module Basics.Extra exposing (apply, const, flip, uncurry)


flip : (a -> b -> c) -> b -> a -> c
flip f a =
    \b -> f b a


const : a -> (b -> a)
const value =
    \_ -> value


uncurry : (a -> b -> c) -> ( a, b ) -> c
uncurry f ( a, b ) =
    f a b


apply : a -> (a -> b) -> b
apply a f =
    f a
