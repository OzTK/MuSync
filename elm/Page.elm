module Page exposing (Page, init, is, match, navigate, onNavigate, oneOf)

import Connection exposing (ProviderConnection(..))
import Connection.Connected as ConnectedProvider exposing (ConnectedProvider, MusicService)
import Connection.Dict as ConnectionsDict exposing (ConnectionsDict)
import MusicService exposing (MusicServiceError)
import Page.Request as Request exposing (NavigationError, PagePath(..), WithPlaylistsAndConnections)
import Playlist exposing (Playlist)
import Playlist.Dict exposing (PlaylistKey, PlaylistsDict)
import Playlist.State exposing (PlaylistImportResult)
import RemoteData exposing (RemoteData(..), WebData)
import Task
import UserInfo exposing (UserInfo)


type Page
    = Page Request.PagePath


init : Page
init =
    Page ServiceConnection


match :
    { serviceConnection : a
    , playlistSpinner : a
    , playlistsPicker : a
    , playlistDetails : PlaylistKey -> a
    , destinationPicker : PlaylistKey -> a
    , destinationPicked : PlaylistKey -> ConnectedProvider -> a
    , transferSpinner : PlaylistKey -> ConnectedProvider -> a
    , transferComplete : PlaylistImportResult -> a
    }
    -> Page
    -> a
match matchers (Page page) =
    case page of
        ServiceConnection ->
            matchers.serviceConnection

        PlaylistsSpinner ->
            matchers.playlistSpinner

        PlaylistPicker ->
            matchers.playlistsPicker

        PlaylistDetails playlist ->
            matchers.playlistDetails playlist

        DestinationPicker playlist ->
            matchers.destinationPicker playlist

        DestinationPicked playlist connection ->
            matchers.destinationPicked playlist connection

        TransferSpinner playlist connection ->
            matchers.transferSpinner playlist connection

        TransferReport result ->
            matchers.transferComplete result


navigate :
    WithPlaylistsAndConnections m
    -> Request.PageRequest
    -> Result NavigationError Page
navigate model req =
    Request.tryNavigate model (Request.pagePath req) |> Result.map Page


is : Page -> Request.PagePath -> Bool
is (Page page) path =
    case ( path, page ) of
        ( Request.ServiceConnection, ServiceConnection ) ->
            True

        ( Request.PlaylistsSpinner, PlaylistsSpinner ) ->
            True

        ( Request.PlaylistPicker, PlaylistPicker ) ->
            True

        ( Request.PlaylistDetails _, PlaylistDetails _ ) ->
            True

        ( Request.DestinationPicker _, DestinationPicker _ ) ->
            True

        ( Request.DestinationPicked _ _, DestinationPicked _ _ ) ->
            True

        ( Request.TransferSpinner _ _, TransferSpinner _ _ ) ->
            True

        ( Request.TransferReport _, TransferReport _ ) ->
            True

        _ ->
            False


oneOf : Page -> List Request.PagePath -> Bool
oneOf page =
    List.foldl (\path matched -> matched || is page path) False



-- Navigation handlers


type alias NavigationHandlers msg =
    { userInfoReceivedHandler : ConnectedProvider -> WebData UserInfo -> msg
    , playlistsFetchedHandler : ConnectedProvider -> Result MusicServiceError (WebData (List Playlist)) -> msg
    }


onNavigate : NavigationHandlers msg -> WithPlaylistsAndConnections m -> Page -> Cmd msg
onNavigate handlers { connections } (Page path) =
    case path of
        ServiceConnection ->
            connections
                |> ConnectionsDict.connections
                |> List.filterMap Connection.asConnected
                |> List.filter (ConnectedProvider.user >> Maybe.map (\_ -> False) >> Maybe.withDefault True)
                |> List.map (\c -> ( c, c |> MusicService.fetchUserInfo |> Task.onError (\_ -> Task.succeed NotAsked) ))
                |> List.map (\( c, t ) -> Task.perform (handlers.userInfoReceivedHandler c) t)
                |> Cmd.batch

        PlaylistsSpinner ->
            connections
                |> ConnectionsDict.connectedConnections
                |> List.map
                    (\con ->
                        con |> MusicService.loadPlaylists |> Task.attempt (handlers.playlistsFetchedHandler con)
                    )
                |> Cmd.batch

        _ ->
            Cmd.none
