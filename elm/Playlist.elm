module Playlist exposing (Playlist, PlaylistId, loadSongs, setSongs)

import RemoteData exposing (WebData, RemoteData(Loading, Success))
import Track exposing (Track, TrackId)


type alias PlaylistId =
    String


type alias Playlist =
    { id : PlaylistId
    , name : String
    , songs : WebData (List Track)
    , tracksCount : Int
    , tracksLink : Maybe String
    }


loadSongs : Playlist -> Playlist
loadSongs playlist =
    { playlist | songs = Loading }


setSongs : WebData (List Track) -> Playlist -> Playlist
setSongs songs playlist =
    { playlist | songs = songs }
