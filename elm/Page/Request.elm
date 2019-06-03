module Page.Request exposing (NavigationError, PagePath(..), PageRequest, WithPlaylistsAndConnections, canNavigate, pagePath, tryNavigate)

import Connection exposing (ProviderConnection(..))
import Connection.Connected as ConnectedProvider exposing (ConnectedProvider)
import Connection.Dict exposing (ConnectionsDict)
import Dict.Any as Dict
import List.Connection as Connections
import Playlist.Dict exposing (PlaylistKey, PlaylistsDict)
import Playlist.State exposing (PlaylistImportResult)
import RemoteData exposing (RemoteData(..), WebData)
import Result.Extra as Result


type PagePath
    = ServiceConnection
    | PlaylistsSpinner
    | PlaylistPicker
    | PlaylistDetails PlaylistKey
    | DestinationPicker PlaylistKey
    | DestinationPicked PlaylistKey ConnectedProvider
    | TransferSpinner PlaylistKey ConnectedProvider
    | TransferReport PlaylistImportResult


type NavigationError
    = NotEnoughConnectedProviders PagePath
    | WaitingForLoadingPlaylists PagePath
    | PlaylistNotFound PagePath
    | MusicServiceNotFound PagePath
    | SourceIsDestination PagePath


type PageRequest
    = PageRequest PagePath


pagePath : PageRequest -> PagePath
pagePath (PageRequest path) =
    path


canNavigate : WithPlaylistsAndConnections m -> PagePath -> Result PagePath PageRequest
canNavigate model path =
    tryNavigate model path |> Result.map PageRequest |> Result.mapError (\_ -> path)


tryNavigate :
    WithPlaylistsAndConnections m
    -> PagePath
    -> Result NavigationError PagePath
tryNavigate model path =
    case path of
        ServiceConnection ->
            Ok <| ServiceConnection

        PlaylistsSpinner ->
            tryPlaylistsSpinner model

        PlaylistPicker ->
            tryPlaylistPicker model

        PlaylistDetails playlist ->
            tryPlaylistDetails playlist model

        DestinationPicker playlist ->
            tryDestinationPicker playlist model

        DestinationPicked playlist connection ->
            trySelectedDestinationPicker playlist connection model

        TransferSpinner playlist destination ->
            tryTransferSpinner playlist destination model

        TransferReport result ->
            Ok <| TransferReport result



-- Specific pages navigation


type alias WithServiceConnections m =
    { m | connections : ConnectionsDict }


type alias WithPlaylists m =
    { m | playlists : PlaylistsDict }


type alias WithPlaylistsAndConnections m =
    { m
        | connections : ConnectionsDict
        , playlists : PlaylistsDict
    }


tryGetPlaylist : (PlaylistKey -> PagePath) -> PlaylistKey -> PlaylistsDict -> Result NavigationError PagePath
tryGetPlaylist req playlistKey playlists =
    playlists
        |> Dict.get playlistKey
        |> Maybe.map (\_ -> Ok <| req playlistKey)
        |> Maybe.withDefault (Err <| PlaylistNotFound (req playlistKey))


tryTransferSpinner : PlaylistKey -> ConnectedProvider -> WithPlaylistsAndConnections m -> Result NavigationError PagePath
tryTransferSpinner playlistKey service ({ connections } as model) =
    model
        |> tryDestinationPicker playlistKey
        |> Result.andThen
            (\_ ->
                Dict.get (ConnectedProvider.type_ service) connections
                    |> Result.fromMaybe (MusicServiceNotFound (TransferSpinner playlistKey service))
                    |> Result.map (\_ -> TransferSpinner playlistKey service)
            )


tryDestinationPicker : PlaylistKey -> WithPlaylists m -> Result NavigationError PagePath
tryDestinationPicker playlistKey { playlists } =
    tryGetPlaylist DestinationPicker playlistKey playlists


trySelectedDestinationPicker : PlaylistKey -> ConnectedProvider -> WithPlaylists m -> Result NavigationError PagePath
trySelectedDestinationPicker playlistKey connection { playlists } =
    playlistKey
        |> Playlist.Dict.keyToCon
        |> (/=) connection
        |> Result.fromBool (SourceIsDestination <| DestinationPicked playlistKey connection)
        |> Result.andThen
            (\_ ->
                tryGetPlaylist DestinationPicker playlistKey playlists
            )
        |> Result.map (\_ -> DestinationPicked playlistKey connection)


tryPlaylistDetails : PlaylistKey -> WithPlaylists m -> Result NavigationError PagePath
tryPlaylistDetails playlistKey { playlists } =
    tryGetPlaylist PlaylistDetails playlistKey playlists


tryPlaylistsSpinner : WithServiceConnections m -> Result NavigationError PagePath
tryPlaylistsSpinner { connections } =
    if hasAtLeast2Connected connections then
        Ok <| PlaylistsSpinner

    else
        Err <| NotEnoughConnectedProviders PlaylistsSpinner


hasAtLeast2Connected : ConnectionsDict -> Bool
hasAtLeast2Connected connections =
    connections
        |> Dict.values
        |> List.map Tuple.first
        |> Connections.connectedProviders
        |> List.filter ConnectedProvider.hasUser
        |> List.length
        |> (<=) 2


tryPlaylistPicker : WithServiceConnections m -> Result NavigationError PagePath
tryPlaylistPicker { connections } =
    if connections |> Dict.values |> List.any isWaitingForPlaylists then
        Err <| WaitingForLoadingPlaylists PlaylistPicker

    else
        Ok <| PlaylistPicker


isWaitingForPlaylists : ( ProviderConnection, WebData (List PlaylistKey) ) -> Bool
isWaitingForPlaylists service =
    case service of
        ( Connected _, Success _ ) ->
            False

        ( Disconnected _, _ ) ->
            False

        _ ->
            True
