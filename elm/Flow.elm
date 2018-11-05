module Flow exposing
    ( ConnectionSelection(..)
    , ConnectionsWithLoadingPlaylists
    , Flow(..)
    , PlaylistSelectionState(..)
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


type PlaylistSelectionState
    = NoPlaylist
    | PlaylistSelected ConnectedProvider PlaylistId


type alias PlaylistSelection =
    { selection : PlaylistSelectionState
    , connections : List ConnectedProvider
    , playlists : PlaylistsDict
    }


type ConnectionSelection
    = NoConnection
    | ConnectionSelected ConnectedProvider


type alias OtherConnectionSelection =
    { selection : ConnectionSelection
    , playlist : ( ConnectedProvider, PlaylistId )
    , connections : List ConnectedProvider
    , playlists : PlaylistsDict
    }


type alias SyncData =
    { playlists : PlaylistsDict
    , connections : List ConnectedProvider
    , playlist : ( ConnectedProvider, PlaylistId )
    , otherConnection : ConnectedProvider
    }


type Flow
    = Connect (List ProviderConnection)
    | LoadPlaylists ConnectionsWithLoadingPlaylists
    | PickPlaylist PlaylistSelection
    | PickOtherConnection OtherConnectionSelection
    | Sync SyncData


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

        PickPlaylist { selection } ->
            case selection of
                PlaylistSelected _ _ ->
                    True

                NoPlaylist ->
                    False

        PickOtherConnection { selection } ->
            case selection of
                ConnectionSelected _ ->
                    True

                NoConnection ->
                    False

        Sync _ ->
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
            let
                ( connections, _ ) =
                    List.unzip data
            in
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
                |> Maybe.map (\dict -> PlaylistSelection NoPlaylist connections dict)
                |> Maybe.map PickPlaylist
                |> Maybe.withDefault flow

        PickPlaylist { playlists, selection, connections } ->
            case selection of
                PlaylistSelected con id ->
                    PickOtherConnection { selection = NoConnection, playlist = ( con, id ), playlists = playlists, connections = connections }

                NoPlaylist ->
                    flow

        PickOtherConnection { playlists, playlist, selection, connections } ->
            case selection of
                ConnectionSelected connection ->
                    Sync { playlist = playlist, playlists = playlists, connections = connections, otherConnection = connection }

                NoConnection ->
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
        PickPlaylist { playlists, selection, connections } ->
            case selection of
                NoPlaylist ->
                    PickPlaylist <| PlaylistSelection (PlaylistSelected connection id) connections playlists

                PlaylistSelected con pId ->
                    if (con == connection) && pId == id then
                        PickPlaylist <| PlaylistSelection NoPlaylist connections playlists

                    else
                        PickPlaylist <| PlaylistSelection (PlaylistSelected connection id) connections playlists

        _ ->
            flow


pickService : ConnectedProvider -> Flow -> Flow
pickService otherConnection flow =
    case flow of
        PickOtherConnection { selection, playlist, playlists, connections } ->
            case selection of
                NoConnection ->
                    if otherConnection /= Tuple.first playlist then
                        PickOtherConnection { selection = ConnectionSelected otherConnection, playlist = playlist, playlists = playlists, connections = connections }

                    else
                        flow

                ConnectionSelected connection ->
                    if otherConnection /= connection then
                        PickOtherConnection { selection = ConnectionSelected otherConnection, playlist = playlist, playlists = playlists, connections = connections }

                    else
                        PickOtherConnection { selection = NoConnection, playlist = playlist, playlists = playlists, connections = connections }

        _ ->
            flow


selectedPlaylist : Flow -> Maybe Playlist
selectedPlaylist flow =
    case flow of
        PickPlaylist { selection, playlists } ->
            case selection of
                NoPlaylist ->
                    Nothing

                PlaylistSelected connection id ->
                    Dict.get ( connection, id ) playlists

        PickOtherConnection { playlists, playlist } ->
            Dict.get playlist playlists

        Sync { playlist, playlists } ->
            Dict.get playlist playlists

        _ ->
            Nothing


clearSelection : Flow -> Flow
clearSelection flow =
    case flow of
        PickPlaylist { playlists, selection, connections } ->
            PickPlaylist <| PlaylistSelection NoPlaylist connections playlists

        PickOtherConnection { playlists, connections } ->
            PickPlaylist <| PlaylistSelection NoPlaylist connections playlists

        _ ->
            flow
