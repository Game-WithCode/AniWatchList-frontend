
import { fectchAnilist } from './aniList';
export const GetMediaDetails = async (ID) => {
  let query = `
query ($mediaId: Int, ) {
  Media(id: $mediaId) {
    id
    type
    title {
      english
      romaji
    }
    averageScore
    bannerImage
    episodes
    coverImage {
      extraLarge
    }
    duration
    status
    description
    genres
    episodes
    format
    popularity
    volumes
    chapters
    trending
      trailer {
      id
      site
      thumbnail
    }
      rankings {
      rank
      type
      allTime
      context
    }
   }
}

`;
  const variables = {
    mediaId: ID,
  };

  try {
    const data = await fectchAnilist(query, variables);
    return data;
  } catch (error) {
    throw error;
  }
}