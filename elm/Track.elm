module Track exposing
    ( IdentifiedTrack
    , Track
    , TrackId
    , asTrack
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


asTrack : IdentifiedTrack -> Track
asTrack { id, title, artist, isrc } =
    Track id title artist (Just isrc)


toString : Track -> String
toString track =
    track.artist ++ " - " ++ track.title
