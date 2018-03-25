module Html.Events.Extra exposing (onChange, onChangeTo)

import Html
import Html.Events exposing (on, targetValue, defaultOptions)
import Json.Decode as Json


onChange : (String -> msg) -> Html.Attribute msg
onChange tagger =
    on "change" (Json.map tagger targetValue)


onChangeTo : (to -> msg) -> Json.Decoder to -> Html.Attribute msg
onChangeTo tagger decoder =
    on "change" <| Json.map tagger <| Json.at [ "target", "value" ] decoder
