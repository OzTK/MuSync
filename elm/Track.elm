module Track exposing
    ( Track
    , TrackId
    , TrackIdSerializationError
    , deserializeId
    , serializeId
    )

import Basics.Extra exposing (pair)
import Connection.Provider as Provider exposing (MusicProviderType(..))
import Model exposing (keyPartsSeparator)


type alias TrackId =
    ( String, MusicProviderType )


serializeId : TrackId -> String
serializeId ( id, pType ) =
    Provider.toString pType ++ keyPartsSeparator ++ id


type TrackIdSerializationError
    = InvalidKeyPartsCount
    | InvalidProviderType String


deserializeId : String -> Result TrackIdSerializationError TrackId
deserializeId rawId =
    let
        parts =
            String.split keyPartsSeparator rawId
    in
    case parts of
        [ pType, id ] ->
            pType
                |> Provider.fromString
                |> Maybe.map (pair id)
                |> Result.fromMaybe (InvalidProviderType pType)

        _ ->
            Err InvalidKeyPartsCount


type alias Track =
    { id : TrackId
    , title : String
    , artist : String
    }
