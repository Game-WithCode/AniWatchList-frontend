"use client";
import React from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { itemfind } from "@/lib/hooks/itemfind"
import { LocateFixed } from 'lucide-react';

const AddToWatchlist = ({ item, addType }) => {
    console.log('addType in watchlist', addType);
    const categoryType = item.type === "TV"
        ? "anime" : item.type;
    let handleritems = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/watchlist/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mal_id: item.mal_id,
                title: item.title,
                image: item.images.jpg.image_url,
                type: addType,
                category: categoryType,
            }),
        });
        const result = await res.json();
        if (res.status === 201) {
            toast.success(`${categoryType} added successfully!`);
        } else if (res.status === 409) {
            toast.error("item is not added!");
        } else if (res.status === 200) {
            toast.info("item already added!");
        } else {
            toast.error("❌ Something went wrong. Try again!");
        }
    }
    // let handlerComplete = async (e) => {
    //     categoryType = item.type === "Movie"
    //         ? "movies"
    //         : item.type === "TV"
    //             ? "anime"
    //             : item.type === "Manga"
    //                 ? "manga" : item.type === "OVA"
    //                     ? "anime"
    //                     : item.type === "ONA"
    //                         ? "anime"
    //                         : item.type === "Special"
    //                             ? "anime" : item.type === "Manhwa"
    //                                 ? "manga"
    //                                 : "anime";
    //     e.preventDefault();
    //     const res = await fetch("/api/watchlist/add", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //             mal_id: item.mal_id,
    //             title: item.title,
    //             image: item.images.jpg.image_url,
    //             type: addType,
    //             category: categoryType,
    //         }),
    //     });
    //     const result = await res.json();
    //     if (res.status === 201) {
    //         toast.success(`${categoryType} added successfully!`);
    //     } else if (res.status === 409) {
    //         toast.error("item is not added!");
    //     } else if (res.status === 200) {
    //         toast.info("item already added!");
    //     } else {
    //         toast.error("❌ Something went wrong. Try again!");
    //     }
    // }
    let completeHandler = async () => {
        const type = item.type === "Movie"
            ? "anime"
            : item.type === "TV"
                ? "anime"
                : item.type === "Manga"
                    ? "manga" : item.type === "OVA"
                        ? "anime"
                        : item.type === "ONA"
                            ? "anime"
                            : item.type === "Special"
                                ? "anime" : item.type === "Manhwa"
                                    ? "manga"
                                    : "anime";
        const recieveItem = await itemfind();
        //  selectedEpisodes.filter(ep => ep != null)
        if (recieveItem) {
            console.log(recieveItem.watchlist.continue[type]);
            const continueItem = recieveItem.watchlist.continue[type];
            const founditem = continueItem.find(i => i.mal_id == item.mal_id)
            if (founditem) {
                const res = await fetch("/api/watchlist/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        mal_id: item.mal_id,
                        title: item.title_english,
                        image: item.images.jpg.image_url,
                        completeEP:founditem.currentEP,
                        totalEP: item.episodes,
                         type: 'complete',
                        category: type,
                    }),
                });
                const result = await res.json();
                if (res.status === 201) {
                    toast.success(`Congrats you completed the Series`);
                } else if (res.status === 409) {
                    toast.error("item is not added!");
                } else if (res.status === 200) {
                    toast.info("you already watched it!");
                } else {
                    toast.error("❌ Something went wrong. Try again!");
                }
            }

        }

    }
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                theme="colored"
            />
            <div className="actionButtons mx-auto mb-6">

                <div className=" container flex flex-col justify-center items-center gap-5 mx-auto">

                    <button className=" flex w-fit  bg-[#E1AA36] text-white font-bold py-2 px-4 rounded-lg cursor-pointer hover:bg-[#eeba4a]  hover:scale-110  focus:ring-offset-2" onClick={handleritems}>
                        <lord-icon
                            src="https://cdn.lordicon.com/tsrgicte.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}>
                        </lord-icon>
                        <span>Add to WatchList</span>
                    </button>
                    <button className="w-fit bg-[#E8E867]  text-black font-bold py-2 px-8 rounded-lg cursor-pointer hover:bg-[#dbdb49]   hover:scale-110  " onClick={completeHandler} >Mark as Watched</button>
                </div>

            </div>
        </>
    )
}

export default AddToWatchlist
