import { fectchAnilist } from './aniList';
export const GetTrending = async ({Type,perPage=10,page=1}= {}) => {

  let query = `
query ( $page: Int, $perPage: Int, $mediaType2: MediaType) {
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (type: $mediaType2, sort: TRENDING_DESC) {
        id
        title {
          romaji
          english
        }
        type
        genres
        averageScore
        description
          coverImage {
          extraLarge
        }
      }
    }

}

`;
  const variables = {
    perPage: perPage,
    mediaType2: Type,
    rating: null,
    page: page
  }


  try {
    const data = await fectchAnilist(query, variables);
    return data;
  } catch (error) {
    throw error;
  }
}