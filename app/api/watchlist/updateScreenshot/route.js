import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Watchlist from "@/models/WatchList";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
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
        const ImageId = body._id;
        let result;
        let myUser = await Watchlist.findOne({ userId });
        const existingItemIndex = myUser.watchlist.screenshots.findIndex(i => i._id.toString() === ImageId);
        if (existingItemIndex === -1) {
            return NextResponse.json(
                { message: "Screenshot not found" },
                { status: 404 }
            );
        }
        // Update fields
        //Get data from body
        const { userStatus, category, userRating, rewatches, totalEP, currentEP, notes, priority,title,description,isFavorite } = body;
        const parsedUserRating = parseInt(userRating);
        const parsedRewatches = parseInt(rewatches);
        const parsedTotalEP = parseInt(totalEP);
        const parsedCurrentEP = parseInt(currentEP);
        if (userStatus !== undefined) {

            // myUser.watchlist.screenshots[existingItemIndex].userStatus = userStatus;
            let updateFields = {
                [`watchlist.screenshots.${existingItemIndex}.UserStatus`]: userStatus,
                [`watchlist.screenshots.${existingItemIndex}.category`]: category,
                [`watchlist.screenshots.${existingItemIndex}.userRating`]: parsedUserRating,
                [`watchlist.screenshots.${existingItemIndex}.rewatches`]: parsedRewatches,
                [`watchlist.screenshots.${existingItemIndex}.totalEP`]: parsedTotalEP,
                [`watchlist.screenshots.${existingItemIndex}.currentEP`]: parsedCurrentEP,
                [`watchlist.screenshots.${existingItemIndex}.notes`]: notes,
                [`watchlist.screenshots.${existingItemIndex}.priority`]: priority,
                [`watchlist.screenshots.${existingItemIndex}.title`]: title,
                [`watchlist.screenshots.${existingItemIndex}.description`]: description,
                [`watchlist.screenshots.${existingItemIndex}.favorite`]: isFavorite,
                [`watchlist.screenshots.${existingItemIndex}.updatedAt`]: new Date(),

            };
            result = await Watchlist.updateOne(
                { userId, [`watchlist.screenshots.${existingItemIndex}._id`]: ImageId },
                { $set: updateFields });
        }

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "No matching item found" }, { status: 404 });
        }
        return NextResponse.json(
            { message: "Screenshot Updated successfully" },
            { status: 200 }
        );
        // const { screenshotId, imageUrl, title, description, category, priority } = await request.json();
    } catch (error) {
        console.error("Error in POST /api/watchlist/updateScreenshot:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}