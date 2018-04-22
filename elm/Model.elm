module Model
    exposing
        ( MusicProviderType(..)
        , Track
        , Playlist
        , PlaylistId
        , MusicData
        , emptyMatchingTracks
        , updateMatchingTracks
        , loadSongs
        , setSongs
        , musicErrorFromHttp
        , musicErrorFromDecoding
        )

import EveryDict as Dict exposing (EveryDict)
import RemoteData exposing (WebData, RemoteData(NotAsked, Loading, Success))
import Http


type MusicProviderType
    = Spotify
    | Deezer
    | Google
    | Amazon


type alias PlaylistId =
    String


type MusicApiError
    = Http Http.Error
    | DecodingError String


type alias MusicData a =
    RemoteData MusicApiError a


musicErrorFromHttp : Http.Error -> MusicApiError
musicErrorFromHttp =
    Http


musicErrorFromDecoding : String -> MusicApiError
musicErrorFromDecoding =
    DecodingError


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
