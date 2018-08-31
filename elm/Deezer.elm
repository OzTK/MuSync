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

import Basics.Either as Either exposing (Either(..))
import Basics.Extra exposing (pair, swap)
import Dict
import Http exposing (Error(..), Response)
import Json.Decode as JD exposing (Decoder, int, map, string)
import Json.Decode.Pipeline exposing (custom, hardcoded, required, requiredAt)
import Json.Encode as JE
import Model exposing (MusicProviderType(..))
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..))
import Track exposing (Track)


playlist : Decoder Playlist
playlist =
    JD.succeed Playlist
        |> required "id" (map String.fromInt int)
        |> required "title" string
        |> hardcoded NotAsked
        |> required "link" string
        |> required "nb_tracks" int


track : Decoder Track
track =
    JD.succeed Track
        |> custom (JD.succeed pair |> required "id" (map String.fromInt int) |> hardcoded Deezer)
        |> required "title" string
        |> requiredAt [ "artist", "name" ] string


httpBadPayloadError : String -> JD.Value -> Either JD.Error String -> Error
httpBadPayloadError url json err =
    { url = url
    , status = { code = 200, message = "OK" }
    , headers = Dict.empty
    , body = JE.encode 0 json
    }
        |> BadPayload (Either.unwrap JD.errorToString identity err)



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
