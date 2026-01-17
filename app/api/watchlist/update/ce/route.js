import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Watchlist from "@/models/WatchList";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

import User from "@/models/User";
export async function POST(request) {
    try {
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

        const body = await request.json();
        const { mal_id, title, image, category, userStatus, itemType, favorite, note, priority } = body;
        let itemId = Number(mal_id);
        let itemTitle = title || "N/A";
        let itemImage = image || "N/A";
        let itemCategory = category || "N/A";
        const episodesProgress = body.episodesProgress || [];
        const totalEpisodes = body.totalEpisodes || 0;
        const rewatches = body.rewatches || 0;
        const Rating = body.rating || 0;
        const isFavorite = body.favorite || false;
        //i want if userStatus is complete then add finish date also 

        let result;
        if (itemType == "manga") {
            const { chaptersProgress, VolumesProgress } = body;
            let updateFields = {
                [`watchlist.${itemType}.$.UserStatus`]: userStatus,
                [`watchlist.${itemType}.$.chaptersProgress`]: chaptersProgress,
                [`watchlist.${itemType}.$.VolumesProgress`]: VolumesProgress,
                [`watchlist.${itemType}.$.rewatches`]: rewatches,
                [`watchlist.${itemType}.$.userRating`]: Rating,
                [`watchlist.${itemType}.$.favorite`]: isFavorite,
                [`watchlist.${itemType}.$.priority`]: priority,
                [`watchlist.${itemType}.$.note`]: note,
                [`watchlist.${itemType}.$.updatedAt`]: new Date(),
            };

            let myUser = await Watchlist.findOne({ userId });
            const existingItem = myUser.watchlist[itemType].find(i => i.mal_id == itemId);
            // Add finishAt only if completed
            if (userStatus === "Completed" && !existingItem.finishAt) {
                updateFields[`watchlist.${itemType}.$.finishAt`] = new Date();
            }

            result = await Watchlist.updateOne(
                { userId, [`watchlist.${itemType}.mal_id`]: itemId },
                { $set: updateFields }
            );
        } else {
            let updateFields = {
                [`watchlist.${itemType}.$.UserStatus`]: userStatus,
                [`watchlist.${itemType}.$.episodesProgress`]: episodesProgress,
                [`watchlist.${itemType}.$.rewatches`]: rewatches,
                [`watchlist.${itemType}.$.userRating`]: Rating,
                [`watchlist.${itemType}.$.favorite`]: isFavorite,
                [`watchlist.${itemType}.$.note`]: note,
                [`watchlist.${itemType}.$.priority`]: priority,
                [`watchlist.${itemType}.$.updatedAt`]: new Date(),
            };

            let myUser = await Watchlist.findOne({ userId });
            const existingItem = myUser.watchlist[itemType].find(i => i.mal_id == itemId);
            // Add finishAt only if completed
            if (userStatus === "Completed" && !existingItem.finishAt) {
                updateFields[`watchlist.${itemType}.$.finishAt`] = new Date();
            }

            result = await Watchlist.updateOne(
                { userId, [`watchlist.${itemType}.mal_id`]: itemId },
                { $set: updateFields }
            );
        }

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "No matching item found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Progress updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error adding item to watchlist:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}