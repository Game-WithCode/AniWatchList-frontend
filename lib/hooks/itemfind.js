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
export const itemExists = async (id,type) => {
    try {
               const res = await fetch(`/api/watchlist/get`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },

        });
        const data = await res.json();
        const itemExists = data?.watchlist?.[type]?.some(i => i.mal_id === id);
        return itemExists;
    } catch (error) {
        console.error("Error checking item existence:", error);
        return false;
    }
};
export const getItemDetails = async (id, type) => {
    try {
        const res = await fetch(`/api/watchlist/get`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        const itemDetails = data?.watchlist?.[type]?.find(i => i.mal_id === id);
        return itemDetails || null;
    } catch (error) {
        console.error("Error fetching item details:", error);
        return null;
    }   
}