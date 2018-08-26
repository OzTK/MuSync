port module Deezer exposing
    ( connectD
    , createPlaylistWithTracks
    , disconnect
    , httpBadPayloadError
    , loadAllPlaylists
    , loadPlaylistSongs
    , playlist
    , playlistCreated
    , receiveMatchingTracks
    , receivePlaylistSongs
    , receivePlaylists
    , searchSong
    , track
    , updateStatus
    )

import Basics.Extra exposing (pair, swap)
import Dict
import Http exposing (Error(BadPayload), Response)
import Json.Decode as JD exposing (Decoder, int, map, string)
import Json.Decode.Pipeline exposing (custom, decode, hardcoded, required, requiredAt)
import Model exposing (MusicProviderType(Deezer))
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(NotAsked))
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
        |> custom (decode pair |> required "id" (map toString int) |> hardcoded Deezer)
        |> required "title" string
        |> requiredAt [ "artist", "name" ] string


httpBadPayloadError : String -> JD.Value -> String -> Error
httpBadPayloadError url json =
    { url = url
    , status = { code = 200, message = "OK" }
    , headers = Dict.empty
    , body = toString json
    }
        |> swap BadPayload



-- Ports


port updateStatus : (Bool -> msg) -> Sub msg


port connectD : () -> Cmd msg


port disconnect : () -> Cmd msg


port loadAllPlaylists : () -> Cmd msg


port receivePlaylists : (Maybe JD.Value -> msg) -> Sub msg


port searchSong : { id : String, title : String, artist : String } -> Cmd msg


port receiveMatchingTracks : (( String, JD.Value ) -> msg) -> Sub msg


port loadPlaylistSongs : PlaylistId -> Cmd msg


port receivePlaylistSongs : (Maybe JD.Value -> msg) -> Sub msg


port createPlaylistWithTracks : ( String, List Int ) -> Cmd msg


port playlistCreated : (JD.Value -> msg) -> Sub msg
