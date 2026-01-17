import { itemfind } from "@/lib/hooks/itemfind";
import { Volume } from "lucide-react";
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    mal_id: Number,
    title: String,
    image: String,
    category: String,
    episodesProgress: {
        type: [Number],
        default: [],
    },
    genres: {
        type: [String],
        default: []
    },
    priority: {
        type: Number,
        default: 2,
    },
    totalEpisodes: Number,
    rewatches: {
        type: Number,
        default: 0
    },
    userRating: {
        type: Number,
        default: 0
    },
    UserStatus: String,
    favorite: {
        type: Boolean,
        default: false
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    finishAt: {
        type: Date,
        default: null,
    },
    note: {
        type: String,
        default: "",
    },
});
// create schema for manga

const MangaSchema = new mongoose.Schema({
    mal_id: Number,
    title: String,
    image: String,
    category: String,
    chaptersProgress: {
        type: [Number],
        default: [],
    },
    totalChapters: Number,
    VolumesProgress: Number,
    totalVolumes: Number,
    rewatches: {
        type: Number,
        default: 0
    },
    genres: {
        type: [String],
        default: []
    },
    priority: {
        type: Number,
        default: 2,
    },
    userRating: {
        type: Number,
        default: 0
    },
    UserStatus: String,
    favorite: {
        type: Boolean,
        default: false
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    finishAt: {
        type: Date,
        default: null,
    },
    note: {
        type: String,
        default: "",
    },
});
const screenshotSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    priority: {
        type: Number,
        default: 1,
    },
    favorite: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        default: "Anime",
    },
    UserStatus: {
        type: String,
        default: "planning",
    },
    userRating: {
        type: Number,
        default: 0,
    },
    rewatches: {
        type: Number,
        default: 0,
    },
    totalEP: {
        type: Number,
        default: 0,
    },
    currentEP: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
        default: "",
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const WatchlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    watchlist: {
        anime: [ItemSchema],
        manga: [MangaSchema],
        // screenshots: [
        //     {
        //         title: String,
        //         description: String,
        //         imageUrl: String,
        //         priority: {
        //             type: Number,
        //             default: 1,
        //         },
        //         category: {
        //             type: String,
        //             default: "Anime",
        //         },
        //         uploadedAt: {
        //             type: Date,
        //             default: Date.now,
        //         },
        //     },
        // ],
        screenshots: [screenshotSchema],
    },

});

export default mongoose.models.Watchlist || mongoose.model("Watchlist", WatchlistSchema);
