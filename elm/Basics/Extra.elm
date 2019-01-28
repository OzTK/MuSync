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


apply : a -> (a -> b) -> b
apply a f =
    f a


iif : ret -> ret -> Bool -> ret
iif whenTrue whenFalse test =
    if test then
        whenTrue

    else
        whenFalse
