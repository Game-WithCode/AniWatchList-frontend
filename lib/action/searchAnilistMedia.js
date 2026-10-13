import { fectchAnilist } from './aniList';

export const searchAnilistMedia = async ({ search, type, page = 1, perPage = 10, startDate, sort, genre, status, format, averageScoreLesser, averageScoreGreater } = {}) => {
  const query = `
    query ($page: Int, $perPage: Int, $type: MediaType, $sort: [MediaSort], $genreIn: [String], $status: MediaStatus, $format: MediaFormat, $averageScoreLesser: Int, $averageScoreGreater: Int, $search: String, $startDate: FuzzyDateInt) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          hasNextPage
          currentPage
        }
        media(type: $type, sort: $sort, genre_in: $genreIn, status: $status, format: $format, averageScore_lesser: $averageScoreLesser, averageScore_greater: $averageScoreGreater, search: $search, startDate: $startDate) {
          id
          type
          title {
            english
          }
          genres
          startDate {
            year
          }
          averageScore
          coverImage {
            extraLarge
          }
          description
          rankings {
            allTime
            rank
            context
          }
        }
      }
    }
  `;

  const variables = {
    search: search || undefined,
    type: type && type !== "all" ? type.toUpperCase() : undefined,
    page: parseInt(page) || 1,
    perPage: parseInt(perPage) || 10,
    startDate: startDate && startDate !== "all" ? parseInt(`${startDate}0000`) : undefined,
    sort: sort && sort !== "all" ? [sort] : undefined,
    genreIn: genre && genre.length > 0 ? (Array.isArray(genre) ? genre : genre.split(',')) : undefined,
    status: status && status !== "all" ? status.toUpperCase() : undefined,
    format: format && format !== "all" ? format.toUpperCase() : undefined,
    averageScoreLesser: averageScoreLesser ? parseInt(averageScoreLesser) * 10 : undefined,
    averageScoreGreater: averageScoreGreater ? parseInt(averageScoreGreater) * 10 : undefined
  };

  const cleanVariables = Object.fromEntries(
    Object.entries(variables).filter(([_, v]) => v !== undefined && v !== null && v !== "")
  );

  return await fectchAnilist(query, cleanVariables);
}