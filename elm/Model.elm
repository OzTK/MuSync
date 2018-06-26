module Model exposing (MusicProviderType(..), UserInfo, providerFromString)


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


type alias UserId =
    String


type alias UserInfo =
    { id : UserId
    , displayName : String
    }
