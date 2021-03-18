module MusicProvider exposing (Api, MusicService(..), fromString, logoPath)

import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (WebData)
import Task exposing (Task)
import Track exposing (IdentifiedTrack, Track)
import UserInfo exposing (UserInfo)


type MusicService
    = Spotify
    | Deezer
    | Google
    | Amazon
    | Youtube


logoPath : MusicService -> String
logoPath provider =
    case provider of
        Deezer ->
            "/assets/img/deezer_logo.png"

        Spotify ->
            "/assets/img/spotify_logo.png"

        Youtube ->
            "/assets/img/youtube_logo.png"

        _ ->
            ""


fromString : String -> Maybe MusicService
fromString pName =
    case pName of
        "Spotify" ->
            Just Spotify

        "Deezer" ->
            Just Deezer

        "Google" ->
            Just Google

        "Amazon" ->
            Just Amazon

        "Youtube" ->
            Just Youtube

        _ ->
            Nothing


type alias Api =
    { getUserInfo : String -> Task Never (WebData UserInfo)
    , searchTrackByName : String -> Track -> Task Never (WebData (Maybe Track))
    , searchTrackByISRC : String -> IdentifiedTrack -> Task Never (WebData (Maybe Track))
    , getPlaylists : String -> Task Never (WebData (List Playlist))
    , getPlaylistTracks : String -> PlaylistId -> Task Never (WebData (List Track))
    , createPlaylist : String -> String -> String -> Task Never (WebData Playlist)
    , addSongsToPlaylist : String -> List Track -> PlaylistId -> Task Never (WebData ())
    }
