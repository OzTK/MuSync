module Connection.Provider exposing
    ( ConnectedProvider(..)
    , ConnectingProvider(..)
    , DisconnectedProvider(..)
    , MusicProviderType(..)
    , OAuthToken
    , connected
    , connectedWithToken
    , connecting
    , disconnected
    , fromString
    , setUserInfo
    , toString
    , token
    , type_
    , user
    )

import Json.Decode as Decode exposing (fail, succeed)
import Model exposing (UserInfo)
import RemoteData exposing (RemoteData(..), WebData)


musicProviderTypeDecoder =
    Decode.map (fromString >> Maybe.map succeed >> Maybe.withDefault (fail "Unknown Music Provider type"))


type MusicProviderType
    = Spotify
    | Deezer
    | Google
    | Amazon


type alias OAuthToken =
    String


type ConnectedProvider
    = ConnectedProvider MusicProviderType (WebData UserInfo)
    | ConnectedProviderWithToken MusicProviderType OAuthToken (WebData UserInfo)


fromString : String -> Maybe MusicProviderType
fromString pName =
    case pName of
        "Spotify" ->
            Just Spotify

        "Deezer" ->
            Just Deezer

        "Google" ->
            Just Google

        "Amazon" ->
            Just Amazon

        _ ->
            Nothing


toString : MusicProviderType -> String
toString pType =
    case pType of
        Spotify ->
            "Spotify"

        Deezer ->
            "Deezer"

        Google ->
            "Google"

        Amazon ->
            "Amazon"


connected : MusicProviderType -> WebData UserInfo -> ConnectedProvider
connected pType userInfo =
    ConnectedProvider pType userInfo


type_ : ConnectedProvider -> MusicProviderType
type_ connection =
    case connection of
        ConnectedProvider pType _ ->
            pType

        ConnectedProviderWithToken pType _ _ ->
            pType


token : ConnectedProvider -> Maybe OAuthToken
token con =
    case con of
        ConnectedProviderWithToken _ t _ ->
            Just t

        _ ->
            Nothing


user : ConnectedProvider -> Maybe UserInfo
user con =
    case con of
        ConnectedProviderWithToken _ _ (Success u) ->
            Just u

        ConnectedProvider _ (Success u) ->
            Just u

        _ ->
            Nothing


setUserInfo : WebData UserInfo -> ConnectedProvider -> ConnectedProvider
setUserInfo userInfo provider =
    case provider of
        ConnectedProvider pType _ ->
            ConnectedProvider pType userInfo

        ConnectedProviderWithToken pType t u ->
            ConnectedProviderWithToken pType t userInfo


connectedWithToken : MusicProviderType -> OAuthToken -> WebData UserInfo -> ConnectedProvider
connectedWithToken pType t u =
    ConnectedProviderWithToken pType t u


type DisconnectedProvider
    = DisconnectedProvider MusicProviderType


disconnected : MusicProviderType -> DisconnectedProvider
disconnected =
    DisconnectedProvider


type ConnectingProvider
    = ConnectingProvider MusicProviderType


connecting : MusicProviderType -> ConnectingProvider
connecting =
    ConnectingProvider
