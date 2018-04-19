module SelectableList exposing (SelectableList, fromList, toList, select, upSelect, clear, selected, map, mapSelected)


type SelectableList a
    = Selected a (List a)
    | NotSelected (List a)


fromList : List a -> SelectableList a
fromList list =
    NotSelected list


toList : SelectableList a -> List a
toList sList =
    case sList of
        Selected _ list ->
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
            Selected el list
        else
            NotSelected list


upSelect : (a -> a) -> a -> SelectableList a -> SelectableList a
upSelect updater element sList =
    let
        list =
            toList sList

        updated =
            updater element
    in
        list
            |> List.map
                (\el ->
                    if el /= element then
                        el
                    else
                        updated
                )
            |> Selected updated


clear : SelectableList a -> SelectableList a
clear sList =
    NotSelected (toList sList)


selected : SelectableList a -> Maybe a
selected sList =
    case sList of
        Selected el _ ->
            Just el

        NotSelected _ ->
            Nothing


map : (a -> b) -> SelectableList a -> SelectableList b
map f sList =
    case sList of
        Selected el list ->
            Selected (f el) (List.map f list)

        NotSelected list ->
            NotSelected <| List.map f list


mapSelected : (a -> a) -> SelectableList a -> SelectableList a
mapSelected f sList =
    case sList of
        Selected el list ->
            upSelect f el sList

        _ ->
            sList
