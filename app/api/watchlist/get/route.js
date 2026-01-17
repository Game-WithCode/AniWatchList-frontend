import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Watchlist from "@/models/WatchList";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
export async function GET(request) {
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

       
        // Find the watchlist for the user
        let watchlist = await Watchlist.findOne({ userId });
        if (!watchlist) {
            return NextResponse.json(
                { message: "Watchlist not found" },
                { status: 404 }
            );
        }
        let animeList = (watchlist?.watchlist || [])
      

        return NextResponse.json(
            { watchlist: animeList? animeList : [] },
            { status: 200 }
        );
    }
    catch (error) {
        console.error("Error fetching watchlist:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }

}