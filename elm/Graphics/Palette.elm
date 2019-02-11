module Graphics.Palette exposing (ColorPalette, fade, palette)

import Element


type alias ColorPalette =
    { primary : Element.Color
    , primaryFaded : Element.Color
    , secondary : Element.Color
    , secondaryFaded : Element.Color
    , ternary : Element.Color
    , ternaryFaded : Element.Color
    , quaternary : Element.Color
    , quaternaryFaded : Element.Color
    , transparentWhite : Float -> Element.Color
    , transparent : Element.Color
    , white : Element.Color
    , black : Element.Color
    , text : Element.Color
    , textHighlight : Element.Color
    , textFaded : Element.Color
    }


palette : ColorPalette
palette =
    let
        white =
            Element.rgb255 255 255 255

        textColor =
            Element.rgb255 42 67 80

        secondary =
            Element.rgb255 69 162 134

        ternary =
            Element.rgb255 248 160 116

        quaternary =
            Element.rgb255 189 199 79
    in
    { primary = Element.rgb255 220 94 93
    , primaryFaded = Element.rgba255 220 94 93 0.1
    , secondary = secondary
    , secondaryFaded = secondary |> fade 0.7
    , ternary = ternary
    , ternaryFaded = ternary |> fade 0.2
    , quaternary = quaternary
    , quaternaryFaded = quaternary |> fade 0.2
    , transparent = Element.rgba255 255 255 255 0
    , white = white
    , transparentWhite = \t -> white |> fade t
    , black = Element.rgb255 0 0 0
    , text = textColor
    , textFaded = textColor |> fade 0.17
    , textHighlight = white
    }


fade : Float -> Element.Color -> Element.Color
fade alpha color =
    let
        rgbColor =
            Element.toRgb color
    in
    { rgbColor | alpha = alpha } |> Element.fromRgb
