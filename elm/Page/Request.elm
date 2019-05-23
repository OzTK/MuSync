module Page.Request exposing (PageRequest(..))

import Connection.Connected exposing (ConnectedProvider)
import Playlist.Dict exposing (PlaylistKey)
import Playlist.State exposing (PlaylistImportResult)


type PageRequest
    = ServiceConnection
    | PlaylistsSpinner
    | PlaylistPicker
    | PlaylistDetails PlaylistKey
    | DestinationPicker PlaylistKey
    | DestinationPicked PlaylistKey ConnectedProvider
    | TransferSpinner PlaylistKey ConnectedProvider
    | TransferReport PlaylistImportResult
