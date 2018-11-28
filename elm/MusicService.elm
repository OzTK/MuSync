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
import Http
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
    = InvalidServiceConnectionError ConnectedProvider
    | MissingUserInfo ConnectedProvider
    | IntermediateRequestFailed (Maybe Http.Error)
    | NeverError


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


asErrorTask : Task x a -> Task MusicServiceError a
asErrorTask =
    Task.mapError (\_ -> NeverError)


createPlaylist : ConnectedProvider -> String -> Task MusicServiceError (WebData Playlist)
createPlaylist connection name =
    case connection of
        ConnectedProviderWithToken Spotify tok (Success userInfo) ->
            Spotify.createPlaylist (rawToken tok) userInfo.id name |> asErrorTask

        ConnectedProviderWithToken Deezer tok (Success userInfo) ->
            Deezer.createPlaylist (rawToken tok) userInfo.id name |> asErrorTask

        ConnectedProvider _ _ ->
            Task.fail (InvalidServiceConnectionError connection)

        ConnectedProviderWithToken _ _ _ ->
            Task.fail (MissingUserInfo connection)


addSongsToPlaylist : ConnectedProvider -> Playlist -> List Track -> Task Never (WebData Playlist)
addSongsToPlaylist connection playlist tracks =
    Debug.todo <| "Adding all the tracks from " ++ connectionToString connection ++ " to " ++ playlist.name


liftError : Task MusicServiceError (WebData a) -> Task MusicServiceError a
liftError task =
    task
        |> Task.andThen
            (\data ->
                case data of
                    Success d ->
                        Task.succeed d

                    Failure err ->
                        Task.fail <| IntermediateRequestFailed (Just err)

                    _ ->
                        Task.fail <| IntermediateRequestFailed Nothing
            )


searchAllTracks : ConnectedProvider -> List Track -> Task MusicServiceError (WebData (List Track))
searchAllTracks connectedProvider trackList =
    Debug.todo "Search all the tracks"


imporPlaylist : ConnectedProvider -> Playlist -> ConnectedProvider -> Task MusicServiceError (WebData Playlist)
imporPlaylist con ({ name, link } as playlist) otherConnection =
    let
        tracksTask =
            playlist
                |> loadPlaylistSongs con
                |> liftError
                |> Task.andThen (searchAllTracks otherConnection)
                |> liftError

        newPlaylistTask =
            createPlaylist con name |> liftError
    in
    Task.map2
        (\tracks newPlaylist -> addSongsToPlaylist con newPlaylist tracks |> asErrorTask)
        tracksTask
        newPlaylistTask
        |> Task.andThen identity


loadPlaylists : ConnectedProvider -> Task MusicServiceError (WebData (List Playlist))
loadPlaylists connection =
    case connection of
        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.getPlaylists (rawToken tok) |> asErrorTask

        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.getPlaylists (rawToken tok) |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


loadPlaylistSongs : ConnectedProvider -> Playlist -> Task MusicServiceError (WebData (List Track))
loadPlaylistSongs connection { id, link } =
    case connection of
        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.getPlaylistTracksFromLink (rawToken tok) link |> asErrorTask

        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.getPlaylistTracksFromLink (rawToken tok) link |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


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
            Task.fail (InvalidServiceConnectionError provider)
