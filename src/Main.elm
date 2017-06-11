port module Main exposing (..)

import Html exposing (..)
import Html.Attributes as Attr exposing (..)
import Html.Events as Event
import Http
import Json.Decode as Decode exposing (int, string, Decoder, field, succeed)


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
    }


initialModel : Model
initialModel =
    { notes = []
    , alertMessage = Nothing
    , signal = ""
    }



-- CSS


myStyle : String -> Html.Attribute Msg
myStyle color =
    Attr.style
        [ ( "backgroundColor", color )
        ]



-- MESSAGES


type Msg
    = GetNotes (Result Http.Error (List Note))
    | Trigger Note
    | Release Note



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GetNotes (Ok dbNotes) ->
            ( { model | notes = dbNotes }, Cmd.none )

        GetNotes (Err error) ->
            ( { model | alertMessage = Just (httpErrorToMessage error) }, Cmd.none )

        Trigger note ->
            ( { model | signal = ("Note Triggered: " ++ note.tone_val) }, signal note.tone_val )

        Release note ->
            ( { model | signal = "Note Released" }, signal "" )



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ h1 [ Attr.class "text-center" ] [ Html.text "Welcome to Notes" ]
        , displayNotes model.notes
        , viewAlertMessage model.alertMessage
        ]


viewNote : Note -> Html Msg
viewNote note =
    img
        [ class "note"
        , src ("images/" ++ (toString note.value) ++ ".svg")
        , Event.onMouseDown (Trigger note)
        , Event.onMouseUp (Release note)
        ]
        []


displayNotes : List Note -> Html Msg
displayNotes notes =
    let
        noteList =
            notes
                |> List.map viewNote
    in
        ol [ Attr.class "flexcontainer ", reversed True ] noteList


viewAlertMessage : Maybe String -> Html Msg
viewAlertMessage alertMessage =
    case alertMessage of
        Just message ->
            div []
                [ Html.text message ]

        Nothing ->
            Html.text ""



-- EXTERNAL


port signal : String -> Cmd msg


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
