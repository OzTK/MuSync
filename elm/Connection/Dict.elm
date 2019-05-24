module Connection.Dict exposing (ConnectionsDict, connectedConnections, connections, fromList, init, startLoading, stopLoading, updateConnection)

import Connection exposing (ProviderConnection(..))
import Connection.Connected as ConnectedProvider exposing (ConnectedProvider, MusicService)
import Dict.Any as Dict exposing (AnyDict)
import List.Connection as Connections
import List.Extra as List
import Playlist exposing (PlaylistId)
import Playlist.Dict as Playlists exposing (PlaylistKey)
import RemoteData exposing (RemoteData(..), WebData)


type alias ConnectionsDict =
    AnyDict String MusicService ( ProviderConnection, WebData (List PlaylistKey) )


keyBuilder : MusicService -> String
keyBuilder =
    ConnectedProvider.toString



-- Constructors


fromList : List ProviderConnection -> ConnectionsDict
fromList list =
    list
        |> List.groupByOverwrite keyBuilder Connection.type_
        |> Dict.map (\_ c -> ( c, NotAsked ))


init : ConnectionsDict
init =
    Dict.empty keyBuilder



-- Transform


connections : ConnectionsDict -> List ProviderConnection
connections connectionsDict =
    connectionsDict
        |> Dict.values
        |> List.map Tuple.first


connectedConnections : ConnectionsDict -> List ConnectedProvider
connectedConnections =
    Connections.connectedProviders << connections



-- Update


updateConnection : MusicService -> (ProviderConnection -> ProviderConnection) -> ConnectionsDict -> ConnectionsDict
updateConnection type_ f =
    Dict.update type_ (Maybe.map <| Tuple.mapFirst f)


startLoading : MusicService -> ConnectionsDict -> ConnectionsDict
startLoading service =
    Dict.update service <|
        \result ->
            case result of
                Just ( con, _ ) ->
                    Just ( con, Loading )

                Nothing ->
                    Nothing


stopLoading : MusicService -> WebData (List PlaylistId) -> ConnectionsDict -> ConnectionsDict
stopLoading service error =
    Dict.update service <|
        \result ->
            case result of
                Just ( Connected con, _ ) ->
                    Just ( Connected con, RemoteData.map (List.map <| Playlists.key con) error )

                _ ->
                    Nothing
