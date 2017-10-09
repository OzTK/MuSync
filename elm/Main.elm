port module Main exposing (Model, Msg, update, view, subscriptions, init)

import Html exposing (Html, text, div, button, span, ul, li)
import Html.Attributes exposing (disabled, style)
import Html.Events exposing (onClick)
import Dict exposing (Dict)
import RemoteData exposing (RemoteData(..), WebData)
import Model exposing (Track, Tracks)
import Spotify


-- Ports


port updateDeezerStatus : (Bool -> msg) -> Sub msg


port connectDeezer : () -> Cmd msg


port loadDeezerPlaylists : () -> Cmd msg


port receiveDeezerPlaylists : (Maybe (List DeezerPlaylist) -> msg) -> Sub msg


port loadDeezerPlaylistSongs : Int -> Cmd msg


port receiveDeezerPlaylistSongs : (Maybe (List { title : String, artist : String }) -> msg) -> Sub msg


port connectSpotify : () -> Cmd msg


port onSpotifyConnected : (( Maybe String, String ) -> msg) -> Sub msg



-- Model


type alias DeezerPlaylist =
    { id : Int, title : String, nb_tracks : Int }


type alias PlaylistsData =
    RemoteData String (List DeezerPlaylist)


type alias SongsData =
    RemoteData String Tracks


type DeezerConnectionStatus
    = Disconnected
    | Connecting
    | Connected PlaylistSelection
    | Failed String


type SpotifyStatus
    = SpotDisconnected
    | SpotConnecting
    | SpotConnected String (Dict Int (WebData Tracks))
    | SpotFailed String


type PlaylistSelection
    = None PlaylistsData
    | Selected (List DeezerPlaylist) DeezerPlaylist SongsData


type alias Model =
    { dzConnectionStatus : DeezerConnectionStatus, spotifyStatus : SpotifyStatus }


init : ( Model, Cmd Msg )
init =
    ( { dzConnectionStatus = Disconnected, spotifyStatus = SpotDisconnected }, Cmd.none )



-- Update


type Msg
    = DeezerStatusUpdate Bool
    | ConnectDeezer
    | ReceiveDeezerPlaylists (Maybe (List DeezerPlaylist))
    | ReceiveDeezerSongs (Maybe (List { title : String, artist : String }))
    | RequestDeezerSongs (List DeezerPlaylist) DeezerPlaylist
    | BackToPlaylists
    | ConnectSpotify
    | SpotifyConnectionStatusUpdate ( Maybe String, String )
    | SearchInSpotify Track
    | SpotifySearchResult Track (WebData Tracks)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        DeezerStatusUpdate isConnected ->
            if isConnected then
                ( { model | dzConnectionStatus = Connected <| None Loading }, loadDeezerPlaylists () )
            else
                { model | dzConnectionStatus = Failed "Failed to connect to Deezer" } ! []

        ConnectDeezer ->
            ( { model | dzConnectionStatus = Connecting }, connectDeezer () )

        ReceiveDeezerPlaylists (Just p) ->
            { model | dzConnectionStatus = Connected <| None (Success p) } ! []

        ReceiveDeezerPlaylists Nothing ->
            { model | dzConnectionStatus = Connected <| None (Failure "Failed to load playlists") } ! []

        ReceiveDeezerSongs songs ->
            let
                updatedModel =
                    { model | dzConnectionStatus = updateDzTracks model.dzConnectionStatus songs }
            in
                { updatedModel | spotifyStatus = linkSpotifyToDeezer updatedModel Nothing } ! []

        RequestDeezerSongs playlists p ->
            ( { model | dzConnectionStatus = Connected <| Selected playlists p Loading }, loadDeezerPlaylistSongs p.id )

        BackToPlaylists ->
            { model | dzConnectionStatus = backToPlaylists model.dzConnectionStatus, spotifyStatus = resetTrackSearch model } ! []

        ConnectSpotify ->
            ( { model | spotifyStatus = SpotConnecting }, connectSpotify () )

        SpotifyConnectionStatusUpdate ( Nothing, token ) ->
            { model | spotifyStatus = linkSpotifyToDeezer model (Just token) } ! []

        SpotifyConnectionStatusUpdate ( Just err, _ ) ->
            { model | spotifyStatus = SpotFailed err } ! []

        SearchInSpotify track ->
            let
                ( status, token ) =
                    requestSpotifySong model track
            in
                ( { model | spotifyStatus = status }
                , token
                    |> Maybe.map (\t -> Spotify.searchTrack t SpotifySearchResult track)
                    |> Maybe.withDefault Cmd.none
                )

        SpotifySearchResult track tracksData ->
            { model | spotifyStatus = collectSpotifyResults model track tracksData } ! []


