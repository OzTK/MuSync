module ApiClient exposing (Base, Endpoint, Full, actionEndpoint, appendPath, asAny, baseEndpoint, endpointFromLink, get, getWithRateLimit, post, queryEndpoint)

import Dict exposing (Dict)
import Http
import Json.Decode exposing (Decoder)
import Json.Encode as Json
import Model exposing (UserInfo)
import Playlist exposing (Playlist)
import Process
import RemoteData exposing (RemoteData(..), WebData)
import RemoteData.Http as Http exposing (Config)
import Task exposing (Task)
import Track exposing (Track)
import Url
import Url.Builder as Url exposing (QueryParameter)



-- Utils


delayAndRetry : Task Never (WebData a) -> Float -> Task Never (WebData a)
delayAndRetry task =
    (+) 1000
        >> Process.sleep
        >> Task.andThen (\_ -> withRateLimit task)


withRateLimit : Task Never (WebData a) -> Task Never (WebData a)
withRateLimit task =
    task
        |> Task.andThen
            (\result ->
                case result of
                    Failure (Http.BadStatus response) ->
                        if response.status.code == 429 then
                            response.headers
                                |> Dict.get "retry-after"
                                |> Maybe.andThen String.toFloat
                                |> Maybe.map (delayAndRetry task)
                                |> Maybe.withDefault (Task.succeed result)

                        else
                            Task.succeed result

                    _ ->
                        Task.succeed result
            )



-- Model


scheme =
    "https://"


type Endpoint m
    = Endpoint String


type Base
    = Base


type AnyFullEndpoint
    = FullNoQuery (Endpoint Full)
    | FullWithQuery (Endpoint FullAndQuery)


type Full
    = Full


type FullAndQuery
    = FullAndQuery


baseEndpoint : String -> Endpoint Base
baseEndpoint =
    Endpoint


actionEndpoint : Endpoint Base -> List String -> Endpoint Full
actionEndpoint (Endpoint base) path =
    Endpoint <| Url.crossOrigin base path []


queryEndpoint : Endpoint Base -> List String -> List QueryParameter -> AnyFullEndpoint
queryEndpoint (Endpoint base) path query =
    FullWithQuery <| Endpoint <| Url.crossOrigin base path query


endpointFromLink : Endpoint Base -> String -> Maybe (Endpoint Full)
endpointFromLink (Endpoint domain) link =
    Url.fromString link
        |> Maybe.andThen
            (\{ host } ->
                if String.contains domain link then
                    Just (Endpoint link)

                else
                    Nothing
            )


asAny : Endpoint Full -> AnyFullEndpoint
asAny =
    FullNoQuery


appendPath : String -> Endpoint Full -> Endpoint Full
appendPath segment (Endpoint url) =
    Endpoint (url ++ "/" ++ Url.percentEncode segment)



-- Public Api


get : Config -> AnyFullEndpoint -> Decoder m -> Task Never (WebData m)
get config endpoint =
    let
        url =
            case endpoint of
                FullNoQuery (Endpoint u) ->
                    u

                FullWithQuery (Endpoint u) ->
                    u
    in
    Http.getTaskWithConfig config url


post : Config -> Endpoint Full -> Decoder m -> Json.Value -> Task Never (WebData m)
post config (Endpoint url) =
    Http.postTaskWithConfig config url


getWithRateLimit : Config -> AnyFullEndpoint -> Decoder m -> Task Never (WebData m)
getWithRateLimit config endpoint decoder =
    get config endpoint decoder |> withRateLimit
