module UserInfo exposing (UserId, UserInfo)


type alias UserId =
    String


type alias UserInfo =
    { id : UserId
    , displayName : String
    }
