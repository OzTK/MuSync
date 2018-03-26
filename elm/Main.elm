port module Main exposing (Model, Msg, update, view, subscriptions, init, main)

import List.Extra as List
import Html exposing (Html, text, div, button, span, ul, li, p, select, option, label)
import Html.Attributes exposing (disabled, style, for, name, value)
import Html.Events exposing (onClick)
import Html.Events.Extra exposing (onChangeTo)
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
    | PlaylistsProviderChanged (ProviderConnection MusicProviderType)
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
                    | availableProviders = Provider.mapOn Deezer (\_ -> connection) model.availableProviders
                    , playlists = Provider.select connection
                }
                    ! [ loadPlaylists connection ]

        ToggleConnect pType ->
            let
                connection =
                    model.availableProviders |> Provider.find pType

                wasConnected =
                    connection |> Maybe.map Provider.isConnected |> Maybe.withDefault False

                availableProviders_ =
                    Provider.mapOn pType
                        (\con ->
                            if not (Provider.isConnected con) then
                                Provider.connecting pType
                            else
                                Provider.disconnected pType
                        )
                        model.availableProviders

                nextProvider =
                    availableProviders_ |> Provider.connectedProviders |> List.head
            in
                { model
                    | availableProviders = availableProviders_
                    , playlists =
                        if wasConnected then
                            nextProvider
                                |> Maybe.map Provider.select
                                |> Maybe.withDefault Provider.noSelection
                        else
                            model.playlists
                }
                    ! [ if wasConnected then
                            nextProvider
                                |> Maybe.map loadPlaylists
                                |> Maybe.withDefault Cmd.none
                        else
                            connection
                                |> Maybe.map Provider.provider
                                |> Maybe.map (providerToggleConnectionCmd False)
                                |> Maybe.withDefault Cmd.none
                      ]

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
            { model | playlists = Provider.mapSelection (SelectableList.select p) model.playlists } ! []

        BackToPlaylists ->
            { model | playlists = model.playlists |> Provider.mapSelection SelectableList.clear } ! []

        SpotifyConnectionStatusUpdate ( Nothing, token ) ->
            let
                connection =
                    Provider.connectedWithToken Spotify token
            in
                { model
                    | availableProviders =
                        Provider.map
                            (\con pType ->
                                if pType == Spotify then
                                    connection
                                else
                                    con
                            )
                            model.availableProviders
                    , playlists = Provider.select connection
                }
                    ! [ loadPlaylists connection ]

        SpotifyConnectionStatusUpdate ( Just _, _ ) ->
            { model
                | availableProviders =
                    Provider.map
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

        PlaylistsProviderChanged p ->
            { model | playlists = Provider.select p } ! [ loadPlaylists p ]


canSelect : providerType -> WithProviderSelection providerType data -> Bool
canSelect pType selection =
    selection
        |> Provider.selectionProvider
        |> Maybe.map ((==) pType)
        |> Maybe.withDefault True


loadPlaylists : ProviderConnection MusicProviderType -> Cmd Msg
loadPlaylists connection =
    case connection of
        Connected (ConnectedProvider Deezer) ->
            loadDeezerPlaylists ()

        Connected (ConnectedProviderWithToken Spotify token) ->
            Spotify.getPlaylists token ReceivePlaylists

        _ ->
            Cmd.none


searchMatchingSong : Track -> { m | comparedProvider : WithProviderSelection MusicProviderType data } -> Cmd Msg
searchMatchingSong track { comparedProvider } =
    comparedProvider
        |> Provider.connectedProvider
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
        [ div [ style [ ( "position", "fixed" ), ( "right", "0" ) ] ] (buttons model)
        , providerSelector PlaylistsProviderChanged model
        , playlists model
        ]


providerSelector :
    (ProviderConnection MusicProviderType -> Msg)
    -> { m | availableProviders : List (ProviderConnection MusicProviderType) }
    -> Html Msg
providerSelector tagger { availableProviders } =
    let
        connected =
            Provider.connectedProviders availableProviders
    in
        div []
            [ label [ for "provider-selector" ] [ text "Select a main provider:" ]
            , select [ name "provider-selector", style [ ( "width", "300" ) ], onChangeTo tagger (connectedProviderDecoder connected) ]
                (connected
                    |> List.map (Provider.provider >> providerName >> providerOption)
                    |> List.withDefault [ providerOption "-- Connect at least one provider --" ]
                )
            ]


providerOption : String -> Html Msg
providerOption provider =
    option [ value provider ] [ text provider ]


buttons : { m | availableProviders : List (ProviderConnection MusicProviderType) } -> List (Html Msg)
buttons { availableProviders } =
    List.map (connectButton ToggleConnect) availableProviders


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
        div [ style [ ( "margin", "8px" ) ] ]
            [ button
                [ style [ ( "width", "100%" ) ], onClick <| tagger (Provider.provider connection), disabled connecting ]
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
            ]


playlists :
    { m
        | playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
        , comparedProvider : WithProviderSelection MusicProviderType ()
    }
    -> Html Msg
playlists { playlists, comparedProvider } =
    case ( playlists, comparedProvider ) of
        ( Provider.Selected _ (Success p), _ ) ->
            p
                |> SelectableList.selected
                |> Maybe.map .songs
                |> Maybe.andThen RemoteData.toMaybe
                |> Maybe.map songs
                |> Maybe.withDefault
                    (div []
                        [ ul [] <| SelectableList.toList <| SelectableList.map (playlist PlaylistSelected) p ]
                    )

        ( Provider.Selected _ NotAsked, _ ) ->
            text "Loading your playlists..."

        ( Provider.Selected _ Loading, _ ) ->
            text "Loading your playlists..."

        ( Provider.Selected _ (Failure err), _ ) ->
            text ("An error occured loading your playlists: " ++ toString err)

        ( Provider.NoProviderSelected, _ ) ->
            text "Select a provider to load your playlists"


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


connectedProviderDecoder : List (ProviderConnection MusicProviderType) -> JD.Decoder (ProviderConnection MusicProviderType)
connectedProviderDecoder providers =
    let
        found pType =
            providers
                |> Provider.find pType
                |> Maybe.map JD.succeed
                |> Maybe.withDefault (JD.fail "The provider requested was not present in the list")
    in
        JD.string
            |> JD.andThen
                (\name ->
                    case name of
                        "Spotify" ->
                            found Spotify

                        "Deezer" ->
                            found Deezer

                        "Amazon Prime" ->
                            found Amazon

                        "Play" ->
                            found Google

                        _ ->
                            JD.fail "Expected a valid MusicProviderType name to decode"
                )



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
