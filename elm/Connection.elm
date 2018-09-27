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
        , MusicProviderType
        , OAuthToken
        )
import Model exposing (UserInfo)
import RemoteData exposing (WebData)



-- Provider connection


type ProviderConnection
    = Disconnected DisconnectedProvider
    | Connecting ConnectingProvider
    | Connected ConnectedProvider


connected : MusicProviderType -> WebData UserInfo -> ProviderConnection
connected pType userInfo =
    Connected <| P.connected pType userInfo


connectedWithToken : MusicProviderType -> OAuthToken -> WebData UserInfo -> ProviderConnection
connectedWithToken pType token user =
    Connected <| P.connectedWithToken pType token user


disconnected : MusicProviderType -> ProviderConnection
disconnected =
    Disconnected << P.disconnected


connecting : MusicProviderType -> ProviderConnection
connecting =
    Connecting << P.connecting


asConnected : ProviderConnection -> Maybe ConnectedProvider
asConnected connection =
    case connection of
        Connected provider ->
            Just provider

        _ ->
            Nothing


isConnected : ProviderConnection -> Bool
isConnected connection =
    case connection of
        Connected _ ->
            True

        _ ->
            False


isConnecting : ProviderConnection -> Bool
isConnecting connection =
    case connection of
        Connecting _ ->
            True

        _ ->
            False


type_ : ProviderConnection -> MusicProviderType
type_ con =
    case con of
        Disconnected (DisconnectedProvider pType) ->
            pType

        Connecting (ConnectingProvider pType) ->
            pType

        Connected connection ->
            P.type_ connection


map : (ConnectedProvider -> ConnectedProvider) -> ProviderConnection -> ProviderConnection
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
