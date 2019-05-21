module Flow.Context exposing
    ( Context
    , addPlaylists
    , allConnected
    , canTransferPlaylist
    , getPlaylist
    , hasAtLeast2Connected
    , init
    , playlistTransferFinished
    , setUserInfo
    , startTransfer
    , updateConnection
    )

import Connection exposing (ProviderConnection)
import Connection.Connected as ConnectedProvider exposing (ConnectedProvider, MusicService)
import List.Connection as Connections
import MusicService
import Playlist exposing (Playlist, PlaylistId)
import Playlist.Dict as Playlists exposing (PlaylistsDict, noPlaylists)
import Playlist.State exposing (PlaylistImportResult, PlaylistState)
import RemoteData exposing (WebData)
import UserInfo exposing (UserInfo)


type alias Context m =
    { m
        | playlists : PlaylistsDict
        , connections : List ProviderConnection
    }


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
        |> List.filter ConnectedProvider.hasUser
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
                        ConnectedProvider.setUserInfo info c

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
                (\p dict -> Playlists.add (Playlists.keyFromPlaylist con p) p dict)
                ctx.playlists
                playlists
    }


startTransfer : ConnectedProvider -> PlaylistId -> Context m -> Context m
startTransfer con playlist ctx =
    { ctx | playlists = Playlists.startTransfer (Playlists.key con playlist) ctx.playlists }


canTransferPlaylist : PlaylistId -> ConnectedProvider -> Context m -> Bool
canTransferPlaylist id con { playlists } =
    let
        key =
            Playlists.key con id
    in
    not
        (Playlists.isTransferring key playlists
            || Playlists.isTransferComplete key playlists
        )


getPlaylist : ( ConnectedProvider, PlaylistId ) -> Context m -> Maybe ( Playlist, PlaylistState )
getPlaylist ( con, id ) { playlists } =
    Playlists.get (Playlists.key con id) playlists



-- Transfer


playlistTransferFinished : ( ConnectedProvider, PlaylistId ) -> PlaylistImportResult -> Context m -> Context m
playlistTransferFinished ( con, id ) importResult ctx =
    { ctx
        | playlists =
            ctx.playlists
                |> Playlists.completeTransfer (Playlists.key con id) importResult
                |> Playlists.addNew (MusicService.importedPlaylistKey importResult) (MusicService.importedPlaylist importResult)
    }
