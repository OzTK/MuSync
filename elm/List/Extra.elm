module List.Extra exposing (find, flatten, groupByOverwrite, update, withDefault, zip)

import Basics.Extra exposing (uncurry)
import Dict.Any as Dict exposing (AnyDict)


withDefault : List a -> List a -> List a
withDefault placeholderList list =
    if List.isEmpty list then
        placeholderList

    else
        list


update : (item -> Bool) -> (item -> item) -> List item -> List item
update predicate f =
    List.map
        (\item ->
            if predicate item then
                f item

            else
                item
        )


find : (elem -> Bool) -> List elem -> Maybe elem
find f list =
    case list of
        first :: rest ->
            if f first then
                Just first

            else
                find f rest

        [] ->
            Nothing


zip : ( List a, List b ) -> List ( a, b )
zip =
    uncurry (List.map2 Tuple.pair)


flatten : List (List a) -> List a
flatten =
    List.foldl (\l flat -> flat ++ l) []


groupByOverwrite : (key -> String) -> (a -> key) -> List a -> AnyDict String key a
groupByOverwrite keyBuilder grouper =
    List.foldl
        (\el dict ->
            Dict.insert (grouper el) el dict
        )
        (Dict.empty keyBuilder)
