module List.Extra exposing (withDefault)


withDefault : List a -> List a -> List a
withDefault placeholderList list =
    if List.isEmpty list then
        placeholderList
    else
        list
