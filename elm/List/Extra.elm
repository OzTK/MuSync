module List.Extra exposing (withDefault, nonEmpty)


withDefault : List a -> List a -> List a
withDefault placeholderList list =
    if List.isEmpty list then
        placeholderList
    else
        list


nonEmpty : (List a -> List a) -> List a -> List a
nonEmpty f list =
    if List.isEmpty list then
        list
    else
        f list
