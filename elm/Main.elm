module Main exposing (Model, Msg, update, view, subscriptions, init)

import Html exposing (..)


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    {}


type Msg
    = Deezer


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Deezer ->
            model ! []


view : Model -> Html Msg
view model =
    div []
        [ text "New Html Program"
        ]


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


init : ( Model, Cmd Msg )
init =
    ( {}, Cmd.none )
