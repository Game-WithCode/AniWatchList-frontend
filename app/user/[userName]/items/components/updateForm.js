"use client"
import React, { use } from 'react'
import { ChevronDown, ChevronUp, X, Heart } from "lucide-react";
import { useState, useEffect } from 'react';
import { itemfind } from '@/lib/hooks/itemfind';
import { toast } from 'react-toastify';
import { set } from 'mongoose';


const UpdateForm = ({ item, status, onClose }) => {

    const [selectedStatus, setSelectedStatus] = useState(
        Array.isArray(status) && status.length === 0
            ? "Planning"
            : status || "Planning"
    );
    const [repeatCount, setRepeatCount] = useState(0);
    const [rating, setRating] = useState(0);
    const [EPprogress, setEPprogress] = useState(0);
    const [selectedEpisodes, setSelectedEpisodes] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [finishDate, setFinishDate] = useState("");
    const [updatedDate, setUpdatedDate] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [notes, setNotes] = useState("");
    const [CHprogress, setCHprogress] = useState(0);
    const [VOLprogress, setVOLprogress] = useState(0);
    const [watchAll, setWatchAll] = useState(false);
    const [genre, setgenre] = useState([])
    const [priority, setpriority] = useState(2);
    // if itemtype is anime then each by episode but if manga then by chapter
    const categoryType = item.type;
    const itemType = (categoryType === "TV" || categoryType === "Movie" || categoryType === "OVA" || categoryType === "ONA" || categoryType === "Special") ? "anime" : "manga";
    const episodes = Array.from({ length: (itemType === "anime" ? item.episodes : item.chapters) }, (_, i) => i + 1);
    const toggleEpisode = (ep) => {
        let newSelected;

        if (selectedEpisodes.includes(ep)) {
            // Remove episode
            newSelected = selectedEpisodes.filter((e) => e !== ep);
        } else {
            // Add episode
            newSelected = [...selectedEpisodes, ep];
        }

        // Sort the array
        newSelected.sort((a, b) => a - b);

        // Update state once
        setSelectedEpisodes(newSelected);
    };
    let itemReceiver = async () => {
        return await itemfind();
    }
    let handlerClose = () => {
        onClose();
    }
    useEffect(() => {
        const fetchAnime = async () => {
            try {

                const data = await itemReceiver();
                const animeList = data?.watchlist?.[itemType] || []
                const foundItem = animeList.find(items => items.mal_id == item.mal_id)
                const currentEp = foundItem?.episodesProgress || [];
                //i want currentEp last value
                const lastEpisode = currentEp[currentEp.length - 1];
                setEPprogress(lastEpisode || 0);
                setRating(foundItem?.userRating || 0);
                setRepeatCount(foundItem?.rewatches || 0);
                setStartDate(foundItem?.addedAt || "");
                setFinishDate(foundItem?.finishAt || "");
                setUpdatedDate(foundItem?.updatedAt || "");
                setIsFavorite(foundItem?.favorite || false);
                setNotes(foundItem?.note || "");
                setpriority(foundItem?.priority || 2)
                const findedGeneres = []
                item.genres?.map((item) => {
                    findedGeneres.push(item.name)
                })

                setgenre(findedGeneres)

                if (itemType === "manga") {
                    const currentCh = foundItem?.chaptersProgress || [];
                    setSelectedEpisodes(currentCh);
                    const lastChapter = currentCh[currentCh.length - 1];
                    setCHprogress(lastChapter || 0);
                    setVOLprogress(foundItem?.VolumesProgress || 0);
                }



                if (Array.isArray(currentEp)) {
                    // Flatten and ensure only numbers go in
                    setSelectedEpisodes(prev => [
                        ...new Set([...prev, ...currentEp?.map(Number)]),
                    ]);
                } else {
                    setSelectedEpisodes(prev =>
                        prev.includes(currentEp) ? prev : [...prev, Number(currentEp)]
                    );
                }




            } catch (err) {
                console.error('Error fetching anime:', err);
            }
        };
        fetchAnime();
    }, []);
    let handlerSave = async (e) => {
        toast.dismiss();
        if (itemType === "anime") {
            const EPCount = Array.from({ length: EPprogress }, (_, i) => i + 1);
            const updatedEpisodes = Array.from(new Set([...selectedEpisodes, ...EPCount]))
                .sort((a, b) => a - b);

            // Update state for UI
            setSelectedEpisodes(updatedEpisodes);


            e.preventDefault();
            let itemPresent = await itemReceiver();



            const dbitem = itemPresent?.watchlist?.[itemType] ?? [];
            const isItemAlreadyAdded = dbitem.some(i => i.mal_id === item.mal_id);

            if (!isItemAlreadyAdded) {
                const res = await fetch("/api/watchlist/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        mal_id: item.mal_id,
                        title: item.title_english,
                        image: item.images.webp.large_image_url,
                        priority: priority,
                        itemType: itemType,
                        genres: genre,
                        userStatus: selectedStatus,
                        category: categoryType,
                        episodesProgress: updatedEpisodes.filter(ep => ep != null),
                        favorite: isFavorite,
                        rewatches: repeatCount,
                        rating: rating,
                        totalEpisodes: item.episodes,
                        note: notes,

                    }),
                });
                const result = await res.json();
                if (res.status === 201) {
                    toast.success(`${categoryType} added successfully!`, {
                        toastId: 'save-success'
                    });
                    onClose();
                } else if (res.status === 409) {
                    toast.error("item is not added!");
                } else if (res.status === 200) {
                    toast.info("item already added!");
                } else {
                    toast.error("❌ Something went wrong. Try again!");
                }

            } else {
                //if staus is continue and use update episode to last episode so add to completed if episodes progress equal to total episodes
                //it create local selectedStatus to take the value of selectedStatus state
                let localSelectedStatus = selectedStatus;
                let localRepeatCount = repeatCount;
                let findUserStatus = dbitem.find(i => i.mal_id === item.mal_id);
                if (localSelectedStatus === "Rewatch" && findUserStatus.UserStatus !== "Rewatch") {

                    updatedEpisodes.length = 0;
                }
                if (updatedEpisodes.length === item.episodes) {
                    if (selectedStatus === "Rewatch") {
                        localRepeatCount += 1;
                    }

                    localSelectedStatus = "Completed";
                    setSelectedStatus(localSelectedStatus);

                    // userStatus is rewatch then increase the repeat number
                    if (selectedStatus !== "Completed") {
                        toast.success(`Congrat you completed the series!`);
                    }
                }
                //if user selected the rewatch then we have to empty the epProgress but if userStatus is not rewatch then we have to keep the epProgress as it is



                const res = await fetch(`/api/watchlist/update/ce`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        mal_id: item.mal_id,
                        title: item.title,
                        image: item.images.webp.large_image_url,
                        itemType: itemType,

                        userStatus: localSelectedStatus,
                        priority: priority,
                        category: categoryType,
                        episodesProgress: updatedEpisodes.filter(ep => ep != null),
                        rewatches: localRepeatCount,
                        favorite: isFavorite,
                        rating: rating,
                        totalEpisodes: item.episodes,
                        note: notes,
                    }),
                });
                const result = await res.json();
                if (res.status === 200) {
                    toast.success(`Item updated successfully!`);
                    onClose()
                } else {

                    toast.error("❌ Something went wrong. Try again!");
                }

            }
        } else {
            handlerManga();
        }
    }
    let handlerDelete = async () => {
        const res = await fetch(`/api/watchlist/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mal_id: item.mal_id,
                itemType: itemType,
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
    let addFavorite = async () => {
        setIsFavorite(!isFavorite);
    }
    // Handle watch all toggle
    const handleWatchAll = async (checked) => {
        setWatchAll(checked);
        const Progress = EPprogress || CHprogress;
        const total = itemType === "anime" ? item.episodes : item.chapters;
        if (checked) {
            updateEPCH(total)

        } else {
            const data = await itemfind();
            const animeList = data?.watchlist?.[itemType] || [];
            // Use '===' for strict equality
            const foundItem = animeList.find(items => items.mal_id === item.mal_id);
            // Fix: Add space after foundItem and handle the 'else' case correctly
            const currentEp = foundItem
                ? (itemType === "anime" ? foundItem.episodesProgress : foundItem.chaptersProgress)
                : [];
            updateEPCH(currentEp.length || 0);
        }
    };
    let updateEPCH = (e) => {
        //let update selectedEpisode on click chaper Progress bar

        const Progress = e;
        if (itemType === "anime") {
            const EPCount = Array.from({ length: Progress }, (_, i) => i + 1);

            setSelectedEpisodes(EPCount);
        } else {
            const CHCount = Array.from({ length: Progress }, (_, i) => i + 1);

            setSelectedEpisodes(CHCount);
        }
    }
    useEffect(() => {
        // If all episodes/chapters are selected, check the "Watch All" box
        const total = itemType === "anime" ? item.episodes : item.chapters;
        if (selectedEpisodes.length === total && total > 0) {
            setWatchAll(true);
        } else {
            setWatchAll(false);
        }
        if (itemType === "anime") {
            setEPprogress(selectedEpisodes.length);
        } else {
            setCHprogress(selectedEpisodes.length);
        }
    }, [selectedEpisodes]);
    //if selectedEpisode change than change the EPprogress and CHprogress

    // let create handler which handle manga and anime form  separately
    let handlerManga = async () => {

        const CPCount = Array.from({ length: CHprogress }, (_, i) => i + 1);
        const updatedEpisodes = Array.from(new Set([...selectedEpisodes, ...CPCount]))
            .sort((a, b) => a - b);
        // Update state for UI
        setSelectedEpisodes(updatedEpisodes);

        let itemPresent = await itemReceiver();
        const dbitem = itemPresent?.watchlist?.[itemType] ?? [];
        const isItemAlreadyAdded = dbitem.some(i => i.mal_id === item.mal_id);
        if (!isItemAlreadyAdded) {
            const res = await fetch(`/api/watchlist/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mal_id: item.mal_id,
                    title: item.title,
                    image: item.images.webp.large_image_url,
                    itemType: itemType,
                    genres: genre,
                    priority: priority,
                    userStatus: selectedStatus,
                    category: categoryType,
                    chaptersProgress: updatedEpisodes.filter(ep => ep != null),
                    VolumesProgress: VOLprogress,
                    totalVolumes: item.volumes,
                    totalChapters: item.chapters,
                    rewatches: repeatCount,
                    favorite: isFavorite,
                    rating: rating,
                    totalEpisodes: item.episodes,
                    note: notes,
                }),
            });
            const result = await res.json();
            if (res.status === 201) {
                toast.success(`Item updated successfully!`);
                onClose()
            } else {

                toast.error("❌ Something went wrong. Try again!");
            }
        } else {
            let localSelectedStatus = selectedStatus;

            let localRepeatCount = repeatCount;
            let localVolumesProgress = VOLprogress;
            let findUserStatus = dbitem.find(i => i.mal_id === item.mal_id);
            if (localSelectedStatus === "Rewatch" && findUserStatus.UserStatus !== "Rewatch") {

                updatedEpisodes.length = 0;
                localVolumesProgress = 0;
            }

            if (updatedEpisodes.length === item.chapters) {
                if (selectedStatus === "Rewatch") {
                    localRepeatCount += 1;
                }


                localSelectedStatus = "Completed";
                localVolumesProgress = item.volumes;
                setSelectedStatus(localSelectedStatus);
                // userStatus is rewatch then increase the repeat number

                if (selectedStatus !== "Completed") {
                    toast.success(`Congrat you completed the series!`);
                }

            }
            const res = await fetch(`/api/watchlist/update/ce`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mal_id: item.mal_id,
                    title: item.title,
                    image: item.images.webp.large_image_url,
                    category: categoryType,
                    itemType: itemType,
                    priority: priority,
                    chaptersProgress: updatedEpisodes.filter(ep => ep != null),
                    VolumesProgress: localVolumesProgress,
                    totalVolumes: item.volumes,
                    userStatus: localSelectedStatus,
                    totalChapters: item.chapters,
                    rewatches: localRepeatCount,
                    favorite: isFavorite,
                    rating: rating,
                    totalEpisodes: item.episodes,
                    note: notes,
                }),
            });
            const result = await res.json();
            if (res.status === 200) {
                toast.success(`Item Manga updated successfully!`);
                onClose()
            } else {

                toast.error("❌ Something went wrong. Try again!");
            }
        }
    }
    return (
        <>
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md">
                <div className="bg-background-deep w-full max-w-5xl rounded-2xl md:rounded-3xl overflow-hidden border border-slate-800 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] flex flex-col max-h-[95vh] md:max-h-[92vh]">

                    <div className="relative h-40 md:h-56 shrink-0">
                        <div className="absolute top-0 w-full h-34 brightness-75 z-0">
                            <img
                                src={item.images.jpg.large_image_url}
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
                                    src={item.images.jpg.image_url}
                                    width="120px"
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="pb-1 md:pb-2">
                                <h2 className="text-2xl md:text-4xl font-bold font-display text-white tracking-tight leading-tight pb-10">  {item.title_english ?? item.title}</h2>
                            </div>


                        </div>


                    </div>
                    <div className='p-5 md:p-8 grow'>
                        <div className='flex flex-col md:flex-row md:items-center gap-4 '>
                            <div className='flex flex-1 gap-3 md:gap-4 max-w-xl'>
                                <div className='relative flex-1'>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
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
                                        value={priority}
                                        onChange={(e) => setpriority(e.target.value)}
                                        className="glass-input rounded-xl w-full pl-3 pr-8 py-2.5 md:py-3 appearance-none text-xs md:text-sm font-medium">
                                        <option value={3}>High priority</option>
                                        <option value={2}>Medium priority</option>
                                        <option value={1}>Low Priority</option>

                                    </select>
                                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-lg">expand_more</span>
                                </div>
                                <button className="flex items-center justify-center h-10.5 md:h-12 w-10.5 md:w-12 rounded-xl border border-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    <span className={`material-symbols-outlined text-bgsecondary ${isFavorite ? '[font-variation-settings:"FILL"_1]' : ''} text-xl`} >
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
                                            <input type="number" className="glass-input rounded-r-xl w-full text-center py-2 font-display text-lg font-semibold" value={repeatCount} onChange={(e) => { setRepeatCount(e.target.value < 0 ? 0 : e.target.value) }} />
                                        </div>
                                    </div>
                                    <div className='space-y-2.5'>
                                        {itemType === "anime" ? (
                                            <>
                                                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">No of Progress</label>
                                                <div className="flex h-11">
                                                    <span className="bg-bgsecondary/10 text-bgsecondary border border-bgsecondary/20 border-r-0 px-2.5 text-[9px] font-bold rounded-l-xl flex items-center uppercase">{item.episodes}</span>
                                                    <input type="number" className="glass-input rounded-r-xl w-full text-center py-2 font-display text-lg font-semibold" value={EPprogress} onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        setEPprogress(value > item.episodes ? item.episodes : value);
                                                        updateEPCH(e.target.value)
                                                    }} />
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
                                                <input type="number" className="glass-input rounded-r-xl w-full text-center py-2 font-display text-lg font-semibold" value={CHprogress} onChange={(e) => { setCHprogress(e.target.value < 0 ? 0 : e.target.value > item.chapters ? item.chapters : e.target.value); updateEPCH(e.target.value) }} />
                                            </div>
                                        </>)}
                                    </div>
                                    <div className='space-y-2.5'>

                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">No of Rating</label>
                                        <div className="flex h-11">
                                            <span className="bg-bgsecondary/10 text-bgsecondary border border-bgsecondary/20 border-r-0 px-2.5 text-[9px] font-bold rounded-l-xl flex items-center uppercase">10</span>
                                            <input type="number" className="glass-input rounded-r-xl w-full text-center py-2 font-display text-lg font-semibold" value={rating} onChange={(e) => { setRating(e.target.value < 0 ? 0 : e.target.value > 10 ? 10 : e.target.value) }} />
                                        </div>

                                    </div>
                                </div>
                                {itemType === "manga" && (<div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                                    <div className='space-y-2.5'>
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">No of VolumesProgress</label>
                                        <div className="flex h-11">
                                            <span className="bg-bgsecondary/10 text-bgsecondary border border-bgsecondary/20 border-r-0 px-2.5 text-[9px] font-bold rounded-l-xl flex items-center uppercase">{item.volumes || 'N/A'}</span>
                                            <input type="number" className="glass-input rounded-r-xl w-full text-center py-2 font-display text-lg font-semibold" value={VOLprogress} onChange={(e) => { setVOLprogress(e.target.value < 0 ? 0 : e.target.value > item.volumes ? item.volumes : e.target.value) }} />
                                        </div>
                                    </div>
                                </div>)}

                                <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                                    <div className='space-y-2.5'>
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">Start Date</label>
                                        <input type="date" className="glass-input rounded-xl w-full py-2.5 px-3 text-xs font-medium h-11" value={
                                            startDate
                                                ? new Date(startDate).toISOString().split("T")[0]
                                                : ""
                                        } readOnly />

                                    </div>
                                    <div className='space-y-2.5'>
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">Finish Date</label>
                                        <input type="date" className="glass-input rounded-xl w-full py-2.5 px-3 text-xs font-medium h-11" value={
                                            finishDate
                                                ? new Date(finishDate).toISOString().split("T")[0]
                                                : ""
                                        } readOnly />
                                    </div>
                                    <div className='space-y-2.5'>
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] block ml-1">Last Update</label>
                                        <input type="date" className="glass-input rounded-xl w-full py-2.5 px-3 text-xs font-medium h-11" value={
                                            updatedDate
                                                ? new Date(updatedDate).toISOString().split("T")[0]
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
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className='lg:col-span-2 xl:col-span-1 space-y-4 flex flex-col min-h-75 lg:h-full'>
                                <div className="flex justify-between items-center mb-1">

                                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] ml-1">{itemType === "anime" ? "Episodes" : "Chapters"} Progress</label>
                                    <div className="flex items-center gap-2 group cursor-pointer">
                                        {/* <input className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/20 h-4 w-4" id="watchall" type="checkbox" /> */}
                                        <input
                                            id="watchAll"
                                            type="checkbox"
                                            name="progressOption"
                                            value={watchAll}
                                            onChange={(e) => handleWatchAll(e.target.checked)}
                                            className="rounded border-slate-700 bg-slate-900 text-bgsecondary focus:ring-bgsecondary/20 h-4 w-4"
                                        />
                                        {/* <label className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors cursor-pointer" for="watchall">Mark all watched</label> */}
                                        <label htmlFor="watchAll" className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors cursor-pointer">
                                            Watch All {itemType === "anime" ? "Episodes" : "Chapters"}
                                        </label>
                                    </div>
                                </div>
                                <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80 grow max-h-75  overflow-y-auto scrollbar-hide mt-2'>
                                    {episodes?.map((ep) => (
                                        <div key={ep}
                                            className='flex items-center gap-2 md:gap-3 p-2 md:p-2.5 rounded-lg md:rounded-xl bg-slate-900/60 border border-slate-700/30 hover:border-bgsecondary/40 hover:bg-slate-800 transition-all cursor-pointer group'>
                                            <input
                                                type="checkbox"
                                                checked={selectedEpisodes.includes(ep)}
                                                onChange={() => toggleEpisode(ep)}
                                                className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/20 h-4 w-4"
                                            />
                                            <label
                                                className="text-[10px] md:text-xs font-medium text-slate-400 group-hover:text-white transition-colors"
                                            > Ep {ep} </label>
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
