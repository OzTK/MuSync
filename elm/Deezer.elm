port module Deezer exposing
    ( connectDeezer
    , createPlaylist
    , decodePlaylist
    , decodePlaylists
    , disconnectDeezer
    , getPlaylistTracksFromLink
    , getPlaylists
    , httpBadPayloadError
    , playlist
    , searchTrack
    , track
    )

import ApiClient as Api exposing (AnyFullEndpoint, Base, Endpoint, Full, FullAndQuery)
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
import Url.Builder as Url


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


endpoint : Endpoint Base
endpoint =
    Api.baseEndpoint "https://cors-anywhere.herokuapp.com/https://api.deezer.com/"


withToken : String -> AnyFullEndpoint -> AnyFullEndpoint
withToken token =
    Api.appendQueryParam (Url.string "access_token" token) >> Api.fullQueryAsAny



-- Http


getUserInfo : String -> Task Never (WebData UserInfo)
getUserInfo token =
    Api.get defaultConfig (Api.actionEndpoint endpoint [ "user", "me" ] |> Api.fullAsAny |> withToken token) userInfo


searchTrack : String -> Track -> Task Never (WebData (List Track))
searchTrack token t =
    Api.getWithRateLimit defaultConfig
        (Api.queryEndpoint endpoint
            [ "search", "track" ]
            [ Url.string
                "q"
                ("artist:\""
                    ++ t.artist
                    ++ "\" track:\""
                    ++ t.title
                    ++ "\""
                )
            ]
        )
        tracksResult


getPlaylists : String -> Task Never (WebData (List Playlist))
getPlaylists token =
    Api.getWithRateLimit defaultConfig
        (Api.actionEndpoint endpoint [ "user", "me", "playlists" ] |> Api.fullAsAny |> withToken token)
        decodePlaylists


getPlaylistTracksFromLink : String -> String -> Task Never (WebData (List Track))
getPlaylistTracksFromLink token link =
    link
        |> Api.endpointFromLink endpoint
        |> Maybe.map (Api.appendPath "tracks")
        |> Maybe.map Api.fullAsAny
        |> Maybe.map (withToken token)
        |> Maybe.map (\url -> Api.getWithRateLimit defaultConfig url tracksResult)
        |> Maybe.withDefault (Task.succeed (Failure <| BadUrl link))


createPlaylist : String -> String -> String -> Task Never (WebData Playlist)
createPlaylist token user name =
    Api.post
        defaultConfig
        (Api.actionEndpoint endpoint [ "users", user, "playlists" ] |> Api.fullAsAny |> withToken token)
        playlist
        (JE.object [ ( "title", JE.string name ) ])


addSongsToPlaylist : String -> List Track -> WebData Playlist -> Task Never (WebData Playlist)
addSongsToPlaylist token songs playlistData =
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


port connectDeezer : () -> Cmd msg


port disconnectDeezer : () -> Cmd msg
