module Main exposing (Model, Msg, init, main, subscriptions, update, view)

import Basics.Extra exposing (const, flip)
import Browser
import Browser.Events as Browser
import Connection exposing (ProviderConnection(..))
import Deezer
import Dict.Any as Dict exposing (AnyDict)
import Dict.Any.Extra as Dict
import Element
    exposing
        ( Color
        , DeviceClass(..)
        , Element
        , Orientation(..)
        , alignBottom
        , alignLeft
        , alignRight
        , alignTop
        , alpha
        , centerX
        , centerY
        , clip
        , column
        , el
        , fill
        , fillPortion
        , focused
        , height
        , html
        , htmlAttribute
        , image
        , maximum
        , minimum
        , mouseDown
        , mouseOver
        , moveDown
        , moveUp
        , padding
        , paddingEach
        , paddingXY
        , paragraph
        , px
        , row
        , scrollbarX
        , scrollbarY
        , shrink
        , spaceEvenly
        , spacing
        , text
        , width
        , wrappedRow
        )
import Element.Background as Bg
import Element.Border as Border
import Element.Events exposing (onClick)
import Element.Font as Font
import Element.Input as Input exposing (button, checkbox, labelRight)
import Element.Region as Region
import Flow exposing (ConnectionsWithLoadingPlaylists, Flow(..), PlaylistsDict)
import Html exposing (Html)
import Html.Attributes as Html
import Html.Events as Html
import Html.Events.Extra as Html
import Http
import Json.Decode as JD
import Json.Encode as JE
import List.Connection as Connections
import List.Extra as List
import Maybe.Extra as Maybe
import Model exposing (UserInfo)
import MusicService exposing (ConnectedProvider(..), DisconnectedProvider(..), MusicService(..), OAuthToken)
import Playlist exposing (Playlist, PlaylistId)
import RemoteData exposing (RemoteData(..), WebData)
import Result.Extra as Result
import SelectableList exposing (SelectableList)
import Spotify
import Task
import Track exposing (Track, TrackId)
import Tuple exposing (pair)



-- Model


type alias Model =
    { flow : Flow
    , availableConnections : SelectableList ProviderConnection
    , songs : AnyDict String MatchingTrackKey (WebData (List Track))
    , alternativeTitles : AnyDict String MatchingTrackKey ( String, Bool )
    , device : Element.Device
    }


type alias Dimensions =
    { height : Int
    , width : Int
    }


type alias MatchingTrackKey =
    ( TrackId, MusicService )


type alias Flags =
    Dimensions


type MatchingTracksKeySerializationError
    = TrackIdError Track.TrackIdSerializationError
    | OtherProviderTypeError String
    | WrongKeysFormatError String


serializeMatchingTracksKey : MatchingTrackKey -> String
serializeMatchingTracksKey ( id, pType ) =
    id ++ Model.keysSeparator ++ MusicService.toString pType


deserializeMatchingTracksKey : String -> Result MatchingTracksKeySerializationError MatchingTrackKey
deserializeMatchingTracksKey key =
    case String.split Model.keysSeparator key of
        [ rawTrackId, rawProvider ] ->
            rawProvider
                |> MusicService.fromString
                |> Result.fromMaybe (OtherProviderTypeError rawProvider)
                |> Result.map (pair rawTrackId)

        _ ->
            Err (WrongKeysFormatError key)


init : Flags -> ( Model, Cmd Msg )
init =
    \flags ->
        ( { flow = Flow.start [ Connection.disconnected Spotify, Connection.disconnected Deezer ]
          , availableConnections =
                SelectableList.fromList
                    [ Connection.disconnected Spotify
                    , Connection.disconnected Deezer
                    ]
          , songs = Dict.empty serializeMatchingTracksKey
          , alternativeTitles = Dict.empty serializeMatchingTracksKey
          , device = Element.classifyDevice flags
          }
        , Cmd.none
        )



-- Update


