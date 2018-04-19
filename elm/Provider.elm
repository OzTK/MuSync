module Provider
    exposing
        ( OAuthToken
        , WithProviderSelection(..)
        , ProviderConnection(..)
        , ConnectedProvider(..)
        , DisconnectedProvider(..)
        , connected
        , connectedWithToken
        , connectedType
        , disconnected
        , connecting
        , inactive
        , provider
        , connectionToMaybe
        , isConnected
        , isDisconnected
        , isConnecting
        , isInactive
        , providerError
        , providerHttpError
        , decodingError
        , noSelection
        , select
        , isSelected
        , setData
        , selectionProvider
        , mapSelection
        , connectedProviders
        , connectedProvider
        , flatMap
        , map
        , mapOn
        , find
        , filterByType
        , filter
        , toggle
        , getData
        )

import RemoteData exposing (RemoteData(NotAsked, Success))
import Http


type alias OAuthToken =
    String


type ProviderError
    = Http Http.Error
    | ProviderError String
    | DecodingError String


providerError : String -> ProviderError
providerError err =
    ProviderError err


providerHttpError : Http.Error -> ProviderError
providerHttpError err =
    Http err


decodingError : String -> ProviderError
decodingError err =
    DecodingError err



-- Provider connection


type ConnectedProvider providerType
    = ConnectedProvider providerType
    | ConnectedProviderWithToken providerType OAuthToken


connected : providerType -> ProviderConnection providerType
connected pType =
    Connected (ConnectedProvider pType)


connectedType : ConnectedProvider providerType -> providerType
connectedType connection =
    case connection of
        ConnectedProvider pType ->
            pType

        ConnectedProviderWithToken pType _ ->
            pType


connectedWithToken : providerType -> OAuthToken -> ProviderConnection providerType
connectedWithToken pType token =
    Connected (ConnectedProviderWithToken pType token)


type DisconnectedProvider providerType
    = DisconnectedProvider providerType


disconnected : providerType -> ProviderConnection providerType
disconnected pType =
    Disconnected (DisconnectedProvider pType)


type ConnectingProvider pType
    = ConnectingProvider pType


connecting : providerType -> ProviderConnection providerType
connecting pType =
    Connecting (ConnectingProvider pType)


type InactiveProvider providerType
    = InactiveProvider providerType


inactive : providerType -> ProviderConnection providerType
inactive pType =
    Inactive (InactiveProvider pType)


type ProviderConnection providerType
    = Inactive (InactiveProvider providerType)
    | Disconnected (DisconnectedProvider providerType)
    | Connecting (ConnectingProvider providerType)
    | Connected (ConnectedProvider providerType)


provider : ProviderConnection providerType -> providerType
provider con =
    case con of
        Inactive (InactiveProvider pType) ->
            pType

        Disconnected (DisconnectedProvider pType) ->
            pType

        Connecting (ConnectingProvider pType) ->
            pType

        Connected (ConnectedProvider pType) ->
            pType

        Connected (ConnectedProviderWithToken pType _) ->
            pType


connectionToMaybe : ProviderConnection providerType -> Maybe (ConnectedProvider providerType)
connectionToMaybe connection =
    case connection of
        Connected provider ->
            Just provider

        _ ->
            Nothing


isConnected : ProviderConnection providerType -> Bool
isConnected connection =
    case connection of
        Connected _ ->
            True

        _ ->
            False


isDisconnected : ProviderConnection providerType -> Bool
isDisconnected connection =
    case connection of
        Disconnected _ ->
            True

        _ ->
            False


isConnecting : ProviderConnection providerType -> Bool
isConnecting connection =
    case connection of
        Connecting _ ->
            True

        _ ->
            False


isInactive : ProviderConnection providerType -> Bool
isInactive connection =
    case connection of
        Inactive _ ->
            True

        _ ->
            False



-- List Helpers


connectedProviders : List (ProviderConnection providerType) -> List (ProviderConnection providerType)
connectedProviders =
    List.filterMap
        (\con ->
            case con of
                Connected provider ->
                    Just con

                _ ->
                    Nothing
        )


