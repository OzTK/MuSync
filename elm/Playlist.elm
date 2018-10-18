module Playlist exposing (Playlist, PlaylistId, loadSongs, setSongs, songIds, summary)

import RemoteData exposing (RemoteData(..), WebData)
import Track exposing (Track, TrackId)


type alias PlaylistId =
    String


type alias Playlist =
    { id : PlaylistId
    , name : String
    , songs : WebData (List Track)
    , link : String
    , tracksCount : Int
    }


summary : Playlist -> String
summary { name, tracksCount } =
    name ++ " (" ++ String.fromInt tracksCount ++ " tracks)"


loadSongs : Playlist -> Playlist
loadSongs playlist =
    { playlist | songs = Loading }


setSongs : WebData (List Track) -> Playlist -> Playlist
setSongs songs playlist =
    { playlist | songs = songs }


songIds : Playlist -> Maybe (List TrackId)
songIds { songs } =
    songs |> RemoteData.map (List.map .id) |> RemoteData.toMaybe
