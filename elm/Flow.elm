module Flow exposing
    ( ConnectionsWithLoadingPlaylists
    , Flow(..)
    , PlaylistsDict
    , allServices
    , canStep
    , clearSelection
    , next
    , pickPlaylist
    , pickService
    , selectedPlaylist
    , start
    , udpateLoadingPlaylists
    , updateConnection
    )

import Connection exposing (ProviderConnection)
import Dict.Any as Dict exposing (AnyDict)
import List.Connection as Connections
import List.Extra as List
import Maybe.Extra as Maybe
import MusicService exposing (ConnectedProvider, MusicService)
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..), WebData)
import SelectableList exposing (ListWithSelection)
import String.Extra as String
import Tuple exposing (pair, second)


type alias ConnectionsWithLoadingPlaylists =
    List ( ConnectedProvider, WebData (List Playlist) )


type alias PlaylistsDict =
    AnyDict String ( ConnectedProvider, PlaylistId ) Playlist


type Selection
    = NoSelection
    | PlaylistSelected ConnectedProvider PlaylistId
    | OtherServiceSelected ConnectedProvider PlaylistId ConnectedProvider


type alias PlaylistAndSelection =
    { selection : Selection
    , playlists : PlaylistsDict
    }


type Flow
    = Connect (List ProviderConnection)
    | LoadPlaylists ConnectionsWithLoadingPlaylists
    | PickPlaylists PlaylistAndSelection
    | Sync PlaylistsDict ConnectedProvider PlaylistId ConnectedProvider


start : List ProviderConnection -> Flow
start connections =
    Connect connections


canStep : Flow -> Bool
canStep flow =
    case flow of
        Connect connections ->
            connections |> Connections.connectedProviders |> List.length |> (<) 1

        LoadPlaylists data ->
            data |> List.map Tuple.second |> RemoteData.fromList |> RemoteData.isSuccess

        PickPlaylists { selection } ->
            case selection of
                OtherServiceSelected _ _ _ ->
                    True

                _ ->
                    False

        Sync _ _ _ _ ->
            False


next : Flow -> Flow
next flow =
    case flow of
        Connect connections ->
            let
                connected =
                    Connections.connectedProviders connections
            in
            if List.length connected > 1 then
                LoadPlaylists (List.map (\c -> ( c, Loading )) connected)

            else
                flow

        LoadPlaylists data ->
            data
                |> List.map
                    (\( con, d ) ->
                        d
                            |> RemoteData.toMaybe
                            |> Maybe.map (List.map (\p -> ( ( con, p.id ), p )))
                    )
                |> Maybe.fromList
                |> Maybe.map List.concat
                |> Maybe.map (Dict.fromList (Tuple.mapFirst MusicService.connectionToString >> String.fromPair "_"))
                |> Maybe.map (PlaylistAndSelection NoSelection)
                |> Maybe.map PickPlaylists
                |> Maybe.withDefault flow

        PickPlaylists { playlists, selection } ->
            case selection of
                OtherServiceSelected s1 p s2 ->
                    Sync playlists s1 p s2

                _ ->
                    flow

        _ ->
            flow



-- Connect


allServices : Flow -> Maybe (List ProviderConnection)
allServices flow =
    case flow of
        Connect services ->
            Just services

        _ ->
            Nothing


updateConnection : (ProviderConnection -> ProviderConnection) -> MusicService -> Flow -> Flow
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


pickPlaylist : ConnectedProvider -> PlaylistId -> Flow -> Flow
pickPlaylist connection id flow =
    case flow of
        PickPlaylists { playlists, selection } ->
            case selection of
                NoSelection ->
                    PickPlaylists <| PlaylistAndSelection (PlaylistSelected connection id) playlists

                PlaylistSelected con pId ->
                    if (con == connection) && pId == id then
                        PickPlaylists <| PlaylistAndSelection NoSelection playlists

                    else
                        PickPlaylists <| PlaylistAndSelection (PlaylistSelected connection id) playlists

                _ ->
                    flow

        _ ->
            flow


pickService : ConnectedProvider -> Flow -> Flow
pickService otherConnection flow =
    case flow of
        PickPlaylists { playlists, selection } ->
            case selection of
                PlaylistSelected connection id ->
                    if otherConnection /= connection then
                        PickPlaylists <|
                            PlaylistAndSelection (OtherServiceSelected connection id otherConnection) playlists

                    else
                        flow

                _ ->
                    flow

        _ ->
            flow


selectedPlaylist : Flow -> Maybe Playlist
selectedPlaylist flow =
    case flow of
        PickPlaylists { selection, playlists } ->
            case selection of
                NoSelection ->
                    Nothing

                PlaylistSelected connection id ->
                    Dict.get ( connection, id ) playlists

                OtherServiceSelected connection id _ ->
                    Dict.get ( connection, id ) playlists

        _ ->
            Nothing


clearSelection : Flow -> Flow
clearSelection flow =
    case flow of
        PickPlaylists { playlists, selection } ->
            PickPlaylists <| PlaylistAndSelection NoSelection playlists

        _ ->
            flow
