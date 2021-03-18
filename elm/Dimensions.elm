module Dimensions exposing (DimensionPalette, dimensions)

import Element exposing (DeviceClass(..), height, padding, paddingEach, paddingXY, px, spacing, width)
import Element.Font as Font


scaled : Int -> Float
scaled =
    Element.modular 16 1.25


type alias DimensionPalette msg =
    { xxSmallText : Element.Attribute msg
    , xSmallText : Element.Attribute msg
    , smallText : Element.Attribute msg
    , mediumText : Element.Attribute msg
    , largeText : Element.Attribute msg
    , xSmallSpacing : Element.Attribute msg
    , smallSpacing : Element.Attribute msg
    , mediumSpacing : Element.Attribute msg
    , largeSpacing : Element.Attribute msg
    , xSmallPadding : Int
    , smallPadding : Int
    , smallPaddingAll : Element.Attribute msg
    , smallHPadding : Element.Attribute msg
    , smallVPadding : Element.Attribute msg
    , mediumPadding : Int
    , mediumPaddingAll : Element.Attribute msg
    , mediumPaddingTop : Element.Attribute msg
    , largePadding : Int
    , largePaddingAll : Element.Attribute msg
    , buttonImageWidth : Element.Attribute msg
    , buttonHeight : Element.Attribute msg
    , headerTopPadding : Element.Attribute msg
    , panelHeight : Int
    }


dimensions : { m | device : Element.Device } -> DimensionPalette msg
dimensions { device } =
    let
        { xSmallPadding, smallPadding, mediumPadding, largePadding } =
            case device.class of
                Phone ->
                    { xSmallPadding = scaled -3 |> round, smallPadding = scaled -2 |> round, mediumPadding = scaled 1 |> round, largePadding = scaled 3 |> round }

                _ ->
                    { xSmallPadding = scaled -2 |> round, smallPadding = scaled -1 |> round, mediumPadding = scaled 3 |> round, largePadding = scaled 5 |> round }
    in
    case device.class of
        Phone ->
            { xxSmallText = scaled -3 |> round |> Font.size
            , xSmallText = scaled -2 |> round |> Font.size
            , smallText = scaled -1 |> round |> Font.size
            , mediumText = scaled 1 |> round |> Font.size
            , largeText = scaled 2 |> round |> Font.size
            , xSmallSpacing = scaled -2 |> round |> spacing
            , smallSpacing = scaled 1 |> round |> spacing
            , mediumSpacing = scaled 3 |> round |> spacing
            , largeSpacing = scaled 5 |> round |> spacing
            , xSmallPadding = smallPadding
            , smallPadding = smallPadding
            , smallPaddingAll = padding smallPadding
            , smallHPadding = paddingXY smallPadding 0
            , smallVPadding = paddingXY 0 smallPadding
            , mediumPadding = mediumPadding
            , mediumPaddingAll = padding mediumPadding
            , mediumPaddingTop = paddingEach { top = mediumPadding, right = 0, bottom = 0, left = 0 }
            , largePadding = largePadding
            , largePaddingAll = largePadding |> padding
            , buttonImageWidth = scaled 4 |> round |> px |> width
            , buttonHeight = scaled 5 |> round |> px |> height
            , headerTopPadding = paddingEach { top = round (scaled -1), right = 0, bottom = 0, left = 0 }
            , panelHeight = 220
            }

        _ ->
            { xxSmallText = scaled -3 |> round |> Font.size
            , xSmallText = scaled -2 |> round |> Font.size
            , smallText = scaled -1 |> round |> Font.size
            , mediumText = scaled 1 |> round |> Font.size
            , largeText = scaled 3 |> round |> Font.size
            , xSmallSpacing = scaled -2 |> round |> spacing
            , smallSpacing = scaled 1 |> round |> spacing
            , mediumSpacing = scaled 3 |> round |> spacing
            , largeSpacing = scaled 9 |> round |> spacing
            , xSmallPadding = xSmallPadding
            , smallPadding = smallPadding
            , smallPaddingAll = padding smallPadding
            , smallHPadding = paddingXY smallPadding 0
            , smallVPadding = paddingXY 0 smallPadding
            , mediumPadding = mediumPadding
            , mediumPaddingAll = padding mediumPadding
            , mediumPaddingTop = paddingEach { top = mediumPadding, right = 0, bottom = 0, left = 0 }
            , largePadding = largePadding
            , largePaddingAll = largePadding |> padding
            , buttonImageWidth = scaled 6 |> round |> px |> width
            , buttonHeight = scaled 6 |> round |> px |> height
            , headerTopPadding = paddingEach { top = round (scaled 2), right = 0, bottom = 0, left = 0 }
            , panelHeight = 350
            }
