module Deezer exposing (playlist, track)

import Json.Decode exposing (Decoder, string, int, map)
import Json.Decode.Pipeline exposing (required, decode, hardcoded)
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
        |> required "nb_tracks" int
        |> hardcoded Nothing


track : Decoder Track
track =
    decode Track
        |> required "id" string
        |> required "title" string
        |> required "artist" string
        |> hardcoded Deezer
        |> hardcoded Track.emptyMatchingTracks
