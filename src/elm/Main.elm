port module Main exposing (..)

import Html exposing (..)
import Html.Attributes as Attr exposing (..)
import Html.Events as Events
import Http
import Json.Decode as Json exposing (int, string, Decoder, field, succeed)
import Dom.Scroll
import Task
import Shapes exposing (..)


-- MAIN


main : Program Never Model Msg
main =
    Html.program
        { init = ( initialModel, getNotes )
        , view = view
        , update = update
        , subscriptions = (always Sub.none)
        }



-- MODEL


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
    }


initialModel : Model
initialModel =
    { notes = []
    , alertMessage = Nothing
    , signal = ""
    , instrument = Maybe.withDefault "" (List.head synthesizers)
    , debuglog = ""
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



-- MESSAGES


type Msg
    = NoOp
    | GetNotes (Result Http.Error (List Note))
    | Trigger Note
    | Release Note
    | ChooseSound String
    | TouchNoteOn String
    | TouchNoteOff String



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
            in
                ( { model | notes = dbNotes }, Task.attempt (always NoOp) <| offset )

        GetNotes (Err error) ->
            ( { model | alertMessage = Just (httpErrorToMessage error) }, Cmd.none )

        Trigger note ->
            ( { model | signal = note.tone_val }
            , noteToJS note.tone_val
            )

        Release note ->
            ( { model | signal = "" }
            , noteToJS ""
            )

        ChooseSound synth ->
            ( { model | instrument = synth }
            , synthToJS synth
            )

        TouchNoteOn noteID ->
            ( { model | signal = noteID, debuglog = noteID }, noteToJS "C3" )

        TouchNoteOff noteID ->
            ( { model | signal = "", debuglog = "I am now off :(" ++ noteID }, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ displayNotes model.notes
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
        , Events.onMouseDown <| Trigger note
        , Events.onMouseEnter <| Trigger note
        , Events.onMouseLeave <| Release note
        , Events.onMouseUp <| Release note
        , myCustomHandler "touchstart" TouchNoteOn
        , myCustomHandler "touchend" TouchNoteOff
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



-- EXTERNAL


port noteToJS : String -> Cmd msg


port synthToJS : String -> Cmd msg


myCustomHandler : String -> (String -> Msg) -> Html.Attribute Msg
myCustomHandler eventType msg =
    Events.on eventType (Json.map msg targetNoteId)


targetNoteId : Json.Decoder String
targetNoteId =
    Json.at [ "target", "id" ] Json.string


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
