port module Main exposing (Model, Msg, update, view, subscriptions, init, main)

import Html exposing (Html, text, div, button, span, ul, li, p)
import Html.Attributes exposing (disabled, style)
import Html.Events exposing (onClick)
import Json.Decode as JD
import RemoteData exposing (RemoteData(..), WebData)
import Model
    exposing
        ( Track
        , Playlist
        , MusicProvider(..)
        , MusicProviderType(..)
        )
import SelectableList exposing (SelectableList)
import Provider
    exposing
        ( WithProviderSelection
        , ProviderConnection(..)
        , ConnectedProvider(..)
        , DisconnectedProvider(..)
        )
import Spotify
import Deezer


-- Ports


port updateDeezerStatus : (Bool -> msg) -> Sub msg


port connectDeezer : () -> Cmd msg


port disconnectDeezer : () -> Cmd msg


port loadDeezerPlaylists : () -> Cmd msg


port receiveDeezerPlaylists : (Maybe JD.Value -> msg) -> Sub msg


port loadDeezerPlaylistSongs : Int -> Cmd msg


port receiveDeezerPlaylistSongs : (Maybe (List Track) -> msg) -> Sub msg


port connectSpotify : () -> Cmd msg


port onSpotifyConnected : (( Maybe String, String ) -> msg) -> Sub msg



-- Model


type alias Model =
    { playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
    , comparedProvider : WithProviderSelection MusicProviderType ()
    , availableProviders : List (ProviderConnection MusicProviderType)
    }


init : ( Model, Cmd Msg )
init =
    ( { playlists = Provider.noSelection
      , comparedProvider = Provider.noSelection
      , availableProviders =
            [ Provider.disconnected Spotify
            , Provider.disconnected Deezer
            ]
      }
    , Cmd.none
    )



-- Update


type Msg
    = ToggleConnect MusicProviderType
    | DeezerStatusUpdate Bool
    | ReceiveDeezerPlaylists (Maybe JD.Value)
    | ReceivePlaylists (WebData (List Playlist))
    | ReceiveDeezerSongs (Maybe (List Track))
    | RequestDeezerSongs Int
    | PlaylistSelected Playlist
    | BackToPlaylists
    | SpotifyConnectionStatusUpdate ( Maybe String, String )
    | SearchInSpotify Track
    | SpotifySearchResult Track (WebData (List Track))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        DeezerStatusUpdate isConnected ->
            let
                connection =
                    if isConnected then
                        Provider.connected Deezer
                    else
                        Provider.disconnected Deezer
            in
                { model
                    | availableProviders = Provider.flatMapOn Deezer (\_ -> connection) model.availableProviders
                    , playlists =
                        if canSelect Deezer model.playlists && isConnected then
                            Provider.select connection
                        else
                            model.playlists
                }
                    ! if isConnected && canSelect Deezer model.playlists then
                        [ loadDeezerPlaylists () ]
                      else
                        []

        ToggleConnect pType ->
            let
                wasConnected =
                    model.availableProviders
                        |> Provider.filter (Just pType) Provider.isConnected
                        |> List.isEmpty
                        |> not
            in
                { model
                    | availableProviders =
                        Provider.flatMapOn pType
                            (\con ->
                                if not (Provider.isConnected con) then
                                    Provider.connecting pType
                                else
                                    Provider.disconnected pType
                            )
                            model.availableProviders
                    , playlists =
                        if wasConnected then
                            Provider.disconnectSelection model.playlists
                        else
                            model.playlists
                }
                    ! [ providerToggleConnectionCmd wasConnected pType ]

        ReceiveDeezerPlaylists (Just pJson) ->
            { model
                | playlists =
                    pJson
                        |> JD.decodeValue (JD.list Deezer.playlist)
                        |> Result.map SelectableList.fromList
                        |> Result.mapError Provider.decodingError
                        |> RemoteData.fromResult
                        |> Provider.setData model.playlists
            }
                ! []

        ReceiveDeezerPlaylists Nothing ->
            { model
                | playlists =
                    "No Playlists received"
                        |> Provider.providerError
                        |> RemoteData.Failure
                        |> Provider.setData model.playlists
            }
                ! []

        ReceiveDeezerSongs _ ->
            model ! []

        RequestDeezerSongs id ->
            model ! [ loadDeezerPlaylistSongs id ]

        PlaylistSelected p ->
            { model | playlists = Provider.flatMapData (SelectableList.select p) model.playlists } ! []

        BackToPlaylists ->
            { model | playlists = model.playlists |> Provider.flatMapData SelectableList.clear } ! []

        SpotifyConnectionStatusUpdate ( Nothing, token ) ->
            let
                connection =
                    Provider.connectedWithToken Spotify token
            in
                { model
                    | availableProviders =
                        Provider.flatMap
                            (\con pType ->
                                if pType == Spotify then
                                    connection
                                else
                                    con
                            )
                            model.availableProviders
                    , playlists =
                        if canSelect Spotify model.playlists then
                            Provider.select connection
                        else
                            model.playlists
                }
                    ! if canSelect Spotify model.playlists then
                        [ Spotify.getPlaylists token ReceivePlaylists ]
                      else
                        []

        SpotifyConnectionStatusUpdate ( Just _, _ ) ->
            { model
                | availableProviders =
                    Provider.flatMap
                        (\con pType ->
                            if pType == Spotify then
                                Provider.disconnected pType
                            else
                                con
                        )
                        model.availableProviders
            }
                ! []

        SearchInSpotify track ->
            model ! [ searchMatchingSong track model ]

        SpotifySearchResult _ _ ->
            model ! []

        ReceivePlaylists playlistsData ->
            let
                data =
                    playlistsData
                        |> RemoteData.mapError Provider.providerHttpError
                        |> RemoteData.map SelectableList.fromList
            in
                { model | playlists = Provider.setData model.playlists data } ! []


