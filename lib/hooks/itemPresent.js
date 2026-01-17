
export const ItemPresentCheck = async (item, itemType, userStatus, selectedEpisodes, repeatCount, rating, categoryType) => {
    const itemId = item.mal_id;
    const itemImage = item.images.jpg.image_url;
    const itemTitle = item.title_english;
    try {

        const res = await fetch('/api/watchlist/get', {
            method: "GET",
            headers: { "Content-Type": "application/json" },

        });
        const data = await res.json();
        const founditem = data?.watchlist?.[itemType].find(i => i.mal_id === itemId);
        if (!founditem) {
            const res = await fetch(`/api/watchlist/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mal_id: item.mal_id,
                    title: item.title_english,
                    image: item.images.jpg.image_url,
                    userStatus: userStatus,
                    itemType: itemType,
                    category: categoryType,
                    episodesProgress: selectedEpisodes.filter(ep => ep != null),
                    rewatches: repeatCount,
                    rating: rating,
                    totalEpisodes: item.episodes,
                }),
            });
            const result = await res.json();
            console.log("Item not presented so it successful present now")

        } else {
            const res = await fetch(`/api/watchlist/update/ce`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mal_id: item.mal_id,
                    title: item.title_english,
                    image: item.images.jpg.image_url,
                    userStatus: userStatus,
                    itemType: itemType,
                    category: categoryType,
                    episodesProgress: selectedEpisodes.filter(ep => ep != null),
                    rewatches: repeatCount,
                    rating: rating,
                    totalEpisodes: item.episodes,
                }),
            });
            const result = await res.json();
            console.log("Item  presented so it updated successfully")

        }
        return true

    } catch (error) {
        console.error("Error saving progress:", error);
        return false

    }
}
