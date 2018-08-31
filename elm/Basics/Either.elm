module Basics.Either exposing (Either(..), unwrap)


type Either a b
    = Left a
    | Right b


unwrap : (a -> c) -> (b -> c) -> Either a b -> c
unwrap fLeft fRight e =
    case e of
        Left sth ->
            fLeft sth

        Right sth ->
            fRight sth
