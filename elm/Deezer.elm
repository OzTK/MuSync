module Deezer exposing (..)

import Json.Decode exposing (Decoder, string, list, int, andThen, map)
import Json.Decode.Pipeline exposing (required, decode, hardcoded, custom)
import RemoteData exposing (RemoteData(NotAsked))
import Model exposing (Track, Playlist)


playlist : Decoder Playlist
playlist =
    decode Playlist
        |> required "id" (map toString int)
        |> required "title" string
        |> hardcoded NotAsked
        |> required "nb_tracks" int


track : Decoder Track
track =
    decode Track
        |> required "title" string
        |> required "artist" string
