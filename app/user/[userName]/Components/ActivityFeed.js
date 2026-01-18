
import { formatDistanceToNow } from 'date-fns'; // Optional: for "2 hours ago" format
export const ActivityFeed = (userData) => {
    if (!userData) return []
    const animeActivity = userData.anime.map((item) => ({
        id: item.mal_id,
        title: item?.title,
        updatedAt: item.updatedAt,
        status: item.UserStatus,
        type: 'anime'
    }))
    animeActivity.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    animeActivity.slice(0, 4)
    const mangaActivity = userData.manga?.map((item) => ({
        id: item.mal_id,
        title: item?.title,
        updatedAt: item.updatedAt,
        status: item.UserStatus,
        type: 'manga'
    }))
    mangaActivity.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    mangaActivity.slice(0, 4)
    const screenshotActivity = userData.screenshots?.map((item) => ({
        id: item.mal_id,
        title: item?.title,
        updatedAt: item.updatedAt,
        status: item.UserStatus,
        type: 'screenshots'
    }))
    screenshotActivity.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    screenshotActivity.slice(0, 4)
    const allActivity = [...animeActivity, ...mangaActivity, ...screenshotActivity];
    // 5. Sort by Date (Newest First)
  allActivity.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });


  // 6. Return top 5 recent items
  return allActivity.slice(0, 5);
}
// --- Helper to get the correct verb for the UI ---
export const getActionVerb = (status, type) => {
    if(type == "screenshots") return "Update Screenshot"
    switch (status){
        case "Continue" : return type == "anime"?"Continue":"Reading"; 
        case "Future" : return "Future"; 
        case "Completed" : return "Completed"; 
        case "Paused" : return "On Hold"; 
        case "Dropped" : return "Dropped"; 
        case "Planning" : return "Plan to Watch"; 
        case "Rewatch" : return "ReWatching"; 
       default :return "Updated";
    }
}

