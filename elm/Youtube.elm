port module Youtube exposing (api, connectYoutube)

import ApiClient as Api exposing (AnyFullEndpoint, Base, Endpoint)
import Basics.Extra exposing (apply)
import Http exposing (header)
import Json.Decode as Decode exposing (Decoder, int, list, string, succeed)
import Json.Decode.Pipeline as Pip
import Json.Encode as JE
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..), WebData)
import RemoteData.Http exposing (Config, defaultConfig)
import Task exposing (Task)
import Track exposing (IdentifiedTrack, Track)
import Url.Builder as Url
import UserInfo exposing (UserInfo)



-- Model


userInfo : Decoder UserInfo
userInfo =
    Decode.succeed UserInfo
        |> Pip.required "id" string
        |> Pip.required "name" string


track : Decoder Track
track =
    Decode.succeed Track
        |> Pip.requiredAt [ "contentDetails", "videoId" ] string
        |> Pip.requiredAt [ "snippet", "title" ] string
        |> Pip.hardcoded ""
        |> Pip.hardcoded Nothing


searchedTrack : Decoder Track
searchedTrack =
    Decode.succeed Track
        |> Pip.requiredAt [ "id", "videoId" ] string
        |> Pip.requiredAt [ "snippet", "title" ] string
        |> Pip.hardcoded ""
        |> Pip.hardcoded Nothing


playlist : Decoder Playlist
playlist =
    Decode.succeed Playlist
        |> Pip.required "id" string
        |> Pip.requiredAt [ "snippet", "title" ] string
        |> Pip.hardcoded ""
        |> Pip.requiredAt [ "contentDetails", "itemCount" ] int


playlistsResponse : Decoder (List Playlist)
playlistsResponse =
    Decode.succeed succeed
        |> Pip.required "items" (list playlist)
        |> Pip.resolve


playlistTracks : Decoder (List Track)
playlistTracks =
    Decode.succeed succeed
        |> Pip.required "items" (list track)
        |> Pip.resolve


searchResponse : Decoder (List Track)
searchResponse =
    Decode.succeed succeed
        |> Pip.requiredAt [ "items" ] (list searchedTrack)
        |> Pip.resolve


addToPlaylistResponse : Decoder Track
addToPlaylistResponse =
    Decode.succeed Track
        |> Pip.required "id" string
        |> Pip.requiredAt [ "snippet", "title" ] string
        |> Pip.hardcoded ""
        |> Pip.hardcoded Nothing



-- Values


endpoint : Section -> Endpoint Base
endpoint section =
    Api.baseEndpoint <| Url.crossOrigin ("https://" ++ sectionToPrefix section ++ ".googleapis.com") (sectionToSegment section) []


type Section
    = Auth
    | YT


oauth : List String
oauth =
    [ "oauth2", "v2" ]


yt : List String
yt =
    [ "youtube", "v3" ]


sectionToSegment : Section -> List String
sectionToSegment section =
    case section of
        Auth ->
            oauth

        YT ->
            yt


sectionToPrefix : Section -> String
sectionToPrefix section =
    case section of
        Auth ->
            "www"

        YT ->
            "youtube"



-- Http


getUserInfo : String -> Task Never (WebData UserInfo)
getUserInfo token =
    Api.get (config token) (Api.actionEndpoint (endpoint Auth) [ "userinfo" ] |> Api.fullAsAny) userInfo


searchTrack : String -> String -> Task Never (WebData (Maybe Track))
searchTrack token query =
    Api.queryEndpoint (endpoint YT)
        [ "search" ]
        [ Url.string "type" "video"
        , Url.string "part" "snippet"
        , Url.int "maxResults" 1
        , Url.string "q" query
        ]
        |> Api.getWithRateLimit (config token)
        |> apply searchResponse
        |> Api.map List.head


searchTrackByName : String -> Track -> Task Never (WebData (Maybe Track))
searchTrackByName token t =
    searchTrack token
        (t.title ++ " - " ++ t.artist)


searchTrackByISRC : String -> IdentifiedTrack -> Task Never (WebData (Maybe Track))
searchTrackByISRC _ _ =
    Task.succeed <| RemoteData.Success Nothing


getPlaylists : String -> Task Never (WebData (List Playlist))
getPlaylists token =
    Api.getWithRateLimit (config token)
        (Api.queryEndpoint (endpoint YT) [ "playlists" ] [ Url.string "part" "snippet,contentDetails", Url.string "mine" "true" ])
        playlistsResponse


playlistsTracksFromLinkEndpoint : String -> AnyFullEndpoint
playlistsTracksFromLinkEndpoint id =
    Api.queryEndpoint (endpoint YT)
        [ "playlistItems" ]
        [ Url.string "playlistId" id
        , Url.string "part" "contentDetails,snippet"
        , Url.int "maxResults" 50
        ]


getPlaylistTracksFromLink : String -> Playlist -> Task Never (WebData (List Track))
getPlaylistTracksFromLink token { id } =
    id
        |> playlistsTracksFromLinkEndpoint
        |> (\e -> Api.getWithRateLimit (config token) e playlistTracks)


createPlaylist : String -> String -> String -> Task.Task Never (WebData Playlist)
createPlaylist token _ name =
    Api.post
        (config token)
        (Api.queryEndpoint (endpoint YT) [ "playlists" ] [ Url.string "part" "snippet,contentDetails" ])
        playlist
        (JE.object
            [ ( "snippet"
              , JE.object
                    [ ( "title", JE.string name )
                    ]
              )
            ]
        )


addPlaylistTrackEncoder : PlaylistId -> Track -> JE.Value
addPlaylistTrackEncoder pid song =
    JE.object
        [ ( "snippet"
          , JE.object
                [ ( "playlistId", JE.string pid )
                , ( "resourceId"
                  , JE.object
                        [ ( "kind", JE.string "youtube#video" )
                        , ( "videoId", JE.string song.id )
                        ]
                  )
                ]
          )
        ]


addSongToPlaylist : String -> PlaylistId -> Track -> Task Never (WebData Track)
addSongToPlaylist token playlistId s =
    Api.post
        (config token)
        (Api.queryEndpoint (endpoint YT) [ "playlistItems" ] [ Url.string "part" "snippet" ])
        addToPlaylistResponse
        (addPlaylistTrackEncoder playlistId s)


addSongsToPlaylist : String -> List Track -> Playlist -> Task.Task Never (WebData ())
addSongsToPlaylist token songs { id } =
    songs
        |> List.map (addSongToPlaylist token id)
        |> Task.sequence
        |> Task.map (\r -> RemoteData.fromList r |> RemoteData.map (\_ -> ()))



-- |> Task.succeed


config : String -> Config
config token =
    { defaultConfig | headers = [ header "Authorization" <| "Bearer " ++ token ] }


api =
    { getUserInfo = getUserInfo
    , searchTrackByName = searchTrackByName
    , searchTrackByISRC = searchTrackByISRC
    , getPlaylists = getPlaylists
    , getPlaylistTracks = getPlaylistTracksFromLink
    , createPlaylist = createPlaylist
    , addSongsToPlaylist = addSongsToPlaylist
    }



-- Ports


port connectYoutube : () -> Cmd msg
