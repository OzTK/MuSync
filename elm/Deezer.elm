port module Deezer exposing (api, connectDeezer, disconnectDeezer)

import ApiClient as Api exposing (AnyFullEndpoint, Base, Endpoint)
import Basics.Extra exposing (apply)
import Json.Decode as Decode exposing (Decoder, bool, int, list, map, maybe, string, succeed)
import Json.Decode.Pipeline as Decode exposing (hardcoded, optional, required, requiredAt)
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..), WebData)
import RemoteData.Http exposing (defaultConfig)
import Task exposing (Task)
import Track exposing (IdentifiedTrack, Track)
import Url.Builder as Url
import UserInfo exposing (UserInfo)



-- Decoders


userInfo : Decoder UserInfo
userInfo =
    succeed UserInfo
        |> Decode.required "id" (int |> Decode.map String.fromInt)
        |> Decode.required "name" string


playlist : Decoder Playlist
playlist =
    succeed Playlist
        |> required "id" (map String.fromInt int)
        |> required "title" string
        |> required "link" string
        |> required "nb_tracks" int


createplaylistResponse : String -> Decoder Playlist
createplaylistResponse title =
    succeed Playlist
        |> required "id" (map String.fromInt int)
        |> hardcoded title
        |> hardcoded ""
        |> hardcoded 0


track : Decoder Track
track =
    succeed Track
        |> required "id" (map String.fromInt int)
        |> required "title" string
        |> requiredAt [ "artist", "name" ] string
        |> optional "isrc" (maybe string) Nothing


decodePlaylists : Decoder (List Playlist)
decodePlaylists =
    succeed succeed
        |> Decode.required "data" (list playlist)
        |> Decode.resolve


allTracks : Decoder TrackBatch
allTracks =
    Decode.oneOf
        [ buildingTracks
        , lastTrackBatch
        ]


tracksResult : Decoder (List Track)
tracksResult =
    succeed succeed
        |> Decode.required "data" (list track)
        |> Decode.resolve


singleTrack : Decoder (Maybe Track)
singleTrack =
    Decode.oneOf
        [ track |> Decode.map Just
        , Decode.succeed Nothing
        ]



-- Tracks fetching


type TrackBatch
    = TrackBatch (List Track) AnyFullEndpoint
    | TrackLastBatch (List Track)


type TracksBuilder
    = BuildingTrackList (List Track) AnyFullEndpoint
    | CompleteTrackList (List Track)


concatTracks : TracksBuilder -> TrackBatch -> TracksBuilder
concatTracks builder batch =
    case ( builder, batch ) of
        ( BuildingTrackList prev _, TrackBatch next url ) ->
            BuildingTrackList (prev ++ next) url

        ( BuildingTrackList prev _, TrackLastBatch final ) ->
            CompleteTrackList (prev ++ final)

        ( CompleteTrackList _, _ ) ->
            builder


buildTracks : AnyFullEndpoint -> TracksBuilder
buildTracks =
    BuildingTrackList []


buildingTracks : Decoder TrackBatch
buildingTracks =
    succeed TrackBatch
        |> Decode.required "data" (list track)
        |> Decode.required "next"
            (string
                |> Decode.andThen
                    (String.append corsProxy
                        >> Api.endpointFromLink endpoint
                        >> Maybe.map Decode.succeed
                        >> Maybe.withDefault (Decode.fail "Invalid next url")
                    )
            )


lastTrackBatch : Decoder TrackBatch
lastTrackBatch =
    succeed TrackLastBatch
        |> Decode.required "data" (list track)



-- Values


corsProxy : String
corsProxy =
    -- "https://thingproxy.freeboard.io/fetch/"
    -- "https://cors-anywhere.herokuapp.com/"
    "https://cors-proxy.htmldriven.com/?url="


endpoint : Endpoint Base
endpoint =
    Api.baseEndpoint <| corsProxy ++ "https://api.deezer.com"


withToken : String -> AnyFullEndpoint -> AnyFullEndpoint
withToken token =
    (Api.appendQueryParam (Url.string "access_token" token) >> Api.fullQueryAsAny)
        >> (Api.appendQueryParam (Url.string "output" "json") >> Api.fullQueryAsAny)



-- Http


getUserInfo : String -> Task Never (WebData UserInfo)
getUserInfo token =
    Api.get
        defaultConfig
        (Api.actionEndpoint endpoint [ "user", "me" ] |> Api.fullAsAny |> withToken token)
        userInfo


