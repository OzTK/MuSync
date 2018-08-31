module Main exposing (Model, Msg, init, main, subscriptions, update, view)

import Basics.Either exposing (Either(..))
import Basics.Extra exposing (pair, swap)
import Browser
import Browser.Events as Browser
import Connection exposing (ProviderConnection(..))
import Connection.Provider as Provider exposing (ConnectedProvider(..), DisconnectedProvider(..), OAuthToken)
import Connection.Selection as Selection exposing (WithProviderSelection(..))
import Deezer
import Dict.Any as Dict exposing (AnyDict)
import Dict.Any.Extra as Dict
import Element
    exposing
        ( Element
        , alignRight
        , alignTop
        , alpha
        , centerX
        , centerY
        , clipY
        , column
        , el
        , fill
        , fillPortion
        , height
        , html
        , htmlAttribute
        , image
        , maximum
        , minimum
        , mouseOver
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
import Element.Input as Input exposing (button)
import Element.Region as Region
import Html exposing (Html)
import Html.Attributes as Html
import Html.Events as Html
import Html.Events.Extra as Html
import Json.Decode as JD
import Json.Encode as JE
import List.Connection as Connections
import List.Extra as List
import Maybe.Extra as Maybe
import Model exposing (MusicProviderType(..), UserInfo)
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..), WebData)
import SelectableList exposing (SelectableList)
import Spotify
import Track exposing (Track, TrackId)



-- Model


type alias Model =
    { playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
    , comparedProvider : WithProviderSelection MusicProviderType ()
    , availableConnections : List (ProviderConnection MusicProviderType)
    , songs : AnyDict String ( TrackId, MusicProviderType ) (WebData (List Track))
    , alternativeTitles : AnyDict String TrackId String
    , device : Element.Device
    }


type alias Dimensions =
    { height : Int
    , width : Int
    }


type alias Flags =
    Dimensions


type MatchingTracksKeySerializationError
    = TrackIdError Track.TrackIdSerializationError
    | OtherProviderTypeError String
    | WrongKeysFormatError String


serializeMatchingTracksKey : ( TrackId, MusicProviderType ) -> String
serializeMatchingTracksKey ( id, pType ) =
    Track.serializeId id ++ Model.keysSeparator ++ Model.providerToString pType


deserializeMatchingTracksKey : String -> Result MatchingTracksKeySerializationError ( TrackId, MusicProviderType )
deserializeMatchingTracksKey key =
    case String.split Model.keysSeparator key of
        [ rawTrackId, rawProvider ] ->
            rawProvider
                |> Model.providerFromString
                |> Result.fromMaybe (OtherProviderTypeError rawProvider)
                |> Result.map2 pair (rawTrackId |> Track.deserializeId |> Result.mapError TrackIdError)

        _ ->
            Err (WrongKeysFormatError key)


init : Flags -> ( Model, Cmd Msg )
init =
    \flags ->
        ( { playlists = Selection.noSelection
          , comparedProvider = Selection.noSelection
          , availableConnections =
                [ Connection.disconnected Spotify
                , Connection.disconnected Deezer
                ]
          , songs = Dict.empty serializeMatchingTracksKey
          , alternativeTitles = Dict.empty Track.serializeId
          , device = Element.classifyDevice flags
          }
        , Cmd.none
        )



-- Update


type Msg
    = ToggleConnect MusicProviderType
    | DeezerStatusUpdate Bool
    | ReceiveDeezerPlaylists (Maybe JD.Value)
    | ReceiveDeezerPlaylist JD.Value
    | ReceivePlaylists (WebData (List Playlist))
    | ReceiveDeezerSongs (Maybe JD.Value)
    | ReceiveDeezerMatchingSongs ( String, JD.Value )
    | RequestDeezerSongs Int
    | ReceiveSpotifyPlaylistSongs Playlist (WebData (List Track))
    | PlaylistSelected Playlist
    | BackToPlaylists
    | PlaylistsProviderChanged (Maybe (ConnectedProvider MusicProviderType))
    | ComparedProviderChanged (Maybe (ConnectedProvider MusicProviderType))
    | SpotifyConnectionStatusUpdate ( Maybe String, String )
    | SpotifyUserInfoReceived OAuthToken (WebData UserInfo)
    | SearchMatchingSongs Playlist
    | RetrySearchSong Track String
    | MatchingSongResult Track MusicProviderType (WebData (List Track))
    | ChangeAltTitle TrackId String
    | ImportPlaylist (List Track) Playlist
    | PlaylistImported (WebData Playlist)
    | BrowserResized Dimensions


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        BrowserResized dimensions ->
            ( { model | device = Element.classifyDevice dimensions }, Cmd.none )

        DeezerStatusUpdate isConnected ->
            let
                connection =
                    if isConnected then
                        Connection.connected Deezer

                    else
                        Connection.disconnected Deezer
            in
            ( { model | availableConnections = Connections.mapOn Deezer (\_ -> connection) model.availableConnections }
            , Cmd.none
            )

        ToggleConnect pType ->
            let
                toggleCmd =
                    model.availableConnections
                        |> Connections.find pType
                        |> Maybe.mapTogether Connection.isConnected Connection.type_
                        |> Maybe.map (\( a, b ) -> providerToggleConnectionCmd a b)
                        |> Maybe.withDefault Cmd.none

                connectedPlaylists =
                    model.playlists
                        |> Selection.providerType
                        |> Maybe.map ((==) pType)
                        |> Maybe.andThen
                            (\selected ->
                                if selected then
                                    Just Selection.noSelection

                                else
                                    Nothing
                            )
                        |> Maybe.withDefault model.playlists

                model_ =
                    { model | availableConnections = Connections.toggle pType model.availableConnections }
            in
            ( { model_
                | playlists = connectedPlaylists
              }
            , toggleCmd
            )

        ReceiveDeezerPlaylists (Just pJson) ->
            ( { model
                | playlists =
                    pJson
                        |> JD.decodeValue (JD.list Deezer.playlist)
                        |> Result.map SelectableList.fromList
                        |> Result.mapError Left
                        |> Result.mapError (Deezer.httpBadPayloadError "/playlists" pJson)
                        |> RemoteData.fromResult
                        |> Selection.setData model.playlists
              }
            , Cmd.none
            )

        ReceiveDeezerPlaylist pJson ->
            pJson
                |> JD.decodeValue Deezer.playlist
                |> RemoteData.fromResult
                |> RemoteData.mapError Left
                |> RemoteData.mapError (Deezer.httpBadPayloadError "/user/playlist" pJson)
                |> PlaylistImported
                |> swap update model

        ReceiveDeezerPlaylists Nothing ->
            ( { model
                | playlists =
                    Right "No Playlists received"
                        |> Deezer.httpBadPayloadError "/playlist/songs" JE.null
                        |> RemoteData.Failure
                        |> Selection.setData model.playlists
              }
            , Cmd.none
            )

        ReceiveDeezerSongs (Just songsValue) ->
            let
                songsData =
                    songsValue
                        |> JD.decodeValue (JD.list Deezer.track)
                        |> RemoteData.fromResult
                        |> RemoteData.mapError Left
                        |> RemoteData.mapError (Deezer.httpBadPayloadError "/playlist/songs" songsValue)
            in
            ( { model
                | playlists =
                    Selection.map
                        (SelectableList.mapSelected (Playlist.setSongs songsData))
                        model.playlists
              }
            , Cmd.none
            )

        ReceiveDeezerSongs Nothing ->
            ( model
            , Cmd.none
            )

        RequestDeezerSongs id ->
            ( model
            , Deezer.loadPlaylistSongs (String.fromInt id)
            )

        ReceiveSpotifyPlaylistSongs _ s ->
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

        SpotifyConnectionStatusUpdate ( Nothing, token ) ->
            let
                connection =
                    Connection.connectedWithToken Spotify token
            in
            ( model
            , Spotify.getUserInfo token SpotifyUserInfoReceived
            )

        SpotifyConnectionStatusUpdate ( Just _, _ ) ->
            ( { model
                | availableConnections =
                    Connections.mapOn Spotify
                        (\con -> con |> Connection.type_ |> Connection.disconnected)
                        model.availableConnections
              }
            , Cmd.none
            )

        SpotifyUserInfoReceived token (Success user) ->
            let
                connection =
                    Connection.connectedWithToken Spotify token user
            in
            ( { model
                | availableConnections =
                    Connections.mapOn Spotify (\_ -> connection) model.availableConnections
              }
            , Cmd.none
            )

        SpotifyUserInfoReceived token _ ->
            ( { model
                | availableConnections =
                    Connections.mapOn Spotify
                        (\con -> con |> Connection.type_ |> Connection.disconnected)
                        model.availableConnections
              }
            , Cmd.none
            )

        MatchingSongResult ({ id } as track) pType results ->
            ( { model | songs = Dict.insert ( id, pType ) results model.songs }
            , Cmd.none
            )

        ReceivePlaylists playlistsData ->
            let
                data =
                    playlistsData |> RemoteData.map SelectableList.fromList
            in
            ( { model | playlists = Selection.setData model.playlists data }
            , Cmd.none
            )

        PlaylistsProviderChanged (Just p) ->
            ( { model | playlists = Selection.select p }
            , loadPlaylists p
            )

        PlaylistsProviderChanged Nothing ->
            ( { model | playlists = Selection.noSelection }
            , Cmd.none
            )

        ComparedProviderChanged (Just p) ->
            ( { model | comparedProvider = Selection.select p }
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
                        |> Selection.providerType
                        |> Maybe.andThen
                            (\pType ->
                                p.songs
                                    |> RemoteData.map (List.map (.id >> swap pair pType))
                                    |> RemoteData.map (\keys -> Dict.insertAtAll keys Loading model.songs)
                                    |> RemoteData.toMaybe
                            )
                        |> Maybe.withDefault model.songs
            in
            ( { model | songs = loading }
            , Cmd.batch cmds
            )

        ReceiveDeezerMatchingSongs ( trackId, jsonTracks ) ->
            let
                tracks =
                    jsonTracks
                        |> JD.decodeValue (JD.list Deezer.track)
                        |> Result.mapError Left
                        |> Result.mapError (Deezer.httpBadPayloadError "/search/tracks" jsonTracks)
                        |> RemoteData.fromResult
            in
            ( { model
                | songs =
                    trackId
                        |> deserializeMatchingTracksKey
                        |> Result.map (\( id, _ ) -> Dict.insert ( id, Deezer ) tracks model.songs)
                        |> Result.withDefault model.songs
              }
            , Cmd.none
            )

        RetrySearchSong track title ->
            ( model
            , model.comparedProvider
                |> Selection.connection
                |> Maybe.map (searchSongFromProvider { track | title = title })
                |> Maybe.withDefault Cmd.none
            )

        ChangeAltTitle id title ->
            ( { model | alternativeTitles = Dict.insert id title model.alternativeTitles }
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



-- Helpers


imporPlaylist : Model -> Playlist -> List Track -> Cmd Msg
imporPlaylist { comparedProvider } { name } tracks =
    case comparedProvider of
        Selection.Selected con _ ->
            case ( Provider.connectedType con, Provider.token con, Provider.user con ) of
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


loadPlaylists : ConnectedProvider MusicProviderType -> Cmd Msg
loadPlaylists connection =
    case connection of
        ConnectedProvider Deezer ->
            Deezer.loadAllPlaylists ()

        ConnectedProviderWithToken Spotify token _ ->
            Spotify.getPlaylists token ReceivePlaylists

        _ ->
            Cmd.none


loadPlaylistSongs : ConnectedProvider MusicProviderType -> Playlist -> Cmd Msg
loadPlaylistSongs connection ({ id, link } as p) =
    case connection of
        ConnectedProvider Deezer ->
            Deezer.loadPlaylistSongs id

        ConnectedProviderWithToken Spotify token _ ->
            Spotify.getPlaylistTracksFromLink token (ReceiveSpotifyPlaylistSongs p) link

        _ ->
            Cmd.none


searchMatchingSong : PlaylistId -> { m | comparedProvider : WithProviderSelection MusicProviderType data } -> Track -> Cmd Msg
searchMatchingSong playlistId { comparedProvider } track =
    comparedProvider
        |> Selection.connection
        |> Maybe.map (searchSongFromProvider track)
        |> Maybe.withDefault Cmd.none


searchSongFromProvider : Track -> ConnectedProvider MusicProviderType -> Cmd Msg
searchSongFromProvider track provider =
    case provider of
        ConnectedProviderWithToken Spotify token _ ->
            Spotify.searchTrack token (MatchingSongResult track Spotify) track

        ConnectedProvider Deezer ->
            Deezer.searchSong { id = serializeMatchingTracksKey ( track.id, Deezer ), artist = track.artist, title = track.title }

        _ ->
            Cmd.none


providerToggleConnectionCmd : Bool -> MusicProviderType -> Cmd msg
providerToggleConnectionCmd isCurrentlyConnected pType =
    case pType of
        Deezer ->
            if isCurrentlyConnected then
                Deezer.disconnect ()

            else
                Deezer.connectD ()

        Spotify ->
            if isCurrentlyConnected then
                Cmd.none

            else
                Spotify.connectS ()

        _ ->
            Cmd.none


asSelectableList :
    WithProviderSelection providerType data
    -> List (ConnectedProvider providerType)
    -> SelectableList (ConnectedProvider providerType)
asSelectableList selection providers =
    let
        connected =
            providers |> SelectableList.fromList
    in
    selection
        |> Selection.connection
        |> Maybe.map (SelectableList.select connected)
        |> Maybe.withDefault connected



-- Styles


scaled : Int -> Float
scaled =
    Element.modular 16 1.25


small =
    scaled 1 |> round


medium =
    scaled 2 |> round


large =
    scaled 3 |> round


palette =
    { primary = Element.rgb255 220 94 93
    , primaryFaded = Element.rgba255 250 160 112 0.1
    , secondary = Element.rgb255 69 162 134
    , ternary = Element.rgb255 248 160 116
    , quaternary = Element.rgb255 189 199 79
    , transparentWhite = Element.rgba255 255 255 255 0.7
    , white = Element.rgb255 255 255 255
    , text = Element.rgb255 42 67 80
    }


primaryButtonStyle : Bool -> List (Element.Attribute msg)
primaryButtonStyle disabled =
    [ paddingXY 16 8
    , Font.color palette.text
    , Border.rounded 5
    , Border.color palette.secondary
    , Border.solid
    , Border.width 1
    ]
        ++ (if disabled then
                [ alpha 0.5 ]

            else
                [ mouseOver [ Bg.color palette.secondary, Font.color palette.white ] ]
           )


linkButtonStyle : List (Element.Attribute msg)
linkButtonStyle =
    [ Font.color palette.secondary
    , Font.underline
    , mouseOver [ Font.color palette.quaternary ]
    ]



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
            [ Font.typeface "ClinicaPro-Regular" ]
        , Font.color palette.text
        , Font.size small
        , height fill
        , width fill
        ]
    <|
        column [ padding 16, height fill, width fill ]
            [ row [ Region.navigation ] [ header ]
            , row [ Region.mainContent, width fill, height fill ] [ content model ]
            ]



-- Reusable


progressBar : Maybe String -> Element msg
progressBar message =
    row []
        [ el
            [ htmlAttribute (Html.class "progress progress-indeterminate") ]
            (el [ htmlAttribute (Html.class "progress-bar") ] Element.none)
        , message
            |> Maybe.map (el [] << text)
            |> Maybe.withDefault Element.none
        ]


providerSelector :
    (Maybe (ConnectedProvider MusicProviderType) -> msg)
    -> Maybe String
    -> SelectableList (ConnectedProvider MusicProviderType)
    -> Element msg
providerSelector tagger label providers =
    row
        [ spacing 5 ]
        [ label |> Maybe.map (swap (++) ":") |> Maybe.map (el [] << text) |> Maybe.withDefault Element.none
        , el [] <|
            Element.html
                (Html.select
                    [ Html.name "provider-selector"
                    , Html.style "display" "inline"
                    , Html.style "width" "auto"
                    , Html.onChangeTo tagger (connectedProviderDecoder (SelectableList.toList providers))
                    ]
                    (providers
                        |> SelectableList.map Provider.connectedType
                        |> SelectableList.mapBoth (providerOption True) (providerOption False)
                        |> SelectableList.toList
                        |> List.nonEmpty ((::) (placeholderOption (SelectableList.hasSelection providers) "-- Select a provider --"))
                        |> List.withDefault [ placeholderOption True "-- Connect at least one more provider --" ]
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


buttons : { m | availableConnections : List (ProviderConnection MusicProviderType) } -> List (Element Msg)
buttons { availableConnections } =
    List.map (connectButton ToggleConnect) availableConnections


connectButton : (MusicProviderType -> Msg) -> ProviderConnection MusicProviderType -> Element Msg
connectButton tagger connection =
    let
        connected =
            Connection.isConnected connection

        connecting =
            Connection.isConnecting connection
    in
    button
        ([ width fill, height (px 42) ] ++ primaryButtonStyle connecting)
        { onPress =
            if connecting then
                Nothing

            else
                Just <| tagger (Connection.type_ connection)
        , label =
            row [ centerX, width (fillPortion 2 |> minimum 94), spacing 3 ] <|
                [ connection |> Connection.type_ |> providerLogoOrName [ height (px 20), width (px 20) ]
                , text
                    (if connected then
                        "Disconnect "

                     else if connecting then
                        "Connecting "

                     else
                        "Connect "
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


header : Element msg
header =
    logo [ Element.alignLeft, width (px 250) ]


content : Model -> Element Msg
content model =
    el [ Bg.uncropped "assets/img/Note.svg", width fill, height fill ] <|
        column
            [ Bg.color palette.transparentWhite
            , Border.rounded 3
            , Border.glow palette.ternary 1
            , width fill
            , height fill
            , padding 8
            ]
        <|
            [ wrappedRow [ spacing 5, width fill ]
                [ model.availableConnections
                    |> Connections.connectedProviders
                    |> asSelectableList model.playlists
                    |> providerSelector PlaylistsProviderChanged (Just "Provider")
                , row [ spacing 8, paddingXY 0 5, centerX, width fill ] <| buttons model
                ]
            , row [ width fill, htmlAttribute <| Html.style "height" "58vh", scrollbarY ] [ playlistsView model ]
            ]


playlistsView :
    { b
        | availableConnections : List (ProviderConnection MusicProviderType)
        , comparedProvider : WithProviderSelection MusicProviderType ()
        , songs : AnyDict String ( TrackId, MusicProviderType ) (WebData (List Track))
        , playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
        , alternativeTitles : AnyDict String TrackId String
    }
    -> Element Msg
playlistsView model =
    case model.playlists of
        Selection.Importing _ _ { name } ->
            progressBar (Just <| "Importing " ++ name ++ "...")

        Selection.Selected _ (Success p) ->
            p
                |> SelectableList.selected
                |> Maybe.map (songsView model)
                |> Maybe.withDefault
                    (column [ spacing 5, height fill, width fill ] <|
                        SelectableList.toList <|
                            SelectableList.map (playlistView PlaylistSelected) p
                    )

        Selection.Selected _ (Failure _) ->
            paragraph [ width fill ] [ text "An error occured loading your playlists" ]

        Selection.NoProviderSelected ->
            paragraph [ width fill, alignTop ] [ text "Select a provider to load your playlists" ]

        Selection.Selected _ _ ->
            paragraph [ alignTop ] [ progressBar (Just "Loading your playlists...") ]


playlistView : (Playlist -> Msg) -> Playlist -> Element Msg
playlistView tagger p =
    el [ onClick (tagger p) ]
        (paragraph [ width fill ] [ text (p.name ++ " (" ++ String.fromInt p.tracksCount ++ " tracks)") ])


comparedSearch :
    { b
        | availableConnections : List (ProviderConnection MusicProviderType)
        , comparedProvider : WithProviderSelection MusicProviderType ()
        , playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
        , songs : AnyDict String ( TrackId, MusicProviderType ) (WebData (List Track))
    }
    -> Playlist
    -> Element Msg
comparedSearch { availableConnections, playlists, comparedProvider, songs } playlist =
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
                    (Selection.providerType comparedProvider)
                |> Maybe.withDefault []

        allSongsGood =
            playlist.songs
                |> RemoteData.map List.length
                |> RemoteData.map ((==) <| List.length matchedSongs)
                |> RemoteData.withDefault False
    in
    wrappedRow [ spacing 8, height shrink ]
        [ availableConnections
            |> Connections.connectedProviders
            |> asSelectableList playlists
            |> SelectableList.rest
            |> asSelectableList comparedProvider
            |> providerSelector ComparedProviderChanged (Just "Import to")
        , button ([] ++ (primaryButtonStyle <| not (Selection.isSelected comparedProvider)))
            { onPress =
                if Selection.isSelected comparedProvider then
                    Just <| SearchMatchingSongs playlist

                else
                    Nothing
            , label = text "search"
            }
        , button (primaryButtonStyle <| not allSongsGood)
            { onPress =
                if allSongsGood then
                    Just <| ImportPlaylist matchedSongs playlist

                else
                    Nothing
            , label = text "import"
            }
        ]


songsView :
    { b
        | availableConnections : List (ProviderConnection MusicProviderType)
        , comparedProvider : WithProviderSelection MusicProviderType ()
        , playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
        , songs : AnyDict String ( TrackId, MusicProviderType ) (WebData (List Track))
        , alternativeTitles : AnyDict String TrackId String
    }
    -> Playlist
    -> Element Msg
songsView model playlist =
    column [ height fill, width fill ]
        [ button linkButtonStyle { onPress = Just BackToPlaylists, label = text "<< back" }
        , playlist.songs
            |> RemoteData.map
                (\s ->
                    column [ spacing 5, height fill, width fill ]
                        [ comparedSearch model playlist
                        , column [ spacing 8, htmlAttribute <| Html.style "height" "48vh", width fill, scrollbarX, scrollbarY ] <| List.map (song model) s
                        ]
                )
            |> RemoteData.withDefault (progressBar Nothing)
        ]


song :
    { c
        | songs : AnyDict String ( TrackId, MusicProviderType ) (WebData (List b))
        , comparedProvider : WithProviderSelection MusicProviderType data
        , alternativeTitles : AnyDict String TrackId String
    }
    -> Track
    -> Element Msg
song ({ comparedProvider } as model) track =
    row []
        [ paragraph [] [ text <| track.title ++ " - " ++ track.artist ]
        , comparedProvider
            |> Selection.providerType
            |> Maybe.andThen (matchingTracksView model track)
            |> Maybe.map Element.html
            |> Maybe.withDefault Element.none
        ]


matchingTracksView :
    { c
        | comparedProvider : WithProviderSelection MusicProviderType data
        , songs : AnyDict String ( TrackId, MusicProviderType ) (RemoteData e (List b))
        , alternativeTitles : AnyDict String TrackId String
    }
    -> Track
    -> MusicProviderType
    -> Maybe (Html Msg)
matchingTracksView { songs, comparedProvider, alternativeTitles } ({ id, title } as track) pType =
    let
        matchingTracks =
            ( pType, Dict.get ( id, pType ) songs )
    in
    case matchingTracks of
        ( p, Just (Success []) ) ->
            Just
                (Html.span []
                    [ Html.i
                        [ Html.class "fa fa-times"
                        , Html.style "margin-left" "6px"
                        , Html.style "color" "red"
                        , Html.title ("This track doesn't exist on " ++ providerName p ++ " :(")
                        ]
                        []
                    , Html.label [ Html.for "correct-title-input" ] [ Html.text "Try correcting song title:" ]
                    , Html.input [ Html.onInput (ChangeAltTitle id), Html.type_ "text", Html.placeholder title, Html.style "display" "inline", Html.style "width" "auto" ] []
                    , Html.button [ Html.onClick <| RetrySearchSong track (Dict.get id alternativeTitles |> Maybe.withDefault title) ] [ Html.text "retry" ]
                    ]
                )

        ( p, Just (Success _) ) ->
            Just
                (Html.i
                    [ Html.class "fa fa-check"
                    , Html.style "margin-left" "6px"
                    , Html.style "color" "green"
                    , Html.title ("Hurray! Found your track on " ++ providerName p)
                    ]
                    []
                )

        ( _, Just Loading ) ->
            Just (Html.span [ Html.class "loader loader-xs" ] [])

        _ ->
            Nothing


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


connectedProviderDecoder : List (ConnectedProvider MusicProviderType) -> JD.Decoder (Maybe (ConnectedProvider MusicProviderType))
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
        [ Deezer.updateStatus DeezerStatusUpdate
        , Deezer.receivePlaylists ReceiveDeezerPlaylists
        , Deezer.receivePlaylistSongs ReceiveDeezerSongs
        , Deezer.receiveMatchingTracks ReceiveDeezerMatchingSongs
        , Deezer.playlistCreated ReceiveDeezerPlaylist
        , Spotify.onConnected SpotifyConnectionStatusUpdate
        , Browser.onResize (\w h -> BrowserResized <| Dimensions h w)
        ]
