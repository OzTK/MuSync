module SelectableList exposing (SelectableList, fromList, toList, select, clear, selected, map)


type SelectableList a
    = SelectableList (List a) (Maybe a)


fromList : List a -> SelectableList a
fromList list =
    SelectableList list Nothing


toList : SelectableList a -> List a
toList (SelectableList list _) =
    list


select : a -> SelectableList a -> SelectableList a
select el (SelectableList l _) =
    if List.member el l then
        SelectableList l (Just el)
    else
        SelectableList l Nothing


clear : SelectableList a -> SelectableList a
clear (SelectableList l _) =
    SelectableList l Nothing


selected : SelectableList a -> Maybe a
selected (SelectableList _ selected) =
    selected


map : (a -> b) -> SelectableList a -> SelectableList b
map f (SelectableList l selected) =
    selected
        |> Maybe.map f
        |> SelectableList (List.map f l)