type Msg
    = ToggleConnect ProviderConnection
    | PlaylistsFetched ConnectedProvider (WebData (List Playlist))
    | PlaylistTracksFetched PlaylistId (WebData (List Track))
    | PlaylistSelectionCleared
    | ComparedProviderChanged (Maybe ConnectedProvider)
    | UserInfoReceived MusicService (WebData UserInfo)
    | ProviderConnected ConnectedProvider
    | ProviderDisconnected DisconnectedProvider
    | SearchMatchingSongs ConnectedProvider Playlist ConnectedProvider
    | MatchingSongResult MatchingTrackKey (WebData (List Track))
    | MatchingSongResultError String MatchingTracksKeySerializationError
    | PlaylistImported (WebData Playlist)
    | BrowserResized Dimensions
    | StepFlow
    | TogglePlaylistSelected ConnectedProvider PlaylistId
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        BrowserResized dims ->
            ( { model | device = Element.classifyDevice dims }, Cmd.none )

        ProviderConnected connection ->
            ( { model
                | flow = Flow.updateConnection (\_ -> Connected connection) (MusicService.type_ connection) model.flow
              }
            , Cmd.none
            )

        ProviderDisconnected loggedOutConnection ->
            let
                connection =
                    Disconnected loggedOutConnection
            in
            ( { model | flow = Flow.updateConnection (const connection) (Connection.type_ connection) model.flow }
            , Cmd.none
            )

        ToggleConnect connection ->
            let
                pType =
                    Connection.type_ connection
            in
            ( model
            , Connection.toggleProviderConnect ProviderDisconnected connection
            )

        PlaylistTracksFetched _ s ->
            ( model
            , Cmd.none
            )

        PlaylistSelectionCleared ->
            ( { model | flow = Flow.clearSelection model.flow }
            , Cmd.none
            )

        UserInfoReceived pType user ->
            ( { model | availableConnections = Connections.mapOn pType (Connection.map (MusicService.setUserInfo user)) model.availableConnections }
            , Cmd.none
            )

        MatchingSongResult key tracksResult ->
            ( { model | songs = Dict.insert key tracksResult model.songs }
            , Cmd.none
            )

        MatchingSongResultError _ _ ->
            ( model
            , Cmd.none
            )

        PlaylistsFetched connection playlistsData ->
            let
                data =
                    playlistsData |> RemoteData.map SelectableList.fromList
            in
            ( { model
                | flow = model.flow |> Flow.udpateLoadingPlaylists connection playlistsData |> Flow.next
              }
            , Cmd.none
            )

        ComparedProviderChanged (Just p) ->
            ( model
            , Cmd.none
            )

        ComparedProviderChanged Nothing ->
            ( model
            , Cmd.none
            )

        SearchMatchingSongs from p to ->
            let
                cmds =
                    p.songs
                        |> RemoteData.map
                            (List.map
                                (\t ->
                                    MusicService.searchMatchingSong (MatchingSongResult ( t.id, MusicService.type_ from )) from t
                                )
                            )
                        |> RemoteData.withDefault []
            in
            ( model
            , Cmd.none
            )

        PlaylistImported _ ->
            ( model
            , Cmd.none
            )

        StepFlow ->
            let
                newFlow =
                    Flow.next model.flow
            in
            ( { model | flow = newFlow }, getFlowStepCmd newFlow )

        TogglePlaylistSelected connection playlist ->
            ( { model | flow = Flow.pickPlaylist connection playlist model.flow }, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


getFlowStepCmd flow =
    case flow of
        LoadPlaylists byProvider ->
            byProvider |> List.map (Tuple.first >> MusicService.loadPlaylists PlaylistsFetched) |> Cmd.batch

        _ ->
            Cmd.none



-- View


view : Model -> Html Msg
view model =
    let
        d =
            dimensions model

        isSelected =
            model.flow |> Flow.selectedPlaylist |> Maybe.isDefined

        panelPushing =
            if not isSelected then
                [ moveDown 0 ]

            else
                [ moveUp <| toFloat d.panelHeight ]
    in
    Element.layoutWith
        { options =
            [ Element.focusStyle
                { borderColor = Nothing
                , backgroundColor = Nothing
                , shadow = Nothing
                }
            ]
        }
        [ Font.family
            [ Font.typeface "Fira Code" ]
        , Font.color palette.text
        , d.smallText
        , height fill
        , width fill
        ]
    <|
        column
            [ height fill
            , width fill
            , Element.inFront <|
                if isSelected then
                    el [ height fill, width fill, Bg.color palette.textFaded, onClick PlaylistSelectionCleared ] Element.none

                else
                    Element.none
            , Element.below <|
                el ([ width fill, height (px d.panelHeight), Bg.color palette.white, transition "transform" ] ++ panelPushing)
                    (model.flow
                        |> Flow.selectedPlaylist
                        |> Maybe.map (importConfigView model)
                        |> Maybe.withDefault (Element.el [ height (px d.panelHeight) ] Element.none)
                    )
            ]
            [ row
                [ Region.navigation
                , width fill
                , d.smallPaddingAll
                , Border.widthEach { bottom = 1, top = 0, left = 0, right = 0 }
                , Border.color palette.textFaded
                ]
                [ header model ]
            , row
                [ Region.mainContent
                , width fill
                , height fill
                , clip
                , d.mediumPaddingTop
                , hack_forceClip
                ]
                [ routeMainView model ]
            ]


importConfigView : { m | device : Element.Device } -> Playlist -> Element Msg
importConfigView model { name } =
    let
        d =
            dimensions model
    in
    column
        [ width fill, height fill, clip, hack_forceClip, spaceEvenly, Border.shadow { offset = ( 0, 0 ), size = 1, blur = 6, color = palette.textFaded } ]
        [ el [ Region.heading 2, width fill, d.smallPaddingAll, Border.color palette.textFaded, Border.widthEach { bottom = 1, left = 0, right = 0, top = 0 } ] <| text "Transfer playlist"
        , paragraph [ height fill, clip, hack_forceClip, scrollbarY, d.smallPaddingAll ] [ text name ]
        , button (primaryButtonStyle model) { onPress = Nothing, label = text "Next" }
        ]



-- Reusable


progressBar : List (Element.Attribute msg) -> Maybe String -> Element msg
progressBar attrs message =
    column ([ htmlAttribute <| Html.style "width" "calc(50vw)" ] ++ attrs)
        [ Element.html <|
            Html.div
                [ Html.class "progress progress-sm progress-indeterminate" ]
                [ Html.div [ Html.class "progress-bar" ] [] ]
        , message
            |> Maybe.map (paragraph [ width shrink, centerX, centerY, Font.center ] << List.singleton << text)
            |> Maybe.withDefault Element.none
        ]


logo : List (Element.Attribute msg) -> Element msg
logo attrs =
    image attrs { src = "assets/img/Logo.svg", description = "MuSync logo" }


note : List (Element.Attribute msg) -> Element msg
note attrs =
    image attrs { src = "assets/img/Note.svg", description = "" }



-- View parts


header : { m | device : Element.Device } -> Element msg
header { device } =
    logo <|
        case ( device.class, device.orientation ) of
            ( Phone, Portrait ) ->
                [ centerX, width (px 80) ]

            ( Tablet, Portrait ) ->
                [ centerX, width (px 150) ]

            _ ->
                [ alignLeft, width (px 250) ]


routeMainView : Model -> Element Msg
routeMainView model =
    case model.flow of
        Connect connections ->
            connectView model connections <| Flow.canStep model.flow

        LoadPlaylists _ ->
            progressBar [ centerX, centerY ] (Just "Fetching your playlists")

        PickPlaylists { playlists } ->
            playlistsList model playlists

        Sync _ _ _ _ ->
            progressBar [ centerX, centerY ] (Just "Syncing your playlists")


playlistRow : { m | device : Element.Device, flow : Flow } -> (PlaylistId -> msg) -> Playlist -> Element msg
playlistRow model tagger playlist =
    let
        d =
            dimensions model

        isSelected =
            model.flow |> Flow.selectedPlaylist |> Maybe.map (.id >> (==) playlist.id) |> Maybe.withDefault False
    in
    button
        ([ width fill
         , clip
         , Border.widthEach { top = 1, left = 0, right = 0, bottom = 0 }
         , Border.color palette.primaryFaded
         , d.smallPaddingAll
         , transition "background"
         ]
            ++ (if isSelected then
                    [ Bg.color palette.ternaryFaded, Border.innerGlow palette.textFaded 1 ]

                else
                    [ mouseOver [ Bg.color palette.ternaryFaded ] ]
               )
        )
        { onPress = Just <| tagger playlist.id
        , label =
            row [ width fill, d.smallSpacing ] <|
                [ el ([ width fill, clip ] ++ hack_textEllipsis) <|
                    Element.html <|
                        Html.text <|
                            Playlist.summary playlist
                , text <| String.fromInt playlist.tracksCount ++ " tracks"
                ]
        }


playlistsList : { m | device : Element.Device, flow : Flow } -> PlaylistsDict -> Element Msg
playlistsList model playlists =
    let
        d =
            dimensions model
    in
    Element.column [ width fill, height fill, clip, hack_forceClip, d.mediumSpacing ] <|
        [ paragraph [ d.largeText, Font.center ] [ text "Pick a playlist you want to transfer" ]
        , Element.column [ width fill, height fill, scrollbarY ]
            (playlists
                |> Dict.keys
                |> List.foldl
                    (\( c, id ) grouped ->
                        Dict.update c (Maybe.map (Just << (::) id) >> Maybe.withDefault (Just [ id ])) grouped
                    )
                    (Dict.empty MusicService.connectionToString)
                |> Dict.map
                    (\connection playlistIds ->
                        Element.column [ width fill ] <|
                            (Element.el [ width fill, d.mediumText, d.smallPaddingAll, Bg.color palette.ternary ] <|
                                text <|
                                    MusicService.connectionToString connection
                            )
                                :: (playlistIds
                                        |> List.filterMap (\id -> Dict.get ( connection, id ) playlists)
                                        |> List.map (playlistRow model <| TogglePlaylistSelected connection)
                                        |> List.withDefault [ text "No tracks" ]
                                   )
                    )
                |> Dict.values
            )
        ]


connectionStatus : Bool -> Element msg
connectionStatus isConnected =
    image [ width (px 50) ]
        { src =
            if isConnected then
                "/assets/img/noun_connected.svg"

            else
                "/assets/img/noun_disconnected.svg"
        , description =
            if isConnected then
                "Connected"

            else
                "Disconnected"
        }


connectView : { m | device : Element.Device } -> List ProviderConnection -> Bool -> Element Msg
connectView model connections canStep =
    let
        d =
            dimensions model
    in
    column [ width fill, height fill, d.largeSpacing ]
        [ paragraph [ d.largeText, Font.center ] [ text "Connect your favorite music providers" ]
        , row [ d.smallSpacing, centerX, centerY ]
            (connections
                |> List.map
                    (\connection ->
                        button
                            ([ d.largePadding
                             , Bg.color palette.white
                             , Border.rounded 3
                             , transition "box-shadow"
                             , htmlAttribute (Html.attribute "aria-label" <| (Connection.type_ >> MusicService.toString) connection)
                             , Border.shadow { offset = ( 0, 0 ), blur = 3, size = 1, color = palette.text }
                             ]
                                ++ (if Connection.isConnected connection then
                                        [ Border.innerGlow palette.text 1 ]

                                    else
                                        [ mouseDown [ Border.glow palette.text 1 ]
                                        , mouseOver [ Border.shadow { offset = ( 0, 0 ), blur = 12, size = 1, color = palette.text } ]
                                        ]
                                   )
                            )
                            { onPress =
                                if Connection.isConnected connection then
                                    Nothing

                                else
                                    Just <| ToggleConnect connection
                            , label =
                                column [ d.smallSpacing, d.smallHPadding ]
                                    [ providerLogoOrName [ d.buttonImageWidth, centerX ] <| Connection.type_ connection
                                    , connectionStatus <| Connection.isConnected connection
                                    ]
                            }
                    )
            )
        , Maybe.fromBool canStep
            |> Maybe.map
                (const <|
                    el [ width fill ] <|
                        button (primaryButtonStyle model ++ [ centerX ])
                            { label = text "Next"
                            , onPress = Just StepFlow
                            }
                )
            |> Maybe.withDefault (el [ d.buttonHeight ] Element.none)
        ]


providerName : MusicService -> String
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


providerLogoOrName : List (Element.Attribute msg) -> MusicService -> Element msg
providerLogoOrName attrs pType =
    let
        pName =
            providerName pType
    in
    (case pType of
        Deezer ->
            Just "/assets/img/deezer_logo.png"

        Spotify ->
            Just "/assets/img/spotify_logo.png"

        _ ->
            Nothing
    )
        |> Maybe.map (\path -> image attrs { src = path, description = pName })
        |> Maybe.withDefault (text pName)


connectedProviderDecoder : List ConnectedProvider -> JD.Decoder (Maybe ConnectedProvider)
connectedProviderDecoder providers =
    let
        found pType =
            providers
                |> Connections.findConnected pType
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
                        JD.fail "Expected a valid MusicService name to decode"
            )



