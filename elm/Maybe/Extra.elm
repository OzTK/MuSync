module Maybe.Extra exposing (filter, fromList, isDefined, not)


isDefined : Maybe a -> Bool
isDefined =
    Maybe.map (\_ -> True) >> Maybe.withDefault False


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


filter : (any -> Bool) -> Maybe any -> Maybe any
filter f =
    Maybe.andThen <|
        \value ->
            if f value then
                Just value

            else
                Nothing
