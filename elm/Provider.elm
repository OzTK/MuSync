module Provider
    exposing
        ( OAuthToken
        , WithProviderSelection(..)
        , ProviderConnection(..)
        , ConnectedProvider(..)
        , connected
        , connectedWithToken
        , disconnected
        , connecting
        , inactive
        , provider
        , connectionToMaybe
        , providerError
        , providerHttpError
        , decodingError
        , noSelection
        , select
        , isSelected
        , setData
        , getConnectedProvider
        , flatMapData
        , flatMap
        )

import RemoteData exposing (RemoteData, RemoteData(NotAsked, Success))
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

                    Connected (ConnectedProviderWithToken pType token) ->
                        fcon pType
        )


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
        SelectedConnected provider d ->
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


flatMapData : (a -> a) -> WithProviderSelection providerType a -> WithProviderSelection providerType a
flatMapData f selection =
    case selection of
        SelectedConnected p (Success d) ->
            SelectedConnected p (Success (f d))

        _ ->
            selection