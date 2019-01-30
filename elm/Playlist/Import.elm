module Playlist.Import exposing (PlaylistImportReport, TrackAndSearchResult, duplicateCount, failedTracks, isSuccessful, matchedTracks, report)

import Track exposing (Track)



-- Models


type alias TrackAndSearchResult =
    ( Track, Maybe Track )


successfulTracks : List TrackAndSearchResult -> List Track
successfulTracks =
    List.filterMap Tuple.second


type PlaylistImportReport
    = ImportIsSuccess (List Track)
    | ImportHasWarnings (List TrackAndSearchResult) Int


report : List TrackAndSearchResult -> Int -> PlaylistImportReport
report results dupes =
    let
        matched =
            successfulTracks results

        matchedTrackCount =
            List.length matched
    in
    if matchedTrackCount < List.length results || dupes > 0 then
        ImportHasWarnings results dupes

    else
        ImportIsSuccess matched


matchedTracks : PlaylistImportReport -> List Track
matchedTracks rpt =
    case rpt of
        ImportIsSuccess tracks ->
            tracks

        ImportHasWarnings tracks _ ->
            successfulTracks tracks


isSuccessful : PlaylistImportReport -> Bool
isSuccessful rpt =
    case rpt of
        ImportIsSuccess _ ->
            True

        ImportHasWarnings _ _ ->
            False


duplicateCount : PlaylistImportReport -> Int
duplicateCount status =
    case status of
        ImportIsSuccess _ ->
            0

        ImportHasWarnings _ dupes ->
            dupes


failedTracks : PlaylistImportReport -> List Track
failedTracks rpt =
    case rpt of
        ImportIsSuccess _ ->
            []

        ImportHasWarnings tracks _ ->
            List.filterMap
                (\( t, m ) ->
                    case m of
                        Just _ ->
                            Nothing

                        Nothing ->
                            Just t
                )
                tracks
