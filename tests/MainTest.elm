module MainTest exposing (suite)

import Test exposing (..)
import Expect


suite : Test
suite =
    describe "Project's initialization" [ test "succeeds" <| \_ -> Expect.pass ]
