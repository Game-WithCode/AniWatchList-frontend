import axios from 'axios';
export async function fectchAnilist(query, variables) {
    const url = 'https://graphql.anilist.co';
    let response;
    try {
        response = await axios.post(url, {
            query: query,
            variables: variables
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

    } catch (error) {
        console.error('Error fetching Anilist data:', error);
    }
    response = response.data;
    return response;
}