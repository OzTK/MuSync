module Flow.Context exposing
    ( Context
    , PlaylistState
    , PlaylistsDict
    , addPlaylists
    , allConnected
    , canTransferPlaylist
    , getPlaylist
    , hasAtLeast2Connected
    , importWarnings
    , init
    , isPlaylistNew
    , isPlaylistTransferred
    , isPlaylistTransferring
    , noPlaylists
    , playlistTransferFinished
    , setUserInfo
    , startTransfer
    , updateConnection
    )

import Basics.Extra exposing (const)
import Connection exposing (ProviderConnection)
import Dict.Any as Dict exposing (AnyDict)
import List.Connection as Connections
import MusicService exposing (ConnectedProvider, MusicService, PlaylistImportResult)
import Playlist exposing (Playlist, PlaylistId)
import Playlist.Import exposing (PlaylistImportReport)
import RemoteData exposing (WebData)
import UserInfo exposing (UserInfo)


type PlaylistState
    = New
    | Untransferred
    | Transferring
    | Transferred PlaylistImportResult


isPlaylistTransferring : PlaylistState -> Bool
isPlaylistTransferring state =
    case state of
        Transferring ->
            True

        _ ->
            False


isPlaylistTransferred : PlaylistState -> Bool
isPlaylistTransferred playlistState =
    case playlistState of
        Transferred _ ->
            True

        _ ->
            False


importWarnings : PlaylistState -> Maybe PlaylistImportReport
importWarnings playlistState =
    case playlistState of
        Transferred result ->
            if Playlist.Import.isSuccessful result.status then
                Nothing

            else
                Just result.status

        _ ->
            Nothing


isPlaylistNew : PlaylistState -> Bool
isPlaylistNew playlistState =
    case playlistState of
        New ->
            True

        _ ->
            False


type alias PlaylistsDict =
    AnyDict String ( ConnectedProvider, PlaylistId ) ( Playlist, PlaylistState )


type alias Context m =
    { m
        | playlists : PlaylistsDict
        , connections : List ProviderConnection
    }


noPlaylists : PlaylistsDict
noPlaylists =
    Dict.empty (\( con, p ) -> MusicService.connectionToString con ++ "_" ++ p)


init : List ProviderConnection -> Context m -> Context m
init connections ctx =
    { ctx
        | connections = connections
        , playlists = noPlaylists
    }



-- Connections


allConnected : Context m -> List ConnectedProvider
allConnected { connections } =
    Connections.connectedProviders connections


hasAtLeast2Connected : Context m -> Bool
hasAtLeast2Connected { connections } =
    connections
        |> Connections.connectedProviders
        |> List.filter MusicService.hasUser
        |> List.length
        |> (<=) 2


updateConnection : (ProviderConnection -> ProviderConnection) -> MusicService -> Context m -> Context m
updateConnection updater pType ctx =
    ctx.connections
        |> List.map
            (\con ->
                if Connection.type_ con == pType then
                    updater con

                else
                    con
            )
        |> (\c -> { ctx | connections = c })


setUserInfo : ConnectedProvider -> WebData UserInfo -> Context m -> Context m
setUserInfo con info ctx =
    ctx.connections
        |> List.map
            (Connection.map
                (\c ->
                    if c == con then
                        MusicService.setUserInfo info c

                    else
                        c
                )
            )
        |> (\c -> { ctx | connections = c })



-- Playlists


addPlaylists : Context m -> ConnectedProvider -> List Playlist -> Context m
addPlaylists ctx con playlists =
    { ctx
        | playlists =
            List.foldl
                (\p dict ->
                    Dict.update ( con, p.id ) (\_ -> Just ( p, Untransferred )) dict
                )
                ctx.playlists
                playlists
    }


startTransfer : ConnectedProvider -> PlaylistId -> Context m -> Context m
startTransfer con playlist ctx =
    { ctx | playlists = Dict.update ( con, playlist ) (Maybe.map (Tuple.mapSecond (const Transferring))) ctx.playlists }


canTransferPlaylist : PlaylistId -> ConnectedProvider -> Context m -> Bool
canTransferPlaylist id con { playlists } =
    Dict.get ( con, id ) playlists
        |> Maybe.map Tuple.second
        |> Maybe.map (not << (\s -> isPlaylistTransferring s || isPlaylistTransferred s))
        |> Maybe.withDefault False


getPlaylist : ( ConnectedProvider, PlaylistId ) -> Context m -> Maybe ( Playlist, PlaylistState )
getPlaylist pId { playlists } =
    Dict.get pId playlists



-- Transfer


playlistTransferFinished : ( ConnectedProvider, PlaylistId ) -> PlaylistImportResult -> Context m -> Context m
playlistTransferFinished key importResult ctx =
    { ctx
        | playlists =
            ctx.playlists
                |> Dict.update key (Maybe.map <| \( p, _ ) -> ( p, Transferred importResult ))
                |> Dict.update (MusicService.importedPlaylistKey importResult) (\_ -> Just ( MusicService.importedPlaylist importResult, New ))
    }
