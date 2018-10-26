module MusicService exposing
    ( ConnectedProvider(..)
    , ConnectingProvider(..)
    , DisconnectedProvider(..)
    , MusicService(..)
    , OAuthToken
    , connected
    , connectedWithToken
    , connecting
    , disconnect
    , disconnected
    , fromString
    , loadPlaylists
    , searchMatchingSong
    , setUserInfo
    , toString
    , type_
    )

import Deezer
import Json.Decode as Decode exposing (Decoder)
import List.Extra as List
import Model exposing (UserInfo)
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..), WebData)
import Spotify
import Track exposing (Track, TrackId)
import Tuple exposing (pair)


type MusicService
    = Spotify
    | Deezer
    | Google
    | Amazon


type alias OAuthToken =
    String


type ConnectedProvider
    = ConnectedProvider MusicService (WebData UserInfo)
    | ConnectedProviderWithToken MusicService OAuthToken (WebData UserInfo)


connected : MusicService -> WebData UserInfo -> ConnectedProvider
connected t userInfo =
    ConnectedProvider t userInfo


type_ : ConnectedProvider -> MusicService
type_ connection =
    case connection of
        ConnectedProvider t _ ->
            t

        ConnectedProviderWithToken t _ _ ->
            t


token : ConnectedProvider -> Maybe OAuthToken
token con =
    case con of
        ConnectedProviderWithToken _ t _ ->
            Just t

        _ ->
            Nothing


user : ConnectedProvider -> Maybe UserInfo
user con =
    case con of
        ConnectedProviderWithToken _ _ (Success u) ->
            Just u

        ConnectedProvider _ (Success u) ->
            Just u

        _ ->
            Nothing


setUserInfo : WebData UserInfo -> ConnectedProvider -> ConnectedProvider
setUserInfo userInfo provider =
    case provider of
        ConnectedProvider t _ ->
            ConnectedProvider t userInfo

        ConnectedProviderWithToken t tok _ ->
            ConnectedProviderWithToken t tok userInfo


connectedWithToken : MusicService -> OAuthToken -> WebData UserInfo -> ConnectedProvider
connectedWithToken t tok u =
    ConnectedProviderWithToken t tok u


type DisconnectedProvider
    = DisconnectedProvider MusicService


disconnected : MusicService -> DisconnectedProvider
disconnected =
    DisconnectedProvider


disconnect : ConnectedProvider -> DisconnectedProvider
disconnect connection =
    DisconnectedProvider <| type_ connection


type ConnectingProvider
    = ConnectingProvider MusicService


connecting : MusicService -> ConnectingProvider
connecting =
    ConnectingProvider


fromString : String -> Maybe MusicService
fromString pName =
    case pName of
        "Spotify" ->
            Just Spotify

        "Deezer" ->
            Just Deezer

        "Google" ->
            Just Google

        "Amazon" ->
            Just Amazon

        _ ->
            Nothing


toString : MusicService -> String
toString t =
    case t of
        Spotify ->
            "Spotify"

        Deezer ->
            "Deezer"

        Google ->
            "Google"

        Amazon ->
            "Amazon"


imporPlaylist : (WebData Playlist -> msg) -> ConnectedProvider -> Playlist -> List Track -> Cmd msg
imporPlaylist tagger con { name } tracks =
    case ( type_ con, token con, user con ) of
        ( Spotify, Just tok, Just { id } ) ->
            Spotify.importPlaylist tok id tagger tracks name

        ( Deezer, _, _ ) ->
            tracks
                |> List.map .id
                |> List.andThenMaybe String.toInt
                |> Maybe.map (pair name)
                |> Maybe.map Deezer.createPlaylistWithTracks
                |> Maybe.withDefault Cmd.none

        _ ->
            Cmd.none


loadPlaylists : (ConnectedProvider -> WebData (List Playlist) -> msg) -> ConnectedProvider -> Cmd msg
loadPlaylists tagger connection =
    case connection of
        ConnectedProvider Deezer _ ->
            Deezer.loadAllPlaylists ()

        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.getPlaylists tok (tagger connection)

        _ ->
            Cmd.none


loadPlaylistSongs : (WebData (List Track) -> msg) -> ConnectedProvider -> Playlist -> Cmd msg
loadPlaylistSongs tagger connection { id, link } =
    case connection of
        ConnectedProvider Deezer _ ->
            Deezer.loadPlaylistSongs id

        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.getPlaylistTracksFromLink tok tagger link

        _ ->
            Cmd.none


searchMatchingSong : (WebData (List Track) -> msg) -> ConnectedProvider -> Track -> Cmd msg
searchMatchingSong tagger comparedProvider track =
    comparedProvider
        |> searchSongFromProvider tagger track


searchSongFromProvider : (WebData (List Track) -> msg) -> Track -> ConnectedProvider -> Cmd msg
searchSongFromProvider tagger track provider =
    case provider of
        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.searchTrack tok tagger track

        ConnectedProvider Deezer _ ->
            Deezer.searchSong { id = track.id, artist = track.artist, title = track.title }

        _ ->
            Cmd.none
