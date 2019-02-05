module Element.Extra exposing (noAttr)

import Element exposing (Color, htmlAttribute)
import Html.Attributes as Html


noAttr : Element.Attribute msg
noAttr =
    htmlAttribute (Html.attribute "" "")
