module Main exposing (Model, Msg, update, view, subscriptions, init, main)

import Maybe.Extra as Maybe
import List.Extra as List
import EveryDict as Dict exposing (EveryDict)
import EveryDict.Extra as Dict
import Html exposing (Html)
import Html.Attributes as Html
import Html.Events as Html
import Html.Events.Extra as Html
import Color
import Element exposing (Element, el, row, column, clipY, scrollbarY, text, alpha, paragraph, decorativeImage, image, paragraph, height, width, padding, paddingXY, fill, fillPortion, shrink, px, minimum, maximum, alignRight, centerX, centerY, spacing, mouseOver, html, htmlAttribute)
import Element.Input as Input exposing (button)
import Element.Events exposing (onClick)
import Element.Region as Region
import Element.Background as Bg
import Element.Font as Font
import Element.Border as Border
import Json.Decode as JD
import Json.Encode as JE
import RemoteData exposing (RemoteData(..), WebData)
import Model exposing (MusicProviderType(..), UserInfo)
import SelectableList exposing (SelectableList)
import Connection exposing (ProviderConnection(..))
import Connection.Provider as Provider exposing (ConnectedProvider(..), DisconnectedProvider(..), OAuthToken)
import List.Connection as Connections
import Connection.Selection as Selection exposing (WithProviderSelection(..))
import Playlist exposing (Playlist, PlaylistId)
import Track exposing (Track, TrackId)
import Spotify
import Deezer


-- Model


type alias Model =
    { playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
    , comparedProvider : WithProviderSelection MusicProviderType ()
    , availableConnections : List (ProviderConnection MusicProviderType)
    , songs : EveryDict ( TrackId, MusicProviderType ) (WebData (List Track))
    , alternativeTitles : EveryDict TrackId String
    }


init : ( Model, Cmd Msg )
init =
    ( { playlists = Selection.noSelection
      , comparedProvider = Selection.noSelection
      , availableConnections =
            [ Connection.disconnected Spotify
            , Connection.disconnected Deezer
            ]
      , songs = Dict.empty
      , alternativeTitles = Dict.empty
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
    | ReceiveDeezerMatchingSongs ( ( String, String ), JD.Value )
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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        DeezerStatusUpdate isConnected ->
            let
                connection =
                    if isConnected then
                        Connection.connected Deezer
                    else
                        Connection.disconnected Deezer
            in
                { model | availableConnections = Connections.mapOn Deezer (\_ -> connection) model.availableConnections } ! []

        ToggleConnect pType ->
            let
                toggleCmd =
                    model.availableConnections
                        |> Connections.find pType
                        |> Maybe.mapTogether Connection.isConnected Connection.type_
                        |> Maybe.map (uncurry providerToggleConnectionCmd)
                        |> Maybe.withDefault Cmd.none

                playlists =
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
                { model_
                    | playlists = playlists
                }
                    ! [ toggleCmd ]

        ReceiveDeezerPlaylists (Just pJson) ->
            { model
                | playlists =
                    pJson
                        |> JD.decodeValue (JD.list Deezer.playlist)
                        |> Result.map SelectableList.fromList
                        |> Result.mapError (Deezer.httpBadPayloadError "/playlists" pJson)
                        |> RemoteData.fromResult
                        |> Selection.setData model.playlists
            }
                ! []

        ReceiveDeezerPlaylist pJson ->
            pJson
                |> JD.decodeValue Deezer.playlist
                |> RemoteData.fromResult
                |> RemoteData.mapError (Deezer.httpBadPayloadError "/user/playlist" pJson)
                |> PlaylistImported
                |> (flip update) model

        ReceiveDeezerPlaylists Nothing ->
            { model
                | playlists =
                    "No Playlists received"
                        |> Deezer.httpBadPayloadError "/playlist/songs" JE.null
                        |> RemoteData.Failure
                        |> Selection.setData model.playlists
            }
                ! []

        ReceiveDeezerSongs (Just songsValue) ->
            let
                songsData =
                    songsValue
                        |> JD.decodeValue (JD.list Deezer.track)
                        |> RemoteData.fromResult
                        |> RemoteData.mapError (Deezer.httpBadPayloadError "/playlist/songs" songsValue)
            in
                { model
                    | playlists =
                        Selection.map
                            (SelectableList.mapSelected (Playlist.setSongs songsData))
                            model.playlists
                }
                    ! []

        ReceiveDeezerSongs Nothing ->
            model ! []

        RequestDeezerSongs id ->
            model ! [ Deezer.loadPlaylistSongs (toString id) ]

        ReceiveSpotifyPlaylistSongs playlist songs ->
            { model
                | playlists =
                    Selection.map
                        (SelectableList.mapSelected <| Playlist.setSongs songs)
                        model.playlists
            }
                ! []

        PlaylistSelected p ->
            let
                playlists =
                    Selection.map (SelectableList.upSelect Playlist.loadSongs p) model.playlists

                loadSongs =
                    playlists
                        |> Selection.data
                        |> Maybe.andThen RemoteData.toMaybe
                        |> Maybe.andThen SelectableList.selected
                        |> Maybe.map .songs
                        |> Maybe.map RemoteData.isLoading
                        |> Maybe.withDefault False
            in
                { model
                    | playlists = playlists
                }
                    ! if loadSongs then
                        [ playlists
                            |> Selection.connection
                            |> Maybe.map (\pType -> loadPlaylistSongs pType p)
                            |> Maybe.withDefault Cmd.none
                        ]
                      else
                        []

        BackToPlaylists ->
            { model | playlists = model.playlists |> Selection.map SelectableList.clear } ! []

        SpotifyConnectionStatusUpdate ( Nothing, token ) ->
            let
                connection =
                    Connection.connectedWithToken Spotify token
            in
                model ! [ Spotify.getUserInfo token SpotifyUserInfoReceived ]

        SpotifyConnectionStatusUpdate ( Just _, _ ) ->
            { model
                | availableConnections =
                    Connections.mapOn Spotify
                        (\con -> con |> Connection.type_ |> Connection.disconnected)
                        model.availableConnections
            }
                ! []

        SpotifyUserInfoReceived token (Success user) ->
            let
                connection =
                    Connection.connectedWithToken Spotify token user
            in
                { model
                    | availableConnections =
                        Connections.mapOn Spotify (\_ -> connection) model.availableConnections
                }
                    ! []

        SpotifyUserInfoReceived token _ ->
            { model
                | availableConnections =
                    Connections.mapOn Spotify
                        (\con -> con |> Connection.type_ |> Connection.disconnected)
                        model.availableConnections
            }
                ! []

        MatchingSongResult ({ id } as track) pType results ->
            { model | songs = Dict.insert ( id, pType ) results model.songs } ! []

        ReceivePlaylists playlistsData ->
            let
                data =
                    playlistsData |> RemoteData.map SelectableList.fromList
            in
                { model | playlists = Selection.setData model.playlists data } ! []

        PlaylistsProviderChanged (Just p) ->
            { model | playlists = Selection.select p } ! [ loadPlaylists p ]

        PlaylistsProviderChanged Nothing ->
            { model | playlists = Selection.noSelection } ! []

        ComparedProviderChanged (Just p) ->
            { model | comparedProvider = Selection.select p } ! []

        ComparedProviderChanged Nothing ->
            { model | comparedProvider = Selection.noSelection } ! []

        SearchMatchingSongs playlist ->
            let
                cmds =
                    playlist.songs
                        |> RemoteData.map (List.map (searchMatchingSong playlist.id model))
                        |> RemoteData.withDefault []

                loading =
                    model.comparedProvider
                        |> Selection.providerType
                        |> Maybe.andThen
                            (\pType ->
                                playlist.songs
                                    |> RemoteData.map (List.map (.id >> (flip (,)) pType))
                                    |> RemoteData.map (\keys -> Dict.insertAtAll keys Loading model.songs)
                                    |> RemoteData.toMaybe
                            )
                        |> Maybe.withDefault model.songs
            in
                { model | songs = loading } ! cmds

        ReceiveDeezerMatchingSongs ( trackId, jsonTracks ) ->
            let
                tracks =
                    jsonTracks
                        |> JD.decodeValue (JD.list Deezer.track)
                        |> Result.mapError (Deezer.httpBadPayloadError "/search/tracks" jsonTracks)
                        |> RemoteData.fromResult
            in
                { model
                    | songs =
                        trackId
                            |> Track.deserializeId
                            |> Result.map (\id -> Dict.insert ( id, Deezer ) tracks model.songs)
                            |> Result.withDefault model.songs
                }
                    ! []

        RetrySearchSong track title ->
            model
                ! [ model.comparedProvider
                        |> Selection.connection
                        |> Maybe.map (searchSongFromProvider { track | title = title })
                        |> Maybe.withDefault Cmd.none
                  ]

        ChangeAltTitle id title ->
            { model | alternativeTitles = Dict.insert id title model.alternativeTitles } ! []

        ImportPlaylist songs playlist ->
            { model | playlists = Selection.importing model.playlists playlist } ! [ imporPlaylist model playlist songs ]

        PlaylistImported _ ->
            { model | playlists = Selection.importDone model.playlists } ! []



-- Helpers


imporPlaylist : Model -> Playlist -> List Track -> Cmd Msg
imporPlaylist { comparedProvider } { name } songs =
    case comparedProvider of
        Selection.Selected con _ ->
            case ( Provider.connectedType con, Provider.token con, Provider.user con ) of
                ( Spotify, Just token, Just { id } ) ->
                    Spotify.importPlaylist token id PlaylistImported songs name

                ( Deezer, _, _ ) ->
                    songs
                        |> List.map (.id >> Tuple.second)
                        |> List.andThenResult String.toInt
                        |> Result.map ((,) name)
                        |> Result.map Deezer.createPlaylistWithTracks
                        |> Result.withDefault Cmd.none

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
loadPlaylistSongs connection ({ id, link } as playlist) =
    case connection of
        ConnectedProvider Deezer ->
            Deezer.loadPlaylistSongs id

        ConnectedProviderWithToken Spotify token _ ->
            Spotify.getPlaylistTracksFromLink token (ReceiveSpotifyPlaylistSongs playlist) link

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
            Deezer.searchSong ({ id = Track.serializeId track.id, artist = track.artist, title = track.title })

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
    { primary = Color.rgb 220 94 93
    , primaryFaded = Color.rgba 250 160 112 0.1
    , secondary = Color.rgb 69 162 134
    , ternary = Color.rgb 248 160 116
    , quaternary = Color.rgb 189 199 79
    , transparentWhite = Color.rgba 255 255 255 0.7
    , text = Color.rgb 42 67 80
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
        ++ if (disabled) then
            [ alpha 0.5 ]
           else
            [ mouseOver [ Bg.color palette.secondary, Font.color Color.white ] ]


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
        ]
    <|
        column [ padding 16 ]
            [ row [ Region.navigation, height (px 130) ] [ header ]
            , row [ Region.mainContent, height fill ] [ content model ]
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
        [ label |> Maybe.map (flip (++) ":") |> Maybe.map (el [] << text) |> Maybe.withDefault Element.none
        , el [] <|
            Element.html
                (Html.select
                    [ Html.name "provider-selector"
                    , Html.style [ ( "display", "inline" ), ( "width", "auto" ) ]
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
            (providerName provider)
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
            ([ width fill, height (px 46) ] ++ primaryButtonStyle connecting)
            { onPress =
                if connecting then
                    Nothing
                else
                    Just <| tagger (Connection.type_ connection)
            , label =
                row [ centerX, width (fillPortion 3 |> minimum 125), spacing 5 ] <|
                    [ (connection |> Connection.type_ |> providerLogoOrName [ height (px 30), width (px 30) ])
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
    decorativeImage attrs { src = "assets/img/Note.svg" }



-- View parts


header : Element msg
header =
    logo [ Element.alignLeft, width (px 250) ]


content : Model -> Element Msg
content model =
    el [ Bg.uncropped "assets/img/Note.svg", width fill, height fill ] <|
        column
            [ padding 16
            , Bg.color palette.transparentWhite
            , Border.rounded 3
            , Border.glow palette.ternary 1
            ]
        <|
            [ row []
                [ model.availableConnections
                    |> Connections.connectedProviders
                    |> asSelectableList model.playlists
                    |> providerSelector PlaylistsProviderChanged (Just "Select a main provider")
                , column [ spacing 8 ] <| buttons model
                ]
            , row [] [ playlists model ]
            ]


playlists :
    { b
        | availableConnections : List (ProviderConnection MusicProviderType)
        , comparedProvider : WithProviderSelection MusicProviderType ()
        , songs : EveryDict ( TrackId, MusicProviderType ) (WebData (List Track))
        , playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
        , alternativeTitles : EveryDict TrackId String
    }
    -> Element Msg
playlists model =
    case model.playlists of
        Selection.Importing _ _ { name } ->
            progressBar (Just <| "Importing " ++ name ++ "...")

        Selection.Selected _ (Success p) ->
            p
                |> SelectableList.selected
                |> Maybe.map (songs model)
                |> Maybe.withDefault
                    (column [ width fill, spacing 5 ] <|
                        SelectableList.toList <|
                            SelectableList.map (playlist PlaylistSelected) p
                    )

        Selection.Selected _ (Failure err) ->
            paragraph [ width fill ] [ text ("An error occured loading your playlists: " ++ toString err) ]

        Selection.NoProviderSelected ->
            paragraph [ width fill ] [ text "Select a provider to load your playlists" ]

        Selection.Selected _ _ ->
            progressBar (Just "Loading your playlists...")


playlist : (Playlist -> Msg) -> Playlist -> Element Msg
playlist tagger p =
    el [ onClick (tagger p) ]
        (paragraph [ width fill ] [ text (p.name ++ " (" ++ toString p.tracksCount ++ " tracks)") ])


comparedSearch :
    { b
        | availableConnections : List (ProviderConnection MusicProviderType)
        , comparedProvider : WithProviderSelection MusicProviderType ()
        , playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
        , songs : EveryDict ( TrackId, MusicProviderType ) (WebData (List Track))
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
        row [ spacing 8, height shrink ]
            [ availableConnections
                |> Connections.connectedProviders
                |> asSelectableList playlists
                |> SelectableList.rest
                |> asSelectableList comparedProvider
                |> providerSelector ComparedProviderChanged (Just "Copy the playlist to")
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


songs :
    { b
        | availableConnections : List (ProviderConnection MusicProviderType)
        , comparedProvider : WithProviderSelection MusicProviderType ()
        , playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
        , songs : EveryDict ( TrackId, MusicProviderType ) (WebData (List Track))
        , alternativeTitles : EveryDict TrackId String
    }
    -> Playlist
    -> Element Msg
songs model playlist =
    column []
        [ button linkButtonStyle { onPress = Just BackToPlaylists, label = text "<< back" }
        , playlist.songs
            |> RemoteData.map
                (\s ->
                    column [ spacing 5 ]
                        [ comparedSearch model playlist
                        , column [ spacing 8 ] <| List.map (song model) s
                        ]
                )
            |> RemoteData.withDefault (progressBar Nothing)
        ]


song :
    { c
        | songs : EveryDict ( TrackId, MusicProviderType ) (WebData (List b))
        , comparedProvider : WithProviderSelection MusicProviderType data
        , alternativeTitles : EveryDict TrackId String
    }
    -> Track
    -> Element Msg
song ({ comparedProvider } as model) track =
    row []
        [ paragraph [] [ text <| track.title ++ " - " ++ track.artist ]
        , comparedProvider
            |> Selection.providerType
            |> Maybe.andThen (matchingTracks model track)
            |> Maybe.map Element.html
            |> Maybe.withDefault Element.none
        ]


matchingTracks :
    { c
        | comparedProvider : WithProviderSelection MusicProviderType data
        , songs : EveryDict ( TrackId, MusicProviderType ) (RemoteData e (List b))
        , alternativeTitles : EveryDict TrackId String
    }
    -> Track
    -> MusicProviderType
    -> Maybe (Html Msg)
matchingTracks { songs, comparedProvider, alternativeTitles } ({ id, title } as track) pType =
    let
        pType =
            Selection.providerType comparedProvider

        mathingSongs =
            Maybe.map (\p -> ( p, Dict.get ( id, p ) songs )) pType
    in
        case mathingSongs of
            Just ( p, Just (Success []) ) ->
                Just
                    (Html.span []
                        [ Html.i
                            [ Html.class "fa fa-times"
                            , Html.style [ ( "margin-left", "6px" ), ( "color", "red" ) ]
                            , Html.title ("This track doesn't exist on " ++ providerName p ++ " :(")
                            ]
                            []
                        , Html.label [ Html.for "correct-title-input" ] [ Html.text "Try correcting song title:" ]
                        , Html.input [ Html.onInput (ChangeAltTitle id), Html.type_ "text", Html.placeholder title, Html.style [ ( "display", "inline" ), ( "width", "auto" ) ] ] []
                        , Html.button [ Html.onClick <| RetrySearchSong track (Dict.get id alternativeTitles |> Maybe.withDefault title) ] [ Html.text "retry" ]
                        ]
                    )

            Just ( p, Just (Success _) ) ->
                Just
                    (Html.i
                        [ Html.class "fa fa-check"
                        , Html.style [ ( "margin-left", "6px" ), ( "color", "green" ) ]
                        , Html.title ("Hurray! Found your track on " ++ providerName p)
                        ]
                        []
                    )

            Just ( _, Just Loading ) ->
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


main : Program Never Model Msg
main =
    Html.program
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
        ]
