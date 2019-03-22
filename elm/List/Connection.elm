module List.Connection exposing
    ( connectedProviders
    , mapOn
    , toggle
    )

import Connection exposing (ProviderConnection(..))
import MusicService
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
