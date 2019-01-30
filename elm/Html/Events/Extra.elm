module Html.Events.Extra exposing (onChangeTo)

import Html
import Html.Events exposing (on)
import Json.Decode as Json


onChangeTo : (to -> msg) -> Json.Decoder to -> Html.Attribute msg
onChangeTo tagger decoder =
    on "change" <| Json.map tagger <| Json.at [ "target", "value" ] decoder
