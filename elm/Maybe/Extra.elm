module Maybe.Extra exposing (mapTogether)


mapTogether : (a -> b) -> (a -> c) -> Maybe a -> Maybe ( b, c )
mapTogether f1 f2 maybe =
    case maybe of
        Just sth ->
            Just ( f1 sth, f2 sth )

        Nothing ->
            Nothing
