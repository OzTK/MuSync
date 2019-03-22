module Task.Extra exposing (resultSequence)

import Task exposing (Task)


taskAsResults : Task e r -> Task Never (List (Result e r))
taskAsResults =
    Task.map (List.singleton << Ok)
        >> Task.onError (Task.succeed << List.singleton << Err)


resultSequence : List (Task e r) -> Task Never (List (Result e r))
resultSequence tasks =
    case tasks of
        t :: [] ->
            taskAsResults t

        t :: rest ->
            t |> taskAsResults |> Task.map2 (++) (resultSequence rest)

        [] ->
            Task.succeed []
