module Graphics.Note exposing (view)

import Svg exposing (defs, style, svg, text)
import Svg.Attributes exposing (class, d, id, viewBox)


view =
    svg [ viewBox "0 0 30 43.5" ]
        [ defs [] [ style [] [ text " .cls-1{fill:#294351;} " ] ]
        , Svg.path
            [ id "Croche"
            , d "M23.61.21,14,34.7c-.61-1.73-4.68-3.1-8-2.31-4,.94-6.51,4-5.7,7S5,43.85,8.92,42.91a8.07,8.07,0,0,0,5.17-3.53,7.26,7.26,0,0,0,.66-2.11L21.53,12.9c14,8,3.37,19.29.72,23.58C39.31,23,22.28,10.87,25,.58Z"
            , class "cls-1"
            ]
            []
        ]
