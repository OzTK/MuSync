module Provider
    exposing
        ( OAuthToken
        , ProviderConnection(..)
        , ConnectedProvider(..)
        , DisconnectedProvider(..)
        , InactiveProvider(..)
        , ConnectingProvider(..)
        , connected
        , connectedWithToken
        , connectedType
        , disconnected
        , connecting
        , inactive
        , provider
        , providerFromConnected
        , connectionToMaybe
        , isConnected
        , isDisconnected
        , isConnecting
        , isInactive
        )


type alias OAuthToken =
    String



-- Provider connection


type ConnectedProvider providerType
    = ConnectedProvider providerType
    | ConnectedProviderWithToken providerType OAuthToken


connected : providerType -> ProviderConnection providerType
connected pType =
    Connected (ConnectedProvider pType)


connectedType : ConnectedProvider providerType -> providerType
connectedType connection =
    case connection of
        ConnectedProvider pType ->
            pType

        ConnectedProviderWithToken pType _ ->
            pType


connectedWithToken : providerType -> OAuthToken -> ProviderConnection providerType
connectedWithToken pType token =
    Connected (ConnectedProviderWithToken pType token)


type DisconnectedProvider providerType
    = DisconnectedProvider providerType


disconnected : providerType -> ProviderConnection providerType
disconnected pType =
    Disconnected (DisconnectedProvider pType)


type ConnectingProvider pType
    = ConnectingProvider pType


connecting : providerType -> ProviderConnection providerType
connecting pType =
    Connecting (ConnectingProvider pType)


type InactiveProvider providerType
    = InactiveProvider providerType


inactive : providerType -> ProviderConnection providerType
inactive pType =
    Inactive (InactiveProvider pType)


type ProviderConnection providerType
    = Inactive (InactiveProvider providerType)
    | Disconnected (DisconnectedProvider providerType)
    | Connecting (ConnectingProvider providerType)
    | Connected (ConnectedProvider providerType)


provider : ProviderConnection providerType -> providerType
provider con =
    case con of
        Inactive (InactiveProvider pType) ->
            pType

        Disconnected (DisconnectedProvider pType) ->
            pType

        Connecting (ConnectingProvider pType) ->
            pType

        Connected connected ->
            providerFromConnected connected


providerFromConnected : ConnectedProvider a -> a
providerFromConnected con =
    case con of
        ConnectedProvider pType ->
            pType

        ConnectedProviderWithToken pType _ ->
            pType


connectionToMaybe : ProviderConnection providerType -> Maybe (ConnectedProvider providerType)
connectionToMaybe connection =
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
