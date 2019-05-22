module Connection.Dict exposing (ConnectionsDict, connections, fromList, init, updateConnection)

import Connection exposing (ProviderConnection)
import Connection.Connected as ConnectedProvider exposing (ConnectedProvider, MusicService)
import Dict.Any as Dict exposing (AnyDict)
import List.Extra as List
import Playlist.Dict exposing (PlaylistKey)
import RemoteData exposing (RemoteData(..), WebData)


type alias ConnectionsDict =
    AnyDict String MusicService ( ProviderConnection, WebData (List PlaylistKey) )


keyBuilder : MusicService -> String
keyBuilder =
    ConnectedProvider.toString


init : ConnectionsDict
init =
    Dict.empty keyBuilder


connections : ConnectionsDict -> List ProviderConnection
connections connectionsDict =
    connectionsDict
        |> Dict.values
        |> List.map Tuple.first


updateConnection : MusicService -> (ProviderConnection -> ProviderConnection) -> ConnectionsDict -> ConnectionsDict
updateConnection type_ f =
    Dict.update type_ (Maybe.map <| Tuple.mapFirst f)


fromList : List ProviderConnection -> ConnectionsDict
fromList list =
    list
        |> List.groupByOverwrite keyBuilder Connection.type_
        |> Dict.map (\_ c -> ( c, NotAsked ))
