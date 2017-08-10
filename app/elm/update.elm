module Update exposing (..)

import Note exposing (..)
import Model
import Task
import Ports


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
                , stopNote ""
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
                , stopNote ""
                )

        -- Touch Events
        StartTouch note ->
            let
                updateAnimate innernote =
                    if innernote.tone_val == note.tone_val then
                        { innernote | animate = True }
                    else
                        { innernote | animate = False }
            in
                ( { model
                    | debuglog = "I registered: " ++ note.tone_val
                    , touchEngaged = True
                    , notes = List.map updateAnimate model.notes
                  }
                , noteToJS note.tone_val
                )

        EndTouch note ->
            let
                updateAnimate innernote =
                    { innernote | animate = False }
            in
                ( { model
                    | debuglog = "Note last touched: " ++ note.tone_val
                    , touchEngaged = False
                    , notes = List.map updateAnimate model.notes
                  }
                , stopNote ""
                )

        CancelTouch note ->
            let
                updateAnimate innernote =
                    { innernote | animate = False }
            in
                ( { model | notes = List.map updateAnimate model.notes }, noteToJS "" )

        Clear ->
            ( { model | modal = False }, initMobile "" )
