port module Deezer
    exposing
        ( playlist
        , track
        , httpBadPayloadError
        , updateStatus
        , connectD
        , disconnect
        , loadAllPlaylists
        , receivePlaylists
        , searchSong
        , receiveMatchingTracks
        , loadPlaylistSongs
        , receivePlaylistSongs
        , createPlaylistWithTracks
        , playlistCreated
        )

import Dict
import Json.Decode as JD exposing (Decoder, string, int, map)
import Json.Decode.Pipeline exposing (required, requiredAt, decode, hardcoded, custom)
import Http exposing (Error(BadPayload), Response)
import RemoteData exposing (RemoteData(NotAsked))
import Model exposing (MusicProviderType(Deezer))
import Playlist exposing (Playlist, PlaylistId)
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


httpBadPayloadError : String -> JD.Value -> String -> Error
httpBadPayloadError url json =
    { url = url
    , status = { code = 200, message = "OK" }
    , headers = Dict.empty
    , body = toString json
    }
        |> (flip BadPayload)



-- Ports


port updateStatus : (Bool -> msg) -> Sub msg


port connectD : () -> Cmd msg


port disconnect : () -> Cmd msg


port loadAllPlaylists : () -> Cmd msg


port receivePlaylists : (Maybe JD.Value -> msg) -> Sub msg


port searchSong : { id : ( String, String ), title : String, artist : String } -> Cmd msg


port receiveMatchingTracks : (( ( String, String ), JD.Value ) -> msg) -> Sub msg


port loadPlaylistSongs : PlaylistId -> Cmd msg


port receivePlaylistSongs : (Maybe JD.Value -> msg) -> Sub msg


port createPlaylistWithTracks : ( String, List Int ) -> Cmd msg


port playlistCreated : (JD.Value -> msg) -> Sub msg
