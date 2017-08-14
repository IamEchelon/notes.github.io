module View exposing (view)

import Html exposing (..)
import Note exposing (Note)
import Html.Events as Events
import MultiTouch exposing (..)
import Update exposing (Msg(..))
import Shapes exposing (makeSvg)
import Html.Attributes as Attr exposing (..)
import Model exposing (Model, initialModel, synthesizers)


view : Model -> Html Msg
view model =
    div [ class "notesBody", Events.onMouseUp MouseUp ]
        [ mobileModal model
        , instrument model
        , apiAlertMessage model.alertMessage
        ]


{-| This is the backsplash for setting our Audio context in ToneJS
-}
mobileModal : Model -> Html Msg
mobileModal model =
    div
        [ classList
            [ ( "modal", True )
            , ( "is-active", model.modal )
            , ( "is-hidden-desktop", True )
            ]
        ]
        [ div [ class "modal-background" ] []
        , div [ class "modal-content has-text-centered" ] [ modalButton model ]
        ]


modalButton : Model -> Html Msg
modalButton model =
    button
        [ classList [ ( "is-active", model.modal ) ]
        , id "playButton"
        , Events.onClick ClearModal
        ]
        [ text "Start" ]


{-| Creates a container for all components that create our instrument functionality
-}
instrument : Model -> Html Msg
instrument model =
    div [ class "instrument" ]
        [ keyboard model
        , div
            [ class "panel" ]
            [ instPanel model ]
        ]


keyboard : Model -> Html Msg
keyboard model =
    div [ class "keyboard" ]
        [ div [ id "octave-1" ] [ htmlKeys model ]
        , div [ id "octave-2" ] [ htmlKeys model ]
        , div [ id "octave-3" ] [ htmlKeys model ]
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
        ]
        [ Shapes.makeSvg note.svgPath note.hex_val ]


instPanel : Model -> Html Msg
instPanel model =
    div
        [ class "instpanel"
        ]
        [ selectSynth model
        , synthControls
        , transpControls
        , logo
        ]


selectSynth : Model -> Html Msg
selectSynth model =
    let
        synthOption synth =
            option [ value synth ] [ text synth ]

        synthOptions =
            List.map synthOption synthesizers
    in
        div
            [ classList
                [ ( "selectSynth", True )
                ]
            ]
            [ label
                [ class "label has-text-centered" ]
                [ text "Instruments"
                ]
            , select
                [ Events.onInput ChooseSound ]
                synthOptions
            ]


synthControls : Html Msg
synthControls =
    div
        [ class "controls" ]
        [ h1 [] [ text "Attack" ]
        , h1 [] [ text "Modulation" ]
        , h1 [] [ text "Wave" ]
        ]


transpControls : Html Msg
transpControls =
    div
        [ class "controls" ]
        [ h1 [] [ text "Play" ]
        , h1 [] [ text "Stop" ]
        , h1 [] [ text "Record" ]
        ]


logo : Html Msg
logo =
    div
        [ class "logo" ]
        [ img
            [ class "title", src "src/img/logo.png" ]
            []
        ]


apiAlertMessage : Maybe String -> Html Msg
apiAlertMessage alertMessage =
    case alertMessage of
        Just message ->
            div []
                [ Html.text message ]

        Nothing ->
            Html.text ""
