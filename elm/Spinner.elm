module Spinner exposing (progressBar)


import Element exposing (Element, centerX, centerY, column, paragraph, shrink, text, width)
import Element.Font as Font
import Html
import Html.Attributes as Html

progressBar : List (Element.Attribute msg) -> Maybe String -> Element msg
progressBar attrs message =
    let
        ifMessage v =
            message
                |> Maybe.map (v << text)
                |> Maybe.withDefault Element.none
    in
    column attrs
        [ Element.html <|
            Html.div
                [ Html.class "progress progress-sm progress-indeterminate" ]
                [ Html.div [ Html.class "progress-bar" ] [] ]
        , ifMessage <|
            \msg ->
                paragraph [ width shrink, centerX, centerY, Font.center ] [ msg ]
        ]