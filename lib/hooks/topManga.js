export const TopManga = async (itemCategory) => {
    try {
        const api = process.env.NEXT_PUBLIC_BACKEND_URL
        const res = await fetch(`${api}/api/manga/top`, {
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