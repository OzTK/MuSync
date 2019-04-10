module Main exposing (Model, Msg, init, main, subscriptions, update, view)

import Basics.Extra exposing (apply, const)
import Browser
import Browser.Events as Browser
import Connection exposing (ProviderConnection(..))
import Dict.Any as Dict exposing (AnyDict)
import Element
    exposing
        ( Color
        , DeviceClass(..)
        , Element
        , Orientation(..)
        , above
        , alignBottom
        , alignLeft
        , alignTop
        , centerX
        , centerY
        , clip
        , column
        , el
        , fill
        , focused
        , height
        , html
        , htmlAttribute
        , image
        , inFront
        , maximum
        , minimum
        , mouseDown
        , mouseOver
        , moveDown
        , moveLeft
        , moveUp
        , padding
        , paddingEach
        , paddingXY
        , paragraph
        , px
        , row
        , scrollbarY
        , shrink
        , spaceEvenly
        , spacing
        , text
        , width
        , wrappedRow
        )
import Element.Background as Bg
import Element.Border as Border
import Element.Events exposing (onClick)
import Element.Font as Font
import Element.Input exposing (button)
import Element.Region as Region
import Flow exposing (ConnectionSelection(..), Flow(..), PlaylistSelectionState(..))
import Flow.Context as Ctx exposing (PlaylistState, PlaylistsDict)
import Graphics.Logo as Logo
import Graphics.Note
import Graphics.Palette exposing (fade, palette)
import Html exposing (Html)
import Html.Attributes as Html
import List.Connection as Connections
import List.Extra as List
import Maybe.Extra as Maybe
import MusicService exposing (ConnectedProvider(..), DisconnectedProvider(..), MusicService(..), MusicServiceError, OAuthToken, PlaylistImportResult)
import Playlist exposing (Playlist, PlaylistId)
import Playlist.Import exposing (PlaylistImportReport)
import RemoteData exposing (RemoteData(..), WebData)
import Result.Extra as Result
import SelectableList exposing (SelectableList)
import Task
import Track
import Tuple
import UserInfo exposing (UserInfo)



-- Model


type alias Model =
    { flow : Flow
    , playlists : PlaylistsDict
    , connections : List ProviderConnection
    , device : Element.Device
    }


type alias Dimensions =
    { height : Int
    , width : Int
    }


type alias Flags =
    { window : Dimensions
    , rawTokens : List ( String, String )
    }


deserializeTokenPair : ( String, String ) -> Maybe ( MusicService, OAuthToken )
deserializeTokenPair ( serviceName, token ) =
    token
        |> MusicService.createToken
        |> Result.toMaybe
        |> Maybe.map2 Tuple.pair (MusicService.fromString serviceName)


initConnections : { m | rawTokens : List ( String, String ) } -> List ProviderConnection
initConnections { rawTokens } =
    let
        tokens =
            rawTokens |> List.filterMap deserializeTokenPair |> Dict.fromList MusicService.toString
    in
    [ MusicService.disconnected Spotify, MusicService.disconnected Deezer ]
        |> List.map
            (\con ->
                tokens
                    |> Dict.get ((Connection.type_ << Connection.fromDisconnected) con)
                    |> Maybe.map (Connection.fromConnected << MusicService.connect con)
                    |> Maybe.withDefault (Connection.fromDisconnected con)
            )


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        m =
            Ctx.init (initConnections flags)
                { device = Element.classifyDevice flags.window
                , playlists = Ctx.noPlaylists
                , connections = []
                , flow = Flow.start
                }
    in
    ( m
    , getFlowStepCmd m
    )



-- Update


type Msg
    = ToggleConnect ProviderConnection
    | PlaylistsFetched ConnectedProvider (Result MusicServiceError (WebData (List Playlist)))
    | PlaylistSelectionCleared
    | UserInfoReceived ConnectedProvider (WebData UserInfo)
    | ProviderDisconnected DisconnectedProvider
    | PlaylistImported ( ConnectedProvider, PlaylistId ) (WebData PlaylistImportResult)
    | PlaylistImportFailed ( ConnectedProvider, PlaylistId ) ConnectedProvider MusicServiceError
    | BrowserResized Dimensions
    | StepFlow
    | TogglePlaylistSelected ConnectedProvider PlaylistId
    | ToggleOtherProviderSelected ConnectedProvider


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        BrowserResized dims ->
            ( { model | device = Element.classifyDevice dims }, Cmd.none )

        ProviderDisconnected loggedOutConnection ->
            let
                connection =
                    Disconnected loggedOutConnection
            in
            ( Ctx.updateConnection (const connection) (Connection.type_ connection) model
            , Cmd.none
            )

        ToggleConnect connection ->
            ( model
            , Connection.toggleProviderConnect ProviderDisconnected connection
            )

        PlaylistSelectionCleared ->
            ( { model | flow = Flow.clearSelection model.flow }
            , Cmd.none
            )

        UserInfoReceived con info ->
            ( Ctx.setUserInfo con info model
            , Cmd.none
            )

        PlaylistsFetched connection (Ok playlistsData) ->
            let
                ( flow, m ) =
                    Flow.udpateLoadingPlaylists connection playlistsData model model.flow
            in
            ( { m | flow = flow }
            , Cmd.none
            )

        PlaylistsFetched _ (Err _) ->
            ( model
            , Cmd.none
            )

        PlaylistImported playlist (Success result) ->
            ( Ctx.playlistTransferFinished playlist result model
            , Cmd.none
            )

        -- TODO: Handle import error cases
        PlaylistImported _ _ ->
            ( model
            , Cmd.none
            )

        PlaylistImportFailed _ _ _ ->
            ( model
            , Cmd.none
            )

        StepFlow ->
            let
                ( newFlow, m ) =
                    Flow.next model model.flow

                newModel =
                    { m | flow = newFlow }
            in
            ( newModel, getFlowStepCmd newModel )

        TogglePlaylistSelected connection playlist ->
            ( { model | flow = Flow.pickPlaylist connection playlist model.flow }, Cmd.none )

        ToggleOtherProviderSelected connection ->
            ( { model | flow = Flow.pickService connection model.flow }, Cmd.none )


