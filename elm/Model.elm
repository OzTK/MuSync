module Model exposing (UserInfo, keyPartsSeparator, keysSeparator)


type alias UserId =
    String


type alias UserInfo =
    { id : UserId
    , displayName : String
    }


keyPartsSeparator : String
keyPartsSeparator =
    "_"


keysSeparator : String
keysSeparator =
    "__"
