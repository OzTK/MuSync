module Result.Extra exposing (fromBool, unwrap)


unwrap : Result a a -> a
unwrap r =
    case r of
        Ok data ->
            data

        Err error ->
            error


fromBool : error -> Bool -> Result error ()
fromBool error test =
    if test then
        Ok ()

    else
        Err error
