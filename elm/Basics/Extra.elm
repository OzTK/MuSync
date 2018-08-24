module Basics.Extra exposing (pair, swap)


swap : (a -> b -> c) -> b -> a -> c
swap f a =
    \b -> f b a


pair : a -> b -> ( a, b )
pair a b =
    ( a, b )
