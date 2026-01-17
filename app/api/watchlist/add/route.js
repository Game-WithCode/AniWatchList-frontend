import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Watchlist from "@/models/WatchList";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import { use } from "react";
export async function POST(request) {
    try {
       

        // Get the user session
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        // Connect to the database
        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        const userId = user._id;
        // Parse the request body
        const body = await request.json();
        const { mal_id, title, image, category, userStatus, favorite, note, priority } = body;
        let itemId = Number(mal_id);
        let itemTitle = title;
        let itemImage = image;
        let itemCategory = category;
        const episodesProgress = body.episodesProgress || [];
        const totalEpisodes = body.totalEpisodes || 0;
        const rewatches = body.rewatches || 0;
        const Rating = body.rating || 0;
        const itemType = body.itemType;
        const isFavorite = body.favorite || false;
        const genre = body.genres || []

        let watchlist = await Watchlist.findOne({ userId });
        if (!watchlist) {
            watchlist = await Watchlist.create({
                userId,
                watchlist: {
                    anime: [],
                    manga: [],
                },
            });
        }

        if (!Array.isArray(watchlist.watchlist[itemType])) {
            watchlist.watchlist[itemType] = [];
        }
        let existing = await watchlist.watchlist[itemType].some((item) => item.
            mal_id === itemId);
        if (existing) {
            return NextResponse.json({ message: "Already added" }, { status: 200 });
        }

        if (itemType == "anime") {
            watchlist.watchlist.anime.push({
                mal_id: itemId,
                title: itemTitle,
                image: itemImage,
                category: itemCategory,
                priority: priority,
                genres: genre,
                episodesProgress: episodesProgress,
                totalEpisodes: totalEpisodes,
                rewatches: rewatches,
                userRating: Rating,
                favorite: favorite,
                UserStatus: userStatus,
                note: note,
                addedAt: new Date(),
                updatedAt: new Date(),
            });
        } else if (itemType == "manga") {
            const { VolumesProgress, chaptersProgress, totalVolumes, totalChapters } = body;
            watchlist.watchlist.manga.push({
                mal_id: itemId,
                title: itemTitle,
                image: itemImage,
                category: itemCategory,
                priority: priority,
                genres: genre,
                chaptersProgress: chaptersProgress,
                VolumesProgress: VolumesProgress,
                totalVolumes: totalVolumes,
                totalChapters: totalChapters,
                rewatches: rewatches,
                userRating: Rating,
                favorite: isFavorite,
                UserStatus: userStatus,
                note: note,
                addedAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await watchlist.save();
        return NextResponse.json(
            { message: "Item added to watchlist successfully" },
            { status: 201 }
        );
    }
    catch (error) {
        console.error("Error adding item to watchlist:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}