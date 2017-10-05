module Spotify exposing (initFromUrl)

import Dict


initFromUrl : { a | hash : String } -> Maybe String
initFromUrl l =
    l.hash |> String.dropLeft 1 |> params |> Dict.get "access_token"


params : String -> Dict.Dict String String
params h =
    String.split "&" h |> List.filterMap extractParam |> Dict.fromList


extractParam : String -> Maybe ( String, String )
extractParam kvp =
    case String.split "=" kvp of
        k :: [ v ] ->
            Just ( k, v )

        _ ->
            Nothing
