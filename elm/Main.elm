port module Main exposing (Model, Msg, update, view, subscriptions, init, main)

import Maybe.Extra as Maybe
import List.Extra as List
import EveryDict as Dict exposing (EveryDict)
import Html exposing (Html, text, div, button, span, ul, li, p, select, option, label, h3, i, input)
import Html.Attributes as Html exposing (id, disabled, style, for, name, value, selected, class, title, type_, placeholder)
import Html.Extra
import Html.Events exposing (onClick)
import Html.Events.Extra exposing (onChangeTo)
import Json.Decode as JD
import Json.Encode as JE
import RemoteData exposing (RemoteData(..), WebData)
import Model exposing (MusicProviderType(..))
import SelectableList exposing (SelectableList)
import Provider
    exposing
        ( ProviderConnection(..)
        , ConnectedProvider(..)
        , DisconnectedProvider(..)
        )
import Provider.List as Provider
import Provider.Selection as Provider exposing (WithProviderSelection)
import Playlist exposing (Playlist, PlaylistId)
import Track exposing (Track, TrackId)
import Spotify
import Deezer


-- Ports


port updateDeezerStatus : (Bool -> msg) -> Sub msg


port connectDeezer : () -> Cmd msg


port disconnectDeezer : () -> Cmd msg


port loadDeezerPlaylists : () -> Cmd msg


port receiveDeezerPlaylists : (Maybe JD.Value -> msg) -> Sub msg


port searchDeezerSong : ( PlaylistId, { id : ( String, String ), title : String, artist : String } ) -> Cmd msg


port receiveDeezerMatchingTracks : (( PlaylistId, ( String, String ), JD.Value ) -> msg) -> Sub msg


port loadDeezerPlaylistSongs : PlaylistId -> Cmd msg


port receiveDeezerPlaylistSongs : (Maybe JD.Value -> msg) -> Sub msg


port connectSpotify : () -> Cmd msg


port onSpotifyConnected : (( Maybe String, String ) -> msg) -> Sub msg



-- Model


type alias Model =
    { playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
    , comparedProvider : WithProviderSelection MusicProviderType ()
    , availableProviders : List (ProviderConnection MusicProviderType)
    , songs : EveryDict TrackId (WebData (List Track))
    }


