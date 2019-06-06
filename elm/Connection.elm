module Connection exposing
    ( ProviderConnection(..)
    , asConnected
    , asDisconnected
    , connected
    , connecting
    , disconnected
    , fromConnected
    , fromDisconnected
    , isConnected
    , map
    , toggleProviderConnect
    , type_
    )

import Connection.Connected as ConnectedProvider exposing (ConnectedProvider, MusicService(..))
import Deezer
import MusicService as P exposing (ConnectingProvider(..), DisconnectedProvider(..))
import RemoteData exposing (WebData)
import Spotify
import UserInfo exposing (UserInfo)



-- Provider connection


type ProviderConnection
    = Disconnected DisconnectedProvider
    | Connecting ConnectingProvider
    | Connected ConnectedProvider


fromConnected : ConnectedProvider -> ProviderConnection
fromConnected connectedProvider =
    Connected connectedProvider


fromDisconnected : DisconnectedProvider -> ProviderConnection
fromDisconnected connection =
    Disconnected connection


connected : MusicService -> WebData UserInfo -> ProviderConnection
connected pType userInfo =
    Connected <| ConnectedProvider.connected pType userInfo


disconnected : MusicService -> ProviderConnection
disconnected =
    Disconnected << P.disconnected


connecting : MusicService -> ProviderConnection
connecting =
    Connecting << P.connecting


asConnected : ProviderConnection -> Maybe ConnectedProvider
asConnected connection =
    case connection of
        Connected provider ->
            Just provider

        _ ->
            Nothing


asDisconnected : ProviderConnection -> Maybe DisconnectedProvider
asDisconnected connection =
    case connection of
        Disconnected provider ->
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


type_ : ProviderConnection -> MusicService
type_ con =
    case con of
        Disconnected (DisconnectedProvider pType) ->
            pType

        Connecting (ConnectingProvider pType) ->
            pType

        Connected connection ->
            ConnectedProvider.type_ connection


map : (ConnectedProvider -> ConnectedProvider) -> ProviderConnection -> ProviderConnection
map f connection =
    case connection of
        Connected provider ->
            Connected (f provider)

        _ ->
            connection


toggleProviderConnect : DisconnectedProvider -> Cmd msg
toggleProviderConnect connection =
    case fromDisconnected connection |> type_ of
        Deezer ->
            Deezer.connectDeezer ()

        Spotify ->
            Spotify.connectS ()

        _ ->
            Cmd.none
