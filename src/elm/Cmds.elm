port module Cmds exposing (..)

{-| Communication ports that selects synthesizers and fires note events
-}


port initMobile : String -> Cmd msg


port noteToJS : String -> Cmd msg


port stopNote : String -> Cmd msg


port synthToJS : String -> Cmd msg
