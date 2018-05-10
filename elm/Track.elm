module Track
    exposing
        ( MatchingTracks
        , TrackId
        , Track
        , emptyMatchingTracks
        , matchingTracks
        , updateMatchingTracks
        )

import EveryDict as Dict exposing (EveryDict)
import RemoteData exposing (WebData, RemoteData(Loading))
import Model exposing (MusicProviderType)


type MatchingTracks
    = MatchingTracks (EveryDict MusicProviderType (WebData (List Track)))


type alias TrackId =
    String


type alias Track =
    { id : TrackId
    , title : String
    , artist : String
    , provider : MusicProviderType
    , matchingTracks : MatchingTracks
    }


emptyMatchingTracks : MatchingTracks
emptyMatchingTracks =
    MatchingTracks Dict.empty


matchingTracks : MusicProviderType -> MatchingTracks -> WebData (List Track)
matchingTracks pType (MatchingTracks dict) =
    dict |> Dict.get pType |> Maybe.withDefault RemoteData.NotAsked


updateMatchingTracks : MusicProviderType -> WebData (List Track) -> Track -> Track
updateMatchingTracks pType tracks track =
    let
        (MatchingTracks matchingTracks) =
            track.matchingTracks
    in
        { track | matchingTracks = MatchingTracks <| Dict.insert pType tracks matchingTracks }