getFlowStepCmd : Model -> Cmd Msg
getFlowStepCmd { playlists, connections, flow } =
    case flow of
        Connect ->
            connections
                |> List.filterMap Connection.asConnected
                |> List.filter (MusicService.user >> Maybe.map (\_ -> False) >> Maybe.withDefault True)
                |> List.map (\c -> ( c, c |> MusicService.fetchUserInfo |> Task.onError (\_ -> Task.succeed NotAsked) ))
                |> List.map (\( c, t ) -> Task.perform (UserInfoReceived c) t)
                |> Cmd.batch

        LoadPlaylists byProvider ->
            byProvider
                |> List.map
                    (\( con, _ ) ->
                        con |> MusicService.loadPlaylists |> Task.attempt (PlaylistsFetched con)
                    )
                |> Cmd.batch

        Transfer { playlist, otherConnection } ->
            Dict.get playlist playlists
                |> Maybe.map (MusicService.importPlaylist (Tuple.first playlist) otherConnection << Tuple.first)
                |> Maybe.map
                    (Task.attempt <|
                        Result.map (PlaylistImported playlist)
                            >> Result.mapError (PlaylistImportFailed playlist otherConnection)
                            >> Result.unwrap
                    )
                |> Maybe.withDefault Cmd.none

        _ ->
            Cmd.none



-- View


view : Model -> Html Msg
view model =
    let
        d =
            dimensions model

        ( bodyStyle, mainContentStyle ) =
            case model.device.orientation of
                Portrait ->
                    ( [], [] )

                Landscape ->
                    ( [ d.smallSpacing ], [ paddingXY d.mediumPadding 0 ] )
    in
    Element.layoutWith
        { options =
            [ Element.focusStyle
                { borderColor = Nothing
                , backgroundColor = Nothing
                , shadow = Nothing
                }
            ]
        }
        [ Font.family
            [ Font.typeface "Fira Code" ]
        , Font.color palette.text
        , d.smallText
        , height fill
        , width fill
        ]
    <|
        column
            ([ height fill
             , width fill
             , overlay model
             , panel model
             , clip
             ]
                ++ bodyStyle
            )
            [ el
                [ Region.navigation
                , width fill
                , d.smallPaddingAll
                , Border.color palette.ternaryFaded
                , Bg.color palette.primaryFaded
                , Border.widthEach { bottom = 1, top = 0, left = 0, right = 0 }
                ]
                (header model)
            , el [ paddingEach { top = 32, left = 0, right = 0, bottom = 0 }, width fill ] <|
                breadcrumb [ width (fill |> maximum 800), centerX ] model
            , el
                ([ Region.mainContent
                 , width fill
                 , height fill
                 , clip
                 ]
                    ++ hack_forceClip
                    ++ mainContentStyle
                )
                (routeMainView model)
            ]



-- Flow routing


routeMainView : Model -> Element Msg
routeMainView ({ playlists, connections } as model) =
    case model.flow of
        Connect ->
            connectView model connections <| Flow.canStep model model.flow

        LoadPlaylists _ ->
            progressBar [ centerX, centerY ] (Just "Fetching your playlists")

        PickPlaylist _ ->
            playlistsTable model playlists

        PickOtherConnection _ ->
            playlistsTable model playlists

        Transfer _ ->
            playlistsTable model playlists


routePanel : Model -> Element Msg
routePanel model =
    let
        d =
            dimensions model

        placeholderStyle =
            [ case model.device.orientation of
                Portrait ->
                    height (px d.panelHeight)

                Landscape ->
                    width (px d.panelHeight)
            ]
    in
    case model.flow of
        PickPlaylist { selection } ->
            case selection of
                PlaylistSelected con id ->
                    playlistDetail model ( con, id ) model.playlists

                _ ->
                    Element.el placeholderStyle Element.none

        PickOtherConnection { playlist, selection } ->
            let
                connectionsSelection =
                    case selection of
                        NoConnection ->
                            SelectableList.fromList (Connections.connectedProviders model.connections)

                        ConnectionSelected con ->
                            model.connections |> Connections.connectedProviders |> SelectableList.fromList |> SelectableList.select con
            in
            transferConfigStep2 model (Tuple.first playlist) connectionsSelection

        Transfer { playlist } ->
            playlistDetail model playlist model.playlists

        _ ->
            Element.el placeholderStyle Element.none


