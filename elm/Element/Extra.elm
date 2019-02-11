module Element.Extra exposing (noAttr, toHex)

import Element exposing (Color, htmlAttribute)
import Hex
import Html.Attributes as Html


noAttr : Element.Attribute msg
noAttr =
    htmlAttribute (Html.attribute "" "")



-- Color -> Hex conversion


hexFromFloat =
    (*) 255 >> round >> Hex.toString


hexFromRGBA { red, green, blue, alpha } =
    "#" ++ hexFromFloat red ++ hexFromFloat green ++ hexFromFloat blue ++ hexFromFloat alpha


toHex : Color -> String
toHex =
    Element.toRgb >> hexFromRGBA
