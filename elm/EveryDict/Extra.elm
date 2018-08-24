module EveryDict.Extra exposing (insertAtAll)

import EveryDict as Dict


insertAtAll : List key -> value -> Dict.EveryDict key value -> Dict.EveryDict key value
insertAtAll keys value dict =
    List.foldl
        (\key d ->
            Dict.insert key value d
        )
        dict
        keys
