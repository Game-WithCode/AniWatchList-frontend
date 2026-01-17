export const allGenres = async (itemCategory) => {
    try {
        const api = process.env.NEXT_PUBLIC_BACKEND_URL
        const res = await fetch(`${api}/api/Genres/${itemCategory}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },

        });
        const data = await res.json();


        return data

    } catch (error) {
        console.error("Error saving progress:", error);
        return false

    }
}