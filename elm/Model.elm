module Model exposing (MusicProviderType(..), providerFromString)


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
