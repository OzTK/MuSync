module List.Extra exposing (andThenMaybe, ifNonEmpty, update, withDefault)


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