flatMap : (a -> b) -> List (ProviderConnection a) -> List b
flatMap f =
    List.map
        (\con ->
            case con of
                Inactive (InactiveProvider pType) ->
                    f pType

                Disconnected (DisconnectedProvider pType) ->
                    f pType

                Connecting (ConnectingProvider pType) ->
                    f pType

                Connected (ConnectedProvider pType) ->
                    f pType

                Connected (ConnectedProviderWithToken pType _) ->
                    f pType
        )


map :
    (ProviderConnection providerType -> providerType -> ProviderConnection providerType)
    -> List (ProviderConnection providerType)
    -> List (ProviderConnection providerType)
map f =
    List.map
        (\con ->
            let
                fcon =
                    f con
            in
                case con of
                    Inactive (InactiveProvider pType) ->
                        fcon pType

                    Disconnected (DisconnectedProvider pType) ->
                        fcon pType

                    Connecting (ConnectingProvider pType) ->
                        fcon pType

                    Connected (ConnectedProvider pType) ->
                        fcon pType

                    Connected (ConnectedProviderWithToken pType _) ->
                        fcon pType
        )


mapOn :
    providerType
    -> (ProviderConnection providerType -> ProviderConnection providerType)
    -> List (ProviderConnection providerType)
    -> List (ProviderConnection providerType)
mapOn pType f =
    List.map
        (\con ->
            case con of
                Inactive (InactiveProvider pt) ->
                    if pt == pType then
                        f con
                    else
                        con

                Disconnected (DisconnectedProvider pt) ->
                    if pt == pType then
                        f con
                    else
                        con

                Connecting (ConnectingProvider pt) ->
                    if pt == pType then
                        f con
                    else
                        con

                Connected (ConnectedProvider pt) ->
                    if pt == pType then
                        f con
                    else
                        con

                Connected (ConnectedProviderWithToken pt _) ->
                    if pt == pType then
                        f con
                    else
                        con
        )


find : providerType -> List (ProviderConnection providerType) -> Maybe (ProviderConnection providerType)
find pType connections =
    connections |> filterByType pType |> List.head


filterByType : providerType -> List (ProviderConnection providerType) -> List (ProviderConnection providerType)
filterByType pType =
    List.filter (\con -> provider con == pType)


filter :
    Maybe providerType
    -> (ProviderConnection providerType -> Bool)
    -> List (ProviderConnection providerType)
    -> List (ProviderConnection providerType)
filter pType f =
    List.filter
        (\con ->
            pType
                |> Maybe.map ((==) (provider con))
                |> Maybe.withDefault True
                |> (&&) (f con)
        )


toggle : providerType -> List (ProviderConnection providerType) -> List (ProviderConnection providerType)
toggle pType providers =
    mapOn pType
        (\con ->
            if not (isConnected con) then
                connecting pType
            else
                disconnected pType
        )
        providers



-- WithProviderSelection


type WithProviderSelection providerType data
    = NoProviderSelected
    | Selected (ProviderConnection providerType) (RemoteData ProviderError data)


noSelection : WithProviderSelection providerType data
noSelection =
    NoProviderSelected


select : ProviderConnection providerType -> WithProviderSelection providerType data
select connection =
    case connection of
        Connected provider ->
            Selected connection NotAsked

        _ ->
            NoProviderSelected


isSelected : WithProviderSelection providerType data -> Bool
isSelected selection =
    case selection of
        NoProviderSelected ->
            False

        _ ->
            True


setData : WithProviderSelection providerType data -> RemoteData ProviderError data -> WithProviderSelection providerType data
setData selection data =
    case selection of
        Selected con _ ->
            Selected con data

        _ ->
            selection


selectionProvider : WithProviderSelection providerType data -> Maybe providerType
selectionProvider selection =
    case selection of
        Selected (Connected (ConnectedProvider pType)) _ ->
            Just pType

        Selected (Connected (ConnectedProviderWithToken pType _)) _ ->
            Just pType

        _ ->
            Nothing


connectedProvider : WithProviderSelection providerType data -> Maybe (ConnectedProvider providerType)
connectedProvider selection =
    case selection of
        Selected (Connected provider) _ ->
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


getData : WithProviderSelection providerType data -> Maybe (RemoteData ProviderError data)
getData selection =
    case selection of
        Selected _ data ->
            Just data

        _ ->
            Nothing