-- Styles


scaled : Int -> Float
scaled =
    Element.modular 16 1.25


type alias DimensionPalette msg =
    { smallText : Element.Attribute msg
    , mediumText : Element.Attribute msg
    , largeText : Element.Attribute msg
    , smallSpacing : Element.Attribute msg
    , mediumSpacing : Element.Attribute msg
    , largeSpacing : Element.Attribute msg
    , smallPadding : Int
    , smallPaddingAll : Element.Attribute msg
    , smallHPadding : Element.Attribute msg
    , smallVPadding : Element.Attribute msg
    , mediumPaddingAll : Element.Attribute msg
    , mediumPaddingTop : Element.Attribute msg
    , largePadding : Element.Attribute msg
    , buttonImageWidth : Element.Attribute msg
    , buttonHeight : Element.Attribute msg
    , headerTopPadding : Element.Attribute msg
    , panelHeight : Int
    }


dimensions : { m | device : Element.Device } -> DimensionPalette msg
dimensions { device } =
    let
        ( smallPadding, mediumPadding ) =
            case device.class of
                Phone ->
                    ( scaled -2 |> round, scaled 1 |> round )

                _ ->
                    ( scaled 1 |> round, scaled 3 |> round )
    in
    case device.class of
        Phone ->
            { smallText = scaled -1 |> round |> Font.size
            , mediumText = scaled 1 |> round |> Font.size
            , largeText = scaled 2 |> round |> Font.size
            , smallSpacing = scaled 1 |> round |> spacing
            , mediumSpacing = scaled 3 |> round |> spacing
            , largeSpacing = scaled 5 |> round |> spacing
            , smallPadding = smallPadding
            , smallPaddingAll = padding smallPadding
            , smallHPadding = paddingXY smallPadding 0
            , smallVPadding = paddingXY 0 smallPadding
            , mediumPaddingAll = padding mediumPadding
            , mediumPaddingTop = paddingEach { top = mediumPadding, right = 0, bottom = 0, left = 0 }
            , largePadding = scaled 2 |> round |> padding
            , buttonImageWidth = scaled 4 |> round |> px |> width
            , buttonHeight = scaled 5 |> round |> px |> height
            , headerTopPadding = paddingEach { top = round (scaled -1), right = 0, bottom = 0, left = 0 }
            , panelHeight = 180
            }

        _ ->
            { smallText = scaled 1 |> round |> Font.size
            , mediumText = scaled 2 |> round |> Font.size
            , largeText = scaled 3 |> round |> Font.size
            , smallSpacing = scaled 1 |> round |> spacing
            , mediumSpacing = scaled 3 |> round |> spacing
            , largeSpacing = scaled 9 |> round |> spacing
            , smallPadding = smallPadding
            , smallPaddingAll = padding smallPadding
            , smallHPadding = paddingXY smallPadding 0
            , smallVPadding = paddingXY 0 smallPadding
            , mediumPaddingAll = padding mediumPadding
            , mediumPaddingTop = paddingEach { top = mediumPadding, right = 0, bottom = 0, left = 0 }
            , largePadding = scaled 5 |> round |> padding
            , buttonImageWidth = scaled 6 |> round |> px |> width
            , buttonHeight = scaled 6 |> round |> px |> height
            , headerTopPadding = paddingEach { top = round (scaled 2), right = 0, bottom = 0, left = 0 }
            , panelHeight = 180
            }


