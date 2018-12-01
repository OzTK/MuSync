port module Spotify exposing
    ( connectS
    , createPlaylist
    , getPlaylistTracksFromLink
    , getPlaylists
    , getUserInfo
    , onConnected
    , searchTrack
    )

import ApiClient as Api exposing (AnyFullEndpoint, Base, Endpoint, Full)
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
import Task exposing (Task)
import Track exposing (Track)
import Tuple exposing (pair)
import Url.Builder as Url



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
        |> Pip.required "id" string
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


endpoint : Endpoint Base
endpoint =
    Api.baseEndpoint <| Url.crossOrigin "https://api.spotify.com" [ version ] []


version : String
version =
    "v1"



-- Http


getUserInfo : String -> Task Never (WebData UserInfo)
getUserInfo token =
    Api.get (config token) (Api.actionEndpoint endpoint [ "me" ] |> Api.fullAsAny) userInfo


searchTrack : String -> Track -> Task Never (WebData (Maybe Track))
searchTrack token t =
    Api.getWithRateLimit (config token)
        (Api.queryEndpoint endpoint
            [ "search" ]
            [ Url.string "type" "track"
            , Url.int "limit" 1
            , Url.string
                "q"
                ("artist:\""
                    ++ t.artist
                    ++ "\" track:\""
                    ++ t.title
                    ++ "\""
                )
            ]
        )
        searchResponse
        |> Task.map (RemoteData.map List.head)


getPlaylists : String -> Task Never (WebData (List Playlist))
getPlaylists token =
    Api.getWithRateLimit (config token)
        (Api.actionEndpoint endpoint [ "me", "playlists" ] |> Api.fullAsAny)
        playlistsResponse


playlistsTracksFromLink : String -> Maybe AnyFullEndpoint
playlistsTracksFromLink link =
    link
        |> Api.endpointFromLink endpoint
        |> Maybe.map (Api.appendPath "tracks")
        |> Maybe.map Api.fullAsAny


getPlaylistTracksFromLink : String -> String -> Task Never (WebData (List Track))
getPlaylistTracksFromLink token link =
    link
        |> playlistsTracksFromLink
        |> Maybe.map (\l -> Api.getWithRateLimit (config token) l playlistTracks)
        |> Maybe.withDefault (Task.succeed <| Failure (Http.BadUrl link))


createPlaylist : String -> String -> String -> Task.Task Never (WebData Playlist)
createPlaylist token user name =
    Api.post
        (config token)
        (Api.actionEndpoint endpoint [ "users", user, "playlists" ] |> Api.fullAsAny)
        playlist
        (JE.object [ ( "name", JE.string name ) ])


addPlaylistTracksEncoder : List Track -> JE.Value
addPlaylistTracksEncoder songs =
    JE.object
        [ ( "uris"
          , songs
                |> List.map .id
                |> List.map ((++) "spotify:track:")
                |> JE.list JE.string
          )
        ]


addSongsToPlaylist : Config -> List Track -> WebData Playlist -> Task.Task String (WebData Playlist)
addSongsToPlaylist cfg songs playlistData =
    case playlistData of
        Success { link } ->
            link
                |> playlistsTracksFromLink
                |> Maybe.map
                    (\l ->
                        Api.post cfg l addToPlaylistResponse (addPlaylistTracksEncoder songs)
                            |> Task.map (\_ -> playlistData)
                    )
                |> Maybe.map (Task.mapError (\_ -> ""))
                |> Maybe.withDefault (Task.fail link)

        _ ->
            Task.succeed playlistData


config : String -> Config
config token =
    { defaultConfig | headers = [ header "Authorization" <| "Bearer " ++ token, header "Content-Type" "application/json" ] }



-- Ports


port connectS : () -> Cmd msg


port onConnected : (( Maybe String, String ) -> msg) -> Sub msg
