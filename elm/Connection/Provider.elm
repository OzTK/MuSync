module Connection.Provider exposing
    ( ConnectedProvider(..)
    , ConnectingProvider(..)
    , DisconnectedProvider(..)
    , InactiveProvider(..)
    , OAuthToken
    , connected
    , connectedType
    , connectedWithToken
    , connecting
    , disconnected
    , inactive
    , token
    , user
    )

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


token : ConnectedProvider providerType -> Maybe OAuthToken
token con =
    case con of
        ConnectedProviderWithToken _ t _ ->
            Just t

        _ ->
            Nothing


user : ConnectedProvider providerType -> Maybe UserInfo
user con =
    case con of
        ConnectedProviderWithToken _ _ u ->
            Just u

        _ ->
            Nothing


connectedWithToken : providerType -> OAuthToken -> UserInfo -> ConnectedProvider providerType
connectedWithToken pType t u =
    ConnectedProviderWithToken pType t u


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
