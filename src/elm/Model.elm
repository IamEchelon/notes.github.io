module Model exposing (..)

import Note exposing (Note, noteDecoder)


type alias Model =
    { notes : List Note
    , alertMessage : Maybe String
    , signal : String
    , instrument : String
    , debuglog : String
    , mousedown : Bool
    , touchEngaged : Bool
    , modal : Bool
    , animate : Bool
    }


initialModel : Model
initialModel =
    { notes = []
    , alertMessage = Nothing
    , signal = ""
    , instrument = Maybe.withDefault "" (List.head synthesizers)
    , debuglog = ""
    , mousedown = False
    , touchEngaged = False
    , modal = True
    , animate = False
    }


{-| A list of selectable music instruments within Tone JS
-}
synthesizers : List String
synthesizers =
    [ "duosynth"
    , "fmsynth"
    , "amsynth"
    , "membsynth"
    , "monosynth"
    , "square"
    ]
