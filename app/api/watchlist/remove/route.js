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
        const body = await request.json();
        const { mal_id, itemType } = body;
        let itemId;
        if (itemType == "screenshots") {
            itemId = Object(mal_id)
        } else {
            itemId = Number(mal_id);
        }

        let watchlist = await Watchlist.findOne({ userId });
        if (!watchlist) {
            return NextResponse.json(
                { message: "Watchlist not found" },
                { status: 402 }
            );
        }
        //let remove the item from the db if user click on delete button
        let result;
        if (itemType == "screenshots") {
            result = await Watchlist.updateOne(
                { userId },
                { $pull: { [`watchlist.${itemType}`]: { _id: itemId } } }
            );
        } else {
            result = await Watchlist.updateOne(
                { userId },
                { $pull: { [`watchlist.${itemType}`]: { mal_id: itemId } } }
            );

        }

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "No matching item found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Progress updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error removing item from watchlist:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}