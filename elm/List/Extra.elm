module List.Extra exposing (find, flatten, update, withDefault, zip)

import Basics.Extra exposing (uncurry)


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
