module Main exposing (Model, Msg, init, main, subscriptions, update, view)

import Basics.Extra exposing (const, flip)
import Browser
import Browser.Events as Browser
import Connection exposing (ProviderConnection(..))
import Deezer
import Dict.Any as Dict exposing (AnyDict)
import Dict.Any.Extra as Dict
import Element
    exposing
        ( Color
        , DeviceClass(..)
        , Element
        , Orientation(..)
        , alignBottom
        , alignLeft
        , alignRight
        , alignTop
        , alpha
        , centerX
        , centerY
        , clip
        , column
        , el
        , fill
        , fillPortion
        , focused
        , height
        , html
        , htmlAttribute
        , image
        , maximum
        , minimum
        , mouseDown
        , mouseOver
        , moveDown
        , moveLeft
        , moveRight
        , moveUp
        , padding
        , paddingEach
        , paddingXY
        , paragraph
        , px
        , row
        , scrollbarX
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
import Element.Input as Input exposing (button, checkbox, labelRight)
import Element.Region as Region
import Flow exposing (ConnectionSelection(..), ConnectionsWithLoadingPlaylists, Flow(..), PlaylistSelectionState(..), PlaylistState, PlaylistsDict)
import Html exposing (Html)
import Html.Attributes as Html
import Html.Events as Html
import Html.Events.Extra as Html
import Http
import Json.Decode as JD
import Json.Encode as JE
import List.Connection as Connections
import List.Extra as List
import Maybe.Extra as Maybe
import MusicService exposing (ConnectedProvider(..), DisconnectedProvider(..), MusicService(..), MusicServiceError, OAuthToken, PlaylistImportResult)
import Playlist exposing (Playlist, PlaylistId)
import Playlist.Import exposing (PlaylistImportReport)
import RemoteData exposing (RemoteData(..), WebData)
import Result.Extra as Result
import SelectableList exposing (SelectableList)
import Spotify
import Task
import Track exposing (Track, TrackId)
import Tuple exposing (pair)
import UserInfo exposing (UserInfo)



-- Model


type alias Model =
    { flow : Flow
    , device : Element.Device
    }


type alias Dimensions =
    { height : Int
    , width : Int
    }


type alias Flags =
    { window : Dimensions, rawTokens : List ( String, String ) }


deserializeTokenPair : ( String, String ) -> Maybe ( MusicService, OAuthToken )
deserializeTokenPair ( serviceName, token ) =
    token
        |> MusicService.createToken
        |> Result.toMaybe
        |> Maybe.map2 Tuple.pair (MusicService.fromString serviceName)


initConnections : { m | window : Dimensions, rawTokens : List ( String, String ) } -> List ProviderConnection
initConnections { window, rawTokens } =
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
        flow =
            Flow.start <| initConnections flags
    in
    ( { flow = flow
      , device = Element.classifyDevice flags.window
      }
    , getFlowStepCmd flow
    )



-- Update


type Msg
    = ToggleConnect ProviderConnection
    | PlaylistsFetched ConnectedProvider (Result MusicServiceError (WebData (List Playlist)))
    | PlaylistTracksFetched PlaylistId (WebData (List Track))
    | PlaylistSelectionCleared
    | UserInfoReceived ConnectedProvider (WebData UserInfo)
    | ProviderConnected ConnectedProvider
    | ProviderDisconnected DisconnectedProvider
    | PlaylistImported ( ConnectedProvider, PlaylistId ) (WebData PlaylistImportResult)
    | PlaylistImportFailed ( ConnectedProvider, PlaylistId ) ConnectedProvider MusicServiceError
    | BrowserResized Dimensions
    | StepFlow
    | TogglePlaylistSelected ConnectedProvider PlaylistId
    | ToggleOtherProviderSelected ConnectedProvider
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        BrowserResized dims ->
            ( { model | device = Element.classifyDevice dims }, Cmd.none )

        ProviderConnected connection ->
            let
                newFlow =
                    Flow.updateConnection (\_ -> Connected connection) (MusicService.type_ connection) model.flow
            in
            ( { model
                | flow = newFlow
              }
            , getFlowStepCmd newFlow
            )

        ProviderDisconnected loggedOutConnection ->
            let
                connection =
                    Disconnected loggedOutConnection
            in
            ( { model | flow = Flow.updateConnection (const connection) (Connection.type_ connection) model.flow }
            , Cmd.none
            )

        ToggleConnect connection ->
            let
                pType =
                    Connection.type_ connection
            in
            ( model
            , Connection.toggleProviderConnect ProviderDisconnected connection
            )

        PlaylistTracksFetched _ s ->
            ( model
            , Cmd.none
            )

        PlaylistSelectionCleared ->
            ( { model | flow = Flow.clearSelection model.flow }
            , Cmd.none
            )

        UserInfoReceived con info ->
            ( { model | flow = Flow.setUserInfo con info model.flow }
            , Cmd.none
            )

        PlaylistsFetched connection (Ok playlistsData) ->
            let
                data =
                    playlistsData |> RemoteData.map SelectableList.fromList
            in
            ( { model
                | flow = model.flow |> Flow.udpateLoadingPlaylists connection playlistsData |> Flow.next
              }
            , Cmd.none
            )

        PlaylistsFetched _ (Err _) ->
            ( model
            , Cmd.none
            )

        PlaylistImported playlist (Success result) ->
            ( { model | flow = Flow.playlistTransferFinished playlist result model.flow }
            , Cmd.none
            )

        -- TODO: Handle import error cases
        PlaylistImported playlist _ ->
            ( model
            , Cmd.none
            )

        PlaylistImportFailed _ _ _ ->
            ( model
            , Cmd.none
            )

        StepFlow ->
            let
                newFlow =
                    Flow.next model.flow
            in
            ( { model | flow = newFlow }, getFlowStepCmd newFlow )

        TogglePlaylistSelected connection playlist ->
            ( { model | flow = Flow.pickPlaylist connection playlist model.flow }, Cmd.none )

        ToggleOtherProviderSelected connection ->
            ( { model | flow = Flow.pickService connection model.flow }, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


getFlowStepCmd flow =
    case flow of
        Connect connections ->
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

        Transfer { playlists, playlist, otherConnection } ->
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
            [ height fill
            , width fill
            , overlay model
            , panel model
            , clip
            ]
            [ row
                [ Region.navigation
                , width fill
                , d.smallPaddingAll
                , Border.widthEach { bottom = 1, top = 0, left = 0, right = 0 }
                , Border.color palette.textFaded
                ]
                [ header model ]
            , row
                ([ Region.mainContent
                 , width fill
                 , height fill
                 , clip
                 , d.mediumPaddingTop
                 ]
                    ++ hack_forceClip
                )
                [ routeMainView model ]
            ]



-- Flow routing


routeMainView : Model -> Element Msg
routeMainView model =
    case model.flow of
        Connect connections ->
            connectView model connections <| Flow.canStep model.flow

        LoadPlaylists _ ->
            progressBar [ centerX, centerY ] (Just "Fetching your playlists")

        PickPlaylist { playlists } ->
            playlistsList model playlists

        PickOtherConnection { playlists } ->
            playlistsList model playlists

        Transfer { playlists } ->
            playlistsList model playlists


routePanel : { m | flow : Flow, device : Element.Device } -> Element Msg
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
        PickPlaylist { playlists, selection, connections } ->
            case selection of
                PlaylistSelected con id ->
                    playlistDetail model ( con, id ) playlists

                _ ->
                    Element.el placeholderStyle Element.none

        PickOtherConnection { playlists, playlist, selection, connections } ->
            let
                connectionsSelection =
                    case selection of
                        NoConnection ->
                            SelectableList.fromList connections

                        ConnectionSelected con ->
                            connections |> SelectableList.fromList |> SelectableList.select con
            in
            playlists
                |> Dict.get playlist
                |> Maybe.map Tuple.first
                |> Maybe.map (transferConfigStep2 model (Tuple.first playlist) connectionsSelection)
                |> Maybe.withDefault Element.none

        Transfer { playlist, playlists, connections } ->
            playlistDetail model playlist playlists

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
                if Flow.isPlaylistTransferring state then
                    transferConfigStep3 model p

                else if Flow.isPlaylistTransferred state then
                    state
                        |> Flow.importWarnings
                        |> Maybe.map (transferConfigStep4Warnings model)
                        |> Maybe.withDefault (transferConfigStep4 model)

                else
                    transferConfigStep1 model p
            )
        |> Maybe.withDefault Element.none



-- View parts


panel : { m | device : Element.Device, flow : Flow } -> Element.Attribute Msg
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
            flow |> Flow.selectedPlaylist |> Maybe.isDefined

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
        el (panelStyle ++ [ Bg.color palette.white, transition "transform" ]) <|
            routePanel model


overlay : { m | flow : Flow } -> Element.Attribute Msg
overlay { flow } =
    let
        attrs =
            [ height fill, width fill, transition "background-color", mouseDown [] ]
    in
    flow
        |> Flow.selectedPlaylist
        |> Maybe.map (\_ -> el (attrs ++ [ Bg.color palette.textFaded, onClick PlaylistSelectionCleared ]) Element.none)
        |> Maybe.withDefault (el (attrs ++ [ Element.transparent True, htmlAttribute <| Html.style "pointer-events" "none" ]) Element.none)
        |> Element.inFront


header : { m | device : Element.Device } -> Element msg
header { device } =
    logo <|
        case ( device.class, device.orientation ) of
            ( Phone, Portrait ) ->
                [ centerX, width (px 80) ]

            ( Tablet, Portrait ) ->
                [ centerX, width (px 150) ]

            _ ->
                [ alignLeft, width (px 250) ]


panelDefaultStyle : { m | device : Element.Device } -> List (Element.Attribute msg)
panelDefaultStyle model =
    let
        d =
            dimensions model
    in
    [ paddingEach { top = d.mediumPadding, right = d.smallPadding, bottom = d.mediumPadding, left = d.smallPadding } ]


panelContainer : { m | device : Element.Device } -> Maybe String -> List (Element msg) -> Element msg
panelContainer model maybeTitle children =
    column
        ([ width fill
         , height fill
         , clip
         , spaceEvenly
         , Border.shadow { offset = ( 0, 0 ), size = 1, blur = 6, color = palette.textFaded }
         ]
            ++ hack_forceClip
        )
    <|
        (maybeTitle
            |> Maybe.map
                (\title ->
                    el
                        ([ Region.heading 2
                         , width fill
                         , Border.color palette.textFaded
                         , Border.widthEach { bottom = 1, left = 0, right = 0, top = 0 }
                         ]
                            ++ panelDefaultStyle model
                        )
                    <|
                        text title
                )
            |> Maybe.withDefault Element.none
        )
            :: children


transferConfigStep1 : { m | device : Element.Device } -> Playlist -> Element Msg
transferConfigStep1 model { name } =
    panelContainer model
        (Just "Transfer playlist")
        [ paragraph ([ height fill, clip, scrollbarY ] ++ panelDefaultStyle model ++ hack_forceClip) [ text name ]
        , button (primaryButtonStyle model ++ [ width fill ]) { onPress = Just StepFlow, label = text "NEXT" }
        ]


transferConfigStep2 : { m | device : Element.Device } -> ConnectedProvider -> SelectableList ConnectedProvider -> Playlist -> Element Msg
transferConfigStep2 model unavailable services { name } =
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
                |> SelectableList.mapWithStatus
                    (\connection isSelected ->
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


transferConfigStep3 : { m | device : Element.Device } -> Playlist -> Element Msg
transferConfigStep3 model { name } =
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


playlistRow : { m | device : Element.Device, flow : Flow } -> (PlaylistId -> msg) -> ( Playlist, PlaylistState ) -> Element msg
playlistRow model tagger ( playlist, state ) =
    let
        d =
            dimensions model

        isSelected =
            model.flow |> Flow.selectedPlaylist |> Maybe.map (Tuple.first >> .id >> (==) playlist.id) |> Maybe.withDefault False
    in
    button
        ([ width fill
         , clip
         , Border.widthEach { top = 1, left = 0, right = 0, bottom = 0 }
         , Border.color palette.primaryFaded
         , d.smallPaddingAll
         , transition "background"
         ]
            ++ (if isSelected then
                    [ Bg.color palette.ternaryFaded, Border.innerGlow palette.textFaded 1 ]

                else
                    [ mouseOver [ Bg.color palette.ternaryFaded ] ]
               )
        )
        { onPress = Just <| tagger playlist.id
        , label =
            row [ width fill, d.smallSpacing ] <|
                [ el ([ width fill, clip ] ++ hack_textEllipsis) <|
                    Element.html <|
                        Html.text <|
                            Playlist.summary playlist
                , if Flow.isPlaylistTransferring state then
                    Element.el [ d.smallHPadding, Font.color palette.quaternary ] <| icon "fas fa-sync-alt spinning"

                  else if Flow.isPlaylistTransferred state then
                    Flow.importWarnings state
                        |> Maybe.filter (\w -> (w |> Playlist.Import.failedTracks |> List.length) > 0)
                        |> Maybe.map
                            (\report ->
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
                        |> Maybe.withDefault
                            (Element.el [ d.smallHPadding, Font.color palette.quaternary ] <| icon "far fa-check-circle")

                  else if Flow.isPlaylistNew state then
                    Element.el [ d.xSmallText, Font.color palette.primary ] <| text "new!"

                  else
                    Element.none
                , text <| String.fromInt playlist.tracksCount ++ " tracks"
                ]
        }


playlistsList : { m | device : Element.Device, flow : Flow } -> PlaylistsDict -> Element Msg
playlistsList model playlists =
    let
        d =
            dimensions model

        withGroupedPlaylists f =
            playlists
                |> Dict.keys
                |> List.foldl
                    (\( c, id ) grouped ->
                        Dict.update c (Maybe.map (Just << (::) id) >> Maybe.withDefault (Just [ id ])) grouped
                    )
                    (Dict.empty MusicService.connectionToString)
                |> Dict.map f
                |> Dict.values
    in
    Element.column ([ width fill, height fill, clip, d.mediumSpacing ] ++ hack_forceClip) <|
        [ paragraph [ d.largeText, Font.center ] [ text "Pick a playlist you want to transfer" ]
        , Element.column [ width fill, height fill, scrollbarY ]
            (withGroupedPlaylists <|
                \connection playlistIds ->
                    Element.column [ width fill ] <|
                        (Element.el [ width fill, d.mediumText, d.smallPaddingAll, Bg.color palette.ternary ] <|
                            text <|
                                MusicService.connectionToString connection
                        )
                            :: (playlistIds
                                    |> List.filterMap (\id -> Dict.get ( connection, id ) playlists)
                                    |> List.map (playlistRow model <| TogglePlaylistSelected connection)
                                    |> List.withDefault [ text "No tracks" ]
                               )
            )
        ]


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


stepFlowButton : { m | device : Element.Device } -> List (Element.Attribute Msg) -> String -> Element Msg
stepFlowButton model style label =
    button (primaryButtonStyle model ++ [ centerX ] ++ style)
        { label = text label
        , onPress = Just StepFlow
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
    in
    button
        (htmlAttribute (Html.attribute "aria-label" <| (Connection.type_ >> MusicService.toString) connection) :: squareToggleButtonStyle model buttonState)
        { onPress =
            if Connection.isConnected connection then
                Nothing

            else
                Just <| tagger connection
        , label =
            column [ d.smallSpacing, d.smallHPadding ]
                [ providerLogoOrName [ d.buttonImageWidth, centerX ] <| Connection.type_ connection
                , connectionStatus <| Connection.isConnected connection
                ]
        }


connectView : { m | device : Element.Device } -> List ProviderConnection -> Bool -> Element Msg
connectView model connections canStep =
    let
        d =
            dimensions model

        containerPadding =
            case model.device.orientation of
                Portrait ->
                    []

                Landscape ->
                    [ d.smallPaddingAll ]
    in
    column [ width fill, height fill, d.largeSpacing ]
        [ paragraph [ d.largeText, Font.center ] [ text "Connect your favorite music providers" ]
        , row [ d.smallSpacing, centerX, centerY ] <| List.map (serviceConnectButton model ToggleConnect) connections
        , if canStep then
            el ([ width fill ] ++ containerPadding) <|
                stepFlowButton model [] "NEXT"

          else
            el (d.buttonHeight :: containerPadding) Element.none
        ]



-- Reusable


progressBar : List (Element.Attribute msg) -> Maybe String -> Element msg
progressBar attrs message =
    column attrs
        [ Element.html <|
            Html.div
                [ Html.class "progress progress-sm progress-indeterminate" ]
                [ Html.div [ Html.class "progress-bar" ] [] ]
        , message
            |> Maybe.map (paragraph [ width shrink, centerX, centerY, Font.center ] << List.singleton << text)
            |> Maybe.withDefault Element.none
        ]


logo : List (Element.Attribute msg) -> Element msg
logo attrs =
    image attrs { src = "assets/img/Logo.svg", description = "MuSync logo" }


note : List (Element.Attribute msg) -> Element msg
note attrs =
    image attrs { src = "assets/img/Note.svg", description = "" }


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


transition : String -> Element.Attribute msg
transition prop =
    htmlAttribute <| Html.style "transition" (prop ++ " .2s ease-out")


mainTitleStyle : { m | device : Element.Device } -> List (Element.Attribute msg)
mainTitleStyle model =
    [ model |> dimensions |> .largeText, Font.color palette.primary ]


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
    , transition "box-shadow"
    , transition "background"
    , mouseOver
        [ Bg.color bgHoverColor
        , Font.color textHoverColor
        ]
    , d.buttonHeight
    ]
        ++ deviceDependent


primaryButtonStyle : { m | device : Element.Device } -> List (Element.Attribute msg)
primaryButtonStyle { device } =
    baseButtonStyle device ( palette.secondary, palette.white ) ( palette.secondary, palette.white )


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
    , Border.rounded 3
    , transition "box-shadow"
    , Border.shadow { offset = ( 0, 0 ), blur = 3, size = 1, color = palette.text }
    ]
        ++ (case state of
                Toggled ->
                    [ Border.innerGlow palette.text 1 ]

                Untoggled ->
                    [ mouseDown [ Border.glow palette.text 1 ]
                    , mouseOver [ Border.shadow { offset = ( 0, 0 ), blur = 12, size = 1, color = palette.text } ]
                    ]

                Disabled ->
                    [ Element.alpha 0.5, mouseOver [], focused [], mouseDown [], Border.glow palette.textFaded 1 ]
           )


songsListStyle { device } =
    [ spacing 8, height fill, scrollbarY ]



-- ElmUI HACKS


hack_forceClip : List (Element.Attribute msg)
hack_forceClip =
    [ htmlAttribute (Html.style "flex-shrink" "1"), htmlAttribute <| Html.class "hack_forceClip" ]


hack_textEllipsis : List (Element.Attribute msg)
hack_textEllipsis =
    [ htmlAttribute <| Html.style "text-overflow" "ellipsis", htmlAttribute <| Html.style "display" "inline-block" ]



-- Palettes


scaled : Int -> Float
scaled =
    Element.modular 16 1.25


type alias DimensionPalette msg =
    { xSmallText : Element.Attribute msg
    , smallText : Element.Attribute msg
    , mediumText : Element.Attribute msg
    , largeText : Element.Attribute msg
    , smallSpacing : Element.Attribute msg
    , mediumSpacing : Element.Attribute msg
    , largeSpacing : Element.Attribute msg
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
        ( smallPadding, mediumPadding ) =
            case device.class of
                Phone ->
                    ( scaled -2 |> round, scaled 1 |> round )

                _ ->
                    ( scaled 1 |> round, scaled 3 |> round )
    in
    case device.class of
        Phone ->
            { xSmallText = scaled -2 |> round |> Font.size
            , smallText = scaled -1 |> round |> Font.size
            , mediumText = scaled 1 |> round |> Font.size
            , largeText = scaled 2 |> round |> Font.size
            , smallSpacing = scaled 1 |> round |> spacing
            , mediumSpacing = scaled 3 |> round |> spacing
            , largeSpacing = scaled 5 |> round |> spacing
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
            { xSmallText = scaled -1 |> round |> Font.size
            , smallText = scaled 1 |> round |> Font.size
            , mediumText = scaled 2 |> round |> Font.size
            , largeText = scaled 3 |> round |> Font.size
            , smallSpacing = scaled 1 |> round |> spacing
            , mediumSpacing = scaled 3 |> round |> spacing
            , largeSpacing = scaled 9 |> round |> spacing
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


fade : Float -> Color -> Color
fade alpha color =
    let
        rgbColor =
            Element.toRgb color
    in
    { rgbColor | alpha = alpha } |> Element.fromRgb


type alias ColorPalette =
    { primary : Element.Color
    , primaryFaded : Element.Color
    , secondary : Element.Color
    , secondaryFaded : Element.Color
    , ternary : Element.Color
    , ternaryFaded : Element.Color
    , quaternary : Element.Color
    , transparentWhite : Element.Color
    , transparent : Element.Color
    , white : Element.Color
    , black : Element.Color
    , text : Element.Color
    , textFaded : Element.Color
    }


palette : ColorPalette
palette =
    let
        white =
            Element.rgb255 255 255 255

        textColor =
            Element.rgb255 42 67 80

        secondary =
            Element.rgb255 69 162 134

        ternary =
            Element.rgb255 248 160 116
    in
    { primary = Element.rgb255 220 94 93
    , primaryFaded = Element.rgba255 220 94 93 0.1
    , secondary = secondary
    , secondaryFaded = secondary |> fade 0.2
    , ternary = ternary
    , ternaryFaded = ternary |> fade 0.2
    , quaternary = Element.rgb255 189 199 79
    , transparent = Element.rgba255 255 255 255 0
    , white = white
    , transparentWhite = white |> fade 0.7
    , black = Element.rgb255 0 0 0
    , text = textColor
    , textFaded = textColor |> fade 0.17
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