linkSpotifyToDeezer : { a | dzConnectionStatus : DeezerConnectionStatus, spotifyStatus : SpotifyStatus } -> Maybe String -> SpotifyStatus
linkSpotifyToDeezer { dzConnectionStatus, spotifyStatus } token =
    case ( dzConnectionStatus, spotifyStatus, token ) of
        ( Connected (Selected _ _ (Success songs)), SpotConnecting, Just t ) ->
            SpotConnected t <| Dict.fromList (List.map (\t -> ( Model.trackKey t, NotAsked )) songs)

        ( Connected (Selected _ _ (Success songs)), SpotConnected t _, _ ) ->
            SpotConnected t <| Dict.fromList (List.map (\t -> ( Model.trackKey t, NotAsked )) songs)

        ( _, SpotConnecting, Just t ) ->
            SpotConnected t Dict.empty

        ( _, s, _ ) ->
            s


resetTrackSearch : { m | spotifyStatus : SpotifyStatus } -> SpotifyStatus
resetTrackSearch model =
    case model.spotifyStatus of
        SpotConnected token tracks ->
            SpotConnected token <| Dict.map (\t res -> NotAsked) tracks

        s ->
            s


collectSpotifyResults : { m | spotifyStatus : SpotifyStatus } -> Track -> WebData Tracks -> SpotifyStatus
collectSpotifyResults model track tracksData =
    case model.spotifyStatus of
        SpotConnected token tracks ->
            SpotConnected token <| Dict.update (Model.trackKey track) (\_ -> Just tracksData) tracks

        s ->
            s


requestSpotifySong : { m | spotifyStatus : SpotifyStatus } -> Track -> ( SpotifyStatus, Maybe String )
requestSpotifySong model track =
    case model.spotifyStatus of
        SpotConnected token tracks ->
            ( SpotConnected token <| Dict.update (Model.trackKey track) (\_ -> Just Loading) tracks, Just token )

        _ ->
            ( model.spotifyStatus, Nothing )


backToPlaylists : DeezerConnectionStatus -> DeezerConnectionStatus
backToPlaylists status =
    case status of
        Connected (Selected playlists _ _) ->
            Connected (None <| Success playlists)

        _ ->
            status


updateDzTracks : DeezerConnectionStatus -> Maybe (List { title : String, artist : String }) -> DeezerConnectionStatus
updateDzTracks status songs =
    case ( status, songs ) of
        ( Connected (Selected playlists p _), Just s ) ->
            Connected (Selected playlists p (Success <| List.map Model.outTrackToDeezerTrack s))

        ( Connected (Selected playlists p _), Nothing ) ->
            Connected (Selected playlists p (Failure "Failed to load the songs"))

        _ ->
            status



-- View


view : Model -> Html Msg
view model =
    div []
        ([ deezerButton model
         , spotifyButton model
         , button [ disabled True ] [ text "Connect Amazon Music" ]
         , button [ disabled True ] [ text "Connect Google Music" ]
         , playlists model
         ]
        )



-- Deezer


