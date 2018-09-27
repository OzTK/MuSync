module List.Connection exposing
    ( connectedProviders
    , findConnected
    , mapOn
    , toggle
    )

import Connection exposing (ProviderConnection(..))
import Connection.Provider as P
    exposing
        ( ConnectedProvider(..)
        , ConnectingProvider(..)
        , DisconnectedProvider(..)
        )
import SelectableList exposing (SelectableList)


connectedProviders : SelectableList (ProviderConnection providerType) -> SelectableList (ConnectedProvider providerType)
connectedProviders =
    SelectableList.filterMap
        (\con ->
            case con of
                Connected provider ->
                    Just provider

                _ ->
                    Nothing
        )


mapOn :
    providerType
    -> (ProviderConnection providerType -> ProviderConnection providerType)
    -> SelectableList (ProviderConnection providerType)
    -> SelectableList (ProviderConnection providerType)
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


findConnected : a -> List (ConnectedProvider a) -> Maybe (ConnectedProvider a)
findConnected pType connections =
    connections |> List.filter (\con -> P.type_ con == pType) |> List.head


toggle : providerType -> SelectableList (ProviderConnection providerType) -> SelectableList (ProviderConnection providerType)
toggle pType providers =
    mapOn pType
        (\con ->
            if not (Connection.isConnected con) then
                Connection.connecting pType

            else
                Connection.disconnected pType
        )
        providers
