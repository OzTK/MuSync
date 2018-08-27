module Track exposing
    ( Track
    , TrackId
    , TrackIdSerializationError
    , deserializeId
    , serializeId
    )

import Basics.Extra exposing (pair)
import Model exposing (MusicProviderType, keyPartsSeparator)


type alias TrackId =
    ( String, MusicProviderType )


serializeId : TrackId -> String
serializeId ( id, pType ) =
    Debug.toString pType ++ keyPartsSeparator ++ id


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
                |> Model.providerFromString
                |> Maybe.map (pair id)
                |> Result.fromMaybe (InvalidProviderType pType)

        _ ->
            Err InvalidKeyPartsCount


type alias Track =
    { id : TrackId
    , title : String
    , artist : String
    }
