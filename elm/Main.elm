module Main exposing (Model, Msg, init, main, subscriptions, update, view)

import Basics.Extra exposing (flip)
import Browser
import Browser.Events as Browser
import Connection exposing (ProviderConnection(..))
import Connection.Provider as Provider exposing (ConnectedProvider(..), DisconnectedProvider(..), MusicProviderType(..), OAuthToken)
import Connection.Selection as Selection exposing (WithProviderSelection(..))
import Deezer
import Dict.Any as Dict exposing (AnyDict)
import Dict.Any.Extra as Dict
import Element
    exposing
        ( DeviceClass(..)
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
        , mouseOver
        , moveDown
        , moveUp
        , padding
        , paddingXY
        , paragraph
        , px
        , row
        , scrollbarX
        , scrollbarY
        , shrink
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
import Flow exposing (Flow(..))
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
import Model exposing (UserInfo)
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..), WebData)
import Result.Extra as Result
import SelectableList exposing (SelectableList)
import Spotify
import Task
import Track exposing (Track, TrackId)
import Tuple exposing (pair)



-- Model


type alias Model =
    { flow : Flow
    , playlists : WithProviderSelection (SelectableList Playlist)
    , comparedProvider : WithProviderSelection ()
    , availableConnections : SelectableList ProviderConnection
    , songs : AnyDict String MatchingTrackKey (WebData (List Track))
    , alternativeTitles : AnyDict String MatchingTrackKey ( String, Bool )
    , device : Element.Device
    }


type alias Dimensions =
    { height : Int
    , width : Int
    }


type alias MatchingTrackKey =
    ( TrackId, MusicProviderType )


type alias Flags =
    Dimensions


type MatchingTracksKeySerializationError
    = TrackIdError Track.TrackIdSerializationError
    | OtherProviderTypeError String
    | WrongKeysFormatError String


serializeMatchingTracksKey : MatchingTrackKey -> String
serializeMatchingTracksKey ( id, pType ) =
    Track.serializeId id ++ Model.keysSeparator ++ Provider.toString pType


deserializeMatchingTracksKey : String -> Result MatchingTracksKeySerializationError MatchingTrackKey
deserializeMatchingTracksKey key =
    case String.split Model.keysSeparator key of
        [ rawTrackId, rawProvider ] ->
            rawProvider
                |> Provider.fromString
                |> Result.fromMaybe (OtherProviderTypeError rawProvider)
                |> Result.map2 pair (rawTrackId |> Track.deserializeId |> Result.mapError TrackIdError)

        _ ->
            Err (WrongKeysFormatError key)


init : Flags -> ( Model, Cmd Msg )
init =
    \flags ->
        ( { flow = Flow.start [ Connection.disconnected Spotify, Connection.disconnected Deezer ]
          , playlists = Selection.noSelection
          , comparedProvider = Selection.noSelection
          , availableConnections =
                SelectableList.fromList
                    [ Connection.disconnected Spotify
                    , Connection.disconnected Deezer
                    ]
          , songs = Dict.empty serializeMatchingTracksKey
          , alternativeTitles = Dict.empty serializeMatchingTracksKey
          , device = Element.classifyDevice flags
          }
        , Cmd.none
        )



-- Update


type Msg
    = ToggleConnect ProviderConnection
    | PlaylistsFetched ConnectedProvider (WebData (List Playlist))
    | PlaylistTracksFetched PlaylistId (WebData (List Track))
    | PlaylistSelected Playlist
    | BackToPlaylists
    | PlaylistsProviderChanged (Maybe ProviderConnection)
    | ComparedProviderChanged (Maybe ConnectedProvider)
    | UserInfoReceived MusicProviderType (WebData UserInfo)
    | ProviderStatusUpdated MusicProviderType (Maybe OAuthToken) Bool
    | SearchMatchingSongs Playlist
    | RetrySearchSong Track String
    | MatchingSongResult (Result MatchingTracksKeySerializationError MatchingTrackKey) (WebData (List Track))
    | ChangeAltTitle MatchingTrackKey String
    | ToggleTitleEditable MatchingTrackKey
    | ImportPlaylist (List Track) Playlist
    | PlaylistImported (WebData Playlist)
    | BrowserResized Dimensions
    | StepFlow
    | TogglePlaylistSelected ConnectedProvider PlaylistId Bool


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        BrowserResized dims ->
            ( { model | device = Element.classifyDevice dims }, Cmd.none )

        ProviderStatusUpdated pType maybeToken isConnected ->
            let
                connection =
                    case ( isConnected, maybeToken ) of
                        ( True, Nothing ) ->
                            Connection.connected pType NotAsked

                        ( True, Just token ) ->
                            Connection.connectedWithToken pType token NotAsked

                        ( False, _ ) ->
                            Connection.disconnected pType

                allConnections =
                    Connections.mapOn pType (\_ -> connection) model.availableConnections
            in
            ( { model
                | availableConnections = allConnections
                , flow = Flow.updateConnection (\_ -> connection) pType model.flow
              }
            , afterProviderStatusUpdate connection isConnected maybeToken model.playlists
            )

        ToggleConnect connection ->
            let
                pType =
                    Connection.type_ connection

                toggleCmd =
                    model.availableConnections
                        |> SelectableList.find (\c -> Connection.type_ c == pType)
                        |> Maybe.map Connection.isConnected
                        |> Maybe.map (providerToggleConnectionCmd pType)
                        |> Maybe.withDefault Cmd.none

                connectedPlaylists =
                    model.playlists
                        |> Selection.type_
                        |> Maybe.map ((==) pType)
                        |> Maybe.andThen
                            (\selected ->
                                if selected then
                                    Just Selection.noSelection

                                else
                                    Nothing
                            )
                        |> Maybe.withDefault model.playlists
            in
            ( { model
                | playlists = connectedPlaylists
                , availableConnections = Connections.toggle pType model.availableConnections
              }
            , toggleCmd
            )

        PlaylistTracksFetched _ s ->
            ( { model
                | playlists =
                    Selection.map
                        (SelectableList.mapSelected <| Playlist.setSongs s)
                        model.playlists
              }
            , Cmd.none
            )

        PlaylistSelected p ->
            let
                loadingPlaylists =
                    Selection.map (SelectableList.upSelect Playlist.loadSongs p) model.playlists

                loadSongs =
                    loadingPlaylists
                        |> Selection.data
                        |> Maybe.andThen RemoteData.toMaybe
                        |> Maybe.andThen SelectableList.selected
                        |> Maybe.map .songs
                        |> Maybe.map RemoteData.isLoading
                        |> Maybe.withDefault False
            in
            ( { model
                | playlists = loadingPlaylists
              }
            , Cmd.batch
                (if loadSongs then
                    [ loadingPlaylists
                        |> Selection.connection
                        |> Maybe.andThen Connection.asConnected
                        |> Maybe.map (\pType -> loadPlaylistSongs pType p)
                        |> Maybe.withDefault Cmd.none
                    ]

                 else
                    []
                )
            )

        BackToPlaylists ->
            ( { model | playlists = model.playlists |> Selection.map SelectableList.clear }
            , Cmd.none
            )

        UserInfoReceived pType user ->
            ( { model | availableConnections = Connections.mapOn pType (Connection.map (Provider.setUserInfo user)) model.availableConnections }
            , Cmd.none
            )

        MatchingSongResult keyResult tracksResult ->
            ( keyResult
                |> Result.map (\key -> { model | songs = Dict.insert key tracksResult model.songs })
                |> Result.withDefault model
            , Cmd.none
            )

        PlaylistsFetched connection playlistsData ->
            let
                data =
                    playlistsData |> RemoteData.map SelectableList.fromList
            in
            ( { model
                | playlists = Selection.setData model.playlists data
                , flow = model.flow |> Flow.udpateLoadingPlaylists connection playlistsData |> Flow.next
              }
            , Cmd.none
            )

        PlaylistsProviderChanged (Just p) ->
            ( { model | playlists = Selection.select p, availableConnections = SelectableList.select p model.availableConnections }
            , Cmd.none
            )

        PlaylistsProviderChanged Nothing ->
            ( { model
                | playlists = Selection.noSelection
                , availableConnections = SelectableList.clear model.availableConnections
              }
            , Cmd.none
            )

        ComparedProviderChanged (Just p) ->
            ( { model | comparedProvider = Selection.select <| Connected p }
            , Cmd.none
            )

        ComparedProviderChanged Nothing ->
            ( { model | comparedProvider = Selection.noSelection }
            , Cmd.none
            )

        SearchMatchingSongs p ->
            let
                cmds =
                    p.songs
                        |> RemoteData.map (List.map (searchMatchingSong p.id model))
                        |> RemoteData.withDefault []

                loading =
                    model.comparedProvider
                        |> Selection.type_
                        |> Maybe.andThen
                            (\pType ->
                                p.songs
                                    |> RemoteData.map (List.map (.id >> flip pair pType))
                                    |> RemoteData.map (\keys -> Dict.insertAtAll keys Loading model.songs)
                                    |> RemoteData.toMaybe
                            )
                        |> Maybe.withDefault model.songs
            in
            ( { model | songs = loading }
            , Cmd.batch cmds
            )

        RetrySearchSong track title ->
            ( model
            , model.comparedProvider
                |> Selection.connection
                |> Maybe.andThen Connection.asConnected
                |> Maybe.map (searchSongFromProvider { track | title = title })
                |> Maybe.withDefault Cmd.none
            )

        ChangeAltTitle key title ->
            ( { model | alternativeTitles = Dict.insert key ( title, True ) model.alternativeTitles }
            , Cmd.none
            )

        ToggleTitleEditable key ->
            ( { model
                | alternativeTitles =
                    model.alternativeTitles
                        |> Dict.update key
                            (\value ->
                                value
                                    |> Maybe.map (\( t, editable ) -> ( t, not editable ))
                                    |> Maybe.withDefault ( "", True )
                                    |> Just
                            )
              }
            , Cmd.none
            )

        ImportPlaylist s p ->
            ( { model | playlists = Selection.importing model.playlists p }
            , imporPlaylist model p s
            )

        PlaylistImported _ ->
            ( { model | playlists = Selection.importDone model.playlists }
            , Cmd.none
            )

        StepFlow ->
            let
                newFlow =
                    Flow.next model.flow
            in
            ( { model | flow = newFlow }, getFlowStepCmd newFlow )

        TogglePlaylistSelected connection playlist isSelected ->
            ( { model | flow = Flow.togglePlaylist connection playlist model.flow }, Cmd.none )


getFlowStepCmd flow =
    case flow of
        LoadPlaylists byProvider ->
            byProvider |> List.map (Tuple.first >> loadPlaylists) |> Cmd.batch

        _ ->
            Cmd.none



-- Effects


selectConnection con playlistSelection =
    playlistSelection
        |> Selection.data
        |> Maybe.andThen RemoteData.toMaybe
        |> Maybe.andThen SelectableList.selected
        |> Maybe.map (\_ -> Cmd.none)
        |> Maybe.withDefault (Task.perform (\_ -> PlaylistsProviderChanged <| Just con) <| Task.succeed ())


afterProviderStatusUpdate : ProviderConnection -> Bool -> Maybe OAuthToken -> WithProviderSelection (SelectableList Playlist) -> Cmd Msg
afterProviderStatusUpdate con isConnected maybeToken playlistSelection =
    case ( Connection.type_ con, isConnected, maybeToken ) of
        ( Spotify, True, Just token ) ->
            Cmd.batch
                [ Spotify.getUserInfo token (UserInfoReceived Spotify)
                , selectConnection con playlistSelection
                ]

        ( _, True, _ ) ->
            selectConnection con playlistSelection

        ( _, False, _ ) ->
            Task.perform (\_ -> PlaylistsProviderChanged Nothing) <| Task.succeed ()


imporPlaylist : Model -> Playlist -> List Track -> Cmd Msg
imporPlaylist { comparedProvider } { name } tracks =
    case comparedProvider of
        Selection.Selected (Connected con) _ ->
            case ( Provider.type_ con, Provider.token con, Provider.user con ) of
                ( Spotify, Just token, Just { id } ) ->
                    Spotify.importPlaylist token id PlaylistImported tracks name

                ( Deezer, _, _ ) ->
                    tracks
                        |> List.map (.id >> Tuple.first)
                        |> List.andThenMaybe String.toInt
                        |> Maybe.map (pair name)
                        |> Maybe.map Deezer.createPlaylistWithTracks
                        |> Maybe.withDefault Cmd.none

                _ ->
                    Cmd.none

        _ ->
            Cmd.none


loadPlaylists : ConnectedProvider -> Cmd Msg
loadPlaylists connection =
    case connection of
        ConnectedProvider Deezer _ ->
            Deezer.loadAllPlaylists ()

        ConnectedProviderWithToken Spotify token _ ->
            Spotify.getPlaylists token (PlaylistsFetched connection)

        _ ->
            Cmd.none


loadPlaylistSongs : ConnectedProvider -> Playlist -> Cmd Msg
loadPlaylistSongs connection { id, link } =
    case connection of
        ConnectedProvider Deezer _ ->
            Deezer.loadPlaylistSongs id

        ConnectedProviderWithToken Spotify token _ ->
            Spotify.getPlaylistTracksFromLink token (PlaylistTracksFetched id) link

        _ ->
            Cmd.none


searchMatchingSong : PlaylistId -> { m | comparedProvider : WithProviderSelection data } -> Track -> Cmd Msg
searchMatchingSong playlistId { comparedProvider } track =
    comparedProvider
        |> Selection.connection
        |> Maybe.andThen Connection.asConnected
        |> Maybe.map (searchSongFromProvider track)
        |> Maybe.withDefault Cmd.none


searchSongFromProvider : Track -> ConnectedProvider -> Cmd Msg
searchSongFromProvider track provider =
    case provider of
        ConnectedProviderWithToken Spotify token _ ->
            Spotify.searchTrack token (MatchingSongResult (Ok ( track.id, Spotify ))) track

        ConnectedProvider Deezer _ ->
            Deezer.searchSong { id = serializeMatchingTracksKey ( track.id, Deezer ), artist = track.artist, title = track.title }

        _ ->
            Cmd.none


notifyProviderDisconnected pType =
    Task.succeed () |> Task.perform (\_ -> ProviderStatusUpdated pType Nothing False)


providerToggleConnectionCmd : MusicProviderType -> Bool -> Cmd Msg
providerToggleConnectionCmd pType isCurrentlyConnected =
    case pType of
        Deezer ->
            if isCurrentlyConnected then
                Cmd.batch [ Deezer.disconnect (), notifyProviderDisconnected pType ]

            else
                Deezer.connectD ()

        Spotify ->
            if isCurrentlyConnected then
                notifyProviderDisconnected pType

            else
                Spotify.connectS ()

        _ ->
            Cmd.none



-- View


view : Model -> Html Msg
view model =
    Element.layoutWith
        { options =
            [ Element.focusStyle
                { borderColor = Nothing
                , backgroundColor = Nothing
                , shadow = Nothing
                }
            ]
        }
        [ Bg.color palette.primaryFaded
        , Font.family
            [ Font.typeface "Fira Code" ]
        , Font.color palette.text
        , model |> dimensions |> .smallText
        , height fill
        , width fill
        ]
    <|
        column [ paddingXY 16 8, spacing 5, height fill, width fill ]
            [ row [ Region.navigation, width fill ] [ header model ]
            , row [ Region.mainContent, width fill, height fill, clip, hack_forceClip ] [ content model ]
            ]



-- Reusable


progressBar : List (Element.Attribute msg) -> Maybe String -> Element msg
progressBar attrs message =
    column ([ htmlAttribute <| Html.style "width" "calc(50vw)" ] ++ attrs)
        [ Element.html <|
            Html.div
                [ Html.class "progress progress-sm progress-indeterminate" ]
                [ Html.div [ Html.class "progress-bar" ] [] ]
        , message
            |> Maybe.map (paragraph [ width shrink, centerX, centerY, Font.center ] << List.singleton << text)
            |> Maybe.withDefault Element.none
        ]


providerSelector :
    (Maybe ConnectedProvider -> msg)
    -> Maybe String
    -> SelectableList ConnectedProvider
    -> Element msg
providerSelector tagger label providers =
    row
        [ spacing 5 ]
        [ label |> Maybe.map (flip (++) ":") |> Maybe.map (el [] << text) |> Maybe.withDefault Element.none
        , el [] <|
            Element.html
                (Html.select
                    [ Html.name "provider-selector"
                    , Html.style "display" "inline"
                    , Html.style "width" "auto"
                    , Html.onChangeTo tagger (connectedProviderDecoder (SelectableList.toList providers))
                    ]
                    (providers
                        |> SelectableList.map Provider.type_
                        |> SelectableList.mapBoth (providerOption True) (providerOption False)
                        |> SelectableList.toList
                        |> List.ifNonEmpty ((::) (placeholderOption (SelectableList.hasSelection providers) "-- Select a provider --"))
                        |> List.withDefault [ placeholderOption True "-- Connect provider --" ]
                    )
                )
        ]


providerOption : Bool -> MusicProviderType -> Html msg
providerOption isSelected provider =
    let
        labelAndValue =
            providerName provider
    in
    Html.option [ Html.value labelAndValue, Html.selected isSelected ] [ Html.text labelAndValue ]


placeholderOption : Bool -> String -> Html msg
placeholderOption isSelected label =
    Html.option [ Html.selected isSelected, Html.value "__placeholder__" ] [ Html.text label ]


buttons : { m | availableConnections : SelectableList ProviderConnection, device : Element.Device } -> List (Element Msg)
buttons model =
    model.availableConnections
        |> SelectableList.mapWithStatus
            (\c isSelected ->
                let
                    enabled =
                        c |> Connection.isConnecting |> not |> Maybe.fromBool

                    tagger =
                        if isSelected || not (Connection.isConnected c) then
                            ToggleConnect

                        else
                            \_ -> PlaylistsProviderChanged (Just c)

                    style =
                        primaryButtonStyle model
                            ++ (disabledButtonStyle <| Maybe.not enabled)
                            ++ (if isSelected then
                                    primarySelectedButtonStyle

                                else
                                    []
                               )
                in
                connectButton style
                    (enabled |> Maybe.map (\_ -> tagger))
                    c
                    isSelected
            )
        |> SelectableList.toList


connectButton : List (Element.Attribute Msg) -> Maybe (ProviderConnection -> Msg) -> ProviderConnection -> Bool -> Element Msg
connectButton style tagger connection selected =
    let
        connected =
            Connection.isConnected connection
    in
    button
        (style ++ iconButtonStyle)
        { onPress = Maybe.map (\t -> t connection) tagger
        , label =
            row [ centerX, width (fillPortion 2 |> minimum 94), spacing 3 ] <|
                [ connection |> Connection.type_ |> providerLogoOrName [ height (px 20), width (px 20) ]
                , text
                    (if connected && selected then
                        "Disconnect"

                     else if not (Maybe.isDefined tagger) then
                        "Connecting"

                     else if not connected then
                        "Connect"

                     else
                        "Select"
                    )
                ]
        }


logo : List (Element.Attribute msg) -> Element msg
logo attrs =
    image attrs { src = "assets/img/Logo.svg", description = "MuSync logo" }


note : List (Element.Attribute msg) -> Element msg
note attrs =
    image attrs { src = "assets/img/Note.svg", description = "" }



-- View parts


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


content : Model -> Element Msg
content model =
    column
        [ Bg.color palette.transparentWhite
        , Border.rounded 3
        , Border.glow palette.ternary 1
        , width fill
        , height fill
        , model |> dimensions |> .smallPadding
        , clip
        ]
    <|
        [ routeMainView model ]



-- New layout


routeMainView : Model -> Element Msg
routeMainView model =
    case model.flow of
        Connect connections ->
            connectView model ToggleConnect StepFlow connections

        LoadPlaylists _ ->
            progressBar [ centerX, centerY ] (Just "Fetching your playlists")

        PickPlaylists playlistsMap ->
            let
                d =
                    dimensions model
            in
            Element.column [ width fill, height fill, clip, hack_forceClip, d.mediumSpacing, d.smallPadding ] <|
                [ paragraph [ d.largeText, Font.center ] [ text "Pick the playlists you want to transfer" ]
                , Element.column [ width fill, height fill, scrollbarY, d.mediumSpacing ]
                    (playlistsMap
                        |> Dict.keys
                        |> List.map
                            (\c ->
                                let
                                    ( otherCon, p ) =
                                        Dict.get c playlistsMap |> Maybe.withDefault ( c, [] )
                                in
                                Element.column [ d.smallSpacing ] <|
                                    (Element.el [ d.mediumText ] <|
                                        text <|
                                            (Provider.type_ >> Provider.toString) c
                                                ++ " --> "
                                                ++ (Provider.type_ >> Provider.toString) otherCon
                                    )
                                        :: (p
                                                |> List.map (playlistCheckbox <| TogglePlaylistSelected c)
                                                |> List.withDefault [ text "No tracks" ]
                                           )
                            )
                    )
                , button (primaryButtonStyle model ++ [ centerX ]) { label = text "Sync", onPress = Just StepFlow }
                ]

        Sync _ ->
            progressBar [ centerX, centerY ] (Just "Syncing your playlists")


playlistCheckbox : (PlaylistId -> Bool -> msg) -> ( Bool, Playlist ) -> Element msg
playlistCheckbox tagger ( selected, playlist ) =
    checkbox []
        { onChange = tagger playlist.id
        , icon =
            \checked ->
                text <|
                    if checked then
                        "[X]"

                    else
                        "[ ]"
        , checked = selected
        , label = labelRight [] <| text (Playlist.summary playlist)
        }


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


connectView : { m | device : Element.Device } -> (ProviderConnection -> msg) -> msg -> List ProviderConnection -> Element msg
connectView model tagger transitioner connections =
    column [ width fill, height fill, model |> dimensions |> .largeSpacing ]
        [ paragraph [ model |> dimensions |> .largeText, Font.center ] [ text "Connect your favorite music providers" ]
        , row [ model |> dimensions |> .smallSpacing, centerX, centerY ]
            (connections
                |> List.map
                    (\connection ->
                        button
                            [ model |> dimensions |> .largePadding
                            , Bg.color palette.white
                            , Border.rounded 3
                            , Border.shadow { offset = ( 0, 0 ), blur = 3, size = 1, color = palette.text }
                            , mouseOver [ Border.shadow { offset = ( 0, 0 ), blur = 12, size = 1, color = palette.text } ]
                            , transition "box-shadow"
                            , htmlAttribute (Html.attribute "aria-label" <| (Connection.type_ >> Provider.toString) connection)
                            ]
                            { onPress =
                                if Connection.isConnected connection then
                                    Nothing

                                else
                                    Just <| tagger connection
                            , label =
                                column [ model |> dimensions |> .smallSpacing, model |> dimensions |> .smallHPadding ]
                                    [ providerLogoOrName [ model |> dimensions |> .buttonImageWidth, centerX ] <| Connection.type_ connection
                                    , connectionStatus <| Connection.isConnected connection
                                    ]
                            }
                    )
            )
        , button (primaryButtonStyle model ++ [ centerX ]) { label = text "Next", onPress = Just transitioner }
        ]



-- Old layout


playlistsView : Model -> Element Msg
playlistsView model =
    case model.playlists of
        Selection.Importing _ _ { name } ->
            progressBar [ centerX ] (Just <| "Importing " ++ name ++ "...")

        Selection.Selected _ (Success p) ->
            p
                |> SelectableList.selected
                |> Maybe.map (songsView model)
                |> Maybe.withDefault
                    (column (playlistsListStyle model) <|
                        el (mainTitleStyle model) (text "My playlists")
                            :: (p
                                    |> SelectableList.map (playlistView PlaylistSelected)
                                    |> SelectableList.toList
                               )
                    )

        Selection.Selected _ (Failure _) ->
            paragraph [ width fill ] [ text "An error occured loading your playlists" ]

        Selection.NoProviderSelected ->
            paragraph [ width fill, alignTop ] [ text "Select a provider to load your playlists" ]

        Selection.Selected _ _ ->
            progressBar [ centerX ] (Just "Loading your playlists...")


playlistView : (Playlist -> Msg) -> Playlist -> Element Msg
playlistView tagger p =
    el [ onClick (tagger p) ]
        (paragraph [ width fill ] [ text (p.name ++ " (" ++ String.fromInt p.tracksCount ++ " tracks)") ])


comparedSearch : Model -> Playlist -> Element Msg
comparedSearch ({ availableConnections, playlists, comparedProvider, songs } as model) playlist =
    let
        matchedSongs =
            playlist
                |> Playlist.songIds
                |> Maybe.map2
                    (\pType ids ->
                        List.filterMap
                            (\id ->
                                songs
                                    |> Dict.get ( id, pType )
                                    |> Maybe.andThen RemoteData.toMaybe
                                    |> Maybe.andThen List.head
                            )
                            ids
                    )
                    (Selection.type_ comparedProvider)
                |> Maybe.withDefault []

        importTagger =
            playlist.songs
                |> RemoteData.map List.length
                |> RemoteData.map ((==) <| List.length matchedSongs)
                |> RemoteData.toMaybe
                |> Maybe.andThen Maybe.fromBool
                |> Maybe.map (\_ -> SearchMatchingSongs playlist)

        searchTagger =
            if Selection.isSelected comparedProvider then
                Just <| SearchMatchingSongs playlist

            else
                Nothing

        searchStyle =
            primaryButtonStyle model ++ disabledButtonStyle (Maybe.not searchTagger)

        importStyle =
            primaryButtonStyle model ++ disabledButtonStyle (Maybe.not importTagger)
    in
    wrappedRow [ spacing 8, height shrink ]
        [ availableConnections
            |> SelectableList.toList
            |> Connections.connectedProviders
            |> SelectableList.fromList
            |> providerSelector ComparedProviderChanged (Just "Sync with")
        , button searchStyle
            { onPress = searchTagger
            , label = text "search"
            }
        , button importStyle
            { onPress = importTagger
            , label = text "import"
            }
        ]


songsView : Model -> Playlist -> Element Msg
songsView model playlist =
    column [ width fill, height fill, clip, hack_forceClip ]
        [ button linkButtonStyle { onPress = Just BackToPlaylists, label = text "<< back" }
        , playlist.songs
            |> RemoteData.map
                (\s ->
                    column [ spacing 5, height fill, clip, hack_forceClip ]
                        [ comparedSearch model playlist
                        , column (songsListStyle model) <|
                            (el (mainTitleStyle model) (text "Songs") :: List.map (song model) s)
                        ]
                )
            |> RemoteData.withDefault (progressBar [ centerX, centerY ] <| Just ("Loading songs from " ++ playlist.name))
        ]


song : Model -> Track -> Element Msg
song ({ comparedProvider } as model) track =
    let
        compared =
            Selection.type_ comparedProvider
    in
    column [ width fill, spacing 5 ]
        [ row [ width fill, height (shrink |> minimum 25) ]
            [ paragraph [] [ text <| track.title ++ " - " ++ track.artist ]
            , compared
                |> Maybe.map
                    (\tracks ->
                        el [ alignRight ] <| searchStatusIcon model track.id tracks
                    )
                |> Maybe.withDefault Element.none
            ]
        , compared |> Maybe.map (matchingTracksView model track) |> Maybe.withDefault Element.none
        ]


searchStatusIcon : { m | songs : AnyDict String MatchingTrackKey (WebData (List Track)) } -> TrackId -> MusicProviderType -> Element Msg
searchStatusIcon { songs } trackId pType =
    let
        matchingTracks =
            Dict.get ( trackId, pType ) songs
    in
    case matchingTracks of
        Just (Success []) ->
            Element.html <|
                Html.i
                    [ Html.class "fa fa-times"
                    , Html.style "margin" "0 .75em"
                    , Html.style "color" "red"
                    , Html.title ("This track doesn't exist on " ++ providerName pType ++ " :(")
                    , Html.onClick (ToggleTitleEditable ( trackId, pType ))
                    ]
                    []

        Just (Success _) ->
            Element.html <|
                Html.i
                    [ Html.class "fa fa-check"
                    , Html.style "margin" "0 .75em"
                    , Html.style "color" "green"
                    , Html.title ("Hurray! Found your track on " ++ providerName pType)
                    ]
                    []

        Just Loading ->
            Element.html <| Html.span [ Html.class "loader loader-xs" ] []

        _ ->
            Element.none


matchingTracksView : Model -> Track -> MusicProviderType -> Element Msg
matchingTracksView ({ songs, comparedProvider, alternativeTitles } as model) ({ id, title } as track) pType =
    let
        comparedKey =
            ( id, pType )

        matchingTracks =
            Dict.get comparedKey songs

        altTitle =
            Dict.get comparedKey alternativeTitles
    in
    case ( matchingTracks, altTitle ) of
        ( Just (Success []), Just ( t, True ) ) ->
            row [ spacing 3 ]
                [ Input.text [ width <| fillPortion 2 ]
                    { onChange = ChangeAltTitle comparedKey
                    , text = t
                    , placeholder = Nothing
                    , label = Input.labelAbove [] <| text "Fix song title:"
                    }
                , button ([ alignBottom ] ++ primaryButtonStyle model ++ (Maybe.fromBool (t == "") |> disabledButtonStyle))
                    { onPress = Just <| RetrySearchSong track t
                    , label = text "retry"
                    }
                ]

        _ ->
            Element.none


providerName : MusicProviderType -> String
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


providerLogoOrName : List (Element.Attribute msg) -> MusicProviderType -> Element msg
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


connectedProviderDecoder : List ConnectedProvider -> JD.Decoder (Maybe ConnectedProvider)
connectedProviderDecoder providers =
    let
        found pType =
            providers
                |> Connections.findConnected pType
                |> Maybe.map (Just >> JD.succeed)
                |> Maybe.withDefault (JD.fail "The provider requested was not present in the list")
    in
    JD.string
        |> JD.andThen
            (\name ->
                case name of
                    "Spotify" ->
                        found Spotify

                    "Deezer" ->
                        found Deezer

                    "Amazon Prime" ->
                        found Amazon

                    "Play" ->
                        found Google

                    "__placeholder__" ->
                        JD.succeed Nothing

                    _ ->
                        JD.fail "Expected a valid MusicProviderType name to decode"
            )



-- Styles


scaled : Int -> Float
scaled =
    Element.modular 16 1.25


type alias DimensionPalette msg =
    { smallText : Element.Attribute msg
    , mediumText : Element.Attribute msg
    , largeText : Element.Attribute msg
    , smallSpacing : Element.Attribute msg
    , mediumSpacing : Element.Attribute msg
    , largeSpacing : Element.Attribute msg
    , smallPadding : Element.Attribute msg
    , largePadding : Element.Attribute msg
    , smallHPadding : Element.Attribute msg
    , smallVPadding : Element.Attribute msg
    , buttonImageWidth : Element.Attribute msg
    }


dimensions : { m | device : Element.Device } -> DimensionPalette msg
dimensions { device } =
    case device.class of
        Phone ->
            { smallText = scaled -1 |> round |> Font.size
            , mediumText = scaled 1 |> round |> Font.size
            , largeText = scaled 2 |> round |> Font.size
            , smallSpacing = scaled 1 |> round |> spacing
            , mediumSpacing = scaled 3 |> round |> spacing
            , largeSpacing = scaled 5 |> round |> spacing
            , smallPadding = scaled -2 |> round |> padding
            , largePadding = scaled 2 |> round |> padding
            , smallHPadding = scaled -2 |> round |> flip paddingXY 0
            , smallVPadding = scaled -3 |> round |> paddingXY 0
            , buttonImageWidth = scaled 4 |> round |> px |> width
            }

        _ ->
            { smallText = scaled 1 |> round |> Font.size
            , mediumText = scaled 2 |> round |> Font.size
            , largeText = scaled 3 |> round |> Font.size
            , smallSpacing = scaled 1 |> round |> spacing
            , mediumSpacing = scaled 3 |> round |> spacing
            , largeSpacing = scaled 9 |> round |> spacing
            , smallPadding = scaled 2 |> round |> padding
            , largePadding = scaled 5 |> round |> padding
            , smallHPadding = scaled 2 |> round |> flip paddingXY 0
            , smallVPadding = scaled 1 |> round |> paddingXY 0
            , buttonImageWidth = scaled 6 |> round |> px |> width
            }


