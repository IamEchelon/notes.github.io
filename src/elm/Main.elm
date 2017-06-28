port module Main exposing (..)

import Html exposing (..)
import Html.Attributes as Attr exposing (..)
import Html.Events as Events
import Http
import Json.Decode as ReadJson exposing (int, string, Decoder, field, succeed)
import Dom.Scroll
import Task
import Shapes exposing (makeSvg)
import MultiTouch exposing (..)


-- Main


main : Program Never Model Msg
main =
    Html.program
        { init = ( initialModel, getNotes )
        , view = view
        , update = update
        , subscriptions = (always Sub.none)
        }



-- Model


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
    , modal = False
    , animate = False
    }


{-| A list of selectable music instruments within Tone JS
-}
synthesizers : List String
synthesizers =
    [ "Select a Sound"
    , "duosynth"
    , "fmsynth"
    , "amsynth"
    , "membsynth"
    , "monosynth"
    , "plucksynth"
    ]



-- Messages


type Msg
    = NoOp
    | GetNotes (Result Http.Error (List Note))
    | ChooseSound String
    | MouseDown Note
    | MouseEnter Note
    | MouseLeave
    | MouseUp
    | StartTouch Note
    | EndTouch Note
    | CancelTouch Note
    | Clear
    | SomeAction



-- Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            model ! []

        GetNotes (Ok dbNotes) ->
            let
                offset =
                    Dom.Scroll.toY "notes" 400
            in
                ( { model | notes = dbNotes }, Task.attempt (always NoOp) <| offset )

        GetNotes (Err error) ->
            ({ model | alertMessage = Just (httpErrorToMessage error) } ! [])

        ChooseSound synth ->
            ( { model | instrument = synth }, synthToJS synth )

        -- Mouse Events
        MouseDown note ->
            let
                updateAnimate innernote =
                    if innernote.tone_val == note.tone_val then
                        { innernote | animate = True }
                    else
                        { innernote | animate = False }
            in
                if model.touchEngaged == True then
                    model ! []
                else
                    ( { model
                        | signal = note.tone_val
                        , mousedown = True
                        , animate = True
                        , notes = List.map updateAnimate model.notes
                      }
                    , noteToJS note.tone_val
                    )

        MouseEnter note ->
            let
                updateAnimate innernote =
                    if innernote.tone_val == note.tone_val then
                        { innernote | animate = True }
                    else
                        { innernote | animate = False }
            in
                if model.touchEngaged == True then
                    model ! []
                else if model.mousedown == True then
                    ( { model
                        | signal = note.tone_val
                        , notes = List.map updateAnimate model.notes
                      }
                    , noteToJS note.tone_val
                    )
                else
                    model ! []

        MouseLeave ->
            let
                updateAnimate innernote =
                    { innernote | animate = False }
            in
                ( { model
                    | signal = ""
                    , notes = List.map updateAnimate model.notes
                  }
                , noteToJS ""
                )

        MouseUp ->
            let
                updateAnimate innernote =
                    { innernote | animate = False }
            in
                ( { model
                    | signal = ""
                    , mousedown = False
                    , notes = List.map updateAnimate model.notes
                  }
                , noteToJS ""
                )

        -- Touch Events
        StartTouch note ->
            ( { model
                | debuglog = "I registered: " ++ note.tone_val
                , touchEngaged = True
                , animate = True
              }
            , noteToJS note.tone_val
            )

        EndTouch note ->
            ( { model
                | debuglog = "Note last touched: " ++ note.tone_val
                , touchEngaged = False
                , animate = False
              }
            , noteToJS ""
            )

        CancelTouch note ->
            ( { model | animate = False }, noteToJS "" )

        Clear ->
            ( { model | modal = True }, initMobile "" )

        SomeAction ->
            let
                myMapper note =
                    { note | value = 0 }
            in
                { model | notes = List.map myMapper model.notes } ! []



-- View


view : Model -> Html Msg
view model =
    div [ class "notesBody", Events.onMouseUp MouseUp ]
        [ div [ classList [ ( "modal", True ), ( "hide", model.modal ) ] ]
            [ button
                [ classList [ ( "hide", model.modal ) ]
                , id "playButton"
                , Events.onClick Clear
                ]
                [ text "Start" ]
            ]
        , instrument model
        , apiAlertMessage model.alertMessage
        ]


{-| Creates a container for all components that create our instrument functionality
-}
instrument : Model -> Html Msg
instrument model =
    div [ class "instrument" ]
        [ htmlKeys model
        , div
            [ class "panel" ]
            [ selectSynth model ]
        ]


{-| Takes a note list and maps the values with our htmlNote below
-}
htmlKeys : Model -> Html Msg
htmlKeys model =
    let
        htmlNotes =
            List.map (htmlNote model) model.notes
    in
        div [ class "htmlKeys", id "notes" ] htmlNotes


htmlNote : Model -> Note -> Html Msg
htmlNote model note =
    div
        [ classList [ ( "htmlNote", True ), ( "keydown", note.animate ) ]
        , id (toString note.value)
        , MultiTouch.onStart (always <| StartTouch note)
        , MultiTouch.onEnd (always <| EndTouch note)
        , MultiTouch.onCancel (always <| CancelTouch note)
        , Events.onMouseDown <| MouseDown note
        , Events.onMouseEnter <| MouseEnter note
        , Events.onMouseLeave MouseLeave
        , Events.onMouseUp MouseUp
        , Events.onDoubleClick SomeAction
        ]
        [ Shapes.makeSvg note.svgPath note.hex_val ]


selectSynth : Model -> Html Msg
selectSynth model =
    let
        synthOption synth =
            option [ value synth ] [ text synth ]

        synthOptions =
            List.map synthOption synthesizers
    in
        div [ class "selectSynth" ]
            [ select
                [ Events.onInput ChooseSound ]
                synthOptions
            ]


apiAlertMessage : Maybe String -> Html Msg
apiAlertMessage alertMessage =
    case alertMessage of
        Just message ->
            div []
                [ Html.text message ]

        Nothing ->
            Html.text ""



-- External


port initMobile : String -> Cmd msg


port noteToJS : String -> Cmd msg


port synthToJS : String -> Cmd msg


{-| Parses our JSON data to setup each note
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


{-| Calls to the JSON api to retrieve our note values from a simple database
-}
getNotes : Cmd Msg
getNotes =
    let
        notesUrl =
            "https://api.myjson.com/bins/u0bbj"
    in
        (ReadJson.list noteDecoder)
            |> Http.get notesUrl
            |> Http.send GetNotes


httpErrorToMessage : Http.Error -> String
httpErrorToMessage error =
    case error of
        Http.NetworkError ->
            "Is the Server Running?"

        Http.BadStatus response ->
            toString response.status

        Http.BadPayload message _ ->
            "Decoding failed, " ++ message

        _ ->
            toString error
