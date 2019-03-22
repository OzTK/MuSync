module Element.Extra exposing (toHex)

import Element exposing (Color)
import Hex



-- Color -> Hex conversion


hexFromFloat =
    (*) 255 >> round >> Hex.toString


hexFromRGBA { red, green, blue, alpha } =
    "#" ++ hexFromFloat red ++ hexFromFloat green ++ hexFromFloat blue ++ hexFromFloat alpha


toHex : Color -> String
toHex =
    Element.toRgb >> hexFromRGBA
