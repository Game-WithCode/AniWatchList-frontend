import { itemfind, itemExists } from "./itemfind";

export const upsertItem = async (commonData, totalEpisodes, totalChapters, totalVolumes, progress) => {
    try {
        console.log("Upserting item with data:", commonData, totalEpisodes, totalChapters, totalVolumes, progress);
        // 1. Guard against invalid item types immediately
        if (commonData.itemType !== "anime" && commonData.itemType !== "manga") {
            console.error("Invalid itemType passed to upsertItem:", commonData.itemType);
            return { status: "error", message: "Invalid item type" };
        }

        const hasItem = await itemExists(commonData.itemId, commonData.itemType);

        const animeData = {
            mal_id: commonData.itemId,
            title: commonData.title,
            image: commonData.image,
            priority: commonData.priority,
            itemType: commonData.itemType,
            genres: commonData.genres,
            userStatus: commonData.UserStatus,
            category: commonData.format,
            episodesProgress: progress,
            favorite: commonData.favorite,
            rewatches: commonData.repeat,
            userRating: commonData.rating !== null ? Number(commonData.rating) : null,
            totalEpisodes: totalEpisodes,
            note: commonData.notes,
        };

        const mangaData = {
            ...animeData, // manga shares most fields, just override the specific ones
            chaptersProgress: progress,
            totalChapters: totalChapters,
            totalVolumes: totalVolumes
        };

        // 2. Determine payload and endpoint dynamically
        const payload = commonData.itemType === "anime" ? animeData : mangaData;
        const endpoint = hasItem ? `/api/watchlist/update/ce` : `/api/watchlist/add`;

        // 3. Execute a single, safe fetch
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        // 4. Safely handle the response
        if (!res) {
            return { status: "error", message: "Network error: No response received" };
        }

        if (res.ok) {
            return {
                status: "success",
                message: `Item ${hasItem ? 'updated in' : 'added to'} watchlist`
            };
        } else {
            return {
                status: "error",
                message: `Failed to ${hasItem ? 'update' : 'add'} item`
            };
        }

    } catch (error) {
        console.error("Error saving progress:", error);
        return { status: "error", message: "Failed to save progress" };
    }
}