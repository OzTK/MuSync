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
    , setUserInfo
    , token
    , user
    )

import Model exposing (UserInfo)
import RemoteData exposing (RemoteData(..), WebData)


type alias OAuthToken =
    String


type ConnectedProvider providerType
    = ConnectedProvider providerType (WebData UserInfo)
    | ConnectedProviderWithToken providerType OAuthToken (WebData UserInfo)


connected : providerType -> WebData UserInfo -> ConnectedProvider providerType
connected pType userInfo =
    ConnectedProvider pType userInfo


connectedType : ConnectedProvider providerType -> providerType
connectedType connection =
    case connection of
        ConnectedProvider pType _ ->
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
        ConnectedProviderWithToken _ _ (Success u) ->
            Just u

        ConnectedProvider _ (Success u) ->
            Just u

        _ ->
            Nothing


setUserInfo : WebData UserInfo -> ConnectedProvider pType -> ConnectedProvider pType
setUserInfo userInfo provider =
    case provider of
        ConnectedProvider pType _ ->
            ConnectedProvider pType userInfo

        ConnectedProviderWithToken pType t u ->
            ConnectedProviderWithToken pType t userInfo


connectedWithToken : providerType -> OAuthToken -> WebData UserInfo -> ConnectedProvider providerType
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
