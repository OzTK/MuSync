module Provider.Selection exposing (..)

import Http
import RemoteData exposing (WebData, RemoteData(NotAsked, Success))
import Provider exposing (ConnectedProvider(..))


type WithProviderSelection providerType data
    = NoProviderSelected
    | Selected (ConnectedProvider providerType) (RemoteData Http.Error data)


noSelection : WithProviderSelection providerType data
noSelection =
    NoProviderSelected


select : ConnectedProvider providerType -> WithProviderSelection providerType data
select connection =
    Selected connection NotAsked


isSelected : WithProviderSelection providerType data -> Bool
isSelected selection =
    case selection of
        NoProviderSelected ->
            False

        _ ->
            True


setData : WithProviderSelection providerType data -> RemoteData Http.Error data -> WithProviderSelection providerType data
setData selection data =
    case selection of
        Selected con _ ->
            Selected con data

        _ ->
            selection


selectionProvider : WithProviderSelection providerType data -> Maybe providerType
selectionProvider selection =
    case selection of
        Selected (ConnectedProvider pType) _ ->
            Just pType

        Selected (ConnectedProviderWithToken pType _) _ ->
            Just pType

        _ ->
            Nothing


connectedProvider : WithProviderSelection providerType data -> Maybe (ConnectedProvider providerType)
connectedProvider selection =
    case selection of
        Selected provider _ ->
            Just provider

        _ ->
            Nothing


mapSelection : (a -> a) -> WithProviderSelection providerType a -> WithProviderSelection providerType a
mapSelection f selection =
    case selection of
        Selected con (Success d) ->
            Selected con (Success (f d))

        _ ->
            selection


getData : WithProviderSelection providerType data -> Maybe (RemoteData Http.Error data)
getData selection =
    case selection of
        Selected _ data ->
            Just data

        _ ->
            Nothing
