port module Main exposing (Model, Msg, update, view, subscriptions, init, main)

import List.Extra as List
import Html exposing (Html, text, div, button, span, ul, li, p, select, option, label, h3)
import Html.Attributes exposing (disabled, style, for, name, value, selected)
import Html.Extra
import Html.Events exposing (onClick)
import Html.Events.Extra exposing (onChangeTo)
import Json.Decode as JD
import RemoteData exposing (RemoteData(..), WebData)
import Model
    exposing
        ( Track
        , Playlist
        , PlaylistId
        , MusicProviderType(..)
        , MusicData
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


port loadDeezerPlaylistSongs : PlaylistId -> Cmd msg


port receiveDeezerPlaylistSongs : (Maybe JD.Value -> msg) -> Sub msg


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
    | ReceiveDeezerSongs (Maybe JD.Value)
    | RequestDeezerSongs Int
    | ReceiveSpotifyPlaylistSongs Playlist (WebData (List Track))
    | PlaylistSelected Playlist
    | BackToPlaylists
    | PlaylistsProviderChanged (Maybe (ConnectedProvider MusicProviderType))
    | ComparedProviderChanged (Maybe (ConnectedProvider MusicProviderType))
    | SpotifyConnectionStatusUpdate ( Maybe String, String )
    | SearchMatchingSong Track
    | MatchingSongResult Track (WebData (List Track))


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
                { model | availableProviders = Provider.mapOn Deezer (\_ -> connection) model.availableProviders } ! []

        ToggleConnect pType ->
            let
                connection =
                    model.availableProviders |> Provider.find pType

                wasConnected =
                    connection |> Maybe.map Provider.isConnected |> Maybe.withDefault False

                toggleCmd =
                    connection
                        |> Maybe.map Provider.provider
                        |> Maybe.map (providerToggleConnectionCmd wasConnected)
                        |> Maybe.withDefault Cmd.none

                availableProviders_ =
                    Provider.toggle pType model.availableProviders

                nextProvider =
                    availableProviders_ |> Provider.connectedProviders |> List.head

                model_ =
                    { model | availableProviders = availableProviders_ }
            in
                if wasConnected then
                    { model_
                        | playlists =
                            nextProvider
                                |> Maybe.map Provider.select
                                |> Maybe.withDefault Provider.noSelection
                    }
                        ! (nextProvider
                            |> Maybe.map loadPlaylists
                            |> Maybe.withDefault Cmd.none
                            |> List.singleton
                            |> (::) toggleCmd
                          )
                else
                    model_ ! [ toggleCmd ]

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

        ReceiveDeezerSongs (Just songsValue) ->
            let
                songs =
                    songsValue
                        |> JD.decodeValue (JD.list Deezer.track)
                        |> RemoteData.fromResult
                        |> RemoteData.mapError Model.musicErrorFromDecoding
            in
                { model
                    | playlists =
                        Provider.mapSelection
                            (SelectableList.mapSelected (Model.setSongs songs))
                            model.playlists
                }
                    ! []

        ReceiveDeezerSongs Nothing ->
            model ! []

        RequestDeezerSongs id ->
            model ! [ loadDeezerPlaylistSongs (toString id) ]

        ReceiveSpotifyPlaylistSongs playlist songs ->
            let
                convertedSongs =
                    RemoteData.mapError Model.musicErrorFromHttp songs
            in
                { model
                    | playlists =
                        Provider.mapSelection
                            (SelectableList.mapSelected <| Model.setSongs convertedSongs)
                            model.playlists
                }
                    ! []

        PlaylistSelected p ->
            let
                playlists =
                    Provider.mapSelection (SelectableList.upSelect Model.loadSongs p) model.playlists

                loadSongs =
                    playlists
                        |> Provider.getData
                        |> Maybe.andThen RemoteData.toMaybe
                        |> Maybe.andThen SelectableList.selected
                        |> Maybe.map .songs
                        |> Maybe.map RemoteData.isLoading
                        |> Maybe.withDefault False
            in
                { model
                    | playlists = playlists
                }
                    ! if loadSongs then
                        [ playlists |> Provider.connectedProvider |> Maybe.map (\pType -> loadPlaylistSongs pType p) |> Maybe.withDefault Cmd.none ]
                      else
                        []

        BackToPlaylists ->
            { model | playlists = model.playlists |> Provider.mapSelection SelectableList.clear } ! []

        SpotifyConnectionStatusUpdate ( Nothing, token ) ->
            let
                connection =
                    Provider.connectedWithToken Spotify token
            in
                { model
                    | availableProviders =
                        Provider.mapOn Spotify (\_ -> connection) model.availableProviders
                }
                    ! []

        SpotifyConnectionStatusUpdate ( Just _, _ ) ->
            { model
                | availableProviders =
                    Provider.mapOn Spotify
                        (\con -> con |> Provider.provider |> Provider.disconnected)
                        model.availableProviders
            }
                ! []

        SearchMatchingSong track ->
            model ! [ searchMatchingSong track model ]

        MatchingSongResult track results ->
            { model | playlists = updateMatchingTracks track results model } ! []

        ReceivePlaylists playlistsData ->
            let
                data =
                    playlistsData
                        |> RemoteData.mapError Provider.providerHttpError
                        |> RemoteData.map SelectableList.fromList
            in
                { model | playlists = Provider.setData model.playlists data } ! []

        PlaylistsProviderChanged (Just p) ->
            { model | playlists = Provider.select p } ! [ loadPlaylists p ]

        PlaylistsProviderChanged Nothing ->
            { model | playlists = Provider.noSelection } ! []

        ComparedProviderChanged (Just p) ->
            { model | comparedProvider = Provider.select p } ! []

        ComparedProviderChanged Nothing ->
            { model | comparedProvider = Provider.noSelection } ! []



-- Very ugly, needs to go soon


updateMatchingTracks :
    Track
    -> WebData (List Track)
    -> { c
        | comparedProvider : WithProviderSelection MusicProviderType ()
        , playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
       }
    -> WithProviderSelection MusicProviderType (SelectableList Playlist)
updateMatchingTracks track results { playlists, comparedProvider } =
    playlists
        |> (Provider.mapSelection
                (SelectableList.mapSelected
                    (\p ->
                        Provider.selectionProvider comparedProvider
                            |> Maybe.map
                                (\pType ->
                                    { p
                                        | songs =
                                            p.songs
                                                |> RemoteData.map
                                                    (List.map
                                                        (\t ->
                                                            if t.id == track.id then
                                                                Model.updateMatchingTracks pType results t
                                                            else
                                                                t
                                                        )
                                                    )
                                    }
                                )
                            |> Maybe.withDefault p
                    )
                )
           )


canSelect : providerType -> WithProviderSelection providerType data -> Bool
canSelect pType selection =
    selection
        |> Provider.selectionProvider
        |> Maybe.map ((==) pType)
        |> Maybe.withDefault True


loadPlaylists : ConnectedProvider MusicProviderType -> Cmd Msg
loadPlaylists connection =
    case connection of
        ConnectedProvider Deezer ->
            loadDeezerPlaylists ()

        ConnectedProviderWithToken Spotify token ->
            Spotify.getPlaylists token ReceivePlaylists

        _ ->
            Cmd.none


loadPlaylistSongs : ConnectedProvider MusicProviderType -> Playlist -> Cmd Msg
loadPlaylistSongs connection ({ id, tracksLink } as playlist) =
    case connection of
        ConnectedProvider Deezer ->
            loadDeezerPlaylistSongs id

        ConnectedProviderWithToken Spotify token ->
            tracksLink
                |> Maybe.map (Spotify.getPlaylistTracksFromLink token (ReceiveSpotifyPlaylistSongs playlist))
                |> Maybe.withDefault Cmd.none

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
            Spotify.searchTrack token MatchingSongResult track

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


asSelectableList :
    WithProviderSelection providerType data
    -> List (ConnectedProvider providerType)
    -> SelectableList (ConnectedProvider providerType)
asSelectableList selection providers =
    let
        connected =
            providers |> SelectableList.fromList
    in
        selection
            |> Provider.connectedProvider
            |> Maybe.map (SelectableList.select connected)
            |> Maybe.withDefault connected



-- View


view :
    { a
        | comparedProvider : WithProviderSelection MusicProviderType data
        , availableProviders : List (ProviderConnection MusicProviderType)
        , playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
    }
    -> Html Msg
view model =
    div []
        [ div [ style [ ( "position", "fixed" ), ( "right", "0" ) ] ] (buttons model)
        , label [ for "provider-selector", style [ ( "margin-right", "6px" ) ] ] [ text "Select a main provider:" ]
        , model.availableProviders
            |> Provider.connectedProviders
            |> asSelectableList model.playlists
            |> providerSelector PlaylistsProviderChanged
        , playlists model
        ]


providerSelector :
    (Maybe (ConnectedProvider MusicProviderType) -> msg)
    -> SelectableList (ConnectedProvider MusicProviderType)
    -> Html msg
providerSelector tagger providers =
    select
        [ name "provider-selector"
        , style [ ( "display", "inline" ), ( "width", "auto" ) ]
        , onChangeTo tagger (connectedProviderDecoder (SelectableList.toList providers))
        ]
        (providers
            |> SelectableList.map Provider.providerFromConnected
            |> SelectableList.mapBoth (providerOption True) (providerOption False)
            |> SelectableList.toList
            |> List.nonEmpty ((::) (placeholderOption (SelectableList.hasSelection providers) "-- Select a provider --"))
            |> List.withDefault [ placeholderOption True "-- Connect at least one more provider --" ]
        )


providerOption : Bool -> MusicProviderType -> Html msg
providerOption isSelected provider =
    let
        labelAndValue =
            (providerName provider)
    in
        option [ value labelAndValue, selected isSelected ] [ text labelAndValue ]


placeholderOption : Bool -> String -> Html msg
placeholderOption isSelected label =
    option [ selected isSelected, value "__placeholder__" ] [ text label ]


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
    { a
        | availableProviders : List (ProviderConnection MusicProviderType)
        , comparedProvider : WithProviderSelection MusicProviderType data
        , playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
    }
    -> Html Msg
playlists model =
    case model.playlists of
        Provider.Selected _ (Success p) ->
            p
                |> SelectableList.selected
                |> Maybe.map .songs
                |> Maybe.map (songs model)
                |> Maybe.withDefault
                    (div []
                        [ ul [] <|
                            SelectableList.toList <|
                                SelectableList.map (playlist PlaylistSelected) p
                        ]
                    )

        Provider.Selected _ (Failure err) ->
            div [] [ text ("An error occured loading your playlists: " ++ toString err) ]

        Provider.NoProviderSelected ->
            div [] [ text "Select a provider to load your playlists" ]

        Provider.Selected _ _ ->
            div [] [ text "Loading your playlists..." ]


songs :
    { a
        | availableProviders : List (ProviderConnection MusicProviderType)
        , comparedProvider : WithProviderSelection MusicProviderType data
        , playlists : WithProviderSelection MusicProviderType data1
    }
    -> RemoteData e (List Track)
    -> Html Msg
songs ({ playlists, availableProviders, comparedProvider } as model) songs =
    div []
        [ button [ onClick BackToPlaylists ] [ text "<< back" ]
        , div []
            [ label [ style [ ( "margin-right", "6px" ) ] ] [ text "Pick a provider to copy the playlist to: " ]
            , availableProviders
                |> Provider.connectedProviders
                |> asSelectableList playlists
                |> SelectableList.rest
                |> asSelectableList comparedProvider
                |> providerSelector ComparedProviderChanged
            , button [ disabled (not <| Provider.isSelected comparedProvider) ] [ text "search!" ]
            , ul []
                (songs
                    |> RemoteData.map (List.map (song model))
                    |> RemoteData.withDefault [ h3 [] [ text "Tracks are not ready yet" ] ]
                )
            ]
        ]


song : { a | comparedProvider : WithProviderSelection MusicProviderType data } -> Track -> Html msg
song { comparedProvider } track =
    li []
        [ text <| track.title ++ " - " ++ track.artist
        , comparedProvider
            |> Provider.selectionProvider
            |> Maybe.andThen (matchingTracks track)
            |> Maybe.withDefault Html.Extra.empty
        ]


matchingTracks : Track -> MusicProviderType -> Maybe (Html msg)
matchingTracks { matchingTracks } pType =
    case Model.matchingTracks pType matchingTracks of
        Success [] ->
            Just (text "No tracks found")

        Success _ ->
            Just (text "Matched!")

        Loading ->
            Just (text "Searching...")

        _ ->
            Nothing


playlist : (Playlist -> Msg) -> Playlist -> Html Msg
playlist tagger p =
    li [ onClick (tagger p) ]
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


connectedProviderDecoder : List (ConnectedProvider MusicProviderType) -> JD.Decoder (Maybe (ConnectedProvider MusicProviderType))
connectedProviderDecoder providers =
    let
        found pType =
            providers
                |> Provider.findConnected pType
                |> Maybe.map (Just >> JD.succeed)
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

                        "__placeholder__" ->
                            JD.succeed Nothing

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