type alias ColorPalette =
    { primary : Element.Color
    , primaryFaded : Element.Color
    , secondary : Element.Color
    , secondaryFaded : Element.Color
    , ternary : Element.Color
    , ternaryFaded : Element.Color
    , quaternary : Element.Color
    , transparentWhite : Element.Color
    , transparent : Element.Color
    , white : Element.Color
    , black : Element.Color
    , text : Element.Color
    , textFaded : Element.Color
    }


fade : Float -> Color -> Color
fade alpha color =
    let
        rgbColor =
            Element.toRgb color
    in
    { rgbColor | alpha = alpha } |> Element.fromRgb


palette : ColorPalette
palette =
    let
        white =
            Element.rgb255 255 255 255

        textColor =
            Element.rgb255 42 67 80

        secondary =
            Element.rgb255 69 162 134

        ternary =
            Element.rgb255 248 160 116
    in
    { primary = Element.rgb255 220 94 93
    , primaryFaded = Element.rgba255 220 94 93 0.1
    , secondary = secondary
    , secondaryFaded = secondary |> fade 0.2
    , ternary = ternary
    , ternaryFaded = ternary |> fade 0.2
    , quaternary = Element.rgb255 189 199 79
    , transparent = Element.rgba255 255 255 255 0
    , white = white
    , transparentWhite = white |> fade 0.7
    , black = Element.rgb255 0 0 0
    , text = textColor
    , textFaded = textColor |> fade 0.17
    }