playlistDetail :
    { m | device : Element.Device }
    -> ( ConnectedProvider, PlaylistId )
    -> AnyDict String ( ConnectedProvider, PlaylistId ) ( Playlist, PlaylistState )
    -> Element Msg
playlistDetail model playlist playlists =
    playlists
        |> Dict.get playlist
        |> Maybe.map
            (\( p, state ) ->
                if Ctx.isPlaylistTransferring state then
                    transferConfigStep3 model

                else if Ctx.isPlaylistTransferred state then
                    state
                        |> Ctx.importWarnings
                        |> Maybe.map (transferConfigStep4Warnings model)
                        |> Maybe.withDefault (transferConfigStep4 model)

                else
                    transferConfigStep1 model p
            )
        |> Maybe.withDefault Element.none



-- View parts


overlay : Model -> Element.Attribute Msg
overlay ({ flow } as model) =
    let
        attrs =
            [ height fill, width fill, transition [ "background-color" ], mouseDown [] ]
    in
    flow
        |> Flow.selectedPlaylist model
        |> Maybe.map (\_ -> el (attrs ++ [ Bg.color palette.textFaded, onClick PlaylistSelectionCleared ]) Element.none)
        |> Maybe.withDefault (el (attrs ++ [ Element.transparent True, htmlAttribute <| Html.style "pointer-events" "none" ]) Element.none)
        |> Element.inFront



---- Panel


panel : Model -> Element.Attribute Msg
panel ({ device, flow } as model) =
    let
        d =
            dimensions model

        panelPositioner =
            case device.orientation of
                Portrait ->
                    Element.below

                Landscape ->
                    Element.onRight

        isSelected =
            flow |> Flow.selectedPlaylist model |> Maybe.isDefined

        panelStyle =
            case device.orientation of
                Portrait ->
                    [ width fill
                    , height (px d.panelHeight)
                    , if not isSelected then
                        moveDown 0

                      else
                        moveUp <| toFloat d.panelHeight
                    ]

                Landscape ->
                    [ width (px d.panelHeight)
                    , height fill
                    , if not isSelected then
                        moveLeft 0

                      else
                        moveLeft <| toFloat d.panelHeight
                    ]
                        ++ hack_forceClip
    in
    panelPositioner <|
        el (panelStyle ++ [ Bg.color palette.white, transition [ "transform" ] ]) <|
            routePanel model


header : { m | device : Element.Device } -> Element msg
header { device } =
    case ( device.class, device.orientation ) of
        ( Phone, Portrait ) ->
            logo [ centerX, width (px 80) ]

        ( Tablet, Portrait ) ->
            logo [ centerX, width (px 100) ]

        _ ->
            logo [ alignLeft, width (px 150) ]


panelDefaultStyle : { m | device : Element.Device } -> List (Element.Attribute msg)
panelDefaultStyle model =
    let
        d =
            dimensions model
    in
    [ paddingEach { top = d.mediumPadding, right = d.smallPadding, bottom = d.mediumPadding, left = d.smallPadding } ]


panelContainer : { m | device : Element.Device } -> Maybe String -> List (Element msg) -> Element msg
panelContainer model maybeTitle children =
    let
        style =
            [ width fill
            , height fill
            , clip
            , spaceEvenly
            , Border.shadow { offset = ( 0, 0 ), size = 1, blur = 6, color = palette.textFaded }
            ]
                ++ hack_forceClip

        ifTitle v =
            maybeTitle
                |> Maybe.map v
                |> Maybe.withDefault Element.none
    in
    column style <|
        ifTitle
            (\title ->
                el
                    ([ Region.heading 2
                     , width fill
                     , Border.color palette.textFaded
                     , Border.widthEach { bottom = 1, left = 0, right = 0, top = 0 }
                     ]
                        ++ panelDefaultStyle model
                    )
                    (text title)
            )
            :: children


transferConfigStep1 : { m | device : Element.Device } -> Playlist -> Element Msg
transferConfigStep1 model { name } =
    panelContainer model
        (Just "Transfer playlist")
        [ paragraph ([ height fill, clip, scrollbarY ] ++ panelDefaultStyle model ++ hack_forceClip) [ text name ]
        , button (primaryButtonStyle model ++ [ width fill ]) { onPress = Just StepFlow, label = text "Next" }
        ]


transferConfigStep2 : { m | device : Element.Device } -> ConnectedProvider -> SelectableList ConnectedProvider -> Element Msg
transferConfigStep2 model unavailable services =
    let
        d =
            dimensions model

        buttonState con =
            if con == unavailable then
                Disabled

            else if services |> SelectableList.selected |> Maybe.map ((==) con) |> Maybe.withDefault False then
                Toggled

            else
                Untoggled

        goButtonStyle =
            (if SelectableList.hasSelection services then
                primaryButtonStyle model

             else
                disabledButtonStyle model
            )
                ++ [ width fill ]
    in
    panelContainer model
        (Just "Transfer to")
        [ wrappedRow ([ d.smallSpacing, centerX, centerY ] ++ panelDefaultStyle model)
            (services
                |> SelectableList.map
                    (\connection ->
                        button (squareToggleButtonStyle model <| buttonState connection)
                            { onPress = Just <| ToggleOtherProviderSelected connection, label = (MusicService.type_ >> providerLogoOrName [ d.buttonImageWidth, centerX ]) connection }
                    )
                |> SelectableList.toList
            )
        , button goButtonStyle
            { onPress =
                if SelectableList.hasSelection services then
                    Just StepFlow

                else
                    Nothing
            , label = text "GO!"
            }
        ]


transferConfigStep3 : { m | device : Element.Device } -> Element Msg
transferConfigStep3 model =
    let
        d =
            dimensions model
    in
    panelContainer model
        Nothing
        [ progressBar [ d.smallPaddingAll, centerX, centerY ] <| Just "Transferring playlist"
        , button (primaryButtonStyle model ++ [ width fill ]) { onPress = Just StepFlow, label = text "Run in background" }
        ]


transferConfigStep4 : { m | device : Element.Device } -> Element Msg
transferConfigStep4 model =
    let
        d =
            dimensions model

        factor =
            case model.device.orientation of
                Portrait ->
                    "3"

                Landscape ->
                    "7"
    in
    panelContainer model
        Nothing
        [ column ([ centerY, centerX, d.smallSpacing ] ++ panelDefaultStyle model)
            [ el [ centerX, Font.color palette.secondary ] <| icon ("far fa-check-circle fa-" ++ factor ++ "x")
            , paragraph [ Font.center ] [ text "Your playlist was transferred successfully!" ]
            ]
        , button (primaryButtonStyle model ++ [ width fill ]) { onPress = Just StepFlow, label = text "Back to playlists" }
        ]


transferConfigStep4Warnings : { m | device : Element.Device } -> PlaylistImportReport -> Element Msg
transferConfigStep4Warnings model report =
    let
        d =
            dimensions model

        tracks =
            Playlist.Import.failedTracks report

        dupes =
            Playlist.Import.duplicateCount report

        factor =
            case model.device.orientation of
                Portrait ->
                    "3"

                Landscape ->
                    "7"
    in
    panelContainer model Nothing <|
        [ column
            ([ centerY
             , centerX
             , d.smallSpacing
             , paddingEach { top = d.smallPadding, right = d.smallPadding, bottom = 0, left = d.smallPadding }
             , width fill
             , clip
             ]
                ++ hack_forceClip
            )
          <|
            (el [ centerX, Font.color palette.ternary ] <| icon ("fas fa-exclamation-triangle fa-" ++ factor ++ "x"))
                :: (if dupes > 0 then
                        paragraph [ Font.center ] [ text <| String.fromInt dupes ++ " duplicate tracks were removed" ]

                    else
                        Element.none
                   )
                :: (if List.length tracks > 0 then
                        [ paragraph [ Font.center ] [ text "-----" ]
                        , paragraph [ Font.center ] [ text "Some tracks could not be transferred" ]
                        , column ([ height fill, width fill, d.smallSpacing, clip, scrollbarY ] ++ hack_forceClip) <|
                            List.map
                                (\t ->
                                    el ([ width fill, clip, Font.center ] ++ hack_textEllipsis) <| text (Track.toString t)
                                )
                                tracks
                        ]

                    else
                        []
                   )
        , button (primaryButtonStyle model ++ [ width fill ]) { onPress = Just StepFlow, label = text "Back to playlists" }
        ]



---- Playlists Table


playlistIconTransferring : DimensionPalette msg -> Element msg
playlistIconTransferring d =
    Element.el [ d.smallHPadding, Font.color palette.quaternary ] <| icon "fas fa-sync-alt spinning"


playlistIconWarnings : DimensionPalette msg -> PlaylistState -> Element msg
playlistIconWarnings d state =
    let
        whenWarnings f =
            Ctx.importWarnings state
                |> Maybe.filter (\w -> (w |> Playlist.Import.failedTracks |> List.length) > 0)
                |> Maybe.map f

        orElse =
            Maybe.withDefault
    in
    (whenWarnings <|
        \report ->
            Element.el
                [ d.smallHPadding
                , Font.color palette.ternary
                , Element.htmlAttribute
                    (Html.title <|
                        (Playlist.Import.failedTracks report |> List.length |> String.fromInt)
                            ++ " tracks failed to be imported"
                    )
                ]
                (icon "fas fa-exclamation-triangle")
    )
        |> orElse
            (Element.el [ d.smallHPadding, Font.color palette.quaternary ] <| icon "far fa-check-circle")


playlistIconNew : DimensionPalette msg -> Element msg
playlistIconNew d =
    Element.el [ d.xSmallText, Font.color palette.primary ] <| text "new!"


playlistState : Model -> PlaylistState -> Element msg
playlistState model state =
    let
        d =
            dimensions model
    in
    if Ctx.isPlaylistTransferring state then
        playlistIconTransferring d

    else if Ctx.isPlaylistTransferred state then
        playlistIconWarnings d state

    else if Ctx.isPlaylistNew state then
        playlistIconNew d

    else
        Element.none


playlistRow :
    Model
    -> (PlaylistId -> msg)
    -> ConnectedProvider
    -> ( Playlist, PlaylistState )
    -> Element msg
playlistRow model tagger connection ( playlist, state ) =
    let
        d =
            dimensions model

        isSelected =
            model.flow
                |> Flow.selectedPlaylist model
                |> Maybe.map (Tuple.first >> .id >> (==) playlist.id)
                |> Maybe.withDefault False

        style =
            [ width fill
            , clip
            , Border.widthEach { top = 0, left = 0, right = 0, bottom = 1 }
            , Border.color palette.primaryFaded
            , paddingXY d.smallPadding d.xSmallPadding
            , transition [ "background" ]
            ]
                ++ (if isSelected then
                        [ Bg.color palette.ternaryFaded, Border.innerGlow palette.textFaded 1 ]

                    else
                        [ mouseOver [ Bg.color palette.ternaryFaded ] ]
                   )
    in
    button
        style
        { onPress = Just <| tagger playlist.id
        , label =
            row [ width fill, d.smallSpacing ] <|
                [ providerLogoOrName [ width (px 28) ] (MusicService.type_ connection)
                , el ([ width fill, clip ] ++ hack_textEllipsis) <|
                    text (Playlist.summary playlist)
                , playlistState model state
                , text <| String.fromInt playlist.tracksCount ++ " tracks"
                ]
        }


playlistTableFooter : Element.Attribute msg -> List (Element msg) -> Element msg
playlistTableFooter padding items =
    el [ padding, Bg.color (palette.transparentWhite 0.9), width fill, alignBottom ] <|
        text ((List.length >> String.fromInt) items ++ " playlists in your library")


playlistsTableHeader : List (Element.Attribute msg) -> DimensionPalette msg -> Element msg
playlistsTableHeader style d =
    el
        ([ width fill
         , paddingXY d.smallPadding d.mediumPadding
         , d.mediumText
         , Border.color palette.textFaded
         , Border.widthEach { bottom = 1, top = 0, left = 0, right = 0 }
         ]
            ++ style
        )
        (text "Playlists")


playlistsTableItemsContainer : List (Element msg) -> DimensionPalette msg -> Element msg
playlistsTableItemsContainer items d =
    column [ height fill, width fill, scrollbarY ] <|
        items
            ++ [ el [ paddingEach { top = d.mediumPadding, bottom = d.smallPadding, left = 0, right = 0 } ] Element.none ]


playlistsTableFrame : Model -> List (Element msg) -> Element msg
playlistsTableFrame model items =
    let
        d =
            dimensions model

        ( tableStyle, containerStyle, headerStyle ) =
            case model.device.orientation of
                Portrait ->
                    ( [ width fill ]
                    , []
                    , [ Border.shadow { offset = ( 0, 2 ), size = -7, blur = 14, color = palette.text } ]
                    )

                Landscape ->
                    ( [ width (fill |> maximum 1024)
                      , Border.solid
                      , Border.rounded 5
                      , Border.color palette.quaternaryFaded
                      , Border.shadow { offset = ( 0, 2 ), size = 0, blur = 10, color = palette.text }
                      ]
                    , [ paddingEach { bottom = d.mediumPadding, top = d.smallPadding, left = 0, right = 0 } ]
                    , [ Border.solid ]
                    )
    in
    el ([ height fill, width fill, clip, centerX, hack_forceSticky ] ++ containerStyle ++ hack_forceClip) <|
        column
            ([ height fill
             , centerX
             , clip
             , inFront <| playlistTableFooter d.smallPaddingAll items
             , hack_forceSticky
             ]
                ++ tableStyle
                ++ hack_forceClip
            )
            [ playlistsTableHeader headerStyle d
            , playlistsTableItemsContainer items d
            ]


playlistsGroup : Model -> PlaylistsDict -> ConnectedProvider -> List PlaylistId -> Element Msg
playlistsGroup model playlists connection playlistIds =
    Element.column [ width fill ] <|
        (playlistIds
            |> List.filterMap (\id -> Dict.get ( connection, id ) playlists)
            |> List.map (playlistRow model (TogglePlaylistSelected connection) connection)
            |> List.withDefault [ text "No tracks" ]
        )


playlistsTable : Model -> PlaylistsDict -> Element Msg
playlistsTable model playlists =
    let
        groupByProvider p =
            p
                |> Dict.keys
                |> List.foldl
                    (\( c, id ) grouped ->
                        Dict.update c (Maybe.map (Just << (::) id) >> Maybe.withDefault (Just [ id ])) grouped
                    )
                    (Dict.empty MusicService.connectionToString)

        withPlaylistsGroups f =
            playlists
                |> groupByProvider
                |> Dict.map f
                |> Dict.values
    in
    playlistsTableFrame model <|
        withPlaylistsGroups <|
            playlistsGroup model playlists



---- Connect View


connectionStatus : Bool -> Element msg
connectionStatus isConnected =
    image [ width (px 50) ]
        { src =
            if isConnected then
                "/assets/img/noun_connected.svg"

            else
                "/assets/img/noun_disconnected.svg"
        , description =
            if isConnected then
                "Connected"

            else
                "Disconnected"
        }


serviceConnectButton : { m | device : Element.Device } -> (ProviderConnection -> msg) -> ProviderConnection -> Element msg
serviceConnectButton model tagger connection =
    let
        d =
            dimensions model

        buttonState =
            if Connection.isConnected connection then
                Toggled

            else
                Untoggled

        style =
            htmlAttribute
                (Html.attribute "aria-label" <|
                    (Connection.type_ >> MusicService.toString) connection
                )
                :: squareToggleButtonStyle model buttonState
                ++ [ alignTop ]

        connectIfDisconnected =
            if Connection.isConnected connection then
                Nothing

            else
                Just <| tagger connection
    in
    button style
        { onPress = connectIfDisconnected
        , label =
            column [ d.xSmallSpacing, d.smallHPadding ]
                [ providerLogoOrName [ d.buttonImageWidth, centerX ] <| Connection.type_ connection
                , connectionStatus <| Connection.isConnected connection
                ]
        }


connectView : { m | device : Element.Device } -> List ProviderConnection -> Bool -> Element Msg
connectView model connections canStep =
    let
        d =
            dimensions model

        ( containerPadding, servicesContainerStyle, buttonStyle ) =
            case model.device.orientation of
                Portrait ->
                    ( [], [], [] )

                Landscape ->
                    ( [ d.smallPaddingAll ]
                    , [ Border.dotted
                      , Border.color palette.ternaryFaded
                      , Border.width 3
                      , Border.rounded 8
                      , height fill
                      , width (fill |> maximum 800)
                      ]
                    , [ Border.rounded 8 ]
                    )
    in
    column [ width fill, height fill, d.mediumSpacing ]
        [ row ([ d.smallSpacing, d.mediumPaddingAll, centerX, centerY ] ++ servicesContainerStyle) <|
            List.map (serviceConnectButton model ToggleConnect) connections
        , if canStep then
            el (width fill :: containerPadding) <|
                button (primaryButtonStyle model ++ centerX :: buttonStyle)
                    { label = text "Next"
                    , onPress = Just StepFlow
                    }

          else
            el (d.buttonHeight :: containerPadding) Element.none
        ]



-- Reusable


progressBar : List (Element.Attribute msg) -> Maybe String -> Element msg
progressBar attrs message =
    let
        ifMessage v =
            message
                |> Maybe.map (v << text)
                |> Maybe.withDefault Element.none
    in
    column attrs
        [ Element.html <|
            Html.div
                [ Html.class "progress progress-sm progress-indeterminate" ]
                [ Html.div [ Html.class "progress-bar" ] [] ]
        , ifMessage <|
            \msg ->
                paragraph [ width shrink, centerX, centerY, Font.center ] [ msg ]
        ]


logo : List (Element.Attribute msg) -> Element msg
logo attrs =
    el attrs <| html Logo.view


note : Element msg
note =
    html <| Graphics.Note.view


providerName : MusicService -> String
providerName pType =
    case pType of
        Spotify ->
            "Spotify"

        Deezer ->
            "Deezer"

        Amazon ->
            "Amazon Prime"

        Google ->
            "Play"


providerLogoOrName : List (Element.Attribute msg) -> MusicService -> Element msg
providerLogoOrName attrs pType =
    let
        pName =
            providerName pType
    in
    (case pType of
        Deezer ->
            Just "/assets/img/deezer_logo.png"

        Spotify ->
            Just "/assets/img/spotify_logo.png"

        _ ->
            Nothing
    )
        |> Maybe.map (\path -> image attrs { src = path, description = pName })
        |> Maybe.withDefault (text pName)


icon : String -> Element msg
icon name =
    Element.html <| Html.i [ Html.class name ] []



---- Breadcrumb


baseDot : Int -> List (Element.Attribute msg) -> Element msg
baseDot size attrs =
    el
        ([ width (px size)
         , height (px size)
         , centerY
         , Border.rounded 8
         ]
            ++ attrs
        )
        Element.none


dot : Int -> Bool -> Element msg
dot size active =
    el
        [ height (px size)
        , inFront <|
            baseDot
                size
                [ Bg.color palette.primary
                , if active then
                    delayedTransition 0.2 "transform"

                  else
                    transition [ "transform" ]
                , Element.htmlAttribute (Html.classList [ ( "active-dot", active ), ( "inactive-dot", not active ) ])
                ]
        ]
        (baseDot (size - 2) [ Bg.color palette.primaryFaded ])


