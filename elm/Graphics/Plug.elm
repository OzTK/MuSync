module Graphics.Plug exposing (connected, disconnected)

import Element
import Html exposing (Html)
import Svg exposing (g, svg)
import Svg.Attributes exposing (d, enableBackground, fill, transform, version, viewBox, x, y)


connected =
    svg
        [ x "0px"
        , y "0px"
        , enableBackground "new 0 0 100 100"
        , version "1.1"
        , viewBox "-43 59 86 23"
        ]
        [ g [ transform "rotate(45)" ]
            [ g []
                [ Svg.path [ d "M79.859,20.143c-0.778-0.777-2.037-0.777-2.815,0l-9.222,9.223c-1.901-1.334-4.156-2.061-6.527-2.061 c-3.046,0-5.909,1.186-8.061,3.34l-5.621,5.619c-0.374,0.373-0.583,0.879-0.583,1.406s0.209,1.035,0.583,1.408l13.308,13.309 c0.39,0.389,0.898,0.582,1.408,0.582c0.509,0,1.019-0.193,1.407-0.582l5.621-5.619c3.962-3.965,4.38-10.141,1.275-14.584 l9.227-9.227C80.637,22.18,80.637,20.92,79.859,20.143z M66.543,43.953l-4.214,4.211L51.835,37.67l4.215-4.211 c1.4-1.402,3.264-2.174,5.245-2.174c1.982,0,3.846,0.773,5.248,2.174C69.434,36.354,69.434,41.059,66.543,43.953z" ] []
                , Svg.path [ d "M51.213,52.229l-4.352,4.352l-3.441-3.44l4.351-4.351c0.778-0.777,0.778-2.037,0-2.814c-0.777-0.777-2.036-0.777-2.814,0 l-4.351,4.351l-2.12-2.12c-0.777-0.777-2.037-0.777-2.814,0l-5.619,5.619c-3.964,3.965-4.383,10.141-1.276,14.585l-8.635,8.634 c-0.777,0.777-0.777,2.037,0,2.814c0.389,0.389,0.898,0.584,1.407,0.584c0.51,0,1.019-0.195,1.408-0.584l8.632-8.631 c1.9,1.334,4.154,2.061,6.525,2.061c3.045,0,5.907-1.186,8.062-3.34l5.619-5.619c0.777-0.777,0.777-2.037,0-2.814l-2.118-2.119 l4.352-4.352c0.777-0.777,0.777-2.037,0-2.814S51.99,51.451,51.213,52.229z M43.36,67.133c-1.402,1.4-3.266,2.174-5.247,2.174 s-3.845-0.773-5.247-2.174c-2.893-2.893-2.893-7.6,0-10.494l4.211-4.211l10.494,10.494L43.36,67.133z" ] []
                ]
            ]
        ]


disconnected : String -> Html msg
disconnected c =
    svg
        [ x "0px"
        , y "0px"
        , enableBackground "new 0 0 100 100"
        , version "1.1"
        , viewBox "-43 59 86 23"
        , fill c
        ]
        [ g [ transform "rotate(45)" ]
            [ g []
                [ Svg.path [ d "M79.859,20.143c-0.778-0.777-2.037-0.777-2.815,0l-9.222,9.223c-1.901-1.334-4.156-2.061-6.527-2.061 c-3.046,0-5.909,1.186-8.061,3.34l-5.621,5.619c-0.374,0.373-0.583,0.879-0.583,1.406s0.209,1.035,0.583,1.408l13.308,13.309 c0.39,0.389,0.898,0.582,1.408,0.582c0.509,0,1.019-0.193,1.407-0.582l5.621-5.619c3.962-3.965,4.38-10.141,1.275-14.584 l9.227-9.227C80.637,22.18,80.637,20.92,79.859,20.143z M66.543,43.953l-4.214,4.211L51.835,37.67l4.215-4.211 c1.4-1.402,3.264-2.174,5.245-2.174c1.982,0,3.846,0.773,5.248,2.174C69.434,36.354,69.434,41.059,66.543,43.953z" ] []
                , Svg.path [ d "M51.213,52.229l-4.352,4.352l-3.441-3.44l4.351-4.351c0.778-0.777,0.778-2.037,0-2.814c-0.777-0.777-2.036-0.777-2.814,0 l-4.351,4.351l-2.12-2.12c-0.777-0.777-2.037-0.777-2.814,0l-5.619,5.619c-3.964,3.965-4.383,10.141-1.276,14.585l-8.635,8.634 c-0.777,0.777-0.777,2.037,0,2.814c0.389,0.389,0.898,0.584,1.407,0.584c0.51,0,1.019-0.195,1.408-0.584l8.632-8.631 c1.9,1.334,4.154,2.061,6.525,2.061c3.045,0,5.907-1.186,8.062-3.34l5.619-5.619c0.777-0.777,0.777-2.037,0-2.814l-2.118-2.119 l4.352-4.352c0.777-0.777,0.777-2.037,0-2.814S51.99,51.451,51.213,52.229z M43.36,67.133c-1.402,1.4-3.266,2.174-5.247,2.174 s-3.845-0.773-5.247-2.174c-2.893-2.893-2.893-7.6,0-10.494l4.211-4.211l10.494,10.494L43.36,67.133z" ] []
                ]
            ]
        ]
