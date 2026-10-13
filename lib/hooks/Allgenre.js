import { fectchAnilist } from '@/lib/action/aniList';

export const allGenres = async () => {
    try {
        const query = `
            query {
                GenreCollection
            }
        `;

        const data = await fectchAnilist(query, {});
        return data;

    } catch (error) {
        console.error("Error fetching genres:", error);
        return null; // or throw error, but do not return a boolean
    }
}