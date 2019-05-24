module Main exposing (Model, Msg, init, main, subscriptions, update, view)

import Basics.Extra exposing (apply, const)
import Breadcrumb exposing (breadcrumb)
import Browser
import Browser.Events as Browser
import Connection exposing (ProviderConnection(..))
import Connection.Connected as ConnectedProvider exposing (ConnectedProvider, MusicService(..))
import Connection.Dict as ConnectionsDict exposing (ConnectionsDict)
import Dict.Any as Dict exposing (AnyDict)
import Dimensions exposing (DimensionPalette, dimensions)
import Element exposing (..)
import Element.Background as Bg
import Element.Border as Border
import Element.Events exposing (onClick)
import Element.Font as Font
import Element.Input exposing (button)
import Element.Region as Region
import Flow exposing (ConnectionSelection(..), Flow(..), PlaylistSelectionState(..))
import Flow.Context as Ctx
import Graphics.Logo as Logo
import Graphics.Palette exposing (fade, palette)
import Html exposing (Html)
import Html.Attributes as Html
import List.Extra as List
import Maybe.Extra as Maybe
import MusicService exposing (DisconnectedProvider(..), MusicServiceError)
import Page exposing (Page)
import Page.Request
import Playlist exposing (Playlist, PlaylistId)
import Playlist.Dict as Playlists exposing (PlaylistKey, PlaylistsDict)
import Playlist.Import exposing (PlaylistImportReport)
import Playlist.State exposing (PlaylistImportResult, PlaylistState)
import RemoteData exposing (RemoteData(..), WebData)
import Result.Extra as Result
import SelectableList exposing (SelectableList)
import Spinner
import Styles exposing (transition)
import Task
import Track
import Tuple
import UserInfo exposing (UserInfo)



-- Model


type alias Model =
    { flow : Flow
    , page : Page
    , playlists : PlaylistsDict
    , connections : ConnectionsDict
    , device : Element.Device
    }


type alias M =
    { page : Page
    , playlists : PlaylistsDict
    , connections : AnyDict String MusicService ( ProviderConnection, WebData (List PlaylistKey) )
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


deserializeTokenPair : ( String, String ) -> Maybe ( MusicService, ConnectedProvider.OAuthToken )
deserializeTokenPair ( serviceName, token ) =
    token
        |> ConnectedProvider.createToken
        |> Result.toMaybe
        |> Maybe.map2 Tuple.pair (MusicService.fromString serviceName)


initConnections : { m | rawTokens : List ( String, String ) } -> ConnectionsDict
initConnections { rawTokens } =
    let
        tokens =
            rawTokens |> List.filterMap deserializeTokenPair |> Dict.fromList ConnectedProvider.toString
    in
    [ MusicService.disconnected Spotify, MusicService.disconnected Deezer ]
        |> List.map
            (\con ->
                tokens
                    |> Dict.get ((Connection.type_ << Connection.fromDisconnected) con)
                    |> Maybe.map (Connection.fromConnected << MusicService.connect con)
                    |> Maybe.withDefault (Connection.fromDisconnected con)
            )
        |> ConnectionsDict.fromList


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        m =
            Ctx.init (initConnections flags)
                { device = Element.classifyDevice flags.window
                , page = Page.init
                , playlists = Playlists.noPlaylists
                , connections = ConnectionsDict.init
                , flow = Flow.start
                }
    in
    ( m
    , Cmd.batch [ getFlowStepCmd m, Page.onNavigate handlers m m.page ]
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
    | Navigated Page
    | StepFlow
    | TogglePlaylistSelected ConnectedProvider PlaylistId
    | ToggleOtherProviderSelected ConnectedProvider


handlers =
    { userInfoReceivedHandler = UserInfoReceived
    , playlistsFetchedHandler = PlaylistsFetched
    }


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
                ( flow, _ ) =
                    Flow.udpateLoadingPlaylists connection playlistsData model model.flow

                withPlaylists =
                    playlistsData
                        |> RemoteData.map (List.map .id)
                        |> ConnectionsDict.stopLoading (ConnectedProvider.type_ connection)
                        |> apply model.connections

                storedPlaylists =
                    playlistsData
                        |> RemoteData.map
                            (List.foldl
                                (\p dict ->
                                    Playlists.add (Playlists.key connection p.id) p dict
                                )
                                model.playlists
                            )
                        |> RemoteData.withDefault model.playlists

                m =
                    { model | flow = flow, connections = withPlaylists, playlists = storedPlaylists }
            in
            m
                |> Page.navigate Page.Request.PlaylistPicker
                |> Result.map (apply m << update << Navigated)
                |> Result.withDefault ( m, Cmd.none )

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

        Navigated page ->
            ( { model | page = page, flow = Flow.next model model.flow |> Tuple.first }
            , Page.onNavigate handlers model page
            )

        TogglePlaylistSelected connection playlist ->
            ( { model | flow = Flow.pickPlaylist connection playlist model.flow }, Cmd.none )

        ToggleOtherProviderSelected connection ->
            ( { model | flow = Flow.pickService connection model.flow }, Cmd.none )


getFlowStepCmd : Model -> Cmd Msg
getFlowStepCmd { playlists, flow } =
    case flow of
        Transfer { playlist, otherConnection } ->
            let
                ( con, id ) =
                    playlist
            in
            Playlists.get (Playlists.key con id) playlists
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
                (newRouteMainView model)
            ]



-- Flow routing


newRouteMainView : Model -> Element Msg
newRouteMainView ({ page } as model) =
    page
        |> Page.match
            { serviceConnection = connectView model
            , playlistSpinner = Spinner.progressBar [ centerX, centerY ] (Just "Fetching your playlists")
            , playlistsPicker = playlistsTable model
            , playlistDetails = \_ -> playlistsTable model
            , destinationPicker = \_ -> playlistsTable model
            , destinationPicked = \_ _ -> playlistsTable model
            , transferSpinner = \_ _ -> playlistsTable model
            , transferComplete = \_ -> playlistsTable model
            }


newRoutePanel : Model -> Element Msg
newRoutePanel model =
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
    model.page
        |> Page.match
            { serviceConnection = Element.el placeholderStyle Element.none
            , playlistSpinner = Element.el placeholderStyle Element.none
            , playlistsPicker = Element.el placeholderStyle Element.none
            , playlistDetails = \key -> playlistDetail model key model.playlists
            , destinationPicker =
                \key ->
                    transferConfigStep2 model (Playlists.keyToCon key) Nothing
            , destinationPicked =
                \key con ->
                    transferConfigStep2 model (Playlists.keyToCon key) (Just con)
            , transferSpinner = \_ _ -> playlistsTable model
            , transferComplete = \_ -> playlistsTable model
            }


playlistDetail :
    { m | device : Element.Device }
    -> PlaylistKey
    -> PlaylistsDict
    -> Element Msg
playlistDetail model playlist playlists =
    playlists
        |> Playlists.get playlist
        |> Maybe.map
            (\( p, state ) ->
                if Playlist.State.isPlaylistTransferring state then
                    transferConfigStep3 model

                else if Playlist.State.isPlaylistTransferred state then
                    state
                        |> Playlist.State.importWarnings
                        |> Maybe.map (transferConfigStep4Warnings model)
                        |> Maybe.withDefault (transferConfigStep4 model)

                else
                    transferConfigStep1 model p
            )
        |> Maybe.withDefault Element.none



-- View parts


isPanelOpen : Page -> Bool
isPanelOpen page =
    not <| Page.oneOf page [ Page.Request.ServiceConnection, Page.Request.PlaylistsSpinner, Page.Request.PlaylistPicker ]




overlay : Model -> Element.Attribute Msg
overlay ({ page } as model) =
    let
        attrs =
            [ height fill, width fill, transition [ "background-color" ], mouseDown [] ]

        clickHandler =
            model
                |> Page.navigate Page.Request.PlaylistPicker
                |> Result.map (List.singleton << onClick << Navigated)
                |> Result.withDefault []
    in
    Element.inFront <|
        if isPanelOpen page then
            el (attrs ++ [ Bg.color palette.textFaded, onClick PlaylistSelectionCleared ]) Element.none

        else
            el (attrs ++ [ Element.transparent True, htmlAttribute <| Html.style "pointer-events" "none" ]) Element.none



---- Panel


panel : Model -> Element.Attribute Msg
panel ({ device, page } as model) =
    let
        d =
            dimensions model

        panelPositioner =
            case device.orientation of
                Portrait ->
                    Element.below

                Landscape ->
                    Element.onRight

        panelStyle =
            case device.orientation of
                Portrait ->
                    [ width fill
                    , height (px d.panelHeight)
                    , if not <| isPanelOpen page then
                        moveDown 0

                      else
                        moveUp <| toFloat d.panelHeight
                    ]

                Landscape ->
                    [ width (px d.panelHeight)
                    , height fill
                    , if not <| isPanelOpen page then
                        moveLeft 0

                      else
                        moveLeft <| toFloat d.panelHeight
                    ]
                        ++ hack_forceClip
    in
    panelPositioner <|
        el (panelStyle ++ [ Bg.color palette.white, transition [ "transform" ] ]) <|
            newRoutePanel model


header : { m | device : Element.Device } -> Element msg
header { device } =
    let
        style = case ( device.class, device.orientation ) of
            ( Phone, Portrait ) ->
                [ centerX, width (px 80) ]

            ( Tablet, Portrait ) ->
                [ centerX, width (px 100) ]

            _ ->
                [ alignLeft, width (px 150) ]
    in
        el style Logo.view


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


transferConfigStep2 : { m | device : Element.Device, connections: ConnectionsDict } -> ConnectedProvider -> Maybe ConnectedProvider -> Element Msg
transferConfigStep2 model unavailable destination =
    let
        d =
            dimensions model

        services =
            model.connections
                |> ConnectionsDict.connectedConnections
                |> SelectableList.fromList
                |> SelectableList.selectFirst (\c -> Maybe.map ((==) c) destination |> Maybe.withDefault False)

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
                            { onPress = Just <| ToggleOtherProviderSelected connection, label = (ConnectedProvider.type_ >> providerLogoOrName [ d.buttonImageWidth, centerX ]) connection }
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
        [ Spinner.progressBar [ d.smallPaddingAll, centerX, centerY ] <| Just "Transferring playlist"
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
            Playlist.State.importWarnings state
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
    if Playlist.State.isPlaylistTransferring state then
        playlistIconTransferring d

    else if Playlist.State.isPlaylistTransferred state then
        playlistIconWarnings d state

    else if Playlist.State.isPlaylistNew state then
        playlistIconNew d

    else
        Element.none


playlistRow :
    Model
    -> (PlaylistId -> msg)
    -> ConnectedProvider
    -> Playlists.PlaylistData
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
        { onPress =
            model
                |> Page.navigate (Page.Request.PlaylistDetails <| Playlists.key connection playlist.id)
                |> Result.map Navigated
                |> Result.toMaybe
                |> Maybe.map (\_ -> Just <| tagger playlist.id)
                |> Maybe.withDefault (Just <| tagger playlist.id)
        , label =
            row [ width fill, d.smallSpacing ] <|
                [ providerLogoOrName [ width (px 28) ] (ConnectedProvider.type_ connection)
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


playlistsGroup : Model -> ConnectedProvider -> List PlaylistId -> Element Msg
playlistsGroup model connection playlistIds =
    Element.column [ width fill ] <|
        (playlistIds
            |> List.map (Playlists.key connection)
            |> List.filterMap (\key -> Playlists.get key model.playlists)
            |> List.map (playlistRow model (TogglePlaylistSelected connection) connection)
            |> List.withDefault [ text "No tracks" ]
        )


playlistsTable : Model -> Element Msg
playlistsTable model =
    let
        groupByProvider p =
            p
                |> Dict.keys
                |> List.foldl
                    (\key grouped ->
                        let
                            ( c, id ) =
                                Playlists.destructureKey key
                        in
                        Dict.update c (Maybe.map (Just << (::) id) >> Maybe.withDefault (Just [ id ])) grouped
                    )
                    (Dict.empty ConnectedProvider.connectionToString)

        withPlaylistsGroups f =
            model.playlists
                |> groupByProvider
                |> Dict.map f
                |> Dict.values
    in
    playlistsTableFrame model <|
        withPlaylistsGroups <|
            playlistsGroup model



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
                    (Connection.type_ >> ConnectedProvider.toString) connection
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


connectView : Model -> Element Msg
connectView model =
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
            (model.connections
                |> ConnectionsDict.connections
                |> List.map (serviceConnectButton model ToggleConnect))
        , Page.navigate Page.Request.PlaylistsSpinner model
            |> Result.map
                (\page ->
                    el (width fill :: containerPadding) <|
                        button (primaryButtonStyle model ++ centerX :: buttonStyle)
                            { label = text "Next"
                            , onPress = Just (Navigated page)
                            }
                )
            |> (Result.withDefault <|
                    el (d.buttonHeight :: containerPadding) Element.none
               )
        ]



-- Reusable


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



-- Styles


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
