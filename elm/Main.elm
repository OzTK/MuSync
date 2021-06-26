module Main exposing (Model, Msg, init, main, subscriptions, update, view)

import Basics.Extra exposing (apply)
import Breadcrumb exposing (breadcrumb)
import Browser
import Browser.Events as Browser
import Connection exposing (ProviderConnection(..))
import Connection.Connected as ConnectedProvider exposing (ConnectedProvider)
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
import Graphics.Logo as Logo
import Graphics.Palette exposing (fade, palette)
import Html exposing (Html)
import Html.Attributes as Html
import List.Extra as List
import Maybe.Extra as Maybe
import MusicProvider exposing (MusicService(..))
import MusicService exposing (DisconnectedProvider(..), MusicServiceError)
import Page exposing (Page)
import Page.Request exposing (NavigationError)
import Playlist exposing (Playlist, PlaylistId)
import Playlist.Dict as Playlists exposing (PlaylistKey, PlaylistsDict)
import Playlist.Import exposing (PlaylistImportReport)
import Playlist.State exposing (PlaylistImportResult, PlaylistState)
import RemoteData exposing (RemoteData(..), WebData)
import Result exposing (Result)
import SelectableList exposing (SelectableList)
import Spinner
import Styles exposing (transition)
import Track
import Tuple
import UserInfo exposing (UserInfo)



-- Model


type alias Model =
    { page : Page
    , playlists : PlaylistsDict
    , connections : ConnectionsDict
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


initProviders : List DisconnectedProvider
initProviders =
    [ MusicService.disconnected Spotify, MusicService.disconnected Deezer, MusicService.disconnected Youtube ]


deserializeTokenPair : ( String, String ) -> Maybe ( MusicService, ConnectedProvider.OAuthToken )
deserializeTokenPair ( serviceName, token ) =
    token
        |> ConnectedProvider.createToken
        |> Result.toMaybe
        |> Maybe.map2 Tuple.pair (MusicProvider.fromString serviceName)


initConnections : { m | rawTokens : List ( String, String ) } -> ConnectionsDict
initConnections { rawTokens } =
    let
        tokens =
            rawTokens |> List.filterMap deserializeTokenPair |> Dict.fromList ConnectedProvider.toString
    in
    initProviders
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
            { device = Element.classifyDevice flags.window
            , page = Page.init
            , playlists = Playlists.noPlaylists
            , connections = initConnections flags
            }
    in
    ( m
    , Page.onNavigate handlers m m.page
    )



-- Update


type Msg
    = ToggleConnect DisconnectedProvider
    | PlaylistsFetched ConnectedProvider (Result MusicServiceError (WebData (List Playlist)))
    | PlaylistSelectionCleared
    | UserInfoReceived ConnectedProvider (WebData UserInfo)
    | PlaylistImported PlaylistKey (WebData PlaylistImportResult)
    | PlaylistImportFailed PlaylistKey ConnectedProvider MusicServiceError
    | BrowserResized Dimensions
    | Navigated Page


handlers =
    { userInfoReceivedHandler = UserInfoReceived
    , playlistsFetchedHandler = PlaylistsFetched
    , playlistImportCompleteHandler = PlaylistImported
    , playlistImportFailedHandler = PlaylistImportFailed
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        BrowserResized dims ->
            ( { model | device = Element.classifyDevice dims }, Cmd.none )

        ToggleConnect connection ->
            ( model, Connection.toggleProviderConnect connection )

        PlaylistSelectionCleared ->
            ( model, Cmd.none )

        UserInfoReceived con info ->
            ( model.connections
                |> ConnectionsDict.updateConnection (ConnectedProvider.type_ con)
                    (Connection.map
                        (\c ->
                            if c == con then
                                ConnectedProvider.setUserInfo info c

                            else
                                c
                        )
                    )
                |> (\c -> { model | connections = c })
            , Cmd.none
            )

        PlaylistsFetched connection (Ok playlistsData) ->
            let
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
                    { model | connections = withPlaylists, playlists = storedPlaylists }
            in
            Page.navigate m Page.Request.PlaylistPicker
                |> Result.map (apply m << update << Navigated)
                |> Result.withDefault ( m, Cmd.none )

        PlaylistsFetched _ (Err _) ->
            ( model, Cmd.none )

        PlaylistImported playlist (Success result) ->
            let
                m =
                    { model
                        | playlists =
                            model.playlists
                                |> Playlists.completeTransfer playlist result
                                |> Playlists.addNew (resultToKey result) result.playlist
                    }
            in
            Page.navigate m (Page.Request.TransferReport result)
                |> Result.map (apply m << update << Navigated)
                |> Result.withDefault ( m, Cmd.none )

        -- TODO: Handle import error cases
        PlaylistImported _ _ ->
            ( model, Cmd.none )

        PlaylistImportFailed _ _ _ ->
            ( model, Cmd.none )

        Navigated page ->
            ( { model | page = page }
            , Page.onNavigate handlers model page
            )



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



-- Page Routing


resultToKey : PlaylistImportResult -> PlaylistKey
resultToKey { connection, playlist } =
    Playlists.key connection playlist.id


newRouteMainView : Model -> Element Msg
newRouteMainView ({ page } as model) =
    page
        |> Page.match
            { serviceConnection = connectView model
            , playlistSpinner = Spinner.progressBar [ centerX, centerY ] (Just "Fetching your playlists")
            , playlistsPicker = playlistsTable model Nothing
            , playlistDetails = \key -> playlistsTable model (Just key)
            , destinationPicker = \key -> playlistsTable model (Just key)
            , destinationPicked = \key _ -> playlistsTable model (Just key)
            , transferSpinner = \key _ -> playlistsTable model (Just key)
            , transferComplete = \result -> playlistsTable model (Just <| resultToKey result)
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
            , playlistDetails = \key -> playlistDetail model key
            , destinationPicker =
                \key ->
                    transferConfigStep2 model key Nothing
            , destinationPicked =
                \key con ->
                    transferConfigStep2 model key (Just con)
            , transferSpinner = \_ _ -> transferConfigStep3 model
            , transferComplete = \_ -> transferConfigStep4 model
            }


playlistDetail : Model -> PlaylistKey -> Element Msg
playlistDetail model playlist =
    model.playlists
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
                    transferConfigStep1 model playlist p
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
            Page.navigate model Page.Request.PlaylistPicker
                |> Result.map (List.singleton << onClick << Navigated)
                |> Result.withDefault []
    in
    Element.inFront <|
        if isPanelOpen page then
            el (attrs ++ clickHandler ++ [ Bg.color palette.textFaded ]) Element.none

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
        style =
            case ( device.class, device.orientation ) of
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


transferConfigStep1 : { m | device : Element.Device, playlists : PlaylistsDict, connections : ConnectionsDict } -> PlaylistKey -> Playlist -> Element Msg
transferConfigStep1 model key { name } =
    panelContainer model
        (Just "Transfer playlist")
        [ paragraph ([ height fill, clip, scrollbarY ] ++ panelDefaultStyle model ++ hack_forceClip) [ text name ]
        , button (primaryButtonStyle model ++ [ width fill ])
            { onPress =
                Page.navigate model (Page.Request.DestinationPicker key)
                    |> Result.map Navigated
                    |> Result.toMaybe
            , label = text "Next"
            }
        ]


transferConfigStep2 : { m | device : Element.Device, connections : ConnectionsDict, playlists : PlaylistsDict } -> PlaylistKey -> Maybe ConnectedProvider -> Element Msg
transferConfigStep2 model key destination =
    let
        d =
            dimensions model

        services =
            model.connections
                |> ConnectionsDict.connectedConnections
                |> SelectableList.fromList
                |> SelectableList.selectFirst (\c -> Maybe.map ((==) c) destination |> Maybe.withDefault False)

        unavailable =
            Playlists.keyToCon key

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
                            { onPress =
                                if unavailable /= connection then
                                    Page.navigate model (Page.Request.DestinationPicked key connection)
                                        |> Result.map Navigated
                                        |> Result.toMaybe

                                else
                                    Nothing
                            , label = (ConnectedProvider.type_ >> providerLogoOrName [ d.buttonImageWidth, centerX ]) connection
                            }
                    )
                |> SelectableList.toList
            )
        , button goButtonStyle
            { onPress =
                destination
                    |> Maybe.andThen
                        (\dest ->
                            Page.navigate model (Page.Request.TransferSpinner key dest)
                                |> Result.map Navigated
                                |> Result.toMaybe
                        )
            , label = text "GO!"
            }
        ]


