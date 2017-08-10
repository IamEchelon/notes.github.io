module Shapes exposing (..)

import Svg exposing (..)
import Html exposing (Html)
import Svg.Attributes exposing (..)


-- Shape modeling


type alias Fill =
    String


type alias Path =
    String


makeSvg : Path -> Fill -> Html msg
makeSvg shapePath color =
    svg
        [ version "1.1"
        , x "30"
        , y "30"
        , viewBox "0 0 174 200"
        ]
        [ defs []
            [ Svg.clipPath
                [ id "hex" ]
                [ Svg.path [ strokeWidth "1", d "M86.6025404 0l86.6025406 50v100l-86.6025406 50L0 150V50" ] []
                ]
            ]
        , Svg.path
            [ id "hex"
            , d shapePath
            , fill color
            ]
            []
        ]
