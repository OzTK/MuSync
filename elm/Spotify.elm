module Spotify exposing (searchTrack, getPlaylists, getPlaylistTracksFromLink)

import Http exposing (header, encodeUri)
import RemoteData.Http as Http exposing (defaultConfig, Config)
import Json.Decode exposing (Decoder, nullable, string, int, list, succeed, fail)
import Json.Decode.Pipeline as Pip
import RemoteData exposing (WebData, RemoteData(NotAsked))
import Model exposing (Track, Playlist, MusicProviderType(Spotify))


-- Model


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
        |> Pip.required "id" string
        |> Pip.required "name" string
        |> Pip.custom
            (Pip.decode toArtistName
                |> Pip.requiredAt [ "artists" ] (list artist)
                |> Pip.resolve
            )
        |> Pip.hardcoded Spotify
        |> Pip.hardcoded Model.emptyMatchingTracks


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



-- Values


endpoint : String
endpoint =
    "https://api.spotify.com" ++ "/" ++ version ++ "/"


version : String
version =
    "v1"



-- Http


searchTrack : String -> (Track -> WebData (List Track) -> msg) -> Track -> Cmd msg
searchTrack token tagger ({ artist, title } as track) =
    Http.getWithConfig (config token)
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
        (tagger track)
        searchResponse


getPlaylists : String -> (WebData (List Playlist) -> msg) -> Cmd msg
getPlaylists token tagger =
    Http.getWithConfig (config token)
        (endpoint ++ "me/playlists")
        tagger
        playlistsResponse


getPlaylistTracksFromLink : String -> (WebData (List Track) -> msg) -> String -> Cmd msg
getPlaylistTracksFromLink token tagger link =
    Http.getWithConfig (config token) link tagger playlistTracks


config : String -> Config
config token =
    { defaultConfig | headers = [ header "Authorization" <| "Bearer " ++ token ] }
