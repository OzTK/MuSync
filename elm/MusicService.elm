module MusicService exposing
    ( ConnectingProvider(..)
    , DisconnectedProvider(..)
    , MusicServiceError
    , connect
    , connecting
    , disconnect
    , disconnected
    , fetchUserInfo
    , fromString
    , importPlaylist
    , importedPlaylist
    , importedPlaylistKey
    , loadPlaylists
    )

import ApiClient as Api
import Array
import Connection.Connected as ConnectedProvider exposing (ConnectedProvider(..), MusicService(..), OAuthToken)
import Deezer
import List.Extra as List
import Playlist exposing (Playlist, PlaylistId)
import Playlist.Dict as Playlists exposing (PlaylistKey)
import Playlist.Import exposing (PlaylistImportReport, TrackAndSearchResult)
import Playlist.State exposing (PlaylistImportResult)
import RemoteData exposing (RemoteData(..), WebData)
import Set
import Spotify
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


disconnect : ConnectedProvider -> DisconnectedProvider
disconnect connection =
    DisconnectedProvider <| ConnectedProvider.type_ connection


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



-- HTTP


fetchUserInfo : ConnectedProvider -> Task MusicServiceError (WebData UserInfo)
fetchUserInfo connection =
    case connection of
        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.getUserInfo (ConnectedProvider.rawToken tok) |> asErrorTask

        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.getUserInfo (ConnectedProvider.rawToken tok) |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


createPlaylist : ConnectedProvider -> String -> Task MusicServiceError (WebData Playlist)
createPlaylist connection name =
    case connection of
        ConnectedProviderWithToken Spotify tok (Success userInfo) ->
            Spotify.createPlaylist (ConnectedProvider.rawToken tok) userInfo.id name |> asErrorTask

        ConnectedProviderWithToken Deezer tok (Success userInfo) ->
            Deezer.createPlaylist (ConnectedProvider.rawToken tok) userInfo.id name |> asErrorTask

        ConnectedProvider _ _ ->
            Task.fail (InvalidServiceConnectionError connection)

        ConnectedProviderWithToken _ _ _ ->
            Task.fail (MissingUserInfo connection)


addSongsToPlaylist : ConnectedProvider -> Playlist -> List Track -> Task MusicServiceError (WebData ())
addSongsToPlaylist connection playlist tracks =
    case connection of
        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.addSongsToPlaylist (ConnectedProvider.rawToken tok) tracks playlist |> asErrorTask

        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.addSongsToPlaylist (ConnectedProvider.rawToken tok) tracks playlist.id |> asErrorTask

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


importedPlaylistKey : PlaylistImportResult -> PlaylistKey
importedPlaylistKey { connection, playlist } =
    Playlists.keyFromPlaylist connection playlist


importedPlaylist : PlaylistImportResult -> Playlist
importedPlaylist { playlist } =
    playlist


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
        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.getPlaylists (ConnectedProvider.rawToken tok) |> asErrorTask

        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.getPlaylists (ConnectedProvider.rawToken tok) |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


loadPlaylistSongs : ConnectedProvider -> Playlist -> Task MusicServiceError (WebData (List Track))
loadPlaylistSongs connection { id, link } =
    case connection of
        ConnectedProviderWithToken Deezer tok _ ->
            Deezer.getPlaylistTracks (ConnectedProvider.rawToken tok) id |> asErrorTask

        ConnectedProviderWithToken Spotify tok _ ->
            Spotify.getPlaylistTracksFromLink (ConnectedProvider.rawToken tok) link |> asErrorTask

        _ ->
            Task.fail (InvalidServiceConnectionError connection)


searchSongFromProvider : ConnectedProvider -> Track -> Task MusicServiceError (WebData (Maybe Track))
searchSongFromProvider con track =
    let
        searchFns =
            case con of
                ConnectedProviderWithToken Spotify tok _ ->
                    Just ( Spotify.searchTrackByISRC, Spotify.searchTrackByName, ConnectedProvider.rawToken tok )

                ConnectedProviderWithToken Deezer tok _ ->
                    Just ( Deezer.searchTrackByISRC, Deezer.searchTrackByName, ConnectedProvider.rawToken tok )

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
