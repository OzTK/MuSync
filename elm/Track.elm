module Track exposing
    ( IdentifiedTrack
    , Track
    , TrackId
    , identified
    , toString
    )


type alias TrackId =
    String


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
    Maybe.map (IdentifiedTrack track.id track.title track.artist) track.isrc


toString : Track -> String
toString track =
    track.artist ++ " - " ++ track.title