transferConfigStep3 : Model -> Element Msg
transferConfigStep3 model =
    let
        d =
            dimensions model
    in
    panelContainer model
        Nothing
        [ Spinner.progressBar [ d.smallPaddingAll, centerX, centerY ] <| Just "Transferring playlist"
        , button (primaryButtonStyle model ++ [ width fill ])
            { onPress =
                Page.navigate model Page.Request.PlaylistPicker
                    |> Result.map Navigated
                    |> Result.toMaybe
            , label = text "Run in background"
            }
        ]


transferConfigStep4 : Model -> Element Msg
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
        , button (primaryButtonStyle model ++ [ width fill ])
            { onPress =
                Page.navigate model Page.Request.PlaylistPicker
                    |> Result.map Navigated
                    |> Result.toMaybe
            , label = text "Back to playlists"
            }
        ]


transferConfigStep4Warnings : Model -> PlaylistImportReport -> Element Msg
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
        , button (primaryButtonStyle model ++ [ width fill ])
            { onPress =
                Page.navigate model Page.Request.PlaylistPicker
                    |> Result.map Navigated
                    |> Result.toMaybe
            , label = text "Back to playlists"
            }
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
    -> ConnectedProvider
    -> Bool
    -> Playlists.PlaylistData
    -> Element Msg
playlistRow model connection isSelected ( playlist, state ) =
    let
        d =
            dimensions model

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
            Page.navigate model (Page.Request.PlaylistDetails <| Playlists.key connection playlist.id)
                |> Result.map Navigated
                |> Result.toMaybe
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


playlistsGroup : Model -> Maybe PlaylistKey -> ConnectedProvider -> List PlaylistId -> List (Element Msg)
playlistsGroup model selected connection playlistIds =
    let
        isSelected id =
            selected |> Maybe.map (Playlists.matches connection id) |> Maybe.withDefault False
    in
    playlistIds
        |> List.map (Playlists.key connection)
        |> List.filterMap (\key -> Playlists.get key model.playlists)
        |> List.map (\(( playlist, _ ) as data) -> playlistRow model connection (isSelected playlist.id) data)
        |> List.withDefault [ text "No tracks" ]


playlistsTable : Model -> Maybe PlaylistKey -> Element Msg
playlistsTable model selected =
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
                |> List.flatten
    in
    playlistsTableFrame model <|
        withPlaylistsGroups <|
            playlistsGroup model selected



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


serviceConnectButton : { m | device : Element.Device } -> (DisconnectedProvider -> msg) -> ProviderConnection -> Element msg
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
    in
    button style
        { onPress = Connection.asDisconnected connection |> Maybe.map tagger
        , label =
            column [ d.xSmallSpacing, d.smallHPadding ]
                [ providerLogoOrName [ d.buttonImageWidth, d.buttonHeight, centerX ] <| Connection.type_ connection
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
                    ( [], [ d.mediumSpacing, paddingXY d.largePadding d.mediumPadding ], [] )

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
        [ wrappedRow ([ d.smallSpacing, d.mediumPaddingAll, centerX ] ++ servicesContainerStyle) <|
            (model.connections
                |> ConnectionsDict.connections
                |> List.map (serviceConnectButton model ToggleConnect)
            )
        , Page.navigate model Page.Request.PlaylistsSpinner
            |> Result.map
                (\page ->
                    el (width fill :: containerPadding) <|
                        button (primaryButtonStyle model ++ centerX :: buttonStyle)
                            { label = text "Next"
                            , onPress = Just <| Navigated page
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

        Youtube ->
            "Youtube"


providerLogoOrName : List (Element.Attribute msg) -> MusicService -> Element msg
providerLogoOrName attrs pType =
    el attrs <| image [] { src = MusicProvider.logoPath pType, description = providerName pType }


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
    [ d.largePaddingAll
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
