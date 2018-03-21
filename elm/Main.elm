port module Main exposing (Model, Msg, update, view, subscriptions, init)

import Html exposing (Html, text, div, button, span, ul, li)
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
        , ProviderInfo
        , deezer
        , spotify
        , allProviders
        )
import SelectableList exposing (SelectableList)
import Provider
    exposing
        ( OAuthToken
        , WithProviderSelection
        , ProviderConnection(..)
        , ConnectedProvider(..)
        )
import Spotify
import Deezer


-- Ports


port updateDeezerStatus : (Bool -> msg) -> Sub msg


port connectDeezer : () -> Cmd msg


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
    = ConnectDeezer
    | ConnectSpotify
    | ConnectAmazon
    | ConnectPlay
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
                canSelect =
                    not (Provider.isSelected model.playlists)

                connection =
                    if isConnected then
                        Provider.connected Deezer
                    else
                        Provider.disconnected Deezer
            in
                { model
                    | availableProviders =
                        Provider.flatMap
                            (\con pType ->
                                if pType == Deezer then
                                    connection
                                else
                                    con
                            )
                            model.availableProviders
                    , playlists =
                        if canSelect && isConnected then
                            Provider.select connection
                        else
                            model.playlists
                }
                    ! if isConnected && canSelect then
                        [ loadDeezerPlaylists () ]
                      else
                        []

        ConnectDeezer ->
            { model
                | availableProviders =
                    Provider.flatMap
                        (\con pType ->
                            if pType == Deezer then
                                Provider.connecting pType
                            else
                                con
                        )
                        model.availableProviders
            }
                ! [ connectDeezer () ]

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

        ReceiveDeezerSongs songs ->
            model ! []

        RequestDeezerSongs id ->
            model ! [ loadDeezerPlaylistSongs id ]

        PlaylistSelected p ->
            { model | playlists = Provider.flatMapData (SelectableList.select p) model.playlists } ! []

        BackToPlaylists ->
            { model | playlists = model.playlists |> Provider.flatMapData SelectableList.clear } ! []

        ConnectSpotify ->
            model ! [ connectSpotify () ]

        ConnectAmazon ->
            model ! []

        ConnectPlay ->
            model ! []

        SpotifyConnectionStatusUpdate ( Nothing, token ) ->
            let
                canSelect =
                    not (Provider.isSelected model.playlists)

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
                        if canSelect then
                            Provider.select connection
                        else
                            model.playlists
                }
                    ! [ Spotify.getPlaylists token ReceivePlaylists ]

        SpotifyConnectionStatusUpdate ( Just err, _ ) ->
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

        SpotifySearchResult track tracksData ->
            model ! []

        ReceivePlaylists playlistsData ->
            let
                data =
                    playlistsData
                        |> RemoteData.mapError Provider.providerHttpError
                        |> RemoteData.map SelectableList.fromList
            in
                { model | playlists = Provider.setData model.playlists data } ! []


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


providerConnector : ProviderConnection MusicProviderType -> Msg
providerConnector connection =
    case Provider.provider connection of
        Deezer ->
            ConnectDeezer

        Spotify ->
            ConnectSpotify

        Amazon ->
            ConnectAmazon

        Google ->
            ConnectPlay



-- View


view : Model -> Html Msg
view model =
    div []
        (List.map (\p -> p |> providerConnector |> connectButton p) model.availableProviders ++ [ playlists model ])


playlists :
    { m
        | playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
        , comparedProvider : WithProviderSelection MusicProviderType ()
    }
    -> Html Msg
playlists ({ playlists, comparedProvider } as model) =
    case ( playlists, comparedProvider ) of
        ( Provider.SelectedConnecting _, _ ) ->
            div [] [ text "Loading playlists..." ]

        ( Provider.SelectedConnected provider (Success p), _ ) ->
            p
                |> SelectableList.selected
                |> Maybe.map .songs
                |> Maybe.andThen RemoteData.toMaybe
                |> Maybe.map songs
                |> Maybe.withDefault
                    (div []
                        [ ul [] <| SelectableList.toList <| SelectableList.map (playlist PlaylistSelected) p ]
                    )

        ( Provider.SelectedConnected provider (Failure err), _ ) ->
            err |> toString |> text

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


playlist : (Playlist -> Msg) -> Playlist -> Html Msg
playlist tagger p =
    li [ onClick <| tagger p ]
        [ text <| p.name ++ " (" ++ toString p.tracksCount ++ ")" ]


provider : MusicProviderType -> String
provider pType =
    case pType of
        Spotify ->
            "Spotify"

        Deezer ->
            "Deezer"

        Amazon ->
            "Amazon Prime"

        Google ->
            "Play"


connectButton : ProviderConnection MusicProviderType -> Msg -> Html Msg
connectButton connection tagger =
    case connection of
        Provider.Connected con ->
            button [ disabled True ] [ text (connection |> Provider.provider |> provider |> (++) "Connected to ") ]

        Provider.Connecting con ->
            button [ disabled True ] [ text <| (connection |> Provider.provider |> provider |> (++) "Connecting ") ++ "..." ]

        Provider.Inactive con ->
            button [] [ text (connection |> Provider.provider |> provider) ]

        Provider.Disconnected _ ->
            button [ onClick tagger ] [ text (connection |> Provider.provider |> provider |> (++) "Connect ") ]



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
