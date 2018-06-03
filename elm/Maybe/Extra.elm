module Maybe.Extra exposing (mapTogether, toBool)


mapTogether : (a -> b) -> (a -> c) -> Maybe a -> Maybe ( b, c )
mapTogether f1 f2 maybe =
    case maybe of
        Just sth ->
            Just ( f1 sth, f2 sth )

        Nothing ->
            Nothing


toBool : Maybe a -> Bool
toBool =
    Maybe.map (\_ -> True) >> Maybe.withDefault False
