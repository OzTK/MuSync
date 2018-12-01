module List.Extra exposing (andThenMaybe, find, ifNonEmpty, update, withDefault, zip)

import Basics.Extra exposing (uncurry)


withDefault : List a -> List a -> List a
withDefault placeholderList list =
    if List.isEmpty list then
        placeholderList

    else
        list


ifNonEmpty : (List a -> List a) -> List a -> List a
ifNonEmpty f list =
    if List.isEmpty list then
        list

    else
        f list


andThenMaybe : (a -> Maybe b) -> List a -> Maybe (List b)
andThenMaybe f list =
    List.foldl
        (\item result ->
            Maybe.map2 (::) (f item) result
        )
        (Just [])
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