type alias ColorPalette =
    { primary : Element.Color
    , primaryFaded : Element.Color
    , secondary : Element.Color
    , ternary : Element.Color
    , quaternary : Element.Color
    , transparentWhite : Element.Color
    , transparent : Element.Color
    , white : Element.Color
    , black : Element.Color
    , text : Element.Color
    }


palette : ColorPalette
palette =
    { primary = Element.rgb255 220 94 93
    , primaryFaded = Element.rgba255 250 160 112 0.1
    , secondary = Element.rgb255 69 162 134
    , ternary = Element.rgb255 248 160 116
    , quaternary = Element.rgb255 189 199 79
    , transparentWhite = Element.rgba255 255 255 255 0.7
    , transparent = Element.rgba255 255 255 255 0
    , white = Element.rgb255 255 255 255
    , black = Element.rgb255 0 0 0
    , text = Element.rgb255 42 67 80
    }


transition : String -> Element.Attribute msg
transition prop =
    htmlAttribute <| Html.style "transition" (prop ++ " .2s ease-out")


mainTitleStyle : { m | device : Element.Device } -> List (Element.Attribute msg)
mainTitleStyle model =
    [ model |> dimensions |> .largeText, Font.color palette.primary ]


baseButtonStyle device ( bgColor, textColor ) ( bgHoverColor, textHoverColor ) =
    let
        d =
            { device = device } |> dimensions

        deviceDependent =
            case ( device.class, device.orientation ) of
                ( Phone, Portrait ) ->
                    [ width fill, d.smallPadding ]

                ( Tablet, Portrait ) ->
                    [ width fill, d.smallPadding ]

                _ ->
                    [ width (shrink |> minimum 120), d.smallVPadding ]
    in
    [ Font.color textColor
    , Bg.color bgColor
    , Border.rounded 5
    , Border.color bgHoverColor
    , Border.solid
    , Border.width 1
    , alignBottom
    , Font.center
    , Font.semiBold
    , Border.shadow { offset = ( 0, 0 ), blur = 8, size = 1, color = palette.text }
    , transition "box-shadow"
    , mouseOver
        [ Bg.color bgHoverColor
        , Font.color textHoverColor
        , Border.shadow { offset = ( 0, 0 ), blur = 3, size = 1, color = palette.text }
        ]
    ]
        ++ deviceDependent


disabledButtonStyle whatever =
    case whatever of
        Just _ ->
            [ alpha 0.5, mouseOver [] ]

        Nothing ->
            []


selectedButtonStyle ( bgSelectedColor, textSelectedColor ) =
    [ Bg.color bgSelectedColor, Font.color textSelectedColor ]


iconButtonStyle =
    [ paddingXY 10 8 ]


primaryButtonStyle : { m | device : Element.Device } -> List (Element.Attribute msg)
primaryButtonStyle { device } =
    baseButtonStyle device ( palette.secondary, palette.white ) ( palette.secondary, palette.white )


primarySelectedButtonStyle =
    selectedButtonStyle ( palette.secondary, palette.white )


linkButtonStyle : List (Element.Attribute msg)
linkButtonStyle =
    [ Font.color palette.secondary
    , Font.underline
    , mouseOver [ Font.color palette.quaternary ]
    ]


songsListStyle { device } =
    [ spacing 8, height fill, scrollbarY ]


playlistsListStyle { device } =
    [ spacing 5, width fill, height fill, scrollbarY ]



-- HACKS


hack_forceClip : Element.Attribute msg
hack_forceClip =
    htmlAttribute (Html.style "flex-shrink" "1")



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


handleDeezerMatchingTracksFetched : ( String, JD.Value ) -> Msg
handleDeezerMatchingTracksFetched ( rawKey, json ) =
    MatchingSongResult (deserializeMatchingTracksKey rawKey) (Deezer.decodeTracks json)


handleSpotifyStatusUpdate ( maybeErr, token ) =
    maybeErr |> Maybe.isDefined |> not |> ProviderStatusUpdated Spotify (Just token)


handleDeezerPlaylistTracksFetched ( pid, json ) =
    PlaylistTracksFetched pid (Deezer.decodeTracks json)


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Deezer.updateStatus <| ProviderStatusUpdated Deezer Nothing
        , Deezer.receivePlaylists (PlaylistsFetched (Provider.connected Deezer NotAsked) << Deezer.decodePlaylists)
        , Deezer.receivePlaylistSongs handleDeezerPlaylistTracksFetched
        , Deezer.receiveMatchingTracks handleDeezerMatchingTracksFetched
        , Deezer.playlistCreated (PlaylistImported << Deezer.decodePlaylist)
        , Spotify.onConnected handleSpotifyStatusUpdate
        , Browser.onResize (\w h -> BrowserResized <| Dimensions h w)
        ]
