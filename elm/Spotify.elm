module Spotify exposing (searchTrack, getPlaylists, getPlaylistTracksFromLink, getUserInfo)

import Task
import Process
import Dict
import Time exposing (inSeconds)
import Http exposing (header, encodeUri)
import RemoteData.Http as Http exposing (defaultConfig, Config)
import Json.Decode exposing (Decoder, nullable, string, int, list, succeed, fail)
import Json.Encode as JE
import Json.Decode.Pipeline as Pip
import RemoteData exposing (WebData, RemoteData(NotAsked, Failure))
import Model exposing (MusicProviderType(Spotify), UserInfo)
import Playlist exposing (Playlist)
import Track exposing (Track)


-- Model


userInfo : Decoder UserInfo
userInfo =
    Pip.decode UserInfo
        |> Pip.required "id" string
        |> Pip.required "display_name" string


type alias Artist =
    { name : String }


artist : Decoder Artist
artist =
    Pip.decode Artist |> Pip.required "name" string


toArtistName : List { a | name : String } -> Decoder String
toArtistName artists =
    case artists of
        first :: _ ->
            succeed first.name

        [] ->
            fail "No artists found"


track : Decoder Track
track =
    Pip.decode Track
        |> Pip.custom
            (Pip.decode (,)
                |> Pip.hardcoded Spotify
                |> Pip.required "id" string
            )
        |> Pip.required "name" string
        |> Pip.custom
            (Pip.decode toArtistName
                |> Pip.requiredAt [ "artists" ] (list artist)
                |> Pip.resolve
            )


trackEntry : Decoder Track
trackEntry =
    Pip.decode succeed
        |> Pip.requiredAt [ "track" ] track
        |> Pip.resolve


playlist : Decoder Playlist
playlist =
    Pip.decode Playlist
        |> Pip.required "id" string
        |> Pip.required "name" string
        |> Pip.hardcoded NotAsked
        |> Pip.required "href" string
        |> Pip.requiredAt [ "tracks", "total" ] int
        |> Pip.requiredAt [ "tracks", "href" ] (nullable string)


playlistsResponse : Decoder (List Playlist)
playlistsResponse =
    Pip.decode succeed
        |> Pip.required "items" (list playlist)
        |> Pip.resolve


playlistTracks : Decoder (List Track)
playlistTracks =
    Pip.decode succeed
        |> Pip.required "items" (list trackEntry)
        |> Pip.resolve


searchResponse : Decoder (List Track)
searchResponse =
    Pip.decode succeed
        |> Pip.requiredAt [ "tracks", "items" ] (list track)
        |> Pip.resolve


addToPlaylistResponse =
    Pip.decode succeed
        |> Pip.requiredAt [ "success" ] (string)
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
    (+) 1
        >> inSeconds
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
                                |> Maybe.map String.toFloat
                                |> Maybe.andThen Result.toMaybe
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


getUserInfo : String -> (String -> WebData UserInfo -> msg) -> Cmd msg
getUserInfo token tagger =
    Http.getWithConfig (config token) (endpoint ++ "me") (tagger token) userInfo


searchTrack : String -> (WebData (List Track) -> msg) -> Track -> Cmd msg
searchTrack token tagger ({ artist, title } as track) =
    Http.getTaskWithConfig (config token)
        (endpoint
            ++ "search?type=track&limit=1&q="
            ++ (encodeUri
                    "artist:\""
                    ++ artist
                    ++ "\" track:\""
                    ++ title
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
    Http.getTaskWithConfig (config token) link playlistTracks |> withRateLimit tagger


createPlaylistTask token name =
    Http.postTaskWithConfig
        (config token)
        (endpoint ++ "users/" ++ name ++ "/playlists")
        playlist
        (JE.object [ ( "name", JE.string name ) ])


addSongsToPlaylist token songs playlist =
    List.map
        (\s ->
            Http.putTaskWithConfig
                (config token)
                (playlist.link)
                addToPlaylistResponse
                (JE.object [ ( "id", playlist.id ) ])
        )
        songs



-- importPlaylist token tagger { name, songs } =
--     songs
--         |> RemoteData.map (\s -> ( s, createPlaylistTask token name ))
--         |> RemoteData.map (\( s, t ) -> t |> Task.andThen (addSongsToPlaylist token s))


config : String -> Config
config token =
    { defaultConfig | headers = [ header "Authorization" <| "Bearer " ++ token, header "Content-Type" "application/json" ] }
