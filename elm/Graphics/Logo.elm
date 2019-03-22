module Graphics.Logo exposing (animated)

import Element.Extra as Element
import Graphics.Palette exposing (palette)
import Html exposing (Html)
import Svg exposing (animateTransform, defs, g, style, svg, text)
import Svg.Attributes exposing (additive, attributeName, begin, calcMode, d, dur, enableBackground, end, fill, from, id, keySplines, keyTimes, origin, to, transform, type_, version, viewBox, x, y)


animated : Html msg
animated =
    svg [ viewBox "0 0 119 45", id "logo", fill "white" ]
        [ g [ id "Text" ]
            [ g []
                [ Svg.path
                    [ id "M"
                    , fill (Element.toHex palette.primary)
                    , d "M1.62,7.78H7.25L12.82,16l5.54-8.19H24V29.12H17.17V21.44l-4.35,6.4-4.38-6.4v7.68H1.62Z"
                    ]
                    []
                ]
            , g []
                [ Svg.path
                    [ id "U"
                    , fill (Element.toHex palette.ternary)
                    , d "M35,29.67a12.17,12.17,0,0,1-3.65-.51,7.51,7.51,0,0,1-2.78-1.54A6.73,6.73,0,0,1,26.75,25a9.92,9.92,0,0,1-.62-3.68V7.78h6.82V21.06a2.72,2.72,0,0,0,.46,1.71,1.85,1.85,0,0,0,1.55.59,1.86,1.86,0,0,0,1.55-.59A2.73,2.73,0,0,0,37,21.06V7.78h6.85V21.35A9.92,9.92,0,0,1,43.2,25a6.65,6.65,0,0,1-1.79,2.59,7.67,7.67,0,0,1-2.8,1.54A12.17,12.17,0,0,1,35,29.67Z"
                    ]
                    []
                ]
            , g []
                [ Svg.path
                    [ id "S"
                    , fill (Element.toHex palette.quaternary)
                    , d "M45.39,22.5a10.52,10.52,0,0,0,1.47.35,11.6,11.6,0,0,0,1.46.26,14.09,14.09,0,0,0,1.65.1q1.47,0,1.47-1.09a1.22,1.22,0,0,0-.45-.85,13.53,13.53,0,0,0-1.14-1q-.69-.53-1.47-1.17a10.62,10.62,0,0,1-1.47-1.47,7.67,7.67,0,0,1-1.14-1.87,6,6,0,0,1-.45-2.38,6.15,6.15,0,0,1,.54-2.66,5.35,5.35,0,0,1,1.5-1.92,6.77,6.77,0,0,1,2.26-1.17,9.33,9.33,0,0,1,2.77-.4,14.84,14.84,0,0,1,1.54.08l1.38.14,1.38.19v6l-.58-.06-.58-.06c-.21,0-.44,0-.67,0l-.48,0a3,3,0,0,0-.54.08,1.11,1.11,0,0,0-.45.22.55.55,0,0,0-.19.45q0,.26.43.64t1.06.9q.62.51,1.38,1.18a9.54,9.54,0,0,1,1.38,1.54,9,9,0,0,1,1.06,2,6.56,6.56,0,0,1,.43,2.43,7.66,7.66,0,0,1-.45,2.64,5.62,5.62,0,0,1-1.39,2.14,6.66,6.66,0,0,1-2.42,1.44,10.35,10.35,0,0,1-3.49.53,21.25,21.25,0,0,1-2.26-.11q-1-.11-1.84-.27a15.49,15.49,0,0,1-1.7-.38Z"
                    ]
                    []
                ]
            , g []
                [ Svg.path
                    [ id "N"
                    , fill (Element.toHex palette.secondary)
                    , d "M79.57,7.78h5.6L91.06,16V7.78h6.69V29.12H92.11l-5.86-8.19v8.19H79.57Z"
                    ]
                    []
                ]
            , g []
                [ Svg.path
                    [ id "C"
                    , fill (Element.toHex palette.text)
                    , d "M99.5,18.47a11.49,11.49,0,0,1,.9-4.62,10.78,10.78,0,0,1,2.43-3.54,10.61,10.61,0,0,1,3.58-2.26,12.06,12.06,0,0,1,4.35-.78,13.61,13.61,0,0,1,3.25.35,15.42,15.42,0,0,1,2.45.8,11.55,11.55,0,0,1,2,1.12l-3.36,5.92a11.43,11.43,0,0,0-1.12-.74,10.88,10.88,0,0,0-1.3-.5A5.62,5.62,0,0,0,111,14a4.64,4.64,0,0,0-1.82.35,4.7,4.7,0,0,0-1.46,1,4.4,4.4,0,0,0-1,1.42,4.34,4.34,0,0,0-.35,1.74,4.19,4.19,0,0,0,.37,1.74,4.49,4.49,0,0,0,1,1.42,4.79,4.79,0,0,0,1.5,1,5,5,0,0,0,1.89.35,6,6,0,0,0,1.82-.26,6.69,6.69,0,0,0,1.34-.58,5,5,0,0,0,1.12-.83l3.36,5.92a9.53,9.53,0,0,1-2,1.25,17.41,17.41,0,0,1-2.46.83,12.84,12.84,0,0,1-3.3.38,12.68,12.68,0,0,1-4.61-.82,10.85,10.85,0,0,1-3.65-2.29,10.38,10.38,0,0,1-2.4-3.54A11.69,11.69,0,0,1,99.5,18.47Z"
                    ]
                    []
                ]
            ]
        , g
            [ id "Note"
            ]
            [ Svg.path
                [ id "Croche"
                , fill (Element.toHex palette.text)
                , d "M69.61,1.21,60,35.7c-.61-1.73-4.68-3.1-8-2.31-4,.94-6.51,4-5.7,7s4.66,4.5,8.62,3.56a8.07,8.07,0,0,0,5.17-3.53,7.26,7.26,0,0,0,.66-2.11L67.53,13.9c14,8,3.37,19.29.72,23.58C85.31,24,68.28,11.87,71,1.58Z"
                ]
                [ animateTransform [ type_ "scale", to "1 1", calcMode "spline", keySplines "0.1 0.8 0.51 0.95", keyTimes "0;0.2", begin "logo.mouseenter", end "logo.mouseleave", dur "0.2s", attributeName "transform", fill "freeze" ] []
                , animateTransform [ type_ "scale", to "0.5 0.5", calcMode "spline", keySplines "0.1 0.8 0.51 0.95", keyTimes "0;0.2", begin "logo.mouseleave+0.2s", dur "0.2s", attributeName "transform", fill "freeze" ] []
                ]
            , animateTransform [ id "note_in", type_ "translate", to "0 0", calcMode "spline", keySplines "0.1 0.8 0.51 0.95", keyTimes "0;0.2", begin "logo.mouseenter", dur "0.2s", attributeName "transform", fill "freeze" ] []
            , animateTransform [ id "note_out", type_ "translate", to "-15 10", calcMode "spline", keySplines "0.1 0.8 0.51 0.95", keyTimes "0;0.2", begin "logo.mouseleave+0.2s", dur "0.2s", attributeName "transform", fill "freeze" ] []
            ]
        ]
