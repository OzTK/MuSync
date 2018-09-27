module Connection.Selection exposing
    ( WithProviderSelection(..)
    , connection
    , data
    , importDone
    , importing
    , isSelected
    , map
    , noSelection
    , select
    , setData
    , type_
    )

import Connection exposing (ProviderConnection(..))
import Connection.Provider as Provider exposing (ConnectedProvider(..), MusicProviderType)
import Http
import Playlist exposing (Playlist)
import RemoteData exposing (RemoteData(..), WebData)
import SelectableList exposing (SelectableList)


type WithProviderSelection data
    = NoProviderSelected
    | Selected ProviderConnection (RemoteData Http.Error data)
    | Importing ConnectedProvider (RemoteData Http.Error data) Playlist


noSelection : WithProviderSelection data
noSelection =
    NoProviderSelected


select : ProviderConnection -> WithProviderSelection data
select con =
    Selected con NotAsked


importDone : WithProviderSelection data -> WithProviderSelection data
importDone selection =
    case selection of
        Importing con d _ ->
            Selected (Connected con) d

        _ ->
            selection


importing : WithProviderSelection data -> Playlist -> WithProviderSelection data
importing selection playlist =
    case selection of
        Selected (Connected con) d ->
            Importing con d playlist

        _ ->
            selection


isSelected : WithProviderSelection data -> Bool
isSelected selection =
    case selection of
        NoProviderSelected ->
            False

        _ ->
            True


data : WithProviderSelection data -> Maybe (RemoteData Http.Error data)
data selection =
    case selection of
        Selected _ d ->
            Just d

        _ ->
            Nothing


setData : WithProviderSelection data -> RemoteData Http.Error data -> WithProviderSelection data
setData selection d =
    case selection of
        Selected con _ ->
            Selected con d

        _ ->
            selection


type_ : WithProviderSelection data -> Maybe MusicProviderType
type_ selection =
    case selection of
        Selected provider _ ->
            Just <| Connection.type_ provider

        Importing provider _ _ ->
            Just <| Provider.type_ provider

        _ ->
            Nothing


connection : WithProviderSelection data -> Maybe ProviderConnection
connection selection =
    case selection of
        Selected provider _ ->
            Just provider

        Importing provider _ _ ->
            Just (Connected provider)

        _ ->
            Nothing


map : (a -> a) -> WithProviderSelection a -> WithProviderSelection a
map f selection =
    case selection of
        Selected con (Success d) ->
            Selected con (Success (f d))

        _ ->
            selection
