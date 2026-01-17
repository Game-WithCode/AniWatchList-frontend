export const Browse = async (itemType, filterData) => {
    try {
        const api = process.env.NEXT_PUBLIC_BACKEND_URL
        let intialURL = `${api}/api/${itemType}/browse`;

        let params = Object.entries(filterData || {}).filter(([_, item]) => item !== null).map(([key, value]) => `${key}=${value}`)
 
        if (params.length > 0) {
            intialURL += `?${params.join('&')}`;
        }

        const res = await fetch(`${intialURL}`, {
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