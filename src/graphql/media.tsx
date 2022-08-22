import { gql } from '@apollo/client'

export const mediaQuery = gql`
    query ($page: Int = 1, $perpage: Int = 20, $id: Int, $idIn: [Int], $type: MediaType, $format: [MediaFormat], $season: MediaSeason, $seasonYear: Int, $year: String, $genres: [String], $search: String, $onList: Boolean, $isAdult: Boolean = false, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
        Page(page: $page, perPage: $perpage) {
            pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
            }
            media(id: $id, id_in: $idIn, type: $type, format_in: $format, season: $season, seasonYear: $seasonYear, startDate_like: $year, genre_in: $genres, search: $search, onList: $onList, isAdult: $isAdult, sort: $sort) {
                id
                title {
                    userPreferred
                }
                coverImage {
                    extraLarge
                    large
                    color
                }
                startDate {
                    year
                    month
                    day
                }
                endDate {
                    year
                    month
                    day
                }
                bannerImage
                season
                seasonYear
                type
                format
                status(version: 2)
                episodes
                duration
                chapters
                volumes
                genres
            }
        }
    }
`