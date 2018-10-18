module Flow exposing (Flow(..), next, start, togglePlaylist, udpateLoadingPlaylists, updateConnection)

import Connection exposing (ProviderConnection)
import Connection.Provider as Provider exposing (ConnectedProvider, MusicProviderType)
import Dict.Any as Dict exposing (AnyDict)
import List.Connection as Connections
import List.Extra as List
import Maybe.Extra as Maybe
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..), WebData)
import Tuple exposing (pair, second)


type alias ConnectionsWithLoadingPlaylists =
    List ( ConnectedProvider, WebData (List Playlist) )


type alias SelectablePlaylistsByConnection =
    AnyDict String ConnectedProvider (List ( Bool, Playlist ))


type Flow
    = Connect (List ProviderConnection)
    | LoadPlaylists ConnectionsWithLoadingPlaylists
    | PickPlaylists SelectablePlaylistsByConnection


start : List ProviderConnection -> Flow
start connections =
    Connect connections


next : Flow -> Flow
next flow =
    case flow of
        Connect connections ->
            LoadPlaylists
                (connections
                    |> Connections.connectedProviders
                    |> List.map (\c -> ( c, Loading ))
                )

        LoadPlaylists data ->
            case data |> List.map (\( con, d ) -> RemoteData.map (\p -> ( con, List.map (pair False) p )) d) |> RemoteData.fromList of
                Success playlistsMap ->
                    playlistsMap
                        |> Dict.fromList (Provider.type_ >> Provider.toString)
                        |> PickPlaylists

                _ ->
                    flow

        _ ->
            flow



-- Connect


updateConnection : (ProviderConnection -> ProviderConnection) -> MusicProviderType -> Flow -> Flow
updateConnection updater pType flow =
    case flow of
        Connect connections ->
            connections
                |> List.map
                    (\con ->
                        if Connection.type_ con == pType then
                            updater con

                        else
                            con
                    )
                |> Connect

        f ->
            f



-- LoadPlaylists


udpateLoadingPlaylists : ConnectedProvider -> WebData (List Playlist) -> Flow -> Flow
udpateLoadingPlaylists connection playlists flow =
    case flow of
        LoadPlaylists data ->
            data
                |> List.map
                    (\( c, p ) ->
                        if connection == c then
                            ( c, playlists )

                        else
                            ( c, p )
                    )
                |> LoadPlaylists

        _ ->
            flow



-- PickPlaylists


togglePlaylist : ConnectedProvider -> PlaylistId -> Flow -> Flow
togglePlaylist connection id flow =
    case flow of
        PickPlaylists playlistsMap ->
            playlistsMap
                |> Dict.update connection (Maybe.map (List.update (second >> .id >> (==) id) (Tuple.mapFirst not)))
                |> PickPlaylists

        _ ->
            flow
