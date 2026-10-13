"use client"
import React, { use } from 'react'
import { ChevronDown, ChevronUp, X, Heart } from "lucide-react";
import { useState, useEffect } from 'react';
import { itemfind, itemExists, getItemDetails } from '@/lib/hooks/itemfind';
import { toast } from 'react-toastify';

import { upsertItem } from '@/lib/hooks/upsert';

const UpdateForm = ({ item, status, onClose }) => {
    console.log("Receiving item:", item, "status:", status);
    //common State Variables
    const [commonData, setCommonData] = useState({
        UserStatus: status || null,
        favorite: false,
        rating: null,
        repeat: 0,
        startDate: null,
        endDate: null,
        updateAt: null,
        priority: 1,
        notes: null,
        itemType: item.type.toLowerCase() || null,
        itemId: item.id || null,
        title: item.title.english || item.title.romaji || null,
        image: item.coverImage?.extraLarge || null,
        genres: item.genres || [],
        format: item.format || null,
        WatchAll: false,
    });
    // For the Item Data 
    const [animeDbDataList, setAnimeDbDataList] = useState({
        epProgress: [],
        totalEpisodes: null,

    });
    const [mangaDbDataList, setMangaDbDataList] = useState({
        chProgress: [],
        totalChapters: null,
        totalVolumes: null,
    });
    //First check if the item is present in the database or not 
  useEffect(() => {
    const fetchItem = async () => {
        try {
            console.log("ENTERING IN FETCH ITEM FUNCTION");
            
            const foundItem = await getItemDetails(item.id, item.type.toLowerCase());

            // 1. Only update common data if the item exists in DB
            if (foundItem) {
                setCommonData((prev) => ({
                    ...prev,
                    UserStatus: foundItem?.UserStatus || prev.UserStatus || null,
                    favorite: foundItem?.favorite || false,
                    rating: foundItem?.userRating || null,
                    repeat: foundItem?.rewatches || 0,
                    startDate: foundItem?.addedAt || null,
                    endDate: foundItem?.finishAt || null,
                    updateAt: foundItem?.updatedAt || null,
                    notes: foundItem?.note || null,
                    priority: foundItem?.priority || null,
                }));
            }

            // 2. ALWAYS set the type-specific data, regardless of foundItem
            // Move this OUTSIDE the `if (foundItem)` block
            if (item?.type?.toLowerCase() === 'anime') {
                console.log("Setting anime data list with episodes:", item.episodes);
                setAnimeDbDataList({
                    epProgress: foundItem?.episodesProgress || [],
                    totalEpisodes: item?.episodes || null,
                });
            } else if (item?.type?.toLowerCase() === 'manga') {
                setMangaDbDataList({
                    // FIX: Changed fallback from 0 to [] to match your array schema
                    chProgress: foundItem?.chaptersProgress || [], 
                    totalChapters: item?.chapters || null,
                    totalVolumes: item?.volumes || null,
                });
            }

            console.log("end of fetchItem function");
        } catch (err) {
            console.error('Error fetching item:', err);
        }
    };
    fetchItem();
}, []);
    console.log("Current item state:", commonData, "Anime Data:", animeDbDataList, "Manga Data:", mangaDbDataList);

    //state variables & validate logic
    let handlerSave = async (e) => {
        toast.dismiss();
        e.preventDefault();


        let itemsExists = await itemExists(commonData.itemId, commonData.itemType);

        let cleanedProgress = [...new Set((animeDbDataList.epProgress || []).map(Number))]
            .sort((a, b) => a - b);

        // Create a mutable copy of the current state for this transaction
        let payload = { ...commonData };

        if (payload.itemType === "anime") {
            if (itemsExists) {
                let itemDbData = await getItemDetails(payload.itemId, payload.itemType);

                // Handle Rewatch wipe
                if (payload.UserStatus === "Rewatch" && itemDbData.UserStatus !== "Rewatch") {
                    setAnimeDbDataList({ ...animeDbDataList, epProgress: [] });
                    cleanedProgress = [];
                }

                // Safety check: ensure totalEpisodes > 0 before auto-completing
                const totalEps = animeDbDataList.totalEpisodes || 0;

                if (totalEps > 0 && cleanedProgress.length === totalEps) {
                    if (payload.UserStatus === "Rewatch") {
                        payload.repeat += 1;
                    }

                    payload.UserStatus = "Completed";
                    //this is where it ended so i have to give end date 
                    setCommonData(prev => ({ ...prev, endDate: new Date().toISOString() }));

                    if (commonData.UserStatus !== "Completed") {
                        toast.success(`Congrats, you completed the series!`);
                    }

                    // Sync the state with our updated payload
                    setCommonData(payload);
                }
            }
        } else if (payload.itemType === "manga") {
            if (itemsExists) {
                cleanedProgress = [...new Set((mangaDbDataList.chProgress || []).map(Number))]
                    .sort((a, b) => a - b);
                let itemDbData = await getItemDetails(payload.itemId, payload.itemType);

                // Handle Rewatch wipe
                if (payload.UserStatus === "Rewatch" && itemDbData.UserStatus !== "Rewatch") {
                    setMangaDbDataList({ ...mangaDbDataList, chProgress: [] });
                    cleanedProgress = [];
                }

                // Safety check: ensure totalChapters > 0 before auto-completing
                const totalChps = mangaDbDataList.totalChapters || 0;

                if (totalChps > 0 && cleanedProgress.length === totalChps) {
                    if (payload.UserStatus === "Rewatch") {
                        payload.repeat = Number(payload.repeat) + 1;
                    }

                    payload.UserStatus = "Completed";

                    if (commonData.UserStatus !== "Completed") {
                        toast.success(`Congrats, you completed the series!`);
                    }

                    // Sync the state with our updated payload
                    setCommonData(payload);
                }
            }
        }

        // Pass the locally updated payload, NEVER the stale commonData state
        ;
        const res = await upsertItem(
            payload,
            commonData.itemType === "anime" ? animeDbDataList.totalEpisodes : null,
            commonData.itemType === "manga" ? mangaDbDataList.totalChapters : null,
            commonData.itemType === "manga" ? mangaDbDataList.totalVolumes : null,
            cleanedProgress,

        );
        res.status === "success" ? toast.success(res.message) : toast.error(res.message);
    };



    let handlerDelete = async () => {
        const res = await fetch(`/api/watchlist/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mal_id: commonData.itemId,
                itemType: commonData.itemType,
            }),
        });
        const result = await res.json();
        if (res.status === 200) {
            toast.success(`Item deleted successfully!`);
            onClose();
        } else {

            toast.error("❌ Something went wrong. Try again!");
        }
    }
    //Event Handlers
    let handlerClose = () => {
        onClose();
    }

    // Handle watch all toggle
    const handleWatchAll = async (checked) => {
        setCommonData(prev => ({ ...prev, WatchAll: checked }));
        const total = commonData.itemType === "anime" ? animeDbDataList.totalEpisodes : mangaDbDataList.totalChapters;
        if (checked) {
            if (commonData.itemType === "anime") {
                setAnimeDbDataList(prev => ({ ...prev, epProgress: Array.from({ length: total }, (_, i) => i + 1) }));
            } else {
                setMangaDbDataList(prev => ({ ...prev, chProgress: Array.from({ length: total }, (_, i) => i + 1) }));
            }
        } else {

            // Use '===' for strict equality
            const foundItem = await getItemDetails(commonData.itemId, commonData.itemType);
            // Fix: Add space after foundItem and handle the 'else' case correctly
            const currentEp = foundItem
                ? (commonData.itemType === "anime" ? foundItem.episodesProgress : foundItem.chaptersProgress)
                : [];
            if (commonData.itemType === "anime") {
                setAnimeDbDataList(prev => ({ ...prev, epProgress: currentEp }));
            } else {
                setMangaDbDataList(prev => ({ ...prev, chProgress: currentEp }));
            }
        }
        console.log("Watch All toggled:", checked, "Total:", total, "Current Progress:", commonData.itemType === "anime" ? animeDbDataList.epProgress : mangaDbDataList.chProgress);
    };
    const generateUnitSequence = (latestUnit) => {
        if (!latestUnit || latestUnit < 1) return [];
        // Creates an array of sequential numbers from 1 to latestUnit
        return Array.from({ length: latestUnit }, (_, i) => i + 1);
    };
    const toggleEpisode = (unit) => {
        let newSelected;
        if (commonData.itemType === "anime") {
            newSelected = [...animeDbDataList.epProgress];
            //if the episode is already selected, remove it, otherwise add it
            if (newSelected.includes(unit)) {
                newSelected = newSelected.filter((e) => e !== unit);
            } else {
                newSelected.push(unit);
            }
            newSelected.sort((a, b) => a - b);
            setAnimeDbDataList(prev => ({ ...prev, epProgress: newSelected }));
        } else if (commonData.itemType === "manga") {
            newSelected = [...mangaDbDataList.chProgress];
            //if the episode is already selected, remove it, otherwise add it
            if (newSelected.includes(unit)) {
                newSelected = newSelected.filter((e) => e !== unit);
            } else {
                newSelected.push(unit);
            }
            newSelected.sort((a, b) => a - b);
            setMangaDbDataList(prev => ({ ...prev, chProgress: newSelected }));
        }
    };


    let totalUnits = Array.from({ length: (commonData.itemType === "anime" ? animeDbDataList.totalEpisodes : mangaDbDataList.totalChapters) }, (_, i) => i + 1);
    return (
        <>
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md">
                <div className="bg-background-deep w-full max-w-5xl rounded-2xl md:rounded-3xl overflow-hidden border border-slate-800 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] flex flex-col max-h-[95vh] md:max-h-[92vh]">

                    <div className="relative h-40 md:h-56 shrink-0">
                        <div className="absolute top-0 w-full h-34 brightness-75 z-0">
                            <img
                                src={item.bannerImage || item.coverImage?.extraLarge}
                                alt=""
                                className="w-full h-full object-cover opacity-30"
                            />
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-background-deep via-background-deep/40 to-transparent"></div>
                        </div>
                        <X className='absolute top-4 right-3 z-50' color='white' strokeWidth={3} size={35} onClick={handlerClose} />

                        {/* Foreground Content */}
                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-8 flex items-end gap-4 md:gap-8">
                            <div className='hidden sm:block w-24 h-32 md:w-32 md:h-44 rounded-xl overflow-hidden border-2 border-slate-700/50 shadow-2xl bg-slate-900 shrink-0'>
                                <img
                                    src={item.coverImage?.extraLarge}
                                    width="120px"
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="pb-1 md:pb-2">
                                <h2 className="text-2xl md:text-4xl font-bold font-display text-white tracking-tight leading-tight pb-10">  {item.title.english ?? item.title.romaji}</h2>
                            </div>


                        </div>


                    </div>
                    <div className='p-5 md:p-8 grow'>
                        <div className='flex flex-col md:flex-row md:items-center gap-4 '>
                            <div className='flex flex-1 gap-3 md:gap-4 max-w-xl'>
                                <div className='relative flex-1'>
                                    <select
                                        value={commonData.UserStatus}
                                        onChange={(e) => setCommonData({ ...commonData, UserStatus: e.target.value })}
                                        className="glass-input rounded-xl w-full pl-3 pr-8 py-2.5 md:py-3 appearance-none text-xs md:text-sm font-medium">
                                        <option value="Continue">Set As Continue </option>
                                        <option value="Future">Set As Future </option>
                                        <option value="Completed">Completed</option>
                                        <option value="Paused">Paused</option>
                                        <option value="Dropped">Dropped</option>
                                        <option value="Planning">Plan to Watch</option>
                                        <option value="Rewatch">Plan to Rewatch</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-lg">expand_more</span>
                                </div>
                                <div className='relative flex-1'>
                                    <select
                                        value={commonData?.priority ?? 0}
                                        onChange={(e) => setCommonData({ ...commonData, priority: parseInt(e.target.value) })}
                                        className="glass-input rounded-xl w-full pl-3 pr-8 py-2.5 md:py-3 appearance-none text-xs md:text-sm font-medium">
                                        <option value={3}>High priority</option>
                                        <option value={2}>Medium priority</option>
                                        <option value={1}>Low Priority</option>

                                    </select>
                                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-lg">expand_more</span>
                                </div>
                                <button className="flex items-center justify-center h-10.5 md:h-12 w-10.5 md:w-12 rounded-xl border border-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                                    onClick={() => setCommonData({ ...commonData, favorite: !commonData.favorite })}
                                >
                                    <span className={`material-symbols-outlined text-bgsecondary ${commonData.favorite ? '[font-variation-settings:"FILL"_1]' : ''} text-xl`} >
                                        favorite
                                    </span>
                                </button>
                            </div>
                            <div className='md:ml-auto flex items-center'>
                                <button className="w-full md:w-auto bg-bgsecondary hover:bg-teal-400 text-slate-900 px-8 md:px-10 py-2.5 md:py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/10 active:scale-95 text-sm" onClick={handlerSave}>Save Changes</button>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>

                    <div className='p-5 md:p-8 overflow-y-auto scrollbar-hide grow'>
                        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-2 gap-8 lg:gap-10">
                            {/* this is for details and episode selection */}
                            <div className='lg:col-span-3 xl:col-span-1 space-y-8'>

                                <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                                    <div className='space-y-2.5'>
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">No of Rewatch</label>
                                        <div className="flex h-11">
                                            <span className="bg-bgsecondary/10 text-bgsecondary border border-bgsecondary/20 border-r-0 px-2.5 text-[9px] font-bold rounded-l-xl flex items-center uppercase">Rwtch</span>
                                            <input type="number" className="glass-input rounded-r-xl w-full text-center py-2 font-display text-lg font-semibold" value={commonData.repeat} onChange={(e) => { setCommonData({ ...commonData, repeat: e.target.value < 0 ? 0 : e.target.value }) }} />
                                        </div>
                                    </div>
                                    <div className='space-y-2.5'>
                                        {commonData.itemType === "anime" ? (
                                            <>
                                                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">No of Progress</label>
                                                <div className="flex h-11">
                                                    <span className="bg-bgsecondary/10 text-bgsecondary border border-bgsecondary/20 border-r-0 px-2.5 text-[9px] font-bold rounded-l-xl flex items-center uppercase">{item.episodes}</span>
                                                    <input type="number" className="glass-input rounded-r-xl w-full text-center py-2 font-display text-lg font-semibold"
                                                        value={animeDbDataList.epProgress?.at(-1) ?? 0}
                                                        onChange={(e) => {
                                                            const rawValue = e.target.value;

                                                            // Handle input clearing immediately
                                                            if (rawValue === "") {
                                                                setAnimeDbDataList({ ...animeDbDataList, epProgress: [] });
                                                                return;
                                                            }

                                                            const value = Number(rawValue);
                                                            const maxEp = value > item.episodes ? item.episodes : value;

                                                            setAnimeDbDataList({
                                                                ...animeDbDataList,
                                                                epProgress: generateUnitSequence(maxEp)
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        ) : (<>
                                            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">No of Progress</label>
                                            <div className="flex h-11">
                                                <span className="bg-bgsecondary/10 text-bgsecondary border border-bgsecondary/20 border-r-0 px-2.5 text-[9px] font-bold rounded-l-xl flex items-center uppercase">{item.chapters || 'N/A'}</span>
                                                {/* <input type="number" className="glass-input rounded-r-xl w-full text-center py-2 font-display text-lg font-semibold" value={EPprogress} onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    setEPprogress(value > item.episodes ? item.episodes : value);
                                                    updateEPCH(e.target.value)
                                                }} /> */}
                                                <input type="number" className="glass-input rounded-r-xl w-full text-center py-2 font-display text-lg font-semibold"
                                                    value={mangaDbDataList.chProgress?.at(-1) ?? 0}
                                                    onChange={(e) => {
                                                        const rawValue = e.target.value;

                                                        // Handle input clearing immediately
                                                        if (rawValue === "") {
                                                            setMangaDbDataList({ ...mangaDbDataList, chProgress: [] });
                                                            return;
                                                        }

                                                        const value = Number(rawValue);
                                                        const maxEp = value > item.episodes ? item.episodes : value;

                                                        setMangaDbDataList({
                                                            ...mangaDbDataList,
                                                            chProgress: generateUnitSequence(maxEp)
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </>)}
                                    </div>
                                    <div className='space-y-2.5'>

                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">No of Rating</label>
                                        <div className="flex h-11">
                                            <span className="bg-bgsecondary/10 text-bgsecondary border border-bgsecondary/20 border-r-0 px-2.5 text-[9px] font-bold rounded-l-xl flex items-center uppercase">10</span>
                                            <input type="number" className="glass-input rounded-r-xl w-full text-center py-2 font-display text-lg font-semibold" value={commonData?.rating ?? 0}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setCommonData({
                                                        ...commonData,
                                                        rating: val === "" ? null : val < 0 ? 0 : val > 10 ? 10 : parseInt(val)
                                                    })
                                                }}
                                            />
                                        </div>

                                    </div>
                                </div>
                                {/* {itemType === "manga" && (<div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                                    <div className='space-y-2.5'>
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">No of VolumesProgress</label>
                                        <div className="flex h-11">
                                            <span className="bg-bgsecondary/10 text-bgsecondary border border-bgsecondary/20 border-r-0 px-2.5 text-[9px] font-bold rounded-l-xl flex items-center uppercase">{item.volumes || 'N/A'}</span>
                                            <input type="number" className="glass-input rounded-r-xl w-full text-center py-2 font-display text-lg font-semibold" value={VOLprogress} onChange={(e) => { setVOLprogress(e.target.value < 0 ? 0 : e.target.value > item.volumes ? item.volumes : e.target.value) }} />
                                        </div>
                                    </div>
                                </div>)} */}

                                <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                                    <div className='space-y-2.5'>
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">Start Date</label>
                                        <input type="date" className="glass-input rounded-xl w-full py-2.5 px-3 text-xs font-medium h-11" value={
                                            commonData.startDate
                                                ? new Date(commonData.startDate).toISOString().split("T")[0]
                                                : ""
                                        } readOnly />

                                    </div>
                                    <div className='space-y-2.5'>
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">Finish Date</label>
                                        <input type="date" className="glass-input rounded-xl w-full py-2.5 px-3 text-xs font-medium h-11" value={
                                            commonData.endDate
                                                ? new Date(commonData.endDate).toISOString().split("T")[0]
                                                : ""
                                        } readOnly />
                                    </div>
                                    <div className='space-y-2.5'>
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">Last Update</label>
                                        <input type="date" className="glass-input rounded-xl w-full py-2.5 px-3 text-xs font-medium h-11" value={
                                            commonData.updateAt
                                                ? new Date(commonData.updateAt).toISOString().split("T")[0]
                                                : ""
                                        } disabled />

                                    </div>
                                </div>
                                <div className='space-y-2.5'>
                                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">My Notes</label>
                                    <textarea
                                        name="note"
                                        id="note"
                                        className="glass-input rounded-2xl w-full p-4 resize-none text-sm leading-relaxed"
                                        placeholder="Add your personal thoughts..."
                                        value={commonData?.notes ?? ""}
                                        onChange={(e) => setCommonData({ ...commonData, notes: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className='lg:col-span-2 xl:col-span-1 space-y-4 flex flex-col min-h-75 lg:h-full'>
                                <div className="flex justify-between items-center mb-1">

                                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] ml-1">{commonData.itemType === "anime" ? "Episodes" : "Chapters"} Progress</label>
                                    <div className="flex items-center gap-2 group cursor-pointer">
                                        {/* <input className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/20 h-4 w-4" id="watchall" type="checkbox" /> */}
                                        <input
                                            id="watchAll"
                                            type="checkbox"
                                            name="progressOption"
                                            value={commonData.WatchAll}
                                            onChange={(e) => handleWatchAll(e.target.checked)}
                                            className="rounded border-slate-700 bg-slate-900 text-bgsecondary focus:ring-bgsecondary/20 h-4 w-4"
                                        />
                                        {/* <label className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors cursor-pointer" for="watchall">Mark all watched</label> */}
                                        <label htmlFor="watchAll" className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors cursor-pointer">
                                            Watch All {commonData.itemType === "anime" ? "Episodes" : "Chapters"}
                                        </label>
                                    </div>
                                </div>
                                <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80 grow max-h-75  overflow-y-auto scrollbar-hide mt-2'>
                                    {totalUnits?.map((unit) => (
                                        <div key={unit}
                                            className='flex items-center gap-2 md:gap-3 p-2 md:p-2.5 rounded-lg md:rounded-xl bg-slate-900/60 border border-slate-700/30 hover:border-bgsecondary/40 hover:bg-slate-800 transition-all cursor-pointer group'>
                                            <input
                                                type="checkbox"
                                                checked={commonData.itemType === "anime" ? animeDbDataList.epProgress.includes(unit) : mangaDbDataList.chProgress.includes(unit)}
                                                onChange={() => toggleEpisode(unit)}
                                                className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/20 h-4 w-4"
                                                name={`unit-${unit}`} id={`unit-${unit}`}
                                            />
                                            <label
                                                className="text-[10px] md:text-xs font-medium text-slate-400 group-hover:text-white transition-colors" htmlFor={`unit-${unit}`}
                                            > Ep {unit} </label>
                                        </div>
                                        // <label
                                        //     key={ep}
                                        //     className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md cursor-pointer"
                                        // >
                                        //     <input
                                        //         type="checkbox"
                                        //         checked={selectedEpisodes.includes(ep)}
                                        //         onChange={() => toggleEpisode(ep)}
                                        //         className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/20 h-4 w-4"
                                        //     />
                                        //     <span className="text-sm font-medium">Ep {ep}</span>
                                        // </label>
                                    ))}
                                </div>
                            </div>


                        </div>


                    </div>
                    <div className="px-5 md:px-8 py-4 md:py-5 bg-slate-950/50 border-t border-slate-800 flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
                        <button className="flex items-center justify-center md:justify-start gap-2.5 text-slate-500 hover:text-red-400 text-sm font-semibold transition-all group"
                            onClick={handlerDelete}>
                            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">delete</span>
                            Remove from List
                        </button>

                    </div>


                </div>
            </div >

        </>
    )

}

export default UpdateForm