baseSegment : Int -> List (Element.Attribute msg) -> Element msg
baseSegment size attrs =
    el
        ([ height (px size)
         , width fill
         , centerY
         ]
            ++ attrs
        )
        Element.none


segment : Int -> Bool -> Element msg
segment size active =
    el
        [ width fill
        , height fill
        , inFront <|
            baseSegment size
                [ centerY
                , Bg.color palette.primary
                , Border.rounded 2
                , transition [ "transform" ]
                , Element.htmlAttribute (Html.classList [ ( "active-segment", active ), ( "inactive-segment", not active ) ])
                ]
        ]
    <|
        baseSegment (size - 1) [ Bg.color palette.primaryFaded ]


breadcrumb : List (Element.Attribute msg) -> { m | device : Element.Device, flow : Flow } -> Element msg
breadcrumb attrs model =
    let
        d =
            dimensions model

        { labelWidth, paddingX, fontSize, dotSize, segSize } =
            case ( model.device.class, model.device.orientation ) of
                ( Phone, Portrait ) ->
                    { labelWidth = 75, paddingX = 30, fontSize = d.xxSmallText, dotSize = 10, segSize = 4 }

                _ ->
                    { labelWidth = 170, paddingX = 78, fontSize = d.smallText, dotSize = 15, segSize = 5 }

        index =
            Flow.currentStep model.flow

        bigSpot =
            dot dotSize True

        fadedSpot =
            dot dotSize False

        items =
            [ bigSpot ]
                :: List.repeat index [ segment segSize True, bigSpot ]
                ++ List.repeat (3 - index) [ segment segSize False, fadedSpot ]
    in
    row
        ([ spaceEvenly
         , htmlAttribute (Html.style "z-index" "0")
         , above <| row [ paddingXY paddingX 10, width fill ] (List.flatten items)
         ]
            ++ attrs
        )
    <|
        List.indexedMap
            (\i s ->
                el
                    [ width (px labelWidth)
                    , Font.center
                    , if i == index then
                        delayedTransition 0.2 "color"

                      else
                        transition [ "color" ]
                    , if i > index then
                        Font.color palette.textFaded

                      else
                        Font.color palette.text
                    , fontSize
                    ]
                    (text s)
            )
            Flow.steps



-- Styles


transition : List String -> Element.Attribute msg
transition props =
    props
        |> String.join " .2s ease,"
        |> (++)
        |> apply " .2s ease"
        |> Html.style "transition"
        |> htmlAttribute


delayedTransition : Float -> String -> Element.Attribute msg
delayedTransition delay prop =
    htmlAttribute <| Html.style "transition" (prop ++ " .2s ease " ++ String.fromFloat delay ++ "s")


baseButtonStyle : Element.Device -> ( Color, Color ) -> ( Color, Color ) -> List (Element.Attribute msg)
baseButtonStyle device ( bgColor, textColor ) ( bgHoverColor, textHoverColor ) =
    let
        d =
            dimensions { device = device }

        deviceDependent =
            case ( device.class, device.orientation ) of
                ( Phone, Portrait ) ->
                    [ width fill ]

                ( Tablet, Portrait ) ->
                    [ width fill ]

                _ ->
                    [ width (shrink |> minimum 120) ]
    in
    [ Font.color textColor
    , d.mediumText
    , Bg.color bgColor
    , Border.color bgHoverColor
    , Border.solid
    , Border.width 1
    , alignBottom
    , Font.center
    , Font.semiBold
    , transition [ "box-shadow", "background" ]
    , mouseOver
        [ Bg.color bgHoverColor
        , Font.color textHoverColor
        ]
    , d.buttonHeight
    ]
        ++ deviceDependent


primaryButtonStyle : { m | device : Element.Device } -> List (Element.Attribute msg)
primaryButtonStyle { device } =
    baseButtonStyle device ( palette.secondaryFaded, palette.white ) ( palette.secondary, palette.white )


disabledButtonStyle : { m | device : Element.Device } -> List (Element.Attribute msg)
disabledButtonStyle { device } =
    baseButtonStyle device ( palette.textFaded, palette.white ) ( palette.textFaded, palette.white )


type SquareToggleState
    = Untoggled
    | Toggled
    | Disabled


