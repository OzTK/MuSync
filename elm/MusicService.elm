module MusicService exposing
    ( ConnectingProvider(..)
    , DisconnectedProvider(..)
    , MusicServiceError
    , connect
    , connecting
    , disconnected
    , fetchUserInfo
    , importPlaylist
    , loadPlaylists
    )

-- import Deezer as DeezerMod
-- import Spotify as SpotifyMod

import ApiClient as Api
import Array
import Connection.Connected as ConnectedProvider exposing (ConnectedProvider(..), OAuthToken)
import List.Extra as List
import MusicProvider exposing (MusicService(..))
import Playlist exposing (Playlist)
import Playlist.Import exposing (TrackAndSearchResult)
import Playlist.State exposing (PlaylistImportResult)
import RemoteData exposing (RemoteData(..), WebData)
import Set
import Task exposing (Task)
import Track exposing (Track)
import Tuple
import UserInfo exposing (UserInfo)


type MusicServiceError
    = InvalidServiceConnectionError ConnectedProvider
    | MissingUserInfo ConnectedProvider
    | NeverError


type DisconnectedProvider
    = DisconnectedProvider MusicService


connect : DisconnectedProvider -> OAuthToken -> ConnectedProvider
connect (DisconnectedProvider service) tok =
    ConnectedProviderWithToken service tok NotAsked


disconnected : MusicService -> DisconnectedProvider
disconnected =
    DisconnectedProvider


type ConnectingProvider
    = ConnectingProvider MusicService


connecting : MusicService -> ConnectingProvider
connecting =
    ConnectingProvider



-- HTTP


fetchUserInfo : ConnectedProvider -> Task MusicServiceError (WebData UserInfo)
fetchUserInfo connection =
    case connection of
        ConnectedProviderWithToken service tok _ ->
            let
                api =
                    MusicProvider.api service
            in
            api.getUserInfo (ConnectedProvider.rawToken tok) |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


createPlaylist : ConnectedProvider -> String -> Task MusicServiceError (WebData Playlist)
createPlaylist connection name =
    case connection of
        ConnectedProviderWithToken service tok (Success userInfo) ->
            let
                api =
                    MusicProvider.api service
            in
            api.createPlaylist (ConnectedProvider.rawToken tok) userInfo.id name |> asErrorTask

        ConnectedProvider _ _ ->
            Task.fail (InvalidServiceConnectionError connection)

        ConnectedProviderWithToken _ _ _ ->
            Task.fail (MissingUserInfo connection)


addSongsToPlaylist : ConnectedProvider -> Playlist -> List Track -> Task MusicServiceError (WebData ())
addSongsToPlaylist connection playlist tracks =
    case connection of
        ConnectedProviderWithToken service tok _ ->
            let
                api =
                    MusicProvider.api service
            in
            api.addSongsToPlaylist (ConnectedProvider.rawToken tok) tracks playlist |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


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


importPlaylist : ConnectedProvider -> ConnectedProvider -> Playlist -> Task MusicServiceError (WebData PlaylistImportResult)
importPlaylist con otherConnection ({ name } as playlist) =
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
    in
    Api.chain2
        (\( tracksResult, dupes ) newPlaylist ->
            let
                report =
                    Playlist.Import.report tracksResult dupes

                matchedTracks =
                    Playlist.Import.matchedTracks report

                withTracksCount =
                    { newPlaylist | tracksCount = List.length <| matchedTracks }
            in
            matchedTracks
                |> addSongsToPlaylist otherConnection newPlaylist
                |> Api.map (\_ -> PlaylistImportResult otherConnection withTracksCount report)
        )
        tracksTask
        newPlaylistTask


loadPlaylists : ConnectedProvider -> Task MusicServiceError (WebData (List Playlist))
loadPlaylists connection =
    case connection of
        ConnectedProviderWithToken service tok _ ->
            let
                api =
                    MusicProvider.api service
            in
            api.getPlaylists (ConnectedProvider.rawToken tok) |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


loadPlaylistSongs : ConnectedProvider -> Playlist -> Task MusicServiceError (WebData (List Track))
loadPlaylistSongs connection playlist =
    case connection of
        ConnectedProviderWithToken service tok _ ->
            let
                api =
                    MusicProvider.api service
            in
            api.getPlaylistTracks (ConnectedProvider.rawToken tok) playlist |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


searchSongFromProvider : ConnectedProvider -> Track -> Task MusicServiceError (WebData (Maybe Track))
searchSongFromProvider con track =
    let
        searchFns =
            case con of
                ConnectedProviderWithToken service tok _ ->
                    let
                        api =
                            MusicProvider.api service
                    in
                    Just ( api.searchTrackByISRC, api.searchTrackByName, ConnectedProvider.rawToken tok )

                _ ->
                    Nothing
    in
    searchFns
        |> Maybe.map
            (\( searchTrackByISRC, searchTrackByName, tok ) ->
                track
                    |> Track.identified
                    |> Maybe.map (searchTrackByISRC tok)
                    |> Maybe.map
                        (Api.chain
                            (\data ->
                                case data of
                                    Nothing ->
                                        searchTrackByName tok track

                                    Just _ ->
                                        Task.succeed <| Success data
                            )
                        )
                    |> Maybe.map asErrorTask
                    |> Maybe.withDefault (searchTrackByName tok track |> asErrorTask)
            )
        |> Maybe.withDefault (Task.fail (InvalidServiceConnectionError con))



-- Internal utils


asErrorTask : Task x a -> Task MusicServiceError a
asErrorTask =
    Task.mapError (\_ -> NeverError)
