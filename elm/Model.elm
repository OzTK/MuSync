module Model exposing (Track, Tracks, spotifyTrack, outTrackToSpotifyTrack, deezerTrack, outTrackToDeezerTrack, trackKey)

import Murmur3 exposing (hashString)


type MusicProvider
    = Spotify
    | Deezer
    | Google
    | Amazon


type alias Track =
    { source : MusicProvider, title : String, artist : String }


type alias Tracks =
    List Track


deezerTrack : String -> String -> Track
deezerTrack =
    Track Deezer


outTrackToDeezerTrack : { t | artist : String, title : String } -> Track
outTrackToDeezerTrack { title, artist } =
    Track Deezer title artist


outTrackToSpotifyTrack : { t | artist : String, title : String } -> Track
outTrackToSpotifyTrack { title, artist } =
    Track Spotify title artist


spotifyTrack : String -> String -> Track
spotifyTrack =
    Track Spotify


seed : Int
seed =
    57271586


trackKey : Track -> Int
trackKey track =
    hashString seed (track.title ++ track.artist)
