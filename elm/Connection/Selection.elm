module Connection.Selection exposing
    ( WithProviderSelection(..)
    , connection
    , data
    , importDone
    , importing
    , isSelected
    , map
    , noSelection
    , providerType
    , select
    , setData
    )

import Connection exposing (ProviderConnection(..))
import Connection.Provider as Provider exposing (ConnectedProvider(..))
import Http
import Playlist exposing (Playlist)
import RemoteData exposing (RemoteData(..), WebData)
import SelectableList exposing (SelectableList)


type WithProviderSelection providerType data
    = NoProviderSelected
    | Selected (ProviderConnection providerType) (RemoteData Http.Error data)
    | Importing (ConnectedProvider providerType) (RemoteData Http.Error data) Playlist


noSelection : WithProviderSelection providerType data
noSelection =
    NoProviderSelected


select : ProviderConnection providerType -> WithProviderSelection providerType data
select con =
    Selected con NotAsked


importDone : WithProviderSelection providerType data -> WithProviderSelection providerType data
importDone selection =
    case selection of
        Importing con d _ ->
            Selected (Connected con) d

        _ ->
            selection


importing : WithProviderSelection providerType data -> Playlist -> WithProviderSelection providerType data
importing selection playlist =
    case selection of
        Selected (Connected con) d ->
            Importing con d playlist

        _ ->
            selection


isSelected : WithProviderSelection providerType data -> Bool
isSelected selection =
    case selection of
        NoProviderSelected ->
            False

        _ ->
            True


data : WithProviderSelection providerType data -> Maybe (RemoteData Http.Error data)
data selection =
    case selection of
        Selected _ d ->
            Just d

        _ ->
            Nothing


setData : WithProviderSelection providerType data -> RemoteData Http.Error data -> WithProviderSelection providerType data
setData selection d =
    case selection of
        Selected con _ ->
            Selected con d

        _ ->
            selection


providerType : WithProviderSelection providerType data -> Maybe providerType
providerType selection =
    case selection of
        Selected provider _ ->
            Just <| Connection.type_ provider

        Importing provider _ _ ->
            Just <| Provider.type_ provider

        _ ->
            Nothing


connection : WithProviderSelection providerType data -> Maybe (ProviderConnection providerType)
connection selection =
    case selection of
        Selected provider _ ->
            Just provider

        Importing provider _ _ ->
            Just (Connected provider)

        _ ->
            Nothing


map : (a -> a) -> WithProviderSelection providerType a -> WithProviderSelection providerType a
map f selection =
    case selection of
        Selected con (Success d) ->
            Selected con (Success (f d))

        _ ->
            selection