searchTrackByName : String -> Track -> Task Never (WebData (Maybe Track))
searchTrackByName token t =
    Api.queryEndpoint endpoint
        [ "search", "track" ]
        [ Url.string "q"
            ("artist:\""
                ++ t.artist
                ++ "\" track:\""
                ++ t.title
                ++ "\""
            )
        ]
        |> withToken token
        |> Api.getWithRateLimit defaultConfig
        |> apply (tracksResult |> Decode.map List.head)


searchTrackByISRC : String -> IdentifiedTrack -> Task Never (WebData (Maybe Track))
searchTrackByISRC token { isrc } =
    Api.actionEndpoint endpoint [ "track", "isrc:" ++ isrc ]
        |> Api.fullAsAny
        |> withToken token
        |> Api.getWithRateLimit defaultConfig
        |> apply singleTrack


getPlaylists : String -> Task Never (WebData (List Playlist))
getPlaylists token =
    Api.getWithRateLimit defaultConfig
        (Api.actionEndpoint endpoint [ "user", "me", "playlists" ] |> Api.fullAsAny |> withToken token)
        decodePlaylists


loadTrack : String -> Track -> Task Never (WebData Track)
loadTrack token t =
    Api.getWithRateLimit
        defaultConfig
        (Api.actionEndpoint endpoint [ "track", t.id ] |> Api.fullAsAny |> withToken token)
        track


fetchAllTracks : TracksBuilder -> Task Never (WebData (List Track))
fetchAllTracks builder =
    case builder of
        CompleteTrackList trackList ->
            Task.succeed <| Success trackList

        BuildingTrackList _ url ->
            Api.getWithRateLimit defaultConfig
                url
                allTracks
                |> Api.map (concatTracks builder)
                |> Api.chain fetchAllTracks


getPlaylistTracks : String -> Playlist -> Task Never (WebData (List Track))
getPlaylistTracks token { id } =
    Api.actionEndpoint endpoint [ "playlist", id, "tracks" ]
        |> Api.fullAsAny
        |> withToken token
        |> buildTracks
        |> fetchAllTracks
        |> Api.chain (List.map (loadTrack token) >> Task.sequence >> Task.map RemoteData.fromList)


createPlaylist : String -> String -> String -> Task Never (WebData Playlist)
createPlaylist token user name =
    Api.get
        defaultConfig
        (Api.queryEndpoint endpoint
            [ "user", user, "playlists" ]
            [ Url.string "request_method" "POST", Url.string "title" name ]
            |> withToken token
        )
        (createplaylistResponse name)


addSongsToPlaylistEncoder : List Track -> String
addSongsToPlaylistEncoder tracks =
    tracks
        |> List.map .id
        |> String.join ","


pageSize : Int
pageSize =
    25


addSongsBatchToPlaylist : String -> List Track -> PlaylistId -> Int -> Task Never (WebData ())
addSongsBatchToPlaylist token tracks id skipped =
    if skipped == List.length tracks then
        Task.succeed (Success ())

    else
        let
            next =
                min (skipped + pageSize) (List.length tracks)

            batch =
                tracks |> List.drop skipped |> List.take (next - skipped)
        in
        Api.getWithRateLimit
            defaultConfig
            (Api.queryEndpoint endpoint
                [ "playlist", id, "tracks" ]
                [ Url.string "request_method" "POST", Url.string "songs" (addSongsToPlaylistEncoder batch) ]
                |> withToken token
            )
            bool
            |> Api.chain (\_ -> addSongsBatchToPlaylist token tracks id next)


addSongsToPlaylist : String -> List Track -> Playlist -> Task Never (WebData ())
addSongsToPlaylist token tracks { id } =
    addSongsBatchToPlaylist token tracks id 0
        |> Task.map (RemoteData.map (\_ -> ()))


api =
    { getUserInfo = getUserInfo
    , searchTrackByName = searchTrackByName
    , searchTrackByISRC = searchTrackByISRC
    , getPlaylists = getPlaylists
    , getPlaylistTracks = getPlaylistTracks
    , createPlaylist = createPlaylist
    , addSongsToPlaylist = addSongsToPlaylist
    }


port connectDeezer : () -> Cmd msg


port disconnectDeezer : () -> Cmd msg
