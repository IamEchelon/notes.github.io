module Main exposing (..)

import View exposing (view)
import Html exposing (program)
import Update exposing (update)
import Model exposing (Model, initialModel)


-- Main


main : Program Never Model Update.Msg
main =
    Html.program
        { init = ( initialModel, Update.getNotes )
        , view = view
        , update = update
        , subscriptions = (always Sub.none)
        }
