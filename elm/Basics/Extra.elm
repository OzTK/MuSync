module Basics.Extra exposing (flip, const)


flip : (a -> b -> c) -> b -> a -> c
flip f a =
    \b -> f b a


const : a -> (b -> a)
const value =
    \_ -> value
