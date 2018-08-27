port module Spotify exposing
    ( connectS
    , getPlaylistTracksFromLink
    , getPlaylists
    , getUserInfo
    , importPlaylist
    , onConnected
    , searchTrack
    )

import Model exposing (MusicProviderType(..), UserInfo)
import Playlist exposing (Playlist)
import RemoteData exposing (RemoteData(..), WebData)
import Task
import Track exposing (Track)


getUserInfo : String -> (String -> WebData UserInfo -> msg) -> Cmd msg
getUserInfo token tagger =
    UserInfo "1" "Test User"
        |> Task.succeed
        |> RemoteData.asCmd
        |> Cmd.map (tagger token)



searchTrack : String -> (WebData (List Track) -> msg) -> Track -> Cmd msg
searchTrack token tagger ({ id, artist, title } as track) =
    [ Track id title artist ]
        |> Task.succeed
        |> RemoteData.asCmd
        |> Cmd.map tagger


getPlaylists : String -> (WebData (List Playlist) -> msg) -> Cmd msg
getPlaylists _ tagger =
    [ { id = "1", name = "Favorites", tracksCount = 5, songs = NotAsked, link = "http://myplaylist" }
    , { id = "2", name = "Fiesta", tracksCount = 5, songs = NotAsked, link = "http://myplaylist" }
    , { id = "3", name = "Au calme", tracksCount = 5, songs = NotAsked, link = "http://myplaylist" }
    , { id = "4", name = "Chouchou", tracksCount = 5, songs = NotAsked, link = "http://myplaylist" }
    ]
        |> Task.succeed
        |> RemoteData.asCmd
        |> Cmd.map tagger


getPlaylistTracksFromLink : String -> (WebData (List Track) -> msg) -> String -> Cmd msg
getPlaylistTracksFromLink _ tagger _ =
    [ { id = ( "1", Spotify ), artist = "Johnny Halliday", title = "Allmuer le feu" }
    , { id = ( "2", Spotify ), artist = "Serge Gainsbourg", title = "Petit" }
    , { id = ( "3", Spotify ), artist = "The Beatles", title = "Yellow Submarine" }
    , { id = ( "4", Spotify ), artist = "Iron Maiden", title = "666" }
    , { id = ( "5", Spotify ), artist = "Mickael Jackson", title = "Beat it" }
    , { id = ( "6", Spotify ), artist = "RHCP", title = "Californication" }
    , { id = ( "7", Spotify ), artist = "The Clash", title = "London Calling" }
    , { id = ( "8", Spotify ), artist = "The Tiger Lillies", title = "Terrible" }
    ]
        |> Task.succeed
        |> RemoteData.asCmd
        |> Cmd.map tagger


importPlaylist : String -> String -> (WebData Playlist -> msg) -> List Track -> String -> Cmd msg
importPlaylist _ _ tagger songs name =
    Playlist "1" name NotAsked "http://myplaylist" 5
        |> Task.succeed
        |> RemoteData.asCmd
        |> Cmd.map tagger



-- Ports


port connectS : () -> Cmd msg


port onConnected : (( Maybe String, String ) -> msg) -> Sub msg
