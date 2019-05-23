module Styles exposing (delayedTransition, transition)

import Basics.Extra exposing (apply)
import Element exposing (htmlAttribute)
import Html.Attributes as Html


transition : List String -> Element.Attribute msg
transition props =
    props
        |> String.join " .2s ease,"
        |> (++)
        |> apply " .2s ease"
        |> Html.style "transition"
        |> htmlAttribute


delayedTransition : Float -> String -> Element.Attribute msg
delayedTransition delay prop =
    htmlAttribute <| Html.style "transition" (prop ++ " .2s ease " ++ String.fromFloat delay ++ "s")
