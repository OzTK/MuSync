port module Deezer exposing
    ( connectD
    , createPlaylistWithTracks
    , decodePlaylist
    , decodePlaylists
    , decodeTracks
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
import Basics.Extra exposing (flip)
import Connection.Provider exposing (MusicProviderType(..))
import Dict
import Http exposing (Error(..), Response)
import Json.Decode as JD exposing (Decoder, int, map, string)
import Json.Decode.Pipeline exposing (custom, hardcoded, required, requiredAt)
import Json.Encode as JE
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..), WebData)
import Track exposing (Track)
import Tuple exposing (pair)


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


decodeData decoder url json =
    json
        |> JD.decodeValue decoder
        |> Result.mapError Left
        |> Result.mapError (httpBadPayloadError url json)
        |> RemoteData.fromResult


decodePlaylists : JD.Value -> WebData (List Playlist)
decodePlaylists =
    decodeData (JD.list playlist) "/deezer/playlists"


decodePlaylist : JD.Value -> WebData Playlist
decodePlaylist =
    decodeData playlist "/deezer/playlist"


decodeTracks : JD.Value -> WebData (List Track)
decodeTracks =
    decodeData (JD.list track) "/deezer/tracks"



-- Ports


port updateStatus : (Bool -> msg) -> Sub msg


port connectD : () -> Cmd msg


port disconnect : () -> Cmd msg


port loadAllPlaylists : () -> Cmd msg


port receivePlaylists : (JD.Value -> msg) -> Sub msg


port searchSong : { id : String, title : String, artist : String } -> Cmd msg


port receiveMatchingTracks : (( String, JD.Value ) -> msg) -> Sub msg


port loadPlaylistSongs : PlaylistId -> Cmd msg


port receivePlaylistSongs : (( PlaylistId, JD.Value ) -> msg) -> Sub msg


port createPlaylistWithTracks : ( String, List Int ) -> Cmd msg


port playlistCreated : (JD.Value -> msg) -> Sub msg
