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
        const { mal_id, favorite, itemType } = body;

        // Update the favorite status in the database
        await Watchlist.updateOne(
            { userId, [`watchlist.${itemType}.mal_id`]: mal_id },
            {
                $set: {
                    [`watchlist.${itemType}.$.favorite`]: favorite,
                    [`watchlist.${itemType}.$.updatedAt`]: new Date()
                }
            }
        );

        return NextResponse.json({ message: "Favorite status updated" });
    } catch (error) {
        console.error("Error updating favorite status:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}