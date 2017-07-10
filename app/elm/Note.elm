module Note exposing (..)

import Json.Decode as ReadJson exposing (int, string, Decoder, field, succeed)


{-| The core building block of our app. Each note in this notation system must be initialized with a a shape, a color, and numeric value that represents MIDI output
-}
type alias Note =
    { color : String
    , shape : String
    , value : Int
    , tone_val : String
    , svgPath : String
    , hex_val : String
    , animate : Bool
    }


{-| Parses JSON data to setup each note
-}
noteDecoder : Decoder Note
noteDecoder =
    ReadJson.map7 Note
        (field "color" ReadJson.string)
        (field "shape" ReadJson.string)
        (field "value" ReadJson.int)
        (field "tone_val" ReadJson.string)
        (field "path" ReadJson.string)
        (field "hex_value" ReadJson.string)
        (succeed False)
