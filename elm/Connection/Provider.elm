module Connection.Provider exposing (..)

import Model exposing (UserInfo)


type alias OAuthToken =
    String


type ConnectedProvider providerType
    = ConnectedProvider providerType
    | ConnectedProviderWithToken providerType OAuthToken UserInfo


connected : providerType -> ConnectedProvider providerType
connected =
    ConnectedProvider


connectedType : ConnectedProvider providerType -> providerType
connectedType connection =
    case connection of
        ConnectedProvider pType ->
            pType

        ConnectedProviderWithToken pType _ _ ->
            pType


connectedWithToken : providerType -> OAuthToken -> UserInfo -> ConnectedProvider providerType
connectedWithToken pType token user =
    ConnectedProviderWithToken pType token user


type DisconnectedProvider providerType
    = DisconnectedProvider providerType


disconnected : providerType -> DisconnectedProvider providerType
disconnected =
    DisconnectedProvider


type ConnectingProvider pType
    = ConnectingProvider pType


connecting : providerType -> ConnectingProvider providerType
connecting =
    ConnectingProvider


type InactiveProvider providerType
    = InactiveProvider providerType


inactive : providerType -> InactiveProvider providerType
inactive =
    InactiveProvider
