port module Main exposing (..)

import Html exposing (..)
import Html.Attributes as Attr exposing (..)
import Html.Events as Events
import Http
import Json.Decode as Json exposing (int, string, Decoder, field, succeed)
import Dom.Scroll
import Task
import Shapes exposing (..)
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


type alias Note =
    { color : String
    , shape : String
    , value : Int
    , tone_val : String
    , svgPath : String
    , hex_val : String
    }


type alias Model =
    { notes : List Note
    , alertMessage : Maybe String
    , signal : String
    , instrument : String
    , debuglog : String
    , mousedown : Bool
    , touchEngaged : Bool
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
    }


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
            ( { model | alertMessage = Just (httpErrorToMessage error) }, Cmd.none )

        ChooseSound synth ->
            ( { model | instrument = synth }, synthToJS synth )

        -- Mouse Events
        MouseDown note ->
            if model.touchEngaged == True then
                model ! []
            else
                ( { model
                    | signal = note.tone_val
                    , mousedown = True
                  }
                , noteToJS note.tone_val
                )

        MouseEnter note ->
            if model.touchEngaged == True then
                model ! []
            else if model.mousedown == True then
                ( { model
                    | signal = note.tone_val
                  }
                , noteToJS note.tone_val
                )
            else
                model ! []

        MouseLeave ->
            ( { model | signal = "" }, noteToJS "" )

        MouseUp ->
            ( { model
                | signal = ""
                , mousedown = False
              }
            , Cmd.none
            )

        -- Touch Events
        StartTouch note ->
            ( { model
                | debuglog = "I registered: " ++ note.tone_val
                , touchEngaged = True
              }
            , noteToJS note.tone_val
            )

        EndTouch note ->
            ( { model
                | debuglog = "Note last touched: " ++ note.tone_val
                , touchEngaged = False
              }
            , noteToJS ""
            )

        CancelTouch note ->
            ( model, noteToJS "" )



-- View


view : Model -> Html Msg
view model =
    div [ Events.onMouseUp MouseUp ]
        [ button [ id "playButton", Events.onClick NoOp ] [ text "Start" ]
        , displayNotes model.notes
        , viewAlertMessage model.alertMessage
        , viewInst model
        ]


displayNotes : List Note -> Html Msg
displayNotes notes =
    let
        noteList =
            List.map viewNote notes
    in
        div [ class "notes", id "notes" ]
            [ div [ class "flexcontainer " ]
                noteList
            ]


viewNote : Note -> Html Msg
viewNote note =
    div
        [ class "note"
        , id (toString note.value)
        , draggable "false"
        , MultiTouch.onStart (always <| StartTouch note)
        , MultiTouch.onEnd (always <| EndTouch note)
        , MultiTouch.onCancel (always <| CancelTouch note)
        , Events.onMouseDown <| MouseDown note
        , Events.onMouseEnter <| MouseEnter note
        , Events.onMouseLeave MouseLeave
        , Events.onMouseUp MouseUp
        ]
        [ Shapes.makeSvg note.svgPath note.hex_val ]


viewAlertMessage : Maybe String -> Html Msg
viewAlertMessage alertMessage =
    case alertMessage of
        Just message ->
            div []
                [ Html.text message ]

        Nothing ->
            Html.text ""


viewInst : Model -> Html Msg
viewInst model =
    let
        synthOption synth =
            option [ value synth ] [ text synth ]

        synthOptions =
            List.map synthOption synthesizers
    in
        div []
            [ select [ Events.onInput ChooseSound ] synthOptions ]



-- External


port noteToJS : String -> Cmd msg


port synthToJS : String -> Cmd msg


noteDecoder : Decoder Note
noteDecoder =
    Json.map6 Note
        (field "color" Json.string)
        (field "shape" Json.string)
        (field "value" Json.int)
        (field "tone_val" Json.string)
        (field "path" Json.string)
        (field "hex_value" Json.string)


getNotes : Cmd Msg
getNotes =
    let
        notesUrl =
            "https://api.myjson.com/bins/u0bbj"
    in
        (Json.list noteDecoder)
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
