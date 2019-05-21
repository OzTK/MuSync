module Playlist.State exposing
    ( PlaylistImportResult
    , PlaylistState
    , importWarnings
    , init
    , isPlaylistNew
    , isPlaylistTransferred
    , isPlaylistTransferring
    , new
    , transferComplete
    , transferring
    )

import Connection.Connected exposing (ConnectedProvider)
import Playlist exposing (Playlist)
import Playlist.Import exposing (PlaylistImportReport)


type PlaylistState
    = New
    | Untransferred
    | Transferring
    | Transferred PlaylistImportResult


init : PlaylistState
init =
    Untransferred


new : PlaylistState
new =
    New


transferring : PlaylistState
transferring =
    Transferring


transferComplete : PlaylistImportResult -> PlaylistState
transferComplete =
    Transferred


type alias PlaylistImportResult =
    { connection : ConnectedProvider
    , playlist : Playlist
    , status : PlaylistImportReport
    }


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
