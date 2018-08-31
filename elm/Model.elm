module Model exposing (MusicProviderType(..), UserInfo, keyPartsSeparator, keysSeparator, providerFromString, providerToString)


type MusicProviderType
    = Spotify
    | Deezer
    | Google
    | Amazon


providerFromString : String -> Maybe MusicProviderType
providerFromString pName =
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


providerToString : MusicProviderType -> String
providerToString pType =
    case pType of
        Spotify ->
            "Spotify"

        Deezer ->
            "Deezer"

        Google ->
            "Google"

        Amazon ->
            "Amazon"


type alias UserId =
    String


type alias UserInfo =
    { id : UserId
    , displayName : String
    }


keyPartsSeparator : String
keyPartsSeparator =
    "_"


keysSeparator : String
keysSeparator =
    "__"
