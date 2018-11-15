port module Deezer exposing
    ( connectDeezer
    , decodePlaylist
    , decodePlaylists
    , disconnectDeezer
    , getPlaylistTracksFromLink
    , getPlaylists
    , httpBadPayloadError
    , importPlaylist
    , playlist
    , searchTrack
    , track
    )

import Basics.Either as Either exposing (Either(..))
import Basics.Extra exposing (flip)
import Dict
import Http exposing (Error(..), Response)
import Json.Decode as Decode exposing (Decoder, bool, int, list, map, string, succeed)
import Json.Decode.Pipeline as Decode exposing (custom, hardcoded, required, requiredAt)
import Json.Encode as JE
import Model exposing (UserInfo)
import Playlist exposing (Playlist, PlaylistId)
import Process
import RemoteData exposing (RemoteData(..), WebData)
import RemoteData.Http as Http exposing (Config, defaultConfig)
import Task exposing (Task)
import Track exposing (Track)
import Tuple exposing (pair)


userInfo : Decoder UserInfo
userInfo =
    succeed UserInfo
        |> Decode.required "id" string
        |> Decode.required "name" string


playlist : Decoder Playlist
playlist =
    succeed Playlist
        |> required "id" (map String.fromInt int)
        |> required "title" string
        |> hardcoded NotAsked
        |> required "link" string
        |> required "nb_tracks" int


track : Decoder Track
track =
    succeed Track
        |> required "id" (map String.fromInt int)
        |> required "title" string
        |> requiredAt [ "artist", "name" ] string


httpBadPayloadError : String -> Decode.Value -> Either Decode.Error String -> Error
httpBadPayloadError url json err =
    { url = url
    , status = { code = 200, message = "OK" }
    , headers = Dict.empty
    , body = JE.encode 0 json
    }
        |> BadPayload (Either.unwrap Decode.errorToString identity err)


decodeData decoder url json =
    json
        |> Decode.decodeValue decoder
        |> Result.mapError Left
        |> Result.mapError (httpBadPayloadError url json)
        |> RemoteData.fromResult


decodePlaylists : Decoder (List Playlist)
decodePlaylists =
    succeed succeed
        |> Decode.required "data" (list playlist)
        |> Decode.resolve


decodePlaylist : Decode.Value -> WebData Playlist
decodePlaylist =
    decodeData playlist "/deezer/playlist"


tracksResult : Decoder (List Track)
tracksResult =
    succeed succeed
        |> Decode.required "data" (list track)
        |> Decode.resolve



-- Values


endpoint : String -> String -> String
endpoint token resource =
    let
        prefix =
            if String.contains "?" resource then
                "&"

            else
                "?"
    in
    "https://cors-anywhere.herokuapp.com/https://api.deezer.com/" ++ resource ++ prefix ++ "access_token=" ++ token



-- Http


delayAndRetry : Task Never (WebData a) -> Float -> Task Never (WebData a)
delayAndRetry task =
    (+) 1000
        >> Process.sleep
        >> Task.andThen (\_ -> withRateLimitTask task)


withRateLimitTask : Task Never (WebData a) -> Task Never (WebData a)
withRateLimitTask task =
    task
        |> Task.andThen
            (\result ->
                case result of
                    Failure (Http.BadStatus response) ->
                        if response.status.code == 429 then
                            response.headers
                                |> Dict.get "retry-after"
                                |> Maybe.andThen String.toFloat
                                |> Maybe.map (delayAndRetry task)
                                |> Maybe.withDefault (Task.succeed result)

                        else
                            Task.succeed result

                    _ ->
                        Task.succeed result
            )


withRateLimit : (WebData a -> msg) -> Task Never (WebData a) -> Cmd msg
withRateLimit tagger task =
    withRateLimitTask task |> Task.perform tagger


getUserInfo : String -> (WebData UserInfo -> msg) -> Cmd msg
getUserInfo token tagger =
    Http.getWithConfig defaultConfig (endpoint token "/user/me") tagger userInfo


searchTrack : String -> (WebData (List Track) -> msg) -> Track -> Cmd msg
searchTrack token tagger t =
    Http.getTaskWithConfig defaultConfig
        (endpoint token <|
            "search/track?q="
                ++ ("artist:\""
                        ++ t.artist
                        ++ "\" track:\""
                        ++ t.title
                        ++ "\""
                   )
        )
        tracksResult
        |> withRateLimit tagger


getPlaylists : String -> (WebData (List Playlist) -> msg) -> Cmd msg
getPlaylists token tagger =
    Http.getTaskWithConfig defaultConfig
        (endpoint token "user/me/playlists")
        decodePlaylists
        |> withRateLimit tagger


getPlaylistTracksFromLink : String -> (WebData (List Track) -> msg) -> String -> Cmd msg
getPlaylistTracksFromLink token tagger link =
    Http.getTaskWithConfig defaultConfig (link ++ "/tracks" ++ "?access_token=" ++ token) tracksResult |> withRateLimit tagger


createPlaylistTask : String -> String -> String -> Task Never (WebData Playlist)
createPlaylistTask token user name =
    Http.postTaskWithConfig
        defaultConfig
        (endpoint token <| "users/" ++ user ++ "/playlists")
        playlist
        (JE.object [ ( "name", JE.string name ) ])


addSongsToPlaylistTask : String -> List Track -> WebData Playlist -> Task Never (WebData Playlist)
addSongsToPlaylistTask token songs playlistData =
    case playlistData of
        Success { link } ->
            Http.postTaskWithConfig
                defaultConfig
                (link ++ "/tracks" ++ "?access_token=" ++ token)
                bool
                (JE.object
                    [ ( "uris"
                      , songs
                            |> List.map .id
                            |> List.map ((++) "spotify:track:")
                            |> JE.list JE.string
                      )
                    ]
                )
                |> Task.map (\_ -> playlistData)

        _ ->
            Task.succeed playlistData


importPlaylist : String -> String -> (WebData Playlist -> msg) -> List Track -> String -> Cmd msg
importPlaylist token user tagger songs name =
    createPlaylistTask token user name
        |> Task.andThen (addSongsToPlaylistTask token songs)
        |> Task.perform tagger


port connectDeezer : () -> Cmd msg


port disconnectDeezer : () -> Cmd msg
