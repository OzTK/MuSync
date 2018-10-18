module Maybe.Extra exposing (fromBool, fromList, isDefined, mapTogether, not)


mapTogether : (a -> b) -> (a -> c) -> Maybe a -> Maybe ( b, c )
mapTogether f1 f2 maybe =
    case maybe of
        Just sth ->
            Just ( f1 sth, f2 sth )

        Nothing ->
            Nothing


isDefined : Maybe a -> Bool
isDefined =
    Maybe.map (\_ -> True) >> Maybe.withDefault False


fromBool : Bool -> Maybe Bool
fromBool b =
    if b then
        Just True

    else
        Nothing


not : Maybe any -> Maybe Bool
not maybe =
    case maybe of
        Just _ ->
            Nothing

        Nothing ->
            Just True


fromList : List (Maybe any) -> Maybe (List any)
fromList =
    List.foldr (Maybe.map2 (::)) <| Just []
