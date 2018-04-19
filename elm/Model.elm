module Model
    exposing
        ( MusicProviderType(..)
        , Track
        , Playlist
        , PlaylistId
        , emptyMatchingTracks
        , updateMatchingTracks
        , loadSongs
        , setSongs
        )

import EveryDict as Dict exposing (EveryDict)
import RemoteData exposing (WebData, RemoteData(NotAsked, Loading, Success))


type MusicProviderType
    = Spotify
    | Deezer
    | Google
    | Amazon


type alias PlaylistId =
    String


type alias Playlist =
    { id : PlaylistId
    , name : String
    , songs : WebData (List Track)
    , tracksCount : Int
    }


loadSongs : Playlist -> Playlist
loadSongs playlist =
    { playlist | songs = Loading }


setSongs : List Track -> Playlist -> Playlist
setSongs songs playlist =
    { playlist | songs = Success songs }


type MatchingTracks
    = MatchingTracks (EveryDict MusicProviderType (WebData (List Track)))


emptyMatchingTracks : MatchingTracks
emptyMatchingTracks =
    MatchingTracks Dict.empty


type alias TrackId =
    String


type alias Track =
    { id : TrackId
    , title : String
    , artist : String
    , provider : MusicProviderType
    , matchingTracks : MatchingTracks
    }


updateMatchingTracks : MusicProviderType -> WebData (List Track) -> Track -> Track
updateMatchingTracks pType tracks track =
    let
        (MatchingTracks matchingTracks) =
            track.matchingTracks
    in
        { track | matchingTracks = MatchingTracks <| Dict.insert pType tracks matchingTracks }
