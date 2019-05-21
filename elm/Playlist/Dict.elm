module Playlist.Dict exposing (PlaylistData, PlaylistKey, PlaylistsDict, add, addNew, completeTransfer, destructureKey, get, isTransferComplete, isTransferring, key, keyBuilder, keyFromPlaylist, noPlaylists, startTransfer)

import Basics.Extra exposing (const)
import Connection.Connected as ConnectedProvider exposing (ConnectedProvider)
import Dict.Any as Dict exposing (AnyDict)
import Playlist exposing (Playlist, PlaylistId)
import Playlist.State as State exposing (PlaylistImportResult, PlaylistState)


type alias PlaylistData =
    ( Playlist, PlaylistState )


type alias PlaylistsDict =
    AnyDict String PlaylistKey PlaylistData


type PlaylistKey
    = PlaylistKey ConnectedProvider PlaylistId


keyBuilder : PlaylistKey -> String
keyBuilder (PlaylistKey con p) =
    ConnectedProvider.connectionToString con ++ "_" ++ p


noPlaylists : PlaylistsDict
noPlaylists =
    Dict.empty keyBuilder


keyFromPlaylist : ConnectedProvider -> Playlist -> PlaylistKey
keyFromPlaylist con p =
    PlaylistKey con p.id


key : ConnectedProvider -> PlaylistId -> PlaylistKey
key =
    PlaylistKey


destructureKey : PlaylistKey -> ( ConnectedProvider, PlaylistId )
destructureKey (PlaylistKey con id) =
    ( con, id )


add : PlaylistKey -> Playlist -> PlaylistsDict -> PlaylistsDict
add pKey p =
    Dict.update pKey (\_ -> Just ( p, State.init ))


addNew : PlaylistKey -> Playlist -> PlaylistsDict -> PlaylistsDict
addNew pKey p =
    Dict.update pKey (\_ -> Just ( p, State.new ))


get : PlaylistKey -> PlaylistsDict -> Maybe PlaylistData
get =
    Dict.get


startTransfer : PlaylistKey -> PlaylistsDict -> PlaylistsDict
startTransfer pKey =
    Dict.update pKey (Maybe.map (Tuple.mapSecond (const State.transferring)))


completeTransfer : PlaylistKey -> PlaylistImportResult -> PlaylistsDict -> PlaylistsDict
completeTransfer pKey result =
    Dict.update pKey <|
        Maybe.map <|
            Tuple.mapSecond <|
                const (State.transferComplete result)


isTransferring : PlaylistKey -> PlaylistsDict -> Bool
isTransferring pKey playlists =
    Dict.get pKey playlists
        |> Maybe.map Tuple.second
        |> Maybe.map State.isPlaylistTransferring
        |> Maybe.withDefault False


isTransferComplete : PlaylistKey -> PlaylistsDict -> Bool
isTransferComplete pKey playlists =
    Dict.get pKey playlists
        |> Maybe.map Tuple.second
        |> Maybe.map State.isPlaylistTransferred
        |> Maybe.withDefault False