playlists : { m | dzConnectionStatus : DeezerConnectionStatus, spotifyStatus : SpotifyStatus } -> Html Msg
playlists ({ dzConnectionStatus, spotifyStatus } as model) =
    case ( dzConnectionStatus, spotifyStatus ) of
        ( Connected (None Loading), _ ) ->
            div [] [ text "Loading playlists..." ]

        ( Connected (Selected playlists p Loading), _ ) ->
            div [] [ text <| "Loading songs for " ++ p.title ++ "..." ]

        ( Failed err, _ ) ->
            text err

        ( Connected (None (Failure err)), _ ) ->
            text err

        ( Connected (None (Success p)), _ ) ->
            div [] [ ul [] <| List.map (playlist p) p ]

        ( Connected (Selected _ _ (Success songs)), SpotConnected _ tracks ) ->
            div []
                [ button [ onClick BackToPlaylists ] [ text "<< back" ]
                , songs
                    |> List.map (\t -> ( Dict.get (Model.trackKey t) tracks, t ))
                    |> List.map (uncurry song)
                    |> ul []
                ]

        ( Connected (Selected playlists p (Success songs)), _ ) ->
            div []
                [ button [ onClick BackToPlaylists ] [ text "<< back" ]
                , ul [] <| List.map (song Nothing) songs
                ]

        _ ->
            text ""


song : Maybe (WebData Tracks) -> Track -> Html Msg
song results s =
    case results of
        Just NotAsked ->
            li []
                [ text <| s.title ++ " - " ++ s.artist
                , button [ onClick <| SearchInSpotify s ] [ text "find!" ]
                ]

        Just (Failure err) ->
            li []
                [ text <| s.title ++ " - " ++ s.artist
                , button [ onClick <| SearchInSpotify s ] [ text "find again" ]
                , span [ style [ ( "color", "red" ) ] ] [ text <| toString err ]
                ]

        Just (Success []) ->
            li []
                [ text <| s.title ++ " - " ++ s.artist
                , span [ style [ ( "color", "red" ) ] ] [ text "No track found" ]
                ]

        Just (Success (track1 :: rest)) ->
            li []
                [ text <| s.title ++ " - " ++ s.artist
                , span [ style [ ( "color", "green" ) ] ] [ text "found!" ]
                ]

        Just Loading ->
            li []
                [ text <| s.title ++ " - " ++ s.artist
                , button [ disabled True ] [ text "searching..." ]
                ]

        Nothing ->
            li []
                [ text <| s.title ++ " - " ++ s.artist ]


playlist : List DeezerPlaylist -> DeezerPlaylist -> Html Msg
playlist playlists p =
    li [ onClick <| RequestDeezerSongs playlists p ] [ text <| p.title ++ " (" ++ toString p.nb_tracks ++ ")" ]


deezerButton : { m | dzConnectionStatus : DeezerConnectionStatus } -> Html Msg
deezerButton { dzConnectionStatus } =
    case dzConnectionStatus of
        Connected _ ->
            button [ disabled True ] [ text "Connected to Deezer" ]

        Connecting ->
            button [ disabled True ] [ text "Connecting Deezer..." ]

        Disconnected ->
            button [ onClick ConnectDeezer ] [ text "Connect Deezer" ]

        Failed err ->
            span []
                [ button [ onClick ConnectDeezer ] [ text "Connect Deezer" ]
                , text err
                ]



-- Spotify


spotifyButton : { m | spotifyStatus : SpotifyStatus } -> Html Msg
spotifyButton { spotifyStatus } =
    case spotifyStatus of
        SpotConnecting ->
            button [ disabled True ] [ text "Connecting Spotify..." ]

        SpotDisconnected ->
            button [ onClick ConnectSpotify ] [ text "Connect Spotify" ]

        SpotFailed err ->
            span []
                [ button [ onClick ConnectSpotify ] [ text "Connect Spotify" ]
                , text err
                ]

        _ ->
            button [ disabled True ] [ text "Connected to Spotify" ]



-- Program


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ updateDeezerStatus DeezerStatusUpdate
        , receiveDeezerPlaylists ReceiveDeezerPlaylists
        , receiveDeezerPlaylistSongs ReceiveDeezerSongs
        , onSpotifyConnected SpotifyConnectionStatusUpdate
        ]
