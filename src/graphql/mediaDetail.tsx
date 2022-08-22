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
                description
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
                description
                type
                format
                status(version: 2)
                episodes
                duration
                chapters
                volumes
                genres
                isAdult
                averageScore
                meanScore
                popularity
                favourites
                nextAiringEpisode {
                    airingAt
                    timeUntilAiring
                    episode
                }
                mediaListEntry {
                    id
                    status
                }
                studios(isMain: true) {
                    edges {
                        isMain
                        node {
                            id
                            name
                        }
                    }
                }
                characterPreview: characters(perPage: 6, sort: [ROLE, RELEVANCE, ID]) {
                    edges {
                        id
                        role
                        name
                        voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
                            id
                            name {
                                userPreferred
                            }
                            language: languageV2
                            image {
                                large
                            }
                        }
                        node {
                            id
                            name {
                                userPreferred
                            }
                            image {
                                large
                            }
                        }
                    }
                }
            }
        }
    }
`