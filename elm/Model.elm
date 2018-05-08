module Model
    exposing
        ( MusicProviderType(..)
        , MusicData
        , musicErrorFromHttp
        , musicErrorFromDecoding
        )

import RemoteData exposing (WebData, RemoteData(NotAsked, Loading, Success))
import Http


type MusicProviderType
    = Spotify
    | Deezer
    | Google
    | Amazon


type MusicApiError
    = Http Http.Error
    | DecodingError String


type alias MusicData a =
    RemoteData MusicApiError a


musicErrorFromHttp : Http.Error -> MusicApiError
musicErrorFromHttp =
    Http


musicErrorFromDecoding : String -> MusicApiError
musicErrorFromDecoding =
    DecodingError
