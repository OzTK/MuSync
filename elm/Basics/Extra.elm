module Basics.Extra exposing (pair, flip)


flip : (a -> b -> c) -> b -> a -> c
flip f a =
    \b -> f b a


pair : a -> b -> ( a, b )
pair a b =
    ( a, b )