transition : String -> Element.Attribute msg
transition prop =
    htmlAttribute <| Html.style "transition" (prop ++ " .2s ease-out")


mainTitleStyle : { m | device : Element.Device } -> List (Element.Attribute msg)
mainTitleStyle model =
    [ model |> dimensions |> .largeText, Font.color palette.primary ]


baseButtonStyle device ( bgColor, textColor ) ( bgHoverColor, textHoverColor ) =
    let
        d =
            dimensions { device = device }

        deviceDependent =
            case ( device.class, device.orientation ) of
                ( Phone, Portrait ) ->
                    [ width fill ]

                ( Tablet, Portrait ) ->
                    [ width fill ]

                _ ->
                    [ width (shrink |> minimum 120) ]
    in
    [ Font.color textColor
    , Bg.color bgColor
    , Border.color bgHoverColor
    , Border.solid
    , Border.width 1
    , alignBottom
    , Font.center
    , Font.semiBold
    , transition "box-shadow"
    , mouseOver
        [ Bg.color bgHoverColor
        , Font.color textHoverColor
        ]
    , d.buttonHeight
    ]
        ++ deviceDependent


disabledButtonStyle whatever =
    case whatever of
        Just _ ->
            [ alpha 0.5, mouseOver [] ]

        Nothing ->
            []


