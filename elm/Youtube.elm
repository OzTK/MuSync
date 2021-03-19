port module Youtube exposing (api, connectYoutube)

import ApiClient as Api exposing (AnyFullEndpoint, Base, Endpoint)
import Basics.Extra exposing (apply)
import Http exposing (header)
import Json.Decode as Decode exposing (Decoder, fail, int, list, nullable, string, succeed)
import Json.Decode.Pipeline as Pip
import Json.Encode as JE
import Playlist exposing (Playlist)
import RemoteData exposing (RemoteData(..), WebData)
import RemoteData.Http as Http exposing (Config, defaultConfig)
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


type alias Artist =
    { name : String }


artist : Decoder Artist
artist =
    Decode.succeed Artist |> Pip.required "name" string


toArtistName : List { a | name : String } -> Decoder String
toArtistName artists =
    case artists of
        first :: _ ->
            succeed first.name

        [] ->
            fail "No artists found"


track : Decoder Track
track =
    Decode.succeed Track
        |> Pip.required "id" string
        |> Pip.required "name" string
        |> Pip.custom
            (Decode.succeed toArtistName
                |> Pip.requiredAt [ "artists" ] (list artist)
                |> Pip.resolve
            )
        |> Pip.optionalAt [ "external_ids", "isrc" ] (nullable string) Nothing


trackEntry : Decoder Track
trackEntry =
    Decode.succeed succeed
        |> Pip.requiredAt [ "track" ] track
        |> Pip.resolve


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
        |> Pip.required "items" (list trackEntry)
        |> Pip.resolve


searchResponse : Decoder (List Track)
searchResponse =
    Decode.succeed succeed
        |> Pip.requiredAt [ "tracks", "items" ] (list track)
        |> Pip.resolve


addToPlaylistResponse : Decoder String
addToPlaylistResponse =
    Decode.succeed succeed
        |> Pip.requiredAt [ "snapshot_id" ] string
        |> Pip.resolve



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
        [ Url.string "type" "track"
        , Url.int "limit" 1
        , Url.string "q" query
        ]
        |> Api.getWithRateLimit (config token)
        |> apply searchResponse
        |> Api.map List.head


searchTrackByName : String -> Track -> Task Never (WebData (Maybe Track))
searchTrackByName token t =
    searchTrack token
        ("artist:\""
            ++ t.artist
            ++ "\" track:\""
            ++ t.title
            ++ "\""
        )


searchTrackByISRC : String -> IdentifiedTrack -> Task Never (WebData (Maybe Track))
searchTrackByISRC _ _ =
    Debug.todo "No ISRC search on Youtube"


getPlaylists : String -> Task Never (WebData (List Playlist))
getPlaylists token =
    Api.getWithRateLimit (config token)
        (Api.queryEndpoint (endpoint YT) [ "playlists" ] [ Url.string "part" "snippet,contentDetails", Url.string "mine" "true" ])
        playlistsResponse


playlistsTracksFromLink : String -> Maybe AnyFullEndpoint
playlistsTracksFromLink link =
    link
        |> Api.endpointFromLink (endpoint YT)
        |> Maybe.map (Api.appendPath "tracks")


getPlaylistTracksFromLink : String -> Playlist -> Task Never (WebData (List Track))
getPlaylistTracksFromLink token { link } =
    link
        |> playlistsTracksFromLink
        |> Maybe.map (\l -> Api.getWithRateLimit (config token) l playlistTracks)
        |> Maybe.withDefault (Task.succeed <| Failure (Http.BadUrl link))


createPlaylist : String -> String -> String -> Task.Task Never (WebData Playlist)
createPlaylist token user name =
    Api.post
        (config token)
        (Api.actionEndpoint (endpoint YT) [ "users", user, "playlists" ] |> Api.fullAsAny)
        playlist
        (JE.object [ ( "name", JE.string name ) ])


addPlaylistTracksEncoder : List Track -> JE.Value
addPlaylistTracksEncoder songs =
    JE.object
        [ ( "uris"
          , songs
                |> List.map .id
                |> List.map ((++) "spotify:track:")
                |> JE.list JE.string
          )
        ]


addSongsToPlaylist : String -> List Track -> Playlist -> Task.Task Never (WebData ())
addSongsToPlaylist token songs { link } =
    link
        |> playlistsTracksFromLink
        |> Maybe.map
            (\l ->
                Api.post (config token) l addToPlaylistResponse (addPlaylistTracksEncoder songs)
                    |> Api.map (\_ -> ())
            )
        |> Maybe.withDefault (Task.succeed <| Failure (Http.BadUrl link))


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
