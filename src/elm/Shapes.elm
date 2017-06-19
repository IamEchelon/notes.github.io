module Shapes exposing (..)

import Html exposing (Html)
import Svg exposing (..)
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
        , x "0"
        , y "0"
        , viewBox "0 0 174 200"
        ]
        [ Svg.path
            [ d shapePath
            , fill color
            ]
            [ g [ fillRule "evenodd" ] [] ]
        ]
