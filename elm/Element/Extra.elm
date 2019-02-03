module Element.Extra exposing (noAttr)

import Element exposing (htmlAttribute)
import Html.Attributes as Html


noAttr : Element.Attribute msg
noAttr =
    htmlAttribute (Html.attribute "" "")
