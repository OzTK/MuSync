module Basics.Extra exposing (flip)


flip : (a -> b -> c) -> b -> a -> c
flip f a =
    \b -> f b a
