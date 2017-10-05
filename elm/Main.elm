port module Main exposing (Model, Msg, update, view, subscriptions, init)

import Html exposing (Html, text, div, button, span, ul, li)
import Html.Attributes exposing (disabled)
import Html.Events exposing (onClick)
import RemoteData exposing (RemoteData(..))


-- Ports


port updateDeezerStatus : (Bool -> msg) -> Sub msg


port connectDeezer : () -> Cmd msg


port loadDeezerPlaylists : () -> Cmd msg


port receiveDeezerPlaylists : (Maybe (List DeezerPlaylist) -> msg) -> Sub msg


port loadDeezerPlaylistSongs : Int -> Cmd msg


port receiveDeezerPlaylistSongs : (Maybe (List DeezerSong) -> msg) -> Sub msg


port connectSpotify : () -> Cmd msg


port onSpotifyConnected : (( Maybe String, String ) -> msg) -> Sub msg



-- Model


type alias DeezerSong =
    { title : String, artist : String }


type alias DeezerPlaylist =
    { id : Int, title : String, nb_tracks : Int }


type alias PlaylistsData =
    RemoteData String (List DeezerPlaylist)


type alias SongsData =
    RemoteData String (List DeezerSong)


type DeezerConnectionStatus
    = Disconnected
    | Connecting
    | Connected PlaylistSelection
    | Failed String


type SpotifyConnectionStatus
    = SpotDisconnected
    | SpotConnecting
    | SpotConnected String
    | SpotFailed String


type PlaylistSelection
    = None PlaylistsData
    | Selected (List DeezerPlaylist) DeezerPlaylist SongsData


type alias Model =
    { dzConnectionStatus : DeezerConnectionStatus, spotifyConnectionStatus : SpotifyConnectionStatus }


init : ( Model, Cmd Msg )
init =
    ( { dzConnectionStatus = Disconnected, spotifyConnectionStatus = SpotDisconnected }, Cmd.none )



-- Update


type Msg
    = DeezerStatusUpdate Bool
    | ConnectDeezer
    | ReceiveDeezerPlaylists (Maybe (List DeezerPlaylist))
    | ReceiveDeezerSongs (Maybe (List DeezerSong))
    | RequestDeezerSongs (List DeezerPlaylist) DeezerPlaylist
    | BackToPlaylists
    | ConnectSpotify
    | SpotifyConnected ( Maybe String, String )


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
            { model | dzConnectionStatus = updateSongs model.dzConnectionStatus songs } ! []

        RequestDeezerSongs playlists p ->
            ( { model | dzConnectionStatus = Connected <| Selected playlists p Loading }, loadDeezerPlaylistSongs p.id )

        BackToPlaylists ->
            { model | dzConnectionStatus = backToPlaylists model.dzConnectionStatus } ! []

        ConnectSpotify ->
            ( { model | spotifyConnectionStatus = SpotConnecting }, connectSpotify () )

        SpotifyConnected ( Nothing, token ) ->
            { model | spotifyConnectionStatus = SpotConnected token } ! []

        SpotifyConnected ( Just err, _ ) ->
            { model | spotifyConnectionStatus = SpotFailed err } ! []


backToPlaylists : DeezerConnectionStatus -> DeezerConnectionStatus
backToPlaylists status =
    case status of
        Connected (Selected playlists _ _) ->
            Connected (None <| Success playlists)

        _ ->
            status


updateSongs : DeezerConnectionStatus -> Maybe (List DeezerSong) -> DeezerConnectionStatus
updateSongs status songs =
    case ( status, songs ) of
        ( Connected (Selected playlists p _), Just s ) ->
            Connected (Selected playlists p (Success s))

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


playlists : { m | dzConnectionStatus : DeezerConnectionStatus } -> Html Msg
playlists { dzConnectionStatus } =
    case dzConnectionStatus of
        Connected (None Loading) ->
            div [] [ text "Loading playlists..." ]

        Connected (Selected playlists p Loading) ->
            div [] [ text <| "Loading songs for " ++ p.title ++ "..." ]

        Failed err ->
            text err

        Connected (None (Failure err)) ->
            text err

        Connected (None (Success p)) ->
            div [] [ ul [] <| List.map (playlist p) p ]

        Connected (Selected playlists p (Success songs)) ->
            div []
                [ button [ onClick BackToPlaylists ] [ text "<< back" ]
                , ul [] <| List.map song songs
                ]

        _ ->
            text ""


song : DeezerSong -> Html msg
song s =
    li [] [ text <| s.title ++ " - " ++ s.artist ]


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


spotifyButton : { m | spotifyConnectionStatus : SpotifyConnectionStatus } -> Html Msg
spotifyButton { spotifyConnectionStatus } =
    case spotifyConnectionStatus of
        SpotConnected _ ->
            button [ disabled True ] [ text "Connected to Spotify" ]

        SpotConnecting ->
            button [ disabled True ] [ text "Connecting Spotify..." ]

        SpotDisconnected ->
            button [ onClick ConnectSpotify ] [ text "Connect Spotify" ]

        SpotFailed err ->
            span []
                [ button [ onClick ConnectSpotify ] [ text "Connect Spotify" ]
                , text err
                ]



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
        , onSpotifyConnected SpotifyConnected
        ]