selectedButtonStyle ( bgSelectedColor, textSelectedColor ) =
    [ Bg.color bgSelectedColor, Font.color textSelectedColor ]


iconButtonStyle =
    [ paddingXY 10 8 ]


primaryButtonStyle : { m | device : Element.Device } -> List (Element.Attribute msg)
primaryButtonStyle { device } =
    baseButtonStyle device ( palette.secondary, palette.white ) ( palette.secondary, palette.white )


primarySelectedButtonStyle =
    selectedButtonStyle ( palette.secondary, palette.white )


linkButtonStyle : List (Element.Attribute msg)
linkButtonStyle =
    [ Font.color palette.secondary
    , Font.underline
    , mouseOver [ Font.color palette.quaternary ]
    ]


songsListStyle { device } =
    [ spacing 8, height fill, scrollbarY ]


playlistsListStyle { device } =
    [ spacing 5, width fill, height fill, scrollbarY ]



-- HACKS


hack_forceClip : Element.Attribute msg
hack_forceClip =
    htmlAttribute (Html.style "flex-shrink" "1")


hack_textEllipsis : List (Element.Attribute msg)
hack_textEllipsis =
    [ htmlAttribute <| Html.style "text-overflow" "ellipsis", htmlAttribute <| Html.style "display" "inline-block" ]



-- Program


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- Subscriptions


handleDeezerMatchingTracksFetched : ( String, JD.Value ) -> Msg
handleDeezerMatchingTracksFetched ( rawKey, json ) =
    rawKey
        |> deserializeMatchingTracksKey
        |> Result.map (\key -> MatchingSongResult key (Deezer.decodeTracks json))
        |> Result.mapError (MatchingSongResultError rawKey)
        |> Result.unwrap


handleSpotifyStatusUpdate ( maybeErr, token ) =
    maybeErr
        |> Maybe.map (\_ -> NoOp)
        |> Maybe.withDefault (ProviderConnected <| MusicService.connectedWithToken Spotify token NotAsked)


handleDeezerPlaylistTracksFetched ( pid, json ) =
    PlaylistTracksFetched pid (Deezer.decodeTracks json)


handleDeezerStatusUpdate : Bool -> Msg
handleDeezerStatusUpdate isConnected =
    if isConnected then
        ProviderConnected <| MusicService.connected Deezer NotAsked

    else
        ProviderDisconnected <| MusicService.disconnected Deezer


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Deezer.updateStatus handleDeezerStatusUpdate
        , Deezer.receivePlaylists (PlaylistsFetched (MusicService.connected Deezer NotAsked) << Deezer.decodePlaylists)
        , Deezer.receivePlaylistSongs handleDeezerPlaylistTracksFetched
        , Deezer.receiveMatchingTracks handleDeezerMatchingTracksFetched
        , Deezer.playlistCreated (PlaylistImported << Deezer.decodePlaylist)
        , Spotify.onConnected handleSpotifyStatusUpdate
        , Browser.onResize (\w h -> BrowserResized <| Dimensions h w)
        ]
