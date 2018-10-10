module Flow exposing (Flow(..), gotoConnect, updateConnection)

import Connection exposing (ProviderConnection)
import Connection.Provider exposing (MusicProviderType)
import Dict.Any exposing (AnyDict)
import Playlist exposing (Playlist)


type Flow
    = Connect (List ProviderConnection)
    | PickPlaylists (AnyDict String MusicProviderType (List Playlist))



-- Connect


gotoConnect : List ProviderConnection -> Flow
gotoConnect connections =
    Connect connections


updateConnection : (ProviderConnection -> ProviderConnection) -> MusicProviderType -> Flow -> Flow
updateConnection updater pType flow =
    case flow of
        Connect connections ->
            connections
                |> List.map
                    (\con ->
                        if Connection.type_ con == pType then
                            updater con

                        else
                            con
                    )
                |> Connect

        f ->
            f



-- PickPlaylist
