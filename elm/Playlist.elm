module Playlist exposing (Playlist, PlaylistId, summary)


type alias PlaylistId =
    String


type alias Playlist =
    { id : PlaylistId
    , name : String
    , link : String
    , tracksCount : Int
    }


summary : Playlist -> String
summary { name } =
    name
