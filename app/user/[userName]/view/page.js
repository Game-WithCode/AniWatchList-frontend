'use client'
import React, { use } from 'react'
import { itemfind } from '@/lib/hooks/itemfind'

import { useState, useEffect } from 'react'
import PrioritySection from './components/prioritysection'
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from 'react-toastify';

const ScreenshotViewer = () => {
    const router = useRouter()
    const { data: session, status } = useSession();
    const [screenshots, setScreenshots] = useState([])
    const [ratingSelection, setRatingSelection] = useState(0);
    const [isfilterAppled, setIsfilterAppled] = useState(false);
    const [isFavoriteSelect, setisFavoriteSelect] = useState(false)
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [SortingData, setSortingData] = useState({
        High_priority: [],
        Medium_priority: [],
        Low_priority: [],
        filteredData: [],
    })

    const [filters, setFilters] = useState({
        time: "newest",         // newest | oldest
        category: "all",
        status: "all",
        userRating: "all",
        priority: "all",
        IsFavorite: false
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await itemfind();
            const foundItem = (data?.watchlist?.screenshots || []).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

            const high = [];
            const medium = [];
            const low = [];

            foundItem.forEach((item) => {
                if (item.priority >= 3) high.push(item);
                else if (item.priority === 2) medium.push(item);
                else low.push(item);
            });

            setSortingData({
                High_priority: high,
                Medium_priority: medium,
                Low_priority: low,
            });

            setScreenshots(foundItem);
            setIsfilterAppled(false)
        };

        fetchData();
    }, []);
    useEffect(() => {

        let fetchData = async () => {
            const data = await itemfind();
            const foundItem = (data?.watchlist?.screenshots || []).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
            const hasActiveFilter =
                filters.time !== "newest" ||
                filters.category !== "all" ||
                filters.status !== "all" ||
                filters.userRating !== "all" ||
                filters.IsFavorite !== false ||
                filters.priority !== "all";

            setIsfilterAppled(hasActiveFilter);
            setIsMobileFilterOpen(false); // Close mobile filter on filter change
            const filteredScreenshots = foundItem.filter((item) => {

                // Implement filtering logic based on filters state
                let isValid = true;
                // Example: Filter by priority
                if (filters.priority !== "all") {
                    if (filters.priority === "high" && item.priority < 3) isValid = false;
                    else if (filters.priority === "medium" && item.priority !== 2) isValid = false;
                    else if (filters.priority === "low" && item.priority > 1) isValid = false;
                }
                //create more filters here based on time, userRating, status etc.
                const date = Date.now();
                if (filters.time !== "newest") {
                    // setIsfilterAppled(true)
                    if (filters.time === "today") {
                        const today = new Date().setHours(0, 0, 0, 0);
                        (new Date(item.createdAt) < today) && (isValid = false);
                    }
                    if (filters.time === "week") {

                        (new Date(item.createdAt) < date - 7 * 24 * 60 * 60 * 1000) && (isValid = false);
                    }
                    if (filters.time === "month") {
                        (new Date(item.createdAt) < date - 30 * 24 * 60 * 60 * 1000) && (isValid = false);
                    }
                }


                if (filters.IsFavorite) {
                    if (filters.IsFavorite === true && item.favorite == false) isValid = false
                }
                //category filter(anime/manga)
                if (filters.category !== "all") {
                    // setIsfilterAppled(true)
                    const itemCategory = (item.category || "N/A").toLowerCase();
                    const filterCategory = filters.category.toLowerCase();
                    if (itemCategory !== filterCategory) isValid = false;
                }
                //Stauts filter (continue/watched/planned/pause/drop)
                if (filters.status !== "all") {
                    // setIsfilterAppled(true)
                    const itemStatus = (item.userStatus || "N/A").toLowerCase();
                    const filterStatus = filters.status.toLowerCase();
                    if (itemStatus !== filterStatus) isValid = false;
                }
                //userRating filter (0-5/6-10)
                if (filters.userRating !== "all") {
                    // setIsfilterAppled(true)
                    const itemRating = parseInt(item.userRating) || 0;

                    if (filters.userRating === "0-5" && itemRating > 5) {
                        isValid = false;
                    } else if (filters.userRating === "6-10") {
                        if (!(itemRating >= 6 && itemRating <= 10)) {
                            isValid = false;
                        }
                     
                    } else if (!isNaN(parseInt(filters.userRating))) {
                        setIsfilterAppled(true)
                        if (parseInt(itemRating) !== parseInt(filters.userRating)) {
                            isValid = false;
                        }
                    }
                }
                //priority filter is already done above

                return isValid;
            }).sort((a, b) => {
                if (filters.time === "newest") {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                } else if (filters.time === "oldest") {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                } else {
                    return 0; // no sorting
                }
            });
           
            if (!hasActiveFilter) {
                setSortingData(prev => ({
                    ...prev,
                    filteredData: []
                }));
                return;
            }
            setSortingData(prev => ({
                ...prev,
                filteredData: filteredScreenshots
            }));
        }
        fetchData()
        // You can implement filtering logic here based on the `filters` state

    }, [filters]);
    let detailHandler = (item) => (e) => {
        e.preventDefault();
        
    }

    let filterReset = () => {
        setFilters({
            time: "newest",         // newest | oldest
            category: "all",
            status: "all",
            userRating: "all",
            priority: "all",
            IsFavorite: false
        })
        setRatingSelection(0)
        setIsfilterAppled(false)
    }
    useEffect(() => {
        setFilters((prev) => ({
            ...prev, IsFavorite: isFavoriteSelect
        }))
    }, [isFavoriteSelect]);
    return (
        <>




            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="flex items-center gap-3 text-lg lg:text-3xl  font-bold text-text-primary">
                        <span className="material-symbols-outlined text-xl lg:text-4xl"><span className="material-symbols-outlined">
                            photo_library
                        </span></span>
                        Your Screenshots
                    </h1>
                    <button
                        className="flex items-center justify-center space-x-2 px-2 lg:px-4 py-2 text-sm font-medium text-white bg-bgsecondary rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.7)] hover:shadow-bgsecondary/50 hover:-translate-y-1"
                        onClick={() => router.push(`/user/${session.user.name}/screenshot`)}
                    >
                        {/* Removed the extra span, you don't need it if using a component */}
                        <span className="material-symbols-outlined">
                            upload_file
                        </span>
                        <span className='hidden md:block'>Upload Screenshot</span>
                    </button>
                </div>
                {/* let add filter button for small screen so on click it will open modal for filter options */}
                <div className="lg:hidden container mx-auto px-4 flex justify-end">

                    <button className="lg:hidden bg-bgsecondary text-white py-2 px-4 rounded-lg flex items-center"
                        onClick={() => {
                            setIsMobileFilterOpen(!isMobileFilterOpen);
                        }}
                    >
                        <span className="material-symbols-outlined">
                            {isMobileFilterOpen ? "close" : "tune"}
                        </span>
                    </button>
                </div>
                <section className='flex gap-6'>
                    {/* for testing */}
                    {/* <h1 className='font-semibold text-2xl mb-6 mt-6'>Here test priority </h1>
                    <PrioritySection item={SortingData} sectionkey={"Low_priority"} /> */}
                    {/* for High priority */}
                    <div className='w-full flex'>
                        <section>
                            {isfilterAppled ? (
                                <>
                                    <h1 className='font-semibold text-2xl mb-6 mt-6'>Here Filtered Data </h1>
                                    <PrioritySection item={SortingData["filteredData"]} /></>
                            ) : (
                                <>
                                    <h1 className='font-semibold text-2xl mb-6 mt-6'>Here High priority </h1>

                                    <PrioritySection item={SortingData["High_priority"]} />
                                    {/* for medium priority */}
                                    <h1 className='font-semibold text-2xl mb-6 mt-6'>Here Medium priority </h1>
                                    {/* <div className='flex gap-2 items-center '>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  w-full h-fit">

                            {
                                SortingData.Medium_priority.length > 0 ? (
                                    SortingData.Medium_priority.map((item, index) => {
                                        if (index >= 4) {
                                            return null; // Limit to 4 items
                                        }
                                        return (
                                            <div key={index} className="bg-background-secondary/70 border border-border-color rounded-xl shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group max-h-fit w-full"
                                                onClick={detailHandler(item)}
                                            >
                                                <div className="relative">
                                                    <img alt={`Anime screenshot ${index + 1}`} className="w-full h-48 object-cover" src={item.imageUrl} />
                                                    <div className="absolute top-3 right-3 text-xs font-medium text-text-secondary bg-background-secondary/80 backdrop-blur-3xl text-white px-2.5 py-1 rounded-full">{new Date(item.uploadedAt).toLocaleDateString()}</div>
                                                </div>
                                                <div className="p-4 flex flex-col grow">
                                                    <span className="inline-block bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start">{item.tag || "No Tag"}</span>
                                                    <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors">{item.title}</h3>
                                                    <p className="text-sm text-text-secondary mt-1">{item.description}</p>
                                                </div>
                                            </div>
                                        )
                                    })

                                ) : (
                                    <p className="text-center col-span-full">No screenshots Medium priority yet.</p>
                                )
                            }
                        </div>
                        <span className="material-symbols-outlined cursor-pointer text-3xl font-bold hover:scale-105" style={{ fontSize: '32px' }}>
                            expand_circle_down
                        </span>
                    </div> */}
                                    <PrioritySection item={SortingData["Medium_priority"]} />
                                    {/* For Low priority */}
                                    <h1 className='font-semibold text-2xl mb-6 mt-6'>Here Low priority </h1>
                                    {/* <div className='flex gap-2 items-center '>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  w-full h-fit">

                            {
                                SortingData.Low_priority.length > 0 ? (
                                    SortingData.Low_priority.map((item, index) => {
                                        if (index >= 4) {
                                            return null; // Limit to 4 items
                                        }
                                        return (
                                            <div key={index} className="bg-background-secondary/70 border border-border-color rounded-xl shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group max-h-fit"
                                                onClick={detailHandler(item)}
                                            >
                                                <div className="relative">
                                                    <img alt={`Anime screenshot ${index + 1}`} className="w-full h-48 object-cover" src={item.imageUrl} />
                                                    <div className="absolute top-3 right-3 text-xs font-medium text-text-secondary bg-background-secondary/80 backdrop-blur-3xl text-white px-2.5 py-1 rounded-full">{new Date(item.uploadedAt).toLocaleDateString()}</div>
                                                </div>
                                                <div className="p-4 flex flex-col grow">
                                                    <span className="inline-block bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start">{item.tag || "No Tag"}</span>
                                                    <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors">{item.title}</h3>
                                                    <p className="text-sm text-text-secondary mt-1">{item.description}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <p className="text-center col-span-full">No screenshots Low priority yet.</p>
                                )
                            }
                        </div>
                        <span className="material-symbols-outlined cursor-pointer text-3xl font-bold hover:scale-105" style={{ fontSize: '32px' }}>
                            expand_circle_down
                        </span>
                    </div> */}
                                    <PrioritySection item={SortingData["Low_priority"]} />
                                </>)
                            }
                        </section>
                    </div>
                    {/* create new section for filter options */}
                    <section className={`
    // 1. Mobile State Logic (Fixed overlay when open)
    ${isMobileFilterOpen ? "fixed inset-0 md:inset-1/2 z-50 md:w-1/2  h-fit md:top-1/5 overflow-y-auto rounded-none" : "hidden"}

    // 2. Desktop State (Always visible sidebar)
    lg:block lg:w-1/4 lg:sticky lg:top-20 lg:h-fit lg:max-h-200 lg:rounded-lg 
    
    // 3. Shared Styling (Colors, shadows)
    bg-[#1F2937] p-6 shadow-lg scrollbar-hide overflow-auto
`}>
                        <div className="absolute top-1 right-4 lg:hidden flex items-center justify-center">
                            <button
                                className=" text-white p-1 rounded-lg"
                                onClick={() => setIsMobileFilterOpen(false)}
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between mb-6 mt-5">
                            <h2 className="text-xl font-bold text-text-primary">Filters</h2>
                            <button className="text-sm text-red-400 hover:text-red-500 font-medium" onClick={() => filterReset()}>Reset</button>
                        </div>
                        {/* boday part */}
                        <div className="space-y-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">Time</label>
                                <div className='grid grid-cols-2 gap-2'>
                                    <button className={
                                        filters.time == "newest" ? "px-3 py-1.5 rounded-lg  hover:bg-border-color  text-bgsecondary transition bg-bgsecondary/10" :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] hover:bg-border-color text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"} onClick={
                                                (e) => {
                                                    const value = e.target.value
                                                    setFilters(prev => ({ ...prev, time: prev.time === value ? "newest" : value }))
                                                }
                                            } value={"newest"}>Newest</button>
                                    <button className={
                                        filters.time == "oldest" ? "px-3 py-1.5 rounded-lg  hover:bg-border-color  text-bgsecondary transition bg-bgsecondary/10" :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] hover:bg-border-color text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"} onClick={
                                                (e) => {
                                                    const value = e.target.value
                                                    setFilters(prev => ({ ...prev, time: prev.time === value ? "newest" : value }))
                                                }
                                            } value={"oldest"}>Oldest</button>
                                    <button className={
                                        filters.time == "today" ? "px-3 py-1.5 rounded-lg  hover:bg-border-color  text-bgsecondary transition bg-bgsecondary/10" :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] hover:bg-border-color text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"} onClick={
                                                (e) => {
                                                    const value = e.target.value
                                                    setFilters(prev => ({ ...prev, time: prev.time === value ? "newest" : value }))
                                                }
                                            } value={"today"}>Today</button>
                                    <button className={
                                        filters.time == "week" ? "px-3 py-1.5 rounded-lg  hover:bg-border-color  text-bgsecondary transition bg-bgsecondary/10" :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] hover:bg-border-color text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"} onClick={
                                                (e) => {
                                                    const value = e.target.value
                                                    setFilters(prev => ({ ...prev, time: prev.time === value ? "newest" : value }))
                                                }
                                            } value={"week"}>This week</button>
                                    <button className={
                                        filters.time == "month" ? "px-3 py-1.5 rounded-lg col-span-2 hover:bg-border-color  text-bgsecondary transition bg-bgsecondary/10" :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] col-span-2 hover:bg-border-color text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"}
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters(prev => ({ ...prev, time: prev.time === value ? "newest" : value }))
                                            }
                                        }
                                        value={"month"}>This month</button>
                                </div>
                            </div>
                            <hr className="border-t border-border-color" />
                            {/* Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">Type</label>
                                <div className='flex w-full gap-2'>
                                    <button
                                        className={
                                            filters.category == "anime" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                                "px-3 py-1.5 rounded-lg bg-[#374151]  text-gray-300 hover:text-bgsecondary transition w-full hover:bg-bgsecondary/10"}
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    category: prev.category === value ? "all" : value
                                                }))
                                                // setFilters(prev => ({ ...prev, category: e.target.value }))
                                            }
                                        }
                                        value={"anime"}>Anime</button>
                                    <button className={
                                        filters.category == "manga" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                            "px-3 py-1.5 rounded-lg bg-[#374151]  text-gray-300 hover:text-bgsecondary transition w-full hover:bg-bgsecondary/10"}
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    category: prev.category === value ? "all" : value
                                                }))
                                            }
                                        }
                                        value={"manga"}>Manga</button>



                                </div>
                            </div>
                            <hr className="border-t border-border-color" />
                            {/* priority Filter */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">Priority</label>
                                <div className='flex w-full gap-2'>
                                    <button
                                        className={
                                            filters.priority == "low" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                                "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition w-full hover:bg-bgsecondary/10"}
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    priority: prev.priority === value ? "all" : value
                                                }))
                                            }
                                        }
                                        value={"low"}
                                    >Low</button>
                                    <button className={
                                        filters.priority == "medium" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition w-full hover:bg-bgsecondary/10"}
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    priority: prev.priority === value ? "all" : value
                                                }))
                                            }
                                        }
                                        value={"medium"}
                                    >Medium</button>
                                    <button className={
                                        filters.priority == "high" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition w-full hover:bg-bgsecondary/10"}
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    priority: prev.priority === value ? "all" : value
                                                }))
                                            }
                                        }
                                        value={"high"}
                                    >High</button>


                                </div>
                            </div>
                            <hr className="border-t border-border-color" />
                            {/* UserRating Filter */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">UserRating</label>
                                <div className='flex flex-col w-full gap-2'>
                                    <div className='flex w-full gap-2'>
                                        <button
                                            className={
                                                filters.userRating == "0-5" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                                    "px-3 w-full py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"}
                                            onClick={
                                                (e) => {
                                                    const value = e.target.value
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        userRating: prev.userRating === value ? "all" : value
                                                    }))
                                                }
                                            }
                                            value={"0-5"}
                                        >0-5</button>
                                        <button
                                            className={
                                                filters.userRating == "6-10" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                                    "px-3 w-full py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"}
                                            onClick={
                                                (e) => {
                                                    const value = e.target.value
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        userRating: prev.userRating === value ? "all" : value
                                                    }))
                                                }
                                            }
                                            value={"6-10"}
                                        >6-10</button>
                                    </div>
                                    <div className='flex items-center w-full gap-2'>
                                        <input type="range" min="0" max="10" className="w-full accent-bgsecondary self" value={ratingSelection} onChange={
                                            (e) => {
                                                setRatingSelection(e.target.value)
                                                if (e.target.value === "0") {
                                                    setFilters(prev => ({ ...prev, userRating: "all" }))
                                                } else {
                                                    setFilters(prev => ({ ...prev, userRating: e.target.value }))
                                                }
                                            }
                                        } />
                                        <span className="text-sm text-text-primary"> {ratingSelection} </span>
                                    </div>
                                </div>
                            </div>
                            <hr className="border-t border-border-color" />
                            {/* UserStatus Filter */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">UserStatus</label>
                                <div className='flex w-full gap-2 flex-wrap'>
                                    <button
                                        className={
                                            filters.status == "continue" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                                "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                        }
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    status: prev.status === value ? "all" : value
                                                }))
                                            }
                                        }
                                        value={"Continue"}
                                    >Continue</button>
                                    <button
                                        className={
                                            filters.status == "completed" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                                "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                        }
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    status: prev.status === value ? "all" : value
                                                }))
                                            }
                                        }
                                        value={"Completed"}
                                    >Watched</button>
                                    <button
                                        className={
                                            filters.status == "planning" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                                "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                        }
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    status: prev.status === value ? "all" : value
                                                }))
                                            }
                                        }
                                        value={"Planning"}
                                    >Planned</button>
                                    <button
                                        className={
                                            filters.status == "onhold" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                                "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                        }
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    status: prev.status === value ? "all" : value
                                                }))
                                            }
                                        }
                                        value={"Paused"}
                                    >Pause</button>
                                    <button
                                        className={
                                            filters.status == "dropped" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                                "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                        }
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    status: prev.status === value ? "all" : value
                                                }))
                                            }
                                        }
                                        value={"Dropped"}
                                    >Drop</button>
                                    <button
                                        className={
                                            filters.status == "rewatching" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                                "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                        }
                                        onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    status: prev.status === value ? "all" : value
                                                }))
                                            }
                                        }
                                        value={"Rewatch"}
                                    >Rewatching</button>
                                </div>
                            </div>
                            <hr className="border-t border-border-color" />
                            <div>
                                <div className='flex items-center justify-between'>
                                    <label className="block text-sm font-medium text-bgsecondary mb-2">Favorite Only</label>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input className="sr-only peer" type="checkbox" checked={isFavoriteSelect} onChange={(e) => setisFavoriteSelect(e.target.checked)} />
                                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-bgsecondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bgsecondary relative"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                </section>
            </main >
        </>
    )
}

export default ScreenshotViewer
