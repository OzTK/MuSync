module Deezer exposing (playlist, track, httpBadPayloadError)

import Dict
import Json.Decode exposing (Decoder, string, int, map)
import Json.Decode.Pipeline exposing (required, requiredAt, decode, hardcoded, custom)
import Http exposing (Error(BadPayload), Response)
import RemoteData exposing (RemoteData(NotAsked))
import Model exposing (MusicProviderType(Deezer))
import Playlist exposing (Playlist)
import Track exposing (Track)


playlist : Decoder Playlist
playlist =
    decode Playlist
        |> required "id" (map toString int)
        |> required "title" string
        |> hardcoded NotAsked
        |> required "link" string
        |> required "nb_tracks" int


track : Decoder Track
track =
    decode Track
        |> custom (decode (,) |> hardcoded Deezer |> required "id" (map toString int))
        |> required "title" string
        |> requiredAt [ "artist", "name" ] string


httpBadPayloadError : String -> Json.Decode.Value -> String -> Error
httpBadPayloadError url json =
    { url = url
    , status = { code = 200, message = "OK" }
    , headers = Dict.empty
    , body = toString json
    }
        |> (flip BadPayload)
