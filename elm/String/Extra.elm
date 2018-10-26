module String.Extra exposing (fromPair)

fromPair : String -> (String, String) -> String
fromPair separator (first, second) = first ++ separator ++ second