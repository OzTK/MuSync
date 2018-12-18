module MusicService exposing
    ( ConnectedProvider(..)
    , ConnectingProvider(..)
    , DisconnectedProvider(..)
    , MusicService(..)
    , MusicServiceError
    , OAuthToken
    , PlaylistImportReport
    , PlaylistImportResult
    , TrackAndSearchResult
    , connect
    , connected
    , connectedWithToken
    , connecting
    , connectionToString
    , createToken
    , disconnect
    , disconnected
    , failedTracks
    , fetchUserInfo
    , fromString
    , importPlaylist
    , importedPlaylist
    , importedPlaylistDuplicateCount
    , importedPlaylistKey
    , loadPlaylists
    , setUserInfo
    , toString
    , token
    , type_
    , user
    )

import ApiClient as Api
import Array
import Basics.Extra exposing (iif)
import Deezer
import Http
import Json.Decode as Decode exposing (Decoder)
import List.Extra as List
import Maybe.Extra as Maybe
import Model exposing (UserInfo)
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..), WebData)
import Set
import Spotify
import Task exposing (Task)
import Task.Extra as Task
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



-- HTTP


fetchUserInfo : ConnectedProvider -> Task MusicServiceError (WebData UserInfo)
fetchUserInfo connection =
    case connection of
        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.getUserInfo (rawToken tok) |> asErrorTask

        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.getUserInfo (rawToken tok) |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


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


addSongsToPlaylist : ConnectedProvider -> Playlist -> List Track -> Task MusicServiceError (WebData ())
addSongsToPlaylist connection playlist tracks =
    case connection of
        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.addSongsToPlaylist (rawToken tok) tracks playlist |> asErrorTask

        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.addSongsToPlaylist (rawToken tok) tracks playlist.id |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


type alias TrackAndSearchResult =
    ( Track, Maybe Track )


removeDuplicates : List Track -> ( List Track, Int )
removeDuplicates trackList =
    trackList
        |> List.foldl
            (\t ( tracks, ids ) ->
                let
                    tid =
                        t.isrc |> Maybe.withDefault (Track.toString t)
                in
                if Set.member tid ids then
                    ( tracks, ids )

                else
                    ( Array.push t tracks, Set.insert tid ids )
            )
            ( Array.empty, Set.empty )
        |> Tuple.mapFirst Array.toList
        |> Tuple.mapSecond (Set.size >> (-) (List.length trackList) >> abs)


searchAllTracks : ConnectedProvider -> List Track -> Task MusicServiceError (WebData (List TrackAndSearchResult))
searchAllTracks connection trackList =
    trackList
        |> List.map (\t -> searchSongFromProvider connection t |> Task.map (Tuple.pair t))
        |> Task.sequence
        |> Task.map List.unzip
        |> Task.map (Tuple.mapSecond RemoteData.fromList)
        |> Task.map (\( tracks, result ) -> RemoteData.map (Tuple.pair tracks) result)
        |> Task.map (RemoteData.map List.zip)


type alias PlaylistImportResult =
    { connection : ConnectedProvider
    , playlist : Playlist
    , status : PlaylistImportReport
    }


type PlaylistImportReport
    = ImportIsSuccess
    | ImportHasWarnings (List TrackAndSearchResult) Int


importedPlaylistKey : PlaylistImportResult -> ( ConnectedProvider, PlaylistId )
importedPlaylistKey { connection, playlist, status } =
    case status of
        ImportIsSuccess ->
            ( connection, playlist.id )

        ImportHasWarnings _ _ ->
            ( connection, playlist.id )


importedPlaylist : PlaylistImportResult -> Playlist
importedPlaylist { status, playlist } =
    case status of
        ImportIsSuccess ->
            playlist

        ImportHasWarnings _ _ ->
            playlist


importedPlaylistDuplicateCount : PlaylistImportReport -> Int
importedPlaylistDuplicateCount status =
    case status of
        ImportIsSuccess ->
            0

        ImportHasWarnings _ dupes ->
            dupes


failedTracks : PlaylistImportReport -> List Track
failedTracks report =
    case report of
        ImportIsSuccess ->
            []

        ImportHasWarnings tracks _ ->
            List.filterMap
                (\( t, m ) ->
                    case m of
                        Just _ ->
                            Nothing

                        Nothing ->
                            Just t
                )
                tracks


importPlaylist : ConnectedProvider -> ConnectedProvider -> Playlist -> Task MusicServiceError (WebData PlaylistImportResult)
importPlaylist con otherConnection ({ name, link, tracksCount } as playlist) =
    let
        tracksTask =
            playlist
                |> loadPlaylistSongs con
                |> Api.map removeDuplicates
                |> Api.chain
                    (\( t, dupes ) ->
                        searchAllTracks otherConnection t |> Api.map (\d -> ( d, dupes ))
                    )

        newPlaylistTask =
            createPlaylist otherConnection name

        hasMissingTracks =
            \tracksResult p -> p.tracksCount > List.length tracksResult
    in
    Api.chain2
        (\( tracksResult, dupes ) newPlaylist ->
            let
                matchedTracks =
                    List.filterMap Tuple.second tracksResult

                matchedTrackCount =
                    List.length matchedTracks

                withTracksCount =
                    { newPlaylist | tracksCount = matchedTrackCount }

                msg =
                    if matchedTrackCount < tracksCount then
                        ImportHasWarnings tracksResult dupes

                    else
                        ImportIsSuccess
            in
            matchedTracks
                |> addSongsToPlaylist otherConnection newPlaylist
                |> Api.map (\_ -> PlaylistImportResult otherConnection withTracksCount msg)
        )
        tracksTask
        newPlaylistTask


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
            Deezer.getPlaylistTracks (rawToken tok) id |> asErrorTask

        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.getPlaylistTracksFromLink (rawToken tok) link |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


searchSongFromProvider : ConnectedProvider -> Track -> Task MusicServiceError (WebData (Maybe Track))
searchSongFromProvider provider track =
    case provider of
        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.searchTrack (rawToken tok) track |> asErrorTask

        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.searchTrack (rawToken tok) track |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError provider)



-- Internal utils


asErrorTask : Task x a -> Task MusicServiceError a
asErrorTask =
    Task.mapError (\_ -> NeverError)


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
