module Model
    exposing
        ( MusicProvider(..)
        , MusicProviderType(..)
        , ProviderInfo
        , Track
        , Playlist
        , trackKey
        , deezer
        , spotify
        , allProviders
        )

import Murmur3 exposing (hashString)
import RemoteData exposing (WebData, RemoteData(NotAsked))


type MusicProviderType
    = Spotify
    | Deezer
    | Google
    | Amazon


type MusicProvider
    = MusicProvider MusicProviderType ProviderInfo


type alias ProviderName =
    String


type alias ProviderInfo =
    { name : ProviderName
    , status : RemoteData String ()
    }



-- Providers


deezer : MusicProvider
deezer =
    MusicProvider Deezer { name = "Deezer", status = NotAsked }


spotify : MusicProvider
spotify =
    MusicProvider Spotify { name = "Spotify", status = NotAsked }


allProviders : List MusicProvider
allProviders =
    [ deezer, spotify ]


type alias PlaylistId =
    String


type alias Playlist =
    { id : PlaylistId
    , name : String
    , songs : WebData (List Track)
    , tracksCount : Int
    }


type alias Track =
    { title : String
    , artist : String
    }


seed : Int
seed =
    57271586


trackKey : Track -> Int
trackKey track =
    hashString seed (track.title ++ track.artist)
