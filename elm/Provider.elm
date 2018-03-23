module Provider
    exposing
        ( OAuthToken
        , WithProviderSelection(..)
        , ProviderConnection(..)
        , ConnectedProvider(..)
        , DisconnectedProvider(..)
        , connected
        , connectedWithToken
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
        , disconnectSelection
        , isSelected
        , setData
        , getConnectedProvider
        , selectionProvider
        , flatMapData
        , flatMap
        , flatMapOn
        , filterByType
        , filter
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


flatMap :
    (ProviderConnection providerType -> providerType -> ProviderConnection providerType)
    -> List (ProviderConnection providerType)
    -> List (ProviderConnection providerType)
flatMap f =
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


flatMapOn :
    providerType
    -> (ProviderConnection providerType -> ProviderConnection providerType)
    -> List (ProviderConnection providerType)
    -> List (ProviderConnection providerType)
flatMapOn pType f =
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



-- WithProviderSelection


type WithProviderSelection providerType data
    = NoProviderSelected
    | SelectedDisconnected (DisconnectedProvider providerType)
    | SelectedConnecting (ConnectingProvider providerType)
    | SelectedConnected (ConnectedProvider providerType) (RemoteData ProviderError data)


noSelection : WithProviderSelection providerType data
noSelection =
    NoProviderSelected


select : ProviderConnection providerType -> WithProviderSelection providerType data
select connection =
    case connection of
        Connecting provider ->
            SelectedConnecting provider

        Disconnected provider ->
            SelectedDisconnected provider

        Connected provider ->
            SelectedConnected provider NotAsked

        Inactive _ ->
            NoProviderSelected


disconnectSelection : WithProviderSelection providerType data -> WithProviderSelection providerType data
disconnectSelection selection =
    case selection of
        SelectedConnected (ConnectedProvider p) _ ->
            SelectedDisconnected (DisconnectedProvider p)

        SelectedConnected (ConnectedProviderWithToken p _) _ ->
            SelectedDisconnected (DisconnectedProvider p)

        SelectedConnecting (ConnectingProvider p) ->
            SelectedDisconnected (DisconnectedProvider p)

        _ ->
            selection


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
        SelectedConnected provider _ ->
            SelectedConnected provider data

        _ ->
            selection


getConnectedProvider : WithProviderSelection providerType data -> Maybe (ConnectedProvider providerType)
getConnectedProvider selection =
    case selection of
        SelectedConnected provider _ ->
            Just provider

        _ ->
            Nothing


selectionProvider : WithProviderSelection providerType data -> Maybe providerType
selectionProvider selection =
    case selection of
        SelectedConnected (ConnectedProvider pType) _ ->
            Just pType

        SelectedConnected (ConnectedProviderWithToken pType _) _ ->
            Just pType

        SelectedConnecting (ConnectingProvider pType) ->
            Just pType

        SelectedDisconnected (DisconnectedProvider pType) ->
            Just pType

        NoProviderSelected ->
            Nothing


flatMapData : (a -> a) -> WithProviderSelection providerType a -> WithProviderSelection providerType a
flatMapData f selection =
    case selection of
        SelectedConnected p (Success d) ->
            SelectedConnected p (Success (f d))

        _ ->
            selection
