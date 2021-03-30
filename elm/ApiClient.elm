module ApiClient exposing
    ( AnyFullEndpoint
    , Base
    , Endpoint
    , Full
    , FullAndQuery
    , actionEndpoint
    , appendPath
    , appendQueryParam
    , baseEndpoint
    , baseEndpointProxied
    , chain
    , chain2
    , endpointFromLink
    , fullAsAny
    , fullQueryAsAny
    , get
    , getWithRateLimit
    , map
    , post
    , queryEndpoint
    )

import Dict
import Http
import Json.Decode exposing (Decoder)
import Json.Encode as Json
import Process
import RemoteData exposing (RemoteData(..), WebData)
import RemoteData.Http as Http exposing (Config)
import Task exposing (Task)
import Url
import Url.Builder as Url exposing (QueryParameter)
import Url.Parser exposing (query)



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


type alias EndpointInfo =
    { proxy : String, endpoint : String }


type Endpoint m
    = Endpoint EndpointInfo


updateEndpointUrl : Endpoint m -> Url.Url -> Endpoint m
updateEndpointUrl (Endpoint e) u =
    Endpoint { e | endpoint = Url.toString u }


type Base
    = Base


type AnyFullEndpoint
    = FullNoQuery (Endpoint Full)
    | FullWithQuery (Endpoint FullAndQuery)


fullEndpointUrl : AnyFullEndpoint -> String
fullEndpointUrl ep =
    case ep of
        FullNoQuery (Endpoint { proxy, endpoint }) ->
            proxy ++ endpoint

        FullWithQuery (Endpoint { proxy, endpoint }) ->
            proxy ++ endpoint


type Full
    = Full


type FullAndQuery
    = FullAndQuery


baseEndpoint : String -> Endpoint Base
baseEndpoint e =
    Endpoint { proxy = "", endpoint = e }


baseEndpointProxied : EndpointInfo -> Endpoint Base
baseEndpointProxied =
    Endpoint


actionEndpoint : Endpoint Base -> List String -> Endpoint Full
actionEndpoint (Endpoint base) path =
    Endpoint <| { base | endpoint = Url.crossOrigin base.endpoint path [] }


queryEndpoint : Endpoint Base -> List String -> List QueryParameter -> AnyFullEndpoint
queryEndpoint (Endpoint base) path query =
    FullWithQuery <| Endpoint <| { base | endpoint = Url.crossOrigin base.endpoint path query }


endpointFromLink : Endpoint Base -> String -> Maybe AnyFullEndpoint
endpointFromLink domain link =
    let
        (Endpoint endpoint) =
            domain
    in
    Url.fromString link
        |> Maybe.andThen
            (\{ host, query } ->
                case ( String.contains host endpoint.endpoint, query ) of
                    ( True, Nothing ) ->
                        Just <| fullAsAny (Endpoint { endpoint | endpoint = link })

                    ( True, Just _ ) ->
                        Just <| fullQueryAsAny (Endpoint { endpoint | endpoint = link })

                    _ ->
                        Nothing
            )


fullAsAny : Endpoint Full -> AnyFullEndpoint
fullAsAny =
    FullNoQuery


fullQueryAsAny : Endpoint FullAndQuery -> AnyFullEndpoint
fullQueryAsAny =
    FullWithQuery


appendPath : String -> AnyFullEndpoint -> AnyFullEndpoint
appendPath segment endpoint =
    case endpoint of
        FullNoQuery (Endpoint url) ->
            Endpoint { url | endpoint = url.endpoint ++ "/" ++ Url.percentEncode segment } |> fullAsAny

        FullWithQuery (Endpoint url) ->
            url.endpoint
                |> Url.fromString
                |> Maybe.map (\u -> { u | path = u.path ++ "/" ++ segment })
                |> Maybe.map (fullQueryAsAny << updateEndpointUrl (Endpoint url))
                |> Maybe.withDefault endpoint


appendQueryParam : QueryParameter -> AnyFullEndpoint -> Endpoint FullAndQuery
appendQueryParam param endpoint =
    let
        encodedParam =
            Url.toQuery [ param ] |> String.dropLeft 1
    in
    case endpoint of
        FullNoQuery (Endpoint actionUrl) ->
            actionUrl.endpoint
                |> Url.fromString
                |> Maybe.map
                    (\url ->
                        { url | query = Just encodedParam }
                    )
                |> Maybe.map (\u -> Endpoint { actionUrl | endpoint = Url.toString u })
                |> Maybe.withDefault (Endpoint actionUrl)

        FullWithQuery (Endpoint queryUrl) ->
            queryUrl.endpoint
                |> Url.fromString
                |> Maybe.map
                    (\url ->
                        { url
                            | query =
                                url.query
                                    |> Maybe.map (\q -> Just <| q ++ "&" ++ encodedParam)
                                    |> Maybe.withDefault (Just encodedParam)
                        }
                    )
                |> Maybe.map (updateEndpointUrl (Endpoint queryUrl))
                |> Maybe.withDefault (Endpoint queryUrl)



-- Public Api


get : Config -> AnyFullEndpoint -> Decoder m -> Task Never (WebData m)
get config endpoint =
    Http.getTaskWithConfig config (fullEndpointUrl endpoint)


post : Config -> AnyFullEndpoint -> Decoder m -> Json.Value -> Task Never (WebData m)
post config endpoint =
    Http.postTaskWithConfig config (fullEndpointUrl endpoint)


getWithRateLimit : Config -> AnyFullEndpoint -> Decoder m -> Task Never (WebData m)
getWithRateLimit config endpoint decoder =
    get config endpoint decoder |> withRateLimit


map : (a -> b) -> Task e (WebData a) -> Task e (WebData b)
map f =
    Task.map (RemoteData.map f)


chain : (a -> Task e (WebData b)) -> Task e (WebData a) -> Task e (WebData b)
chain f task =
    task
        |> Task.map (RemoteData.map f)
        |> Task.andThen
            (\data ->
                case data of
                    Success t2 ->
                        t2

                    Failure err ->
                        Task.succeed (Failure err)

                    _ ->
                        Task.succeed NotAsked
            )


chain2 : (a -> b -> Task e (WebData c)) -> Task e (WebData a) -> Task e (WebData b) -> Task e (WebData c)
chain2 f task1 task2 =
    Task.map2 (RemoteData.map2 f) task1 task2
        |> Task.andThen
            (\data ->
                case data of
                    Success t2 ->
                        t2

                    Failure err ->
                        Task.succeed (Failure err)

                    _ ->
                        Task.succeed NotAsked
            )
