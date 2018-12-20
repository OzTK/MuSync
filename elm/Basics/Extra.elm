module Basics.Extra exposing (apply, const, flip, iif, uncurry)


flip : (a -> b -> c) -> b -> a -> c
flip f a =
    \b -> f b a


const : a -> (b -> a)
const value =
    \_ -> value


uncurry : (a -> b -> c) -> ( a, b ) -> c
uncurry f ( a, b ) =
    f a b


iif : (a -> Bool) -> (a -> result) -> (a -> result) -> a -> result
iif predicate whenTrue whenFalse value =
    if predicate value then
        whenTrue value

    else
        whenFalse value


apply : a -> (a -> b) -> b
apply a f =
    f a
