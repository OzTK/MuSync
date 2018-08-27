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

import Connection.Provider exposing (ConnectedProvider(..))
import Http
import Playlist exposing (Playlist)
import RemoteData exposing (RemoteData(..), WebData)


type WithProviderSelection providerType data
    = NoProviderSelected
    | Selected (ConnectedProvider providerType) (RemoteData Http.Error data)
    | Importing (ConnectedProvider providerType) (RemoteData Http.Error data) Playlist


noSelection : WithProviderSelection providerType data
noSelection =
    NoProviderSelected


select : ConnectedProvider providerType -> WithProviderSelection providerType data
select con =
    Selected con NotAsked


importDone : WithProviderSelection providerType data -> WithProviderSelection providerType data
importDone selection =
    case selection of
        Importing con d _ ->
            Selected con d

        _ ->
            selection


importing : WithProviderSelection providerType data -> Playlist -> WithProviderSelection providerType data
importing selection playlist =
    case selection of
        Selected con d ->
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
        Selected (ConnectedProvider pType) _ ->
            Just pType

        Selected (ConnectedProviderWithToken pType _ _) _ ->
            Just pType

        _ ->
            Nothing


connection : WithProviderSelection providerType data -> Maybe (ConnectedProvider providerType)
connection selection =
    case selection of
        Selected provider _ ->
            Just provider

        _ ->
            Nothing


map : (a -> a) -> WithProviderSelection providerType a -> WithProviderSelection providerType a
map f selection =
    case selection of
        Selected con (Success d) ->
            Selected con (Success (f d))

        _ ->
            selection
