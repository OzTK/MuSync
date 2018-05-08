module Playlist exposing (Playlist, PlaylistId, loadSongs, setSongs, loadSongsMatchingTracks, updateMatchingTracks)

import RemoteData exposing (RemoteData(Loading, Success))
import Track exposing (Track, TrackId)
import Model exposing (MusicData, MusicProviderType)


type alias PlaylistId =
    String


type alias Playlist =
    { id : PlaylistId
    , name : String
    , songs : MusicData (List Track)
    , tracksCount : Int
    , tracksLink : Maybe String
    }


loadSongs : Playlist -> Playlist
loadSongs playlist =
    { playlist | songs = Loading }


setSongs : MusicData (List Track) -> Playlist -> Playlist
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


updateMatchingTracks : MusicProviderType -> TrackId -> List Track -> Playlist -> Playlist
updateMatchingTracks pType songId tracks playlist =
    { playlist
        | songs =
            RemoteData.map
                (List.map
                    (\track ->
                        if track.id == songId then
                            Track.updateMatchingTracks pType (Success tracks) track
                        else
                            track
                    )
                )
                playlist.songs
    }
