module Provider.List
    exposing
        ( connectedProviders
        , map
        , flatMap
        , mapOn
        , find
        , findConnected
        , filter
        , filterByType
        , filterNotByType
        , toggle
        )

import Provider
    exposing
        ( ProviderConnection(..)
        , ConnectedProvider(..)
        , DisconnectedProvider(..)
        , InactiveProvider(..)
        , ConnectingProvider(..)
        )


connectedProviders : List (ProviderConnection providerType) -> List (ConnectedProvider providerType)
connectedProviders =
    List.filterMap
        (\con ->
            case con of
                Connected provider ->
                    Just provider

                _ ->
                    Nothing
        )


flatMap : (a -> b) -> List (ProviderConnection a) -> List b
flatMap f =
    List.map
        (\con ->
            case con of
                Inactive (InactiveProvider pType) ->
                    f pType

                Disconnected (DisconnectedProvider pType) ->
                    f pType

                Connecting (ConnectingProvider pType) ->
                    f pType

                Connected (ConnectedProvider pType) ->
                    f pType

                Connected (ConnectedProviderWithToken pType _) ->
                    f pType
        )


map :
    (ProviderConnection providerType -> providerType -> ProviderConnection providerType)
    -> List (ProviderConnection providerType)
    -> List (ProviderConnection providerType)
map f =
    List.map
        (\con ->
            let
                fcon =
                    f con
            in
                case con of
                    Inactive (InactiveProvider pType) ->
                        fcon pType

                    Disconnected (DisconnectedProvider pType) ->
                        fcon pType

                    Connecting (ConnectingProvider pType) ->
                        fcon pType

                    Connected (ConnectedProvider pType) ->
                        fcon pType

                    Connected (ConnectedProviderWithToken pType _) ->
                        fcon pType
        )


mapOn :
    providerType
    -> (ProviderConnection providerType -> ProviderConnection providerType)
    -> List (ProviderConnection providerType)
    -> List (ProviderConnection providerType)
mapOn pType f =
    List.map
        (\con ->
            case con of
                Inactive (InactiveProvider pt) ->
                    if pt == pType then
                        f con
                    else
                        con

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

                Connected (ConnectedProvider pt) ->
                    if pt == pType then
                        f con
                    else
                        con

                Connected (ConnectedProviderWithToken pt _) ->
                    if pt == pType then
                        f con
                    else
                        con
        )


find : providerType -> List (ProviderConnection providerType) -> Maybe (ProviderConnection providerType)
find pType connections =
    connections |> filterByType pType |> List.head


findConnected : a -> List (ConnectedProvider a) -> Maybe (ConnectedProvider a)
findConnected pType connections =
    connections |> List.filter (\con -> Provider.providerFromConnected con == pType) |> List.head


filterByType : providerType -> List (ProviderConnection providerType) -> List (ProviderConnection providerType)
filterByType pType =
    List.filter (\con -> Provider.provider con == pType)


filterNotByType : providerType -> List (ProviderConnection providerType) -> List (ProviderConnection providerType)
filterNotByType pType =
    List.filter (\con -> Provider.provider con /= pType)


filter :
    Maybe providerType
    -> (ProviderConnection providerType -> Bool)
    -> List (ProviderConnection providerType)
    -> List (ProviderConnection providerType)
filter pType f =
    List.filter
        (\con ->
            pType
                |> Maybe.map ((==) (Provider.provider con))
                |> Maybe.withDefault True
                |> (&&) (f con)
        )


toggle : providerType -> List (ProviderConnection providerType) -> List (ProviderConnection providerType)
toggle pType providers =
    mapOn pType
        (\con ->
            if not (Provider.isConnected con) then
                Provider.connecting pType
            else
                Provider.disconnected pType
        )
        providers
