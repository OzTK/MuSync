module SelectableList exposing
    ( SelectableList
    , clear
    , filterMap
    , find
    , fromList
    , hasSelection
    , isSelected
    , map
    , mapBoth
    , mapSelected
    , mapWithStatus
    , rest
    , select
    , selectFirst
    , selected
    , toList
    , upSelect
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
        Selected sel list ->
            Selected
                (if el == sel then
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


selectFirst : (a -> Bool) -> SelectableList a -> SelectableList a
selectFirst predicate sList =
    let
        list =
            toList sList
    in
    List.foldl
        (\el selection ->
            case selection of
                Selected _ _ ->
                    selection

                NotSelected l ->
                    if predicate el then
                        Selected el l

                    else
                        selection
        )
        (NotSelected list)
        list


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


isSelected : a -> SelectableList a -> Bool
isSelected item list =
    case list of
        Selected selection _ ->
            item == selection

        NotSelected _ ->
            False


rest : SelectableList a -> SelectableList a
rest sList =
    case sList of
        Selected sel list ->
            NotSelected <| List.filter ((/=) sel) list

        noSelection ->
            noSelection


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


mapWithStatus f sList =
    case sList of
        Selected el list ->
            Selected (f el True) <|
                List.map
                    (\elem ->
                        if elem == el then
                            f elem True

                        else
                            f elem False
                    )
                    list

        NotSelected list ->
            NotSelected <| List.map (\elem -> f elem False) list


filterMap f sList =
    case sList of
        Selected el list ->
            f el
                |> Maybe.map (\elem -> Selected elem (List.filterMap f list))
                |> Maybe.withDefault (NotSelected <| List.filterMap f list)

        NotSelected list ->
            NotSelected <| List.filterMap f list


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


find : (a -> Bool) -> SelectableList a -> Maybe a
find predicate sList =
    sList |> toList |> List.filter predicate |> List.head
