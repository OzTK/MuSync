module Track exposing
    ( Track
    , TrackId
    , TrackIdSerializationError
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
    }
