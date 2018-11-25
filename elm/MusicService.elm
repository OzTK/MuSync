module MusicService exposing
    ( ConnectedProvider(..)
    , ConnectingProvider(..)
    , DisconnectedProvider(..)
    , MusicService(..)
    , OAuthToken
    , connect
    , connected
    , connectedWithToken
    , connecting
    , connectionToString
    , createToken
    , disconnect
    , disconnected
    , fromString
    , loadPlaylists
    , searchMatchingSong
    , setUserInfo
    , toString
    , token
    , type_
    )

import Deezer
import Json.Decode as Decode exposing (Decoder)
import List.Extra as List
import Model exposing (UserInfo)
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..), WebData)
import Spotify
import Task exposing (Task)
import Track exposing (Track, TrackId)
import Tuple exposing (pair)


type MusicService
    = Spotify
    | Deezer
    | Google
    | Amazon


type MusicServiceError
    = InvalidServiceConnectionError


type OAuthToken
    = OAuthToken String


type OAuthTokenFormatError
    = EmptyTokenError


createToken : String -> Result OAuthTokenFormatError OAuthToken
createToken rawValue =
    if rawValue == "" then
        Err EmptyTokenError

    else
        Ok (OAuthToken rawValue)


rawToken : OAuthToken -> String
rawToken (OAuthToken value) =
    value


type ConnectedProvider
    = ConnectedProvider MusicService (WebData UserInfo)
    | ConnectedProviderWithToken MusicService OAuthToken (WebData UserInfo)


connectionToString : ConnectedProvider -> String
connectionToString =
    type_ >> toString


connect : DisconnectedProvider -> OAuthToken -> ConnectedProvider
connect (DisconnectedProvider service) tok =
    ConnectedProviderWithToken service tok NotAsked


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


asErrorTask : Task Never a -> Task MusicServiceError a
asErrorTask =
    Task.mapError (\_ -> InvalidServiceConnectionError)


imporPlaylist : (WebData Playlist -> msg) -> ConnectedProvider -> Playlist -> List Track -> Cmd msg
imporPlaylist tagger con { name } tracks =
    case ( type_ con, token con, user con ) of
        ( Spotify, Just tok, Just { id } ) ->
            Spotify.importPlaylist (rawToken tok) id tracks name |> Task.perform tagger

        ( Deezer, Just tok, Just { id } ) ->
            Deezer.importPlaylist (rawToken tok) id tracks name |> Task.perform tagger

        _ ->
            Cmd.none


loadPlaylists : (ConnectedProvider -> WebData (List Playlist) -> msg) -> ConnectedProvider -> Cmd msg
loadPlaylists tagger connection =
    case connection of
        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.getPlaylists (rawToken tok) |> Task.perform (tagger connection)

        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.getPlaylists (rawToken tok) |> Task.perform (tagger connection)

        _ ->
            Cmd.none


loadPlaylistSongs : (WebData (List Track) -> msg) -> ConnectedProvider -> Playlist -> Cmd msg
loadPlaylistSongs tagger connection { id, link } =
    case connection of
        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.getPlaylistTracksFromLink (rawToken tok) link |> Task.perform tagger

        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.getPlaylistTracksFromLink (rawToken tok) link |> Task.perform tagger

        _ ->
            Cmd.none


searchMatchingSong : ConnectedProvider -> Track -> Task MusicServiceError (WebData (List Track))
searchMatchingSong comparedProvider track =
    searchSongFromProvider track comparedProvider


searchSongFromProvider : Track -> ConnectedProvider -> Task MusicServiceError (WebData (List Track))
searchSongFromProvider track provider =
    case provider of
        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.searchTrack (rawToken tok) track |> asErrorTask

        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.searchTrack (rawToken tok) track |> asErrorTask

        _ ->
            Task.fail InvalidServiceConnectionError
