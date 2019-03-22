module TestUtils exposing (asTrack)

import Track exposing (IdentifiedTrack, Track)


asTrack : IdentifiedTrack -> Track
asTrack { id, title, artist, isrc } =
    Track id title artist (Just isrc)
