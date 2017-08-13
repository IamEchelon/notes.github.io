module Update exposing (Msg(..), update, getNotes)

import Http
import Cmds exposing (..)
import Note exposing (Note, noteDecoder)
import Json.Decode as ReadJson exposing (..)
import Model exposing (Model, initialModel, synthesizers)


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


getNotes : Cmd Msg
getNotes =
    let
        notesUrl =
            "https://api.myjson.com/bins/u0bbj"
    in
        (ReadJson.list noteDecoder)
            |> Http.get notesUrl
            |> Http.send GetNotes



-- Helper functions


updateAnimate : Note -> Note -> Note
updateAnimate note innernote =
    if innernote.tone_val == note.tone_val then
        { innernote | animate = True }
    else
        { innernote | animate = False }


stopAnimation : Note -> Note
stopAnimation note =
    { note | animate = False }



-- Messages used to trigger updates


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
            ({ model | notes = dbNotes } ! [])

        GetNotes (Err error) ->
            ({ model | alertMessage = Just (httpErrorToMessage error) } ! [])

        ChooseSound synth ->
            ( { model | instrument = synth }, synthToJS synth )

        -- Mouse Events
        MouseDown note ->
            let
                curriedAnim =
                    updateAnimate note
            in
                if model.touchEngaged == True then
                    model ! []
                else
                    ( { model
                        | signal = note.tone_val
                        , mousedown = True
                        , animate = True
                        , notes = List.map curriedAnim model.notes
                      }
                    , noteToJS note.tone_val
                    )

        MouseEnter note ->
            let
                curriedAnim =
                    updateAnimate note
            in
                if model.touchEngaged == True then
                    model ! []
                else if model.mousedown == True then
                    ( { model
                        | signal = note.tone_val
                        , notes = List.map curriedAnim model.notes
                      }
                    , noteToJS note.tone_val
                    )
                else
                    model ! []

        MouseLeave ->
            ( { model
                | signal = ""
                , notes = List.map stopAnimation model.notes
              }
            , stopNote ""
            )

        MouseUp ->
            ( { model
                | signal = ""
                , mousedown = False
                , notes = List.map stopAnimation model.notes
              }
            , stopNote ""
            )

        -- Touch Events
        StartTouch note ->
            let
                curriedAnim =
                    updateAnimate note
            in
                ( { model
                    | debuglog = "I registered: " ++ note.tone_val
                    , touchEngaged = True
                    , notes = List.map curriedAnim model.notes
                  }
                , noteToJS note.tone_val
                )

        EndTouch note ->
            ( { model
                | debuglog = "Note last touched: " ++ note.tone_val
                , touchEngaged = False
                , notes = List.map stopAnimation model.notes
              }
            , stopNote ""
            )

        CancelTouch note ->
            ( { model | notes = List.map stopAnimation model.notes }, noteToJS "" )

        Clear ->
            ( { model | modal = False }, initMobile "" )
