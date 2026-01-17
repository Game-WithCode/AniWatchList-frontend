"use server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Watchlist from "@/models/WatchList";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
export async function addToWatchlist(formData) {
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
        const userId = session.user.id.toString();
        // Parse the request body
        const itemId = Number(formData.get("mal_id"));
        const itemTitle = formData.get("title");
        const itemImage = formData.get("image");
        const itemType = formData.get("type");
        const itemCategory = formData.get("category");
        console.log("Adding to watchlist:", { itemId, itemTitle, itemImage, itemType, itemCategory });
        // const { itemId, itemTitle, itemImage, itemCategory, itemType } = await request.json();
        // let watchlist = await Watchlist.findOne({ userId });
        // if (!watchlist) {
        //     watchlist = await Watchlist.create({ userId });
        // }
        // let existing = await watchlist.watchlist[itemCategory].some((item) => item.itemId === itemId);
        // if (exists) {
        //     return NextResponse.json({ message: "Already added" }, { status: 200 });
        // }
        // // Create a new watchlist item
        // watchlist.watchlist[itemType].push({
        //     mal_id: itemId,
        //     title: itemTitle,
        //     image: itemImage,
        //     category: itemCategory,
        //     type: itemType,
        // });
        // await watchlist.save();
        //    return { success: true };
        let watchlist = await Watchlist.findOne({ userId }).lean();

        if (!watchlist) {
            await Watchlist.create({
                userId,
                watchlist: {
                    anime: [],
                    manga: [],
                    favorite: { anime: [], manga: [] },
                    continue: { anime: [], manga: [] },
                },
            });
             watchlist = await Watchlist.findOne({ userId });
        }
        let exists = watchlist.watchlist[itemCategory].some((item) => item.mal_id === itemId);

        if (exists) {
            return { success: false, message: "Item already in watchlist" };
        }
        await Watchlist.findOneAndUpdate(
            { userId },
            {
                $push: {
                    [`watchlist.${itemCategory}`]: {
                        mal_id: itemId,
                        title: itemTitle,
                        image: itemImage,
                        type: itemType,
                        category: itemCategory,
                        addedAt: new Date()
                    }
                }
            },
            { upsert: true, new: true }
        );
        return { success: true };
    }
    catch (error) {
        console.error("Error adding item to watchlist:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}