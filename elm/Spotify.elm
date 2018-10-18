port module Spotify exposing
    ( connectS
    , getPlaylistTracksFromLink
    , getPlaylists
    , getUserInfo
    , importPlaylist
    , onConnected
    , searchTrack
    )

import Connection.Provider exposing (MusicProviderType(..))
import Dict
import Http exposing (header)
import Json.Decode as Decode exposing (Decoder, fail, int, list, nullable, string, succeed)
import Json.Decode.Pipeline as Pip
import Json.Encode as JE
import Model exposing (UserInfo)
import Playlist exposing (Playlist)
import Process
import RemoteData exposing (RemoteData(..), WebData)
import RemoteData.Http as Http exposing (Config, defaultConfig)
import Task
import Track exposing (Track)
import Tuple exposing (pair)



-- Model


userInfo : Decoder UserInfo
userInfo =
    Decode.succeed UserInfo
        |> Pip.required "id" string
        |> Pip.required "display_name" string


type alias Artist =
    { name : String }


artist : Decoder Artist
artist =
    Decode.succeed Artist |> Pip.required "name" string


toArtistName : List { a | name : String } -> Decoder String
toArtistName artists =
    case artists of
        first :: _ ->
            succeed first.name

        [] ->
            fail "No artists found"


track : Decoder Track
track =
    Decode.succeed Track
        |> Pip.custom
            (Decode.succeed pair
                |> Pip.required "id" string
                |> Pip.hardcoded Spotify
            )
        |> Pip.required "name" string
        |> Pip.custom
            (Decode.succeed toArtistName
                |> Pip.requiredAt [ "artists" ] (list artist)
                |> Pip.resolve
            )


trackEntry : Decoder Track
trackEntry =
    Decode.succeed succeed
        |> Pip.requiredAt [ "track" ] track
        |> Pip.resolve


playlist : Decoder Playlist
playlist =
    Decode.succeed Playlist
        |> Pip.required "id" string
        |> Pip.required "name" string
        |> Pip.hardcoded NotAsked
        |> Pip.required "href" string
        |> Pip.requiredAt [ "tracks", "total" ] int


playlistsResponse : Decoder (List Playlist)
playlistsResponse =
    Decode.succeed succeed
        |> Pip.required "items" (list playlist)
        |> Pip.resolve


playlistTracks : Decoder (List Track)
playlistTracks =
    Decode.succeed succeed
        |> Pip.required "items" (list trackEntry)
        |> Pip.resolve


searchResponse : Decoder (List Track)
searchResponse =
    Decode.succeed succeed
        |> Pip.requiredAt [ "tracks", "items" ] (list track)
        |> Pip.resolve


addToPlaylistResponse : Decoder String
addToPlaylistResponse =
    Decode.succeed succeed
        |> Pip.requiredAt [ "snapshot_id" ] string
        |> Pip.resolve



-- Values


endpoint : String
endpoint =
    "https://api.spotify.com" ++ "/" ++ version ++ "/"


version : String
version =
    "v1"



-- Http


delayAndRetry : Task.Task Never (WebData a) -> Float -> Task.Task Never (WebData a)
delayAndRetry task =
    (+) 1000
        >> Process.sleep
        >> Task.andThen (\_ -> withRateLimitTask task)


withRateLimitTask : Task.Task Never (WebData a) -> Task.Task Never (WebData a)
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


withRateLimit : (WebData a -> msg) -> Task.Task Never (WebData a) -> Cmd msg
withRateLimit tagger task =
    withRateLimitTask task |> Task.perform tagger


getUserInfo : String -> (WebData UserInfo -> msg) -> Cmd msg
getUserInfo token tagger =
    Http.getWithConfig (config token) (endpoint ++ "me") tagger userInfo


searchTrack : String -> (WebData (List Track) -> msg) -> Track -> Cmd msg
searchTrack token tagger t =
    Http.getTaskWithConfig (config token)
        (endpoint
            ++ "search?type=track&limit=1&q="
            ++ ("artist:\""
                    ++ t.artist
                    ++ "\" track:\""
                    ++ t.title
                    ++ "\""
               )
        )
        searchResponse
        |> withRateLimit tagger


getPlaylists : String -> (WebData (List Playlist) -> msg) -> Cmd msg
getPlaylists token tagger =
    Http.getTaskWithConfig (config token)
        (endpoint ++ "me/playlists")
        playlistsResponse
        |> withRateLimit tagger


getPlaylistTracksFromLink : String -> (WebData (List Track) -> msg) -> String -> Cmd msg
getPlaylistTracksFromLink token tagger link =
    Http.getTaskWithConfig (config token) (link ++ "/tracks") playlistTracks |> withRateLimit tagger


createPlaylistTask : String -> String -> String -> Task.Task Never (WebData Playlist)
createPlaylistTask token user name =
    Http.postTaskWithConfig
        (config token)
        (endpoint ++ "users/" ++ user ++ "/playlists")
        playlist
        (JE.object [ ( "name", JE.string name ) ])


addSongsToPlaylistTask : String -> List Track -> WebData Playlist -> Task.Task Never (WebData Playlist)
addSongsToPlaylistTask token songs playlistData =
    case playlistData of
        Success { link } ->
            Http.postTaskWithConfig
                (config token)
                (link ++ "/tracks")
                addToPlaylistResponse
                (JE.object
                    [ ( "uris"
                      , songs
                            |> List.map (.id >> Tuple.first)
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


config : String -> Config
config token =
    { defaultConfig | headers = [ header "Authorization" <| "Bearer " ++ token, header "Content-Type" "application/json" ] }



-- Ports


port connectS : () -> Cmd msg


port onConnected : (( Maybe String, String ) -> msg) -> Sub msg
