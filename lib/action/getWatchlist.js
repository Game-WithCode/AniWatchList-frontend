// lib/actions/watchlist.js
import dbConnect from "@/lib/dbConnect";
import Watchlist from "@/models/WatchList";
import User from "@/models/User";

export async function getWatchlistData(email) {
  try {
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) return null;

    const watchlistDoc = await Watchlist.findOne({ userId: user._id });
    // Return only the inner watchlist array/object
    return watchlistDoc ? watchlistDoc.watchlist : { anime: [], manga: [], scscreenshots:[] };
  } catch (error) {
    console.error("DB Action Error:", error);
    return null;
  }
}