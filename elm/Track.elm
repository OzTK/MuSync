module Track exposing
    ( Track
    , TrackId
    , deserializeId
    , serializeId
    )

import Model exposing (MusicProviderType)


type alias TrackId =
    ( MusicProviderType, String )


serializeId : ( MusicProviderType, String ) -> ( String, String )
serializeId ( pType, id ) =
    ( toString pType, id )


deserializeId : ( String, String ) -> Result String ( MusicProviderType, String )
deserializeId ( pName, id ) =
    pName
        |> Model.providerFromString
        |> Maybe.map (\p -> ( p, id ))
        |> Result.fromMaybe "The provided provider type is not valid"


type alias Track =
    { id : TrackId
    , title : String
    , artist : String
    }
