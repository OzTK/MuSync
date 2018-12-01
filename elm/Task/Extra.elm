module Task.Extra exposing (andThen2, resultSequence)

import Task exposing (Task)


andThen2 : (a -> b -> Task e c) -> Task e a -> Task e b -> Task e c
andThen2 f t =
    Task.andThen identity << Task.map2 f t


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
