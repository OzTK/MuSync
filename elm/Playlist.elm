module Playlist exposing (Playlist, PlaylistId, loadSongs, setSongs, loadSongsMatchingTracks, updateMatchingTracks)

import RemoteData exposing (WebData, RemoteData(Loading, Success))
import Track exposing (Track, TrackId)
import Model exposing (MusicProviderType)


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


loadSongsMatchingTracks : MusicProviderType -> Playlist -> Playlist
loadSongsMatchingTracks provider playlist =
    { playlist
        | songs =
            RemoteData.map
                (List.map (Track.updateMatchingTracks provider Loading))
                playlist.songs
    }


updateMatchingTracks : MusicProviderType -> TrackId -> WebData (List Track) -> Playlist -> Playlist
updateMatchingTracks pType songId tracks playlist =
    { playlist
        | songs =
            RemoteData.map
                (List.map
                    (\track ->
                        if track.id == songId then
                            Track.updateMatchingTracks pType tracks track
                        else
                            track
                    )
                )
                playlist.songs
    }
