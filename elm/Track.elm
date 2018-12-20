module Track exposing
    ( IdentifiedTrack
    , Track
    , TrackId
    , TrackIdSerializationError
    , identified
    , toString
    )

import Tuple exposing (pair)


type alias TrackId =
    String


type TrackIdSerializationError
    = InvalidKeyPartsCount
    | InvalidProviderType String


type alias Track =
    { id : TrackId
    , title : String
    , artist : String
    , isrc : Maybe String
    }


type alias IdentifiedTrack =
    { id : TrackId
    , title : String
    , artist : String
    , isrc : String
    }


identified : Track -> Maybe IdentifiedTrack
identified track =
    case track.isrc of
        Just isrc ->
            Just <| IdentifiedTrack track.id track.title track.artist isrc

        Nothing ->
            Nothing


toString : Track -> String
toString track =
    track.artist ++ " - " ++ track.title
