module Connection.Connected exposing (ConnectedProvider(..), MusicService(..), OAuthToken, OAuthTokenFormatError, any, connected, connectionToString, createToken, hasUser, rawToken, setUserInfo, toString, token, type_, user)

import RemoteData exposing (RemoteData(..), WebData)
import UserInfo exposing (UserInfo)


type MusicService
    = Spotify
    | Deezer
    | Google
    | Amazon


toString : MusicService -> String
toString t =
    case t of
        Spotify ->
            "Spotify"

        Deezer ->
            "Deezer"

        Google ->
            "Google"

        Amazon ->
            "Amazon"


type ConnectedProvider
    = ConnectedProvider MusicService (WebData UserInfo)
    | ConnectedProviderWithToken MusicService OAuthToken (WebData UserInfo)


connectionToString : ConnectedProvider -> String
connectionToString =
    type_ >> toString


connected : MusicService -> WebData UserInfo -> ConnectedProvider
connected t userInfo =
    ConnectedProvider t userInfo


any : ConnectedProvider
any =
    connected Amazon NotAsked


type_ : ConnectedProvider -> MusicService
type_ connection =
    case connection of
        ConnectedProvider t _ ->
            t

        ConnectedProviderWithToken t _ _ ->
            t


token : ConnectedProvider -> Maybe OAuthToken
token con =
    case con of
        ConnectedProviderWithToken _ t _ ->
            Just t

        _ ->
            Nothing


hasUser : ConnectedProvider -> Bool
hasUser con =
    case con of
        ConnectedProviderWithToken _ _ (Success _) ->
            True

        ConnectedProvider _ (Success _) ->
            True

        _ ->
            False


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
        ConnectedProvider t _ ->
            ConnectedProvider t userInfo

        ConnectedProviderWithToken t tok _ ->
            ConnectedProviderWithToken t tok userInfo



-- OAuth token


type OAuthToken
    = OAuthToken String


type OAuthTokenFormatError
    = EmptyTokenError


createToken : String -> Result OAuthTokenFormatError OAuthToken
createToken rawValue =
    if rawValue == "" then
        Err EmptyTokenError

    else
        Ok (OAuthToken rawValue)


rawToken : OAuthToken -> String
rawToken (OAuthToken value) =
    value
