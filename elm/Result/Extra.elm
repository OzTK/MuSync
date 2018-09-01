module Result.Extra exposing (unwrap)


unwrap : Result a a -> a
unwrap r =
    case r of
        Ok data ->
            data

        Err error ->
            error
