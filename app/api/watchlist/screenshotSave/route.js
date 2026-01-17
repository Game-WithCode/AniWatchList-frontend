import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Watchlist from "@/models/WatchList";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import { use } from "react";
import ImageKit from "imagekit";
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC,
    privateKey: process.env.IMAGEKIT_PRIVATE,
    urlEndpoint: process.env.IMAGEKIT_URL,
});
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

  const formData = await request.formData();
        const file = formData.get("screenshotFile"); // screenshot image 
        const title = formData.get("screenshotTitle");
        const description = formData.get("description");
        const category = formData.get("category");
        const isFavorite = formData.get("isFavorite");
        const priority = formData.get("priority") || 1;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const upload = await imagekit.upload({
            file: buffer,
            fileName: `${Date.now()}.png`,
        });
        // add in database
        let watchlist = await Watchlist.findOne({ userId });
        if (!watchlist) {
            watchlist = await Watchlist.create({
                userId,
                watchlist: {
                    anime: [],
                    manga: [],
                    screenshots: [],
                },
            });
        }
        if (!watchlist.watchlist) {
            watchlist.watchlist = {};
        }

        if (!watchlist.watchlist.screenshots) {
            watchlist.watchlist.screenshots = [];
        }
        watchlist.watchlist.screenshots.push({
            title: title || "Untitled",
            description: description || "",
            imageUrl: upload.url,
            category: category || "Anime",
            favorite: isFavorite || false,
            createAt: Date.now(),
            priority: parseInt(priority),
        });
        await watchlist.save();
        return NextResponse.json(
            { message: "Screenshot uploaded successfully", upload },
            { status: 200 }
        );


    } catch (error) {
        console.error("Error adding item to watchlist:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}