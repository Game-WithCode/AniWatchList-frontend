export const itemfind = async () => {
    try {
        
        const res = await fetch(`/api/watchlist/get`, {
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