module List.Connection exposing
    ( connectedProviders
    , findConnected
    , mapOn
    , toggle
    )

import Connection exposing (ProviderConnection(..))
import MusicService as P
    exposing
        ( ConnectedProvider(..)
        , ConnectingProvider(..)
        , DisconnectedProvider(..)
        , MusicService
        )
import SelectableList exposing (SelectableList)


connectedProviders : List ProviderConnection -> List ConnectedProvider
connectedProviders =
    List.filterMap
        (\con ->
            case con of
                Connected provider ->
                    Just provider

                _ ->
                    Nothing
        )


mapOn :
    MusicService
    -> (ProviderConnection -> ProviderConnection)
    -> SelectableList ProviderConnection
    -> SelectableList ProviderConnection
mapOn pType f =
    SelectableList.map
        (\con ->
            case con of
                Disconnected (DisconnectedProvider pt) ->
                    if pt == pType then
                        f con

                    else
                        con

                Connecting (ConnectingProvider pt) ->
                    if pt == pType then
                        f con

                    else
                        con

                Connected (ConnectedProvider pt _) ->
                    if pt == pType then
                        f con

                    else
                        con

                Connected (ConnectedProviderWithToken pt _ _) ->
                    if pt == pType then
                        f con

                    else
                        con
        )


findConnected : MusicService -> List ConnectedProvider -> Maybe ConnectedProvider
findConnected pType connections =
    connections |> List.filter (\con -> P.type_ con == pType) |> List.head


toggle : MusicService -> SelectableList ProviderConnection -> SelectableList ProviderConnection
toggle pType providers =
    mapOn pType
        (\con ->
            if not (Connection.isConnected con) then
                Connection.connecting pType

            else
                Connection.disconnected pType
        )
        providers