init : ( Model, Cmd Msg )
init =
    ( { playlists = Provider.noSelection
      , comparedProvider = Provider.noSelection
      , availableProviders =
            [ Provider.disconnected Spotify
            , Provider.disconnected Deezer
            ]
      , songs = Dict.empty
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
    | ReceiveDeezerMatchingSongs ( PlaylistId, ( String, String ), JD.Value )
    | RequestDeezerSongs Int
    | ReceiveSpotifyPlaylistSongs Playlist (WebData (List Track))
    | PlaylistSelected Playlist
    | BackToPlaylists
    | PlaylistsProviderChanged (Maybe (ConnectedProvider MusicProviderType))
    | ComparedProviderChanged (Maybe (ConnectedProvider MusicProviderType))
    | SpotifyConnectionStatusUpdate ( Maybe String, String )
    | SearchMatchingSongs Playlist
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
                toggleCmd =
                    model.availableProviders
                        |> Provider.find pType
                        |> Maybe.mapTogether Provider.isConnected Provider.provider
                        |> Maybe.map (uncurry providerToggleConnectionCmd)
                        |> Maybe.withDefault Cmd.none

                wasSelected =
                    model.playlists |> Provider.selectionProvider |> Maybe.map ((==) pType) |> Maybe.withDefault False

                model_ =
                    { model | availableProviders = Provider.toggle pType model.availableProviders }
            in
                { model_
                    | playlists =
                        if wasSelected then
                            Provider.noSelection
                        else
                            model.playlists
                }
                    ! [ toggleCmd ]

        ReceiveDeezerPlaylists (Just pJson) ->
            { model
                | playlists =
                    pJson
                        |> JD.decodeValue (JD.list Deezer.playlist)
                        |> Result.map SelectableList.fromList
                        |> Result.mapError (Deezer.httpBadPayloadError "/playlists" pJson)
                        |> RemoteData.fromResult
                        |> Provider.setData model.playlists
            }
                ! []

        ReceiveDeezerPlaylists Nothing ->
            { model
                | playlists =
                    "No Playlists received"
                        |> Deezer.httpBadPayloadError "/playlist/songs" JE.null
                        |> RemoteData.Failure
                        |> Provider.setData model.playlists
            }
                ! []

        ReceiveDeezerSongs (Just songsValue) ->
            let
                songsData =
                    songsValue
                        |> JD.decodeValue (JD.list Deezer.track)
                        |> RemoteData.fromResult
                        |> RemoteData.mapError (Deezer.httpBadPayloadError "/playlist/songs" songsValue)
            in
                { model
                    | playlists =
                        Provider.mapSelection
                            (SelectableList.mapSelected (Playlist.setSongs songsData))
                            model.playlists
                }
                    ! []

        ReceiveDeezerSongs Nothing ->
            model ! []

        RequestDeezerSongs id ->
            model ! [ loadDeezerPlaylistSongs (toString id) ]

        ReceiveSpotifyPlaylistSongs playlist songs ->
            { model
                | playlists =
                    Provider.mapSelection
                        (SelectableList.mapSelected <| Playlist.setSongs songs)
                        model.playlists
            }
                ! []

        PlaylistSelected p ->
            let
                playlists =
                    Provider.mapSelection (SelectableList.upSelect Playlist.loadSongs p) model.playlists

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
                        [ playlists
                            |> Provider.connectedProvider
                            |> Maybe.map (\pType -> loadPlaylistSongs pType p)
                            |> Maybe.withDefault Cmd.none
                        ]
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

        MatchingSongResult ({ id } as track) results ->
            { model | songs = Dict.insert id results model.songs } ! []

        ReceivePlaylists playlistsData ->
            let
                data =
                    playlistsData |> RemoteData.map SelectableList.fromList
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

        SearchMatchingSongs playlist ->
            let
                cmds =
                    playlist.songs
                        |> RemoteData.map (List.map (searchMatchingSong playlist.id model))
                        |> RemoteData.withDefault []

                loading =
                    playlist.songs
                        |> RemoteData.map (List.foldl (\{ id } d -> Dict.insert id Loading d) model.songs)
            in
                { model
                    | songs = RemoteData.withDefault model.songs loading
                }
                    ! cmds

        ReceiveDeezerMatchingSongs ( playlistId, trackId, jsonTracks ) ->
            let
                tracks =
                    jsonTracks
                        |> JD.decodeValue (JD.list Deezer.track)
                        |> Result.mapError (Deezer.httpBadPayloadError "/search/tracks" jsonTracks)
                        |> RemoteData.fromResult
            in
                { model
                    | songs =
                        trackId
                            |> Track.deserializeId
                            |> Result.map (\id -> Dict.insert id tracks model.songs)
                            |> Result.withDefault model.songs
                }
                    ! []


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


searchMatchingSong : PlaylistId -> { m | comparedProvider : WithProviderSelection MusicProviderType data } -> Track -> Cmd Msg
searchMatchingSong playlistId { comparedProvider } track =
    comparedProvider
        |> Provider.connectedProvider
        |> Maybe.map (searchSongFromProvider playlistId track)
        |> Maybe.withDefault Cmd.none


searchSongFromProvider : PlaylistId -> Track -> ConnectedProvider MusicProviderType -> Cmd Msg
searchSongFromProvider playlistId track provider =
    case provider of
        ConnectedProviderWithToken Spotify token ->
            Spotify.searchTrack token (MatchingSongResult track) track

        ConnectedProvider Deezer ->
            searchDeezerSong ( playlistId, { id = Track.serializeId track.id, artist = track.artist, title = track.title } )

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


view : Model -> Html Msg
view model =
    div []
        [ div [ class "connect-buttons", style [ ( "position", "fixed" ), ( "right", "0" ) ] ] (buttons model)
        , label [ for "provider-selector", style [ ( "margin-right", "6px" ) ] ] [ text "Select a main provider:" ]
        , model.availableProviders
            |> Provider.connectedProviders
            |> asSelectableList model.playlists
            |> providerSelector PlaylistsProviderChanged [ id "playlist-provider-picker" ]
        , Html.main_ [] [ playlists model ]
        ]



-- Reusable


progressBar : Html msg
progressBar =
    div
        [ class "progress progress-indeterminate"
        , style [ ( "margin", "16px" ), ( "width", "50%" ) ]
        ]
        [ div [ class "progress-bar" ] [] ]


providerSelector :
    (Maybe (ConnectedProvider MusicProviderType) -> msg)
    -> List (Html.Attribute msg)
    -> SelectableList (ConnectedProvider MusicProviderType)
    -> Html msg
providerSelector tagger attrs providers =
    select
        ([ name "provider-selector"
         , style [ ( "display", "inline" ), ( "width", "auto" ) ]
         , onChangeTo tagger (connectedProviderDecoder (SelectableList.toList providers))
         ]
            ++ attrs
        )
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



-- View parts


playlists model =
    case model.playlists of
        Provider.Selected _ (Success p) ->
            p
                |> SelectableList.selected
                |> Maybe.map (songs model)
                |> Maybe.withDefault
                    (ul [] <|
                        SelectableList.toList <|
                            SelectableList.map (playlist PlaylistSelected) p
                    )

        Provider.Selected _ (Failure err) ->
            div [] [ text ("An error occured loading your playlists: " ++ toString err) ]

        Provider.NoProviderSelected ->
            div [] [ text "Select a provider to load your playlists" ]

        Provider.Selected _ _ ->
            progressBar


compareSearch :
    { a
        | availableProviders : List (ProviderConnection MusicProviderType)
        , comparedProvider : WithProviderSelection MusicProviderType ()
        , playlists : WithProviderSelection MusicProviderType (SelectableList Playlist)
    }
    -> Playlist
    -> Html Msg
compareSearch { availableProviders, playlists, comparedProvider } playlist =
    div [ class "provider-compare" ]
        [ label [ style [ ( "margin-right", "6px" ) ] ] [ text "pick a provider to copy the playlist to: " ]
        , availableProviders
            |> Provider.connectedProviders
            |> asSelectableList playlists
            |> SelectableList.rest
            |> asSelectableList comparedProvider
            |> providerSelector ComparedProviderChanged []
        , button
            [ onClick (SearchMatchingSongs playlist)
            , disabled (not <| Provider.isSelected comparedProvider)
            ]
            [ text "search!" ]
        ]


songs model playlist =
    div [ id "playlist-details" ]
        [ button [ class "back-to-playlists", onClick BackToPlaylists ] [ text "<< back" ]
        , playlist.songs
            |> RemoteData.map
                (\s ->
                    div []
                        [ compareSearch model playlist
                        , ul [ id "playlist-songs" ] (List.map (song model) s)
                        ]
                )
            |> RemoteData.withDefault (progressBar)
        ]


song ({ comparedProvider } as model) track =
    li []
        [ text <| track.title ++ " - " ++ track.artist
        , comparedProvider
            |> Provider.selectionProvider
            |> Maybe.andThen (matchingTracks model track)
            |> Maybe.withDefault Html.Extra.empty
        ]


matchingTracks { songs } { id, title } pType =
    case Dict.get id songs of
        Just (Success []) ->
            Just
                (span []
                    [ i
                        [ class "fa fa-times"
                        , style [ ( "margin-left", "6px" ), ( "color", "red" ) ]
                        , Html.title ("This track doesn't exist on " ++ providerName pType ++ " :(")
                        ]
                        []
                    , label [ for "correct-title-input" ] [ text "Try correcting song title:" ]
                    , input [ type_ "text", placeholder title, style [ ( "display", "inline" ), ( "width", "auto" ) ] ] []
                    , button [] [ text "retry" ]
                    ]
                )

        Just (Success _) ->
            Just
                (i
                    [ class "fa fa-check"
                    , style [ ( "margin-left", "6px" ), ( "color", "green" ) ]
                    , Html.title ("Hurray! Found your track on " ++ providerName pType)
                    ]
                    []
                )

        Just Loading ->
            Just (span [ class "loader loader-xs" ] [])

        _ ->
            Nothing


playlist : (Playlist -> Msg) -> Playlist -> Html Msg
playlist tagger p =
    li [ onClick (tagger p) ]
        [ text <| p.name ++ " (" ++ toString p.tracksCount ++ " tracks)" ]


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
        , receiveDeezerMatchingTracks ReceiveDeezerMatchingSongs
        ]
