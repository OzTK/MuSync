module Dict.Any.Extra exposing (insertAtAll)

import Dict.Any as Dict exposing (AnyDict)


insertAtAll : List key -> value -> AnyDict comparable key value -> AnyDict comparable key value
insertAtAll keys value dict =
    List.foldl
        (\key d ->
            Dict.insert key value d
        )
        dict
        keys
