module Connection exposing
    ( ProviderConnection(..)
    , connected
    , connectedWithToken
    , connecting
    , disconnected
    , inactive
    , isConnected
    , isConnecting
    , isDisconnected
    , isInactive
    , type_
    )

import Connection.Provider as P
    exposing
        ( ConnectedProvider(..)
        , ConnectingProvider(..)
        , DisconnectedProvider(..)
        , InactiveProvider(..)
        , OAuthToken
        )
import Model exposing (UserInfo)



-- Provider connection


connected : providerType -> ProviderConnection providerType
connected =
    Connected << P.connected


connectedWithToken : providerType -> OAuthToken -> UserInfo -> ProviderConnection providerType
connectedWithToken pType token user =
    Connected <| P.connectedWithToken pType token user


disconnected : providerType -> ProviderConnection providerType
disconnected =
    Disconnected << P.disconnected


connecting : providerType -> ProviderConnection providerType
connecting =
    Connecting << P.connecting


inactive : providerType -> ProviderConnection providerType
inactive =
    Inactive << P.inactive


type ProviderConnection providerType
    = Inactive (InactiveProvider providerType)
    | Disconnected (DisconnectedProvider providerType)
    | Connecting (ConnectingProvider providerType)
    | Connected (ConnectedProvider providerType)


isConnected : ProviderConnection providerType -> Bool
isConnected connection =
    case connection of
        Connected _ ->
            True

        _ ->
            False


isDisconnected : ProviderConnection providerType -> Bool
isDisconnected connection =
    case connection of
        Disconnected _ ->
            True

        _ ->
            False


isConnecting : ProviderConnection providerType -> Bool
isConnecting connection =
    case connection of
        Connecting _ ->
            True

        _ ->
            False


isInactive : ProviderConnection providerType -> Bool
isInactive connection =
    case connection of
        Inactive _ ->
            True

        _ ->
            False


type_ : ProviderConnection providerType -> providerType
type_ con =
    case con of
        Inactive (InactiveProvider pType) ->
            pType

        Disconnected (DisconnectedProvider pType) ->
            pType

        Connecting (ConnectingProvider pType) ->
            pType

        Connected connected ->
            P.connectedType connected
