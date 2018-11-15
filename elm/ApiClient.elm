module ApiClient exposing (delayAndRetry)

import Dict exposing (Dict)
import Http
import Json.Decode exposing (Decoder)
import Model exposing (UserInfo)
import Playlist exposing (Playlist)
import Process
import RemoteData exposing (RemoteData(..), WebData)
import RemoteData.Http as Http exposing (Config)
import Task exposing (Task)
import Track exposing (Track)



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


type Full
    = Full


type FullAndQuery
    = FullAndQuery


baseEndpoint : String -> Endpoint Base
baseEndpoint =
    Endpoint


actionEndpoint : Endpoint Base -> String -> Endpoint Full
actionEndpoint (Endpoint base) resource =
    Endpoint (base ++ "/" ++ resource)


type Query
    = Query (Dict String String)


serializeQuery : Query -> String
serializeQuery (Query map) =
    Dict.foldl (\name value qString -> qString ++ "&" ++ name ++ "=" ++ value) "?" map


queryEndpoint : Endpoint Base -> String -> Query -> Endpoint Full
queryEndpoint (Endpoint base) resource query =
    Endpoint (base ++ "/" ++ resource)



-- Public Api


get : Config -> Endpoint Full -> Decoder m -> Task Never (WebData m)
get config (Endpoint url) =
    Http.getTaskWithConfig config url


getWithRateLimit : Config -> Endpoint Full -> Decoder m -> Task Never (WebData m)
getWithRateLimit config endpoint decoder =
    get config endpoint decoder |> withRateLimit
