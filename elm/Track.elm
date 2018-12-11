module Track exposing
    ( Track
    , TrackId
    , TrackIdSerializationError
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


toString : Track -> String
toString track =
    track.artist ++ " - " ++ track.title
