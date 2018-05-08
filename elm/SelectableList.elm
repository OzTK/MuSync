module SelectableList
    exposing
        ( SelectableList
        , fromList
        , toList
        , select
        , upSelect
        , clear
        , selected
        , rest
        , hasSelection
        , map
        , mapSelected
        , mapBoth
        , apply
        , find
        )


type SelectableList a
    = Selected a (List a)
    | NotSelected (List a)



-- Internal


findAndUpdate : (a -> a) -> a -> List a -> List a
findAndUpdate updater element =
    List.map
        (\el ->
            if el /= element then
                el
            else
                updater el
        )


update : (a -> a) -> a -> SelectableList a -> SelectableList a
update updater el sList =
    case sList of
        Selected selected list ->
            Selected
                (if el == selected then
                    updater el
                 else
                    el
                )
                (findAndUpdate updater el list)

        NotSelected list ->
            NotSelected (findAndUpdate updater el list)



-- Public


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


select : SelectableList a -> a -> SelectableList a
select sList el =
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


rest : SelectableList a -> List a
rest sList =
    case sList of
        Selected sel list ->
            List.filter ((/=) sel) list

        NotSelected list ->
            list


hasSelection : SelectableList a -> Bool
hasSelection sList =
    sList |> selected |> (/=) Nothing


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


mapBoth : (a -> b) -> (a -> b) -> SelectableList a -> SelectableList b
mapBoth fSelected fUnselected sList =
    case sList of
        Selected sel list ->
            Selected (fSelected sel) <|
                List.map
                    (\el ->
                        if el == sel then
                            fSelected el
                        else
                            fUnselected el
                    )
                    list

        NotSelected list ->
            NotSelected <| List.map fUnselected list


apply : (List a -> List a) -> SelectableList a -> SelectableList a
apply f sList =
    let
        list =
            sList |> toList |> f
    in
        case sList of
            Selected sel _ ->
                if List.member sel list then
                    Selected sel list
                else
                    NotSelected list

            NotSelected _ ->
                NotSelected list


find : (a -> Bool) -> SelectableList a -> Maybe a
find predicate sList =
    sList |> toList |> List.filter predicate |> List.head
