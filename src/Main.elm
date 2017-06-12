port module Main exposing (..)

import Html exposing (..)
import Html.Attributes as Attr exposing (..)
import Html.Events as Events
import Http
import Json.Decode as Decode exposing (int, string, Decoder, field, succeed)
import MultiTouch as Touch
import Dom.Scroll
import Task


-- MAIN


main : Program Never Model Msg
main =
    Html.program
        { init = ( initialModel, getNotes )
        , view = view
        , update = update
        , subscriptions = (\_ -> Sub.none)
        }



-- MODEL


type alias Note =
    { color : String
    , shape : String
    , value : Int
    , tone_val : String
    }


type alias Model =
    { notes : List Note
    , alertMessage : Maybe String
    , signal : String
    , instrument : String
    }


type alias SendJS =
    { noteToJS : String, synthToJS : String, updateToJS : Bool }


initialModel : Model
initialModel =
    { notes = []
    , alertMessage = Nothing
    , signal = ""
    , instrument = Maybe.withDefault "" (List.head synthesizers)
    }


synthesizers : List String
synthesizers =
    [ "duosynth", "fmsynth", "amsynth", "membsynth", "monosynth", "plucksynth" ]



-- CSS
-- MESSAGES


type Msg
    = NoOp
    | GetNotes (Result Http.Error (List Note))
    | Trigger Note
    | Release Note
    | ChooseSound String



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            model ! []

        GetNotes (Ok dbNotes) ->
            let
                offset =
                    Dom.Scroll.toY "notes" 400

                scroll =
                    Dom.Scroll.toY "76" 300
            in
                ( { model | notes = dbNotes }, Task.attempt (always NoOp) <| offset )

        GetNotes (Err error) ->
            ( { model | alertMessage = Just (httpErrorToMessage error) }, Cmd.none )

        Trigger note ->
            ( { model | signal = note.tone_val }
            , toJS (SendJS note.tone_val model.instrument False)
            )

        Release note ->
            ( { model | signal = "" }
            , toJS (SendJS "" model.instrument False)
            )

        ChooseSound synth ->
            ( { model | instrument = synth }
            , toJS (SendJS "" model.instrument True)
            )



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ displayNotes model.notes
        , viewAlertMessage model.alertMessage
        , viewInst model
        ]


viewNote : Note -> Html Msg
viewNote note =
    img
        [ class "note"
        , id (toString note.value)
        , draggable "false"
        , src ("images/" ++ (toString note.value) ++ ".svg")
        , Events.onMouseDown (Trigger note)
        , Events.onMouseLeave (Release note)
        , Events.onMouseUp (Release note)
        ]
        []


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


displayNotes : List Note -> Html Msg
displayNotes notes =
    let
        noteList =
            notes
                |> List.map viewNote
    in
        div [ class "notes", id "notes" ]
            [ ol [ class "flexcontainer ", reversed True ] noteList
            ]


viewAlertMessage : Maybe String -> Html Msg
viewAlertMessage alertMessage =
    case alertMessage of
        Just message ->
            div []
                [ Html.text message ]

        Nothing ->
            Html.text ""



-- EXTERNAL


port toJS : SendJS -> Cmd msg



-- port selectSynth : String -> Cmd msg


noteDecoder : Decoder Note
noteDecoder =
    Decode.map4 Note
        (field "color" Decode.string)
        (field "shape" Decode.string)
        (field "value" Decode.int)
        (field "tone_val" Decode.string)


getNotes : Cmd Msg
getNotes =
    let
        notesUrl =
            "https://api.myjson.com/bins/1aojyd"
    in
        (Decode.list noteDecoder)
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
