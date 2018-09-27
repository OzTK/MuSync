module Connection exposing
    ( ProviderConnection(..)
    , asConnected
    , connected
    , connectedWithToken
    , connecting
    , disconnected
    , isConnected
    , isConnecting
    , map
    , type_
    )

import Connection.Provider as P
    exposing
        ( ConnectedProvider(..)
        , ConnectingProvider(..)
        , DisconnectedProvider(..)
        , OAuthToken
        )
import Model exposing (UserInfo)
import RemoteData exposing (WebData)



-- Provider connection


type ProviderConnection providerType
    = Disconnected (DisconnectedProvider providerType)
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


asConnected : ProviderConnection pType -> Maybe (ConnectedProvider pType)
asConnected connection =
    case connection of
        Connected provider ->
            Just provider

        _ ->
            Nothing


isConnected : ProviderConnection providerType -> Bool
isConnected connection =
    case connection of
        Connected _ ->
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


type_ : ProviderConnection providerType -> providerType
type_ con =
    case con of
        Disconnected (DisconnectedProvider pType) ->
            pType

        Connecting (ConnectingProvider pType) ->
            pType

        Connected connection ->
            P.type_ connection


map : (ConnectedProvider pType -> ConnectedProvider pType) -> ProviderConnection pType -> ProviderConnection pType
map f connection =
    case connection of
        Connected provider ->
            Connected (f provider)

        _ ->
            connection


withDefault default connection =
    case connection of
        Connected provider ->
            provider

        _ ->
            default
