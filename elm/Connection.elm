module Connection exposing
    ( ProviderConnection(..)
    , asConnected
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
import Task
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


notifyProviderDisconnected : (DisconnectedProvider -> msg) -> DisconnectedProvider -> Cmd msg
notifyProviderDisconnected tagger connection =
    Task.succeed () |> Task.perform (\_ -> tagger connection)


toggleProviderConnect : (DisconnectedProvider -> msg) -> ProviderConnection -> Cmd msg
toggleProviderConnect tagger connection =
    case ( type_ connection, connection ) of
        ( Deezer, Connected con ) ->
            Cmd.batch [ Deezer.disconnectDeezer (), notifyProviderDisconnected tagger <| P.disconnect con ]

        ( Deezer, Disconnected _ ) ->
            Deezer.connectDeezer ()

        ( Spotify, Connected con ) ->
            notifyProviderDisconnected tagger <| P.disconnect con

        ( Spotify, Disconnected _ ) ->
            Spotify.connectS ()

        _ ->
            Cmd.none