canSelect : providerType -> WithProviderSelection providerType data -> Bool
canSelect pType selection =
    selection
        |> Provider.selectionProvider
        |> Maybe.map ((==) pType)
        |> Maybe.withDefault True


searchMatchingSong : Track -> { m | comparedProvider : WithProviderSelection MusicProviderType data } -> Cmd Msg
searchMatchingSong track { comparedProvider } =
    comparedProvider
        |> Provider.getConnectedProvider
        |> Maybe.map (searchSongFromProvider track)
        |> Maybe.withDefault Cmd.none


searchSongFromProvider : Track -> ConnectedProvider MusicProviderType -> Cmd Msg
searchSongFromProvider track provider =
    case provider of
        ConnectedProviderWithToken Spotify token ->
            Spotify.searchTrack token SpotifySearchResult track

        _ ->
            Cmd.none


providerToggleConnectionCmd : Bool -> MusicProviderType -> Cmd msg
providerToggleConnectionCmd isCurrentlyConnected pType =
    case pType of
        Deezer ->
            if isCurrentlyConnected then
                disconnectDeezer ()
            else
                connectDeezer ()

        Spotify ->
            if isCurrentlyConnected then
                Cmd.none
            else
                connectSpotify ()

        _ ->
            Cmd.none



-- View


view : Model -> Html Msg
view model =
    div []
        (List.map (connectButton ToggleConnect) model.availableProviders
            ++ [ playlists model ]
        )


playlists :
    { m
        | playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
        , comparedProvider : WithProviderSelection MusicProviderType ()
    }
    -> Html Msg
playlists { playlists, comparedProvider } =
    case ( playlists, comparedProvider ) of
        ( Provider.SelectedConnecting _, _ ) ->
            div [] [ text "Loading playlists..." ]

        ( Provider.SelectedConnected _ (Success p), _ ) ->
            p
                |> SelectableList.selected
                |> Maybe.map .songs
                |> Maybe.andThen RemoteData.toMaybe
                |> Maybe.map songs
                |> Maybe.withDefault
                    (div []
                        [ ul [] <| SelectableList.toList <| SelectableList.map (playlist PlaylistSelected) p ]
                    )

        ( Provider.SelectedConnected _ (Failure err), _ ) ->
            err |> toString |> text

        ( Provider.SelectedDisconnected (Provider.DisconnectedProvider pType), _ ) ->
            p [] [ text <| "Please connect " ++ providerName pType ++ " to load your playlists" ]

        _ ->
            text ""


songs : List Track -> Html Msg
songs songs =
    div []
        [ button [ onClick BackToPlaylists ] [ text "<< back" ]
        , ul [] <| List.map (song Nothing) songs
        ]


song : Maybe (WebData (List Track)) -> Track -> Html Msg
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

        Just (Success (_ :: _)) ->
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


playlist : (Playlist -> Msg) -> Playlist -> Html Msg
playlist tagger p =
    li [ onClick <| tagger p ]
        [ text <| p.name ++ " (" ++ toString p.tracksCount ++ ")" ]


providerName : MusicProviderType -> String
providerName pType =
    case pType of
        Spotify ->
            "Spotify"

        Deezer ->
            "Deezer"

        Amazon ->
            "Amazon Prime"

        Google ->
            "Play"


connectButton : (MusicProviderType -> Msg) -> ProviderConnection MusicProviderType -> Html Msg
connectButton tagger connection =
    let
        connected =
            Provider.isConnected connection

        connecting =
            Provider.isConnecting connection

        disco =
            Provider.isDisconnected connection
    in
        button
            [ onClick <| tagger (Provider.provider connection), disabled connecting ]
            [ text <|
                (if connected then
                    "Disconnect "
                 else if connecting then
                    "Connecting "
                 else
                    "Connect "
                )
                    ++ (connection |> Provider.provider |> providerName)
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
subscriptions _ =
    Sub.batch
        [ updateDeezerStatus DeezerStatusUpdate
        , receiveDeezerPlaylists ReceiveDeezerPlaylists
        , receiveDeezerPlaylistSongs ReceiveDeezerSongs
        , onSpotifyConnected SpotifyConnectionStatusUpdate
        ]
