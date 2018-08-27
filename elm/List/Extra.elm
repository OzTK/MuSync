module List.Extra exposing (andThenMaybe, andThenResult, nonEmpty, withDefault)


withDefault : List a -> List a -> List a
withDefault placeholderList list =
    if List.isEmpty list then
        placeholderList

    else
        list


nonEmpty : (List a -> List a) -> List a -> List a
nonEmpty f list =
    if List.isEmpty list then
        list

    else
        f list


andThenResult : (a -> Result error b) -> List a -> Result error (List b)
andThenResult f list =
    List.foldl
        (\item result ->
            Result.map2 (::) (f item) result
        )
        (Result.Ok [])
        list


andThenMaybe : (a -> Maybe b) -> List a -> Maybe (List b)
andThenMaybe f list =
    List.foldl
        (\item result ->
            Maybe.map2 (::) (f item) result
        )
        (Just [])
        list
