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
    , map
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
import RemoteData exposing (WebData)



-- Provider connection


type ProviderConnection providerType
    = Inactive (InactiveProvider providerType)
    | Disconnected (DisconnectedProvider providerType)
    | Connecting (ConnectingProvider providerType)
    | Connected (ConnectedProvider providerType)


connected : providerType -> WebData UserInfo -> ProviderConnection providerType
connected pType userInfo =
    Connected <| P.connected pType userInfo


connectedWithToken : providerType -> OAuthToken -> WebData UserInfo -> ProviderConnection providerType
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

        Connected connection ->
            P.connectedType connection


map : (ConnectedProvider pType -> ConnectedProvider pType) -> ProviderConnection pType -> ProviderConnection pType
map f connection =
    case connection of
        Connected provider ->
            Connected (f provider)

        _ ->
            connection
