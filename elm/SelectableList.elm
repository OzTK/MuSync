module SelectableList exposing (SelectableList, fromList, toList, select, clear, selected, map)


type SelectableList a
    = Selected (List a) a
    | NotSelected (List a)


fromList : List a -> SelectableList a
fromList list =
    NotSelected list


toList : SelectableList a -> List a
toList sList =
    case sList of
        Selected list _ ->
            list

        NotSelected list ->
            list


select : a -> SelectableList a -> SelectableList a
select el sList =
    let
        list =
            toList sList
    in
        if List.member el list then
            Selected list el
        else
            NotSelected list


clear : SelectableList a -> SelectableList a
clear sList =
    NotSelected (toList sList)


selected : SelectableList a -> Maybe a
selected sList =
    case sList of
        Selected _ el ->
            Just el

        NotSelected _ ->
            Nothing


map : (a -> b) -> SelectableList a -> SelectableList b
map f sList =
    case sList of
        Selected list el ->
            Selected (List.map f list) (f el)

        NotSelected list ->
            NotSelected <| List.map f list
