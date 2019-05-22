module Flow exposing
    ( ConnectionSelection(..)
    , ConnectionsWithLoadingPlaylists
    , Flow(..)
    , PlaylistSelectionState(..)
    , canStep
    , clearSelection
    , currentStep
    , next
    , pickPlaylist
    , pickService
    , selectedPlaylist
    , start
    , steps
    , udpateLoadingPlaylists
    )

import Connection.Connected exposing (ConnectedProvider)
import Flow.Context as Context exposing (Context)
import Playlist exposing (Playlist, PlaylistId)
import Playlist.State as PlaylistState exposing (PlaylistState)
import RemoteData exposing (RemoteData(..), WebData)
import Tuple exposing (pair)


type alias ConnectionsWithLoadingPlaylists =
    List ( ConnectedProvider, WebData (List Playlist) )


type PlaylistSelectionState
    = NoPlaylist
    | PlaylistSelected ConnectedProvider PlaylistId


type alias PlaylistSelection =
    { selection : PlaylistSelectionState
    }


type ConnectionSelection
    = NoConnection
    | ConnectionSelected ConnectedProvider


type alias OtherConnectionSelection =
    { selection : ConnectionSelection
    , playlist : ( ConnectedProvider, PlaylistId )
    }


type alias SyncData =
    { playlist : ( ConnectedProvider, PlaylistId )
    , otherConnection : ConnectedProvider
    }


type Flow
    = Connect
    | LoadPlaylists ConnectionsWithLoadingPlaylists
    | PickPlaylist PlaylistSelection
    | PickOtherConnection OtherConnectionSelection
    | Transfer SyncData


start : Flow
start =
    Connect


canStep : Context m -> Flow -> Bool
canStep ctx flow =
    case flow of
        Connect ->
            Context.hasAtLeast2Connected ctx

        LoadPlaylists data ->
            data |> List.map Tuple.second |> RemoteData.fromList |> RemoteData.isSuccess

        PickPlaylist { selection } ->
            case selection of
                PlaylistSelected con id ->
                    Context.getPlaylist ( con, id ) ctx
                        |> Maybe.map (Tuple.second >> PlaylistState.isPlaylistTransferring >> not)
                        |> Maybe.withDefault False

                NoPlaylist ->
                    False

        PickOtherConnection { selection } ->
            case selection of
                ConnectionSelected _ ->
                    True

                NoConnection ->
                    False

        Transfer { playlist } ->
            Context.getPlaylist playlist ctx
                |> Maybe.map (PlaylistState.isPlaylistTransferred << Tuple.second)
                |> Maybe.withDefault False


next : Context m -> Flow -> ( Flow, Context m )
next ctx flow =
    case flow of
        Connect ->
            case Context.allConnected ctx of
                (_ :: _ :: _) as connected ->
                    ( LoadPlaylists (List.map (\c -> ( c, Loading )) connected), ctx )

                _ ->
                    ( flow, ctx )

        LoadPlaylists data ->
            data
                |> List.foldl
                    (\( con, d ) c ->
                        d
                            |> RemoteData.map (Context.addPlaylists c con)
                            |> RemoteData.withDefault c
                    )
                    ctx
                |> pair (PickPlaylist <| PlaylistSelection NoPlaylist)

        PickPlaylist ({ selection } as payload) ->
            case selection of
                PlaylistSelected con id ->
                    if Context.canTransferPlaylist id con ctx then
                        ( PickOtherConnection { selection = NoConnection, playlist = ( con, id ) }
                        , ctx
                        )

                    else
                        ( PickPlaylist { payload | selection = NoPlaylist }, ctx )

                NoPlaylist ->
                    ( flow, ctx )

        PickOtherConnection { playlist, selection } ->
            case selection of
                ConnectionSelected connection ->
                    ( Transfer { playlist = playlist, otherConnection = connection }
                    , Context.startTransfer (Tuple.first playlist) (Tuple.second playlist) ctx
                    )

                NoConnection ->
                    ( flow, ctx )

        Transfer _ ->
            ( PickPlaylist <| PlaylistSelection NoPlaylist, ctx )


currentStep : Flow -> Int
currentStep flow =
    case flow of
        Connect ->
            0

        LoadPlaylists _ ->
            0

        PickPlaylist _ ->
            1

        PickOtherConnection _ ->
            2

        Transfer _ ->
            3


steps : List String
steps =
    [ "Connect", "Pick playlist", "Pick destination", "Transfer" ]



-- LoadPlaylists


udpateLoadingPlaylists : ConnectedProvider -> WebData (List Playlist) -> Context m -> Flow -> ( Flow, Context m )
udpateLoadingPlaylists connection playlists ctx flow =
    case flow of
        LoadPlaylists data ->
            let
                loading =
                    data
                        |> List.map
                            (\( c, p ) ->
                                if connection == c then
                                    ( c, playlists )

                                else
                                    ( c, p )
                            )

                updated =
                    LoadPlaylists loading
            in
            if loading |> List.map Tuple.second |> List.all RemoteData.isSuccess then
                next ctx updated

            else
                ( updated, ctx )

        _ ->
            ( flow, ctx )



-- PickPlaylists


pickPlaylist : ConnectedProvider -> PlaylistId -> Flow -> Flow
pickPlaylist connection id flow =
    case flow of
        PickPlaylist { selection } ->
            case selection of
                NoPlaylist ->
                    PickPlaylist <| PlaylistSelection (PlaylistSelected connection id)

                PlaylistSelected con pId ->
                    if (con == connection) && pId == id then
                        PickPlaylist <| PlaylistSelection NoPlaylist

                    else
                        PickPlaylist <| PlaylistSelection (PlaylistSelected connection id)

        _ ->
            flow


pickService : ConnectedProvider -> Flow -> Flow
pickService otherConnection flow =
    case flow of
        PickOtherConnection { selection, playlist } ->
            case selection of
                NoConnection ->
                    if otherConnection /= Tuple.first playlist then
                        PickOtherConnection { selection = ConnectionSelected otherConnection, playlist = playlist }

                    else
                        flow

                ConnectionSelected connection ->
                    if otherConnection /= connection then
                        PickOtherConnection { selection = ConnectionSelected otherConnection, playlist = playlist }

                    else
                        PickOtherConnection { selection = NoConnection, playlist = playlist }

        _ ->
            flow


selectedPlaylist : Context m -> Flow -> Maybe ( Playlist, PlaylistState )
selectedPlaylist ctx flow =
    case flow of
        PickPlaylist { selection } ->
            case selection of
                NoPlaylist ->
                    Nothing

                PlaylistSelected connection id ->
                    Context.getPlaylist ( connection, id ) ctx

        PickOtherConnection { playlist } ->
            Context.getPlaylist playlist ctx

        Transfer { playlist } ->
            Context.getPlaylist playlist ctx

        _ ->
            Nothing


clearSelection : Flow -> Flow
clearSelection flow =
    case flow of
        PickPlaylist _ ->
            PickPlaylist <| PlaylistSelection NoPlaylist

        PickOtherConnection _ ->
            PickPlaylist <| PlaylistSelection NoPlaylist

        _ ->
            flow
