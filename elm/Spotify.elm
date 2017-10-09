module Spotify exposing (searchTrack)

import Http as H exposing (header, encodeUri)
import RemoteData.Http as Http exposing (defaultConfig, Config)
import Json.Decode as JD exposing (Decoder, string, at, list, succeed, fail)
import Json.Decode.Pipeline as Pip
import RemoteData exposing (WebData)
import Model exposing (Track, Tracks)


-- Model


type alias Artist =
    { name : String }


type alias SpotifySearchResponse =
    { tracks : List Track }


artist : Decoder Artist
artist =
    Pip.decode Artist |> Pip.required "name" string


toArtistName : List { a | name : String } -> Decoder String
toArtistName artists =
    case artists of
        first :: others ->
            succeed first.name

        [] ->
            fail "No artists found"


track : Decoder Track
track =
    Pip.decode Model.spotifyTrack
        |> Pip.required "name" string
        |> Pip.custom
            (Pip.decode toArtistName
                |> Pip.requiredAt [ "artists" ] (list artist)
                |> Pip.resolve
            )


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


searchTrack : String -> (Track -> WebData Tracks -> msg) -> Track -> Cmd msg
searchTrack token tagger ({ artist, title } as track) =
    Http.getWithConfig (config token)
        (endpoint
            ++ "search?type=track&limit=1&q="
            ++ (encodeUri
                    ("artist:\""
                        ++ artist
                        ++ "\" track:\""
                        ++ title
                        ++ "\""
                    )
               )
        )
        (tagger track)
        searchResponse


config : String -> Config
config token =
    { defaultConfig | headers = [ header "Authorization" <| "Bearer " ++ token ] }
