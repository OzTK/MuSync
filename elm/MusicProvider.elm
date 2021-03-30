module MusicProvider exposing (Api, MusicService(..), api, fromString, logoPath)

import Deezer
import Playlist exposing (Playlist)
import RemoteData exposing (WebData)
import Spotify
import Task exposing (Task)
import Track exposing (IdentifiedTrack, Track)
import UserInfo exposing (UserInfo)
import Youtube


type MusicService
    = Spotify
    | Deezer
    | Youtube


logoPath : MusicService -> String
logoPath provider =
    case provider of
        Deezer ->
            "assets/img/deezer_logo.png"

        Spotify ->
            "assets/img/spotify_logo.png"

        Youtube ->
            "assets/img/youtube_logo.png"


fromString : String -> Maybe MusicService
fromString pName =
    case pName of
        "Spotify" ->
            Just Spotify

        "Deezer" ->
            Just Deezer

        "Youtube" ->
            Just Youtube

        _ ->
            Nothing


type alias Api =
    { getUserInfo : String -> Task Never (WebData UserInfo)
    , searchTrackByName : String -> Track -> Task Never (WebData (Maybe Track))
    , searchTrackByISRC : String -> IdentifiedTrack -> Task Never (WebData (Maybe Track))
    , getPlaylists : String -> Task Never (WebData (List Playlist))
    , getPlaylistTracks : String -> Playlist -> Task Never (WebData (List Track))
    , createPlaylist : String -> String -> String -> Task Never (WebData Playlist)
    , addSongsToPlaylist : String -> List Track -> Playlist -> Task Never (WebData ())
    }


api : MusicService -> Api
api provider =
    case provider of
        Spotify ->
            Spotify.api

        Deezer ->
            Deezer.api

        Youtube ->
            Youtube.api