squareToggleButtonStyle : { m | device : Element.Device } -> SquareToggleState -> List (Element.Attribute msg)
squareToggleButtonStyle model state =
    let
        d =
            dimensions model
    in
    [ d.largePadding
    , Bg.color palette.white
    , Border.rounded 8
    , Border.width 1
    , Border.color palette.transparent
    , transition [ "box-shadow", "border" ]
    ]
        ++ (case state of
                Toggled ->
                    [ Border.innerGlow palette.text 1 ]

                Untoggled ->
                    [ mouseDown [ Border.innerGlow palette.text 1 ]
                    , mouseOver
                        [ -- Border.shadow { offset = ( 0, 0 ), blur = 1, size = 1, color = palette.text |> fade 0.5,
                          Border.color (palette.text |> fade 0.5)
                        ]
                    ]

                Disabled ->
                    [ Element.alpha 0.5, mouseOver [], focused [], mouseDown [], Border.glow palette.textFaded 1 ]
           )



-- ElmUI HACKS


hack_forceClip : List (Element.Attribute msg)
hack_forceClip =
    [ htmlAttribute (Html.style "flex-shrink" "1"), htmlAttribute <| Html.class "hack_forceClip" ]


hack_textEllipsis : List (Element.Attribute msg)
hack_textEllipsis =
    [ htmlAttribute <| Html.style "text-overflow" "ellipsis", htmlAttribute <| Html.style "display" "inline-block" ]


hack_forceSticky : Element.Attribute msg
hack_forceSticky =
    htmlAttribute <| Html.style "position" "sticky"



-- Palettes


scaled : Int -> Float
scaled =
    Element.modular 16 1.25


type alias DimensionPalette msg =
    { xxSmallText : Element.Attribute msg
    , xSmallText : Element.Attribute msg
    , smallText : Element.Attribute msg
    , mediumText : Element.Attribute msg
    , largeText : Element.Attribute msg
    , xSmallSpacing : Element.Attribute msg
    , smallSpacing : Element.Attribute msg
    , mediumSpacing : Element.Attribute msg
    , largeSpacing : Element.Attribute msg
    , xSmallPadding : Int
    , smallPadding : Int
    , smallPaddingAll : Element.Attribute msg
    , smallHPadding : Element.Attribute msg
    , smallVPadding : Element.Attribute msg
    , mediumPadding : Int
    , mediumPaddingAll : Element.Attribute msg
    , mediumPaddingTop : Element.Attribute msg
    , largePadding : Element.Attribute msg
    , buttonImageWidth : Element.Attribute msg
    , buttonHeight : Element.Attribute msg
    , headerTopPadding : Element.Attribute msg
    , panelHeight : Int
    }


dimensions : { m | device : Element.Device } -> DimensionPalette msg
dimensions { device } =
    let
        ( xSmallPadding, smallPadding, mediumPadding ) =
            case device.class of
                Phone ->
                    ( scaled -3 |> round, scaled -2 |> round, scaled 1 |> round )

                _ ->
                    ( scaled -2 |> round, scaled -1 |> round, scaled 3 |> round )
    in
    case device.class of
        Phone ->
            { xxSmallText = scaled -3 |> round |> Font.size
            , xSmallText = scaled -2 |> round |> Font.size
            , smallText = scaled -1 |> round |> Font.size
            , mediumText = scaled 1 |> round |> Font.size
            , largeText = scaled 2 |> round |> Font.size
            , xSmallSpacing = scaled -2 |> round |> spacing
            , smallSpacing = scaled 1 |> round |> spacing
            , mediumSpacing = scaled 3 |> round |> spacing
            , largeSpacing = scaled 5 |> round |> spacing
            , xSmallPadding = smallPadding
            , smallPadding = smallPadding
            , smallPaddingAll = padding smallPadding
            , smallHPadding = paddingXY smallPadding 0
            , smallVPadding = paddingXY 0 smallPadding
            , mediumPadding = mediumPadding
            , mediumPaddingAll = padding mediumPadding
            , mediumPaddingTop = paddingEach { top = mediumPadding, right = 0, bottom = 0, left = 0 }
            , largePadding = scaled 2 |> round |> padding
            , buttonImageWidth = scaled 4 |> round |> px |> width
            , buttonHeight = scaled 7 |> round |> px |> height
            , headerTopPadding = paddingEach { top = round (scaled -1), right = 0, bottom = 0, left = 0 }
            , panelHeight = 220
            }

        _ ->
            { xxSmallText = scaled -3 |> round |> Font.size
            , xSmallText = scaled -2 |> round |> Font.size
            , smallText = scaled -1 |> round |> Font.size
            , mediumText = scaled 1 |> round |> Font.size
            , largeText = scaled 3 |> round |> Font.size
            , xSmallSpacing = scaled -2 |> round |> spacing
            , smallSpacing = scaled 1 |> round |> spacing
            , mediumSpacing = scaled 3 |> round |> spacing
            , largeSpacing = scaled 9 |> round |> spacing
            , xSmallPadding = xSmallPadding
            , smallPadding = smallPadding
            , smallPaddingAll = padding smallPadding
            , smallHPadding = paddingXY smallPadding 0
            , smallVPadding = paddingXY 0 smallPadding
            , mediumPadding = mediumPadding
            , mediumPaddingAll = padding mediumPadding
            , mediumPaddingTop = paddingEach { top = mediumPadding, right = 0, bottom = 0, left = 0 }
            , largePadding = scaled 5 |> round |> padding
            , buttonImageWidth = scaled 6 |> round |> px |> width
            , buttonHeight = scaled 6 |> round |> px |> height
            , headerTopPadding = paddingEach { top = round (scaled 2), right = 0, bottom = 0, left = 0 }
            , panelHeight = 350
            }



-- Program


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.onResize (\w h -> BrowserResized <| Dimensions h w)
        ]
