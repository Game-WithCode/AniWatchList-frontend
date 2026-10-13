'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useSearchParams, usePathname } from 'next/navigation'
import { itemfind } from '@/lib/hooks/itemfind';
import { allGenres } from '@/lib/hooks/Allgenre';

export default function AddedPage({ params }) {
    let searchType;
    const [ratingSelection, setRatingSelection] = useState(0);
    const [isfilterAppled, setIsfilterAppled] = useState(false);
    const [allGenreOption, setallGenreOption] = useState([]);
    const [SelectedGenre, setSelectedGenre] = useState([]);
    const [SelectionType, setSelectionType] = useState([]);
    const [SelectedType, setSelectedType] = useState([]);
    const [isFavoriteSelect, setisFavoriteSelect] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Updated to match AniList's specific media formats
    const animeTypes = [
        { label: "TV", value: "TV" },
        { label: "TV Short", value: "TV_SHORT" },
        { label: "Movie", value: "MOVIE" },
        { label: "OVA", value: "OVA" },
        { label: "ONA", value: "ONA" },
        { label: "Special", value: "SPECIAL" },
        { label: "Music", value: "MUSIC" }
    ];
    
    const mangaTypes = [
        { label: "Manga", value: "MANGA" },
        { label: "Light Novel", value: "NOVEL" },
        { label: "One-shot", value: "ONE_SHOT" }
    ];

    const router = useRouter();
    const urlSearchParams = useSearchParams();
    const typeFromQuery = urlSearchParams?.get('type');
    
    const [filters, setFilters] = useState({
        time: "newest", // newest | oldest  
        Genre: ["all"],
        Type: ["all"],
        status: "all",
        userRating: "all",
        priority: "all",
        IsFavorite: false
    });

    if (typeFromQuery) {
        searchType = typeFromQuery;
    }

    const pathname = usePathname();
    const baseUserPath = pathname.split("/").slice(0, 3).join("/");
    const [anime, setAnime] = useState([]);
    const [loading, setLoading] = useState(true);

    let filterReset = () => {
        setFilters({
            time: "newest",
            Genre: ["all"],
            Type: ["all"],
            status: "all",
            userRating: "all",
            priority: "all",
            IsFavorite: false
        });
        setRatingSelection(0);
        setIsfilterAppled(false);
        setSelectedGenre([]);
        setSelectedType([]);
    }

    useEffect(() => {
        let fetchData = async () => {
            const data = await itemfind();
            // Fixed typo: changed uploadedAt to addedAt to match your DB schema
            const foundItem = (data?.watchlist?.[searchType] || []).sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
            
            const hasActiveFilter =
                filters.time !== "newest" ||
                filters.Genre[0] !== "all" ||
                filters.Type[0] !== "all" ||
                filters.status !== "all" ||
                filters.userRating !== "all" ||
                filters.IsFavorite !== false ||
                filters.priority !== "all";

            setIsfilterAppled(hasActiveFilter);
            setIsMobileFilterOpen(false); 

            const filteredData = foundItem.filter((item) => {
                let isValid = true;
                
                if (filters.priority !== "all") {
                    if (filters.priority === "high" && item.priority < 3) isValid = false;
                    else if (filters.priority === "medium" && item.priority !== 2) isValid = false;
                    else if (filters.priority === "low" && item.priority > 1) isValid = false;
                }
                
                if (filters.IsFavorite) {
                    if (filters.IsFavorite === true && item.favorite === false) isValid = false;
                }

                const date = Date.now();
                if (filters.time !== "newest") {
                    if (filters.time === "today") {
                        const today = new Date().setHours(0, 0, 0, 0);
                        (new Date(item.addedAt) < today) && (isValid = false);
                    }
                    if (filters.time === "week") {
                        (new Date(item.addedAt) < date - 7 * 24 * 60 * 60 * 1000) && (isValid = false);
                    }
                    if (filters.time === "month") {
                        (new Date(item.addedAt) < date - 30 * 24 * 60 * 60 * 1000) && (isValid = false);
                    }
                }
                
                if (filters.Genre.length > 0 && filters.Genre[0] !== "all") {
                    const itemCategory = (item.genres || []);
                    const filterCategory = filters.Genre;
                    const hasMatch = filterCategory.some(fg => itemCategory.includes(fg));
                    if (!hasMatch) isValid = false;
                }
                
                // Updated format checking for AniList (string matching instead of array includes)
                if (filters.Type.length > 0 && filters.Type[0] !== "all") {
                    const itemCategory = item.category || "";
                    const filterCategory = filters.Type;
                    const hasMatch = filterCategory.some(fc => 
                        itemCategory.toUpperCase() === fc.toUpperCase()
                    );
                    if (!hasMatch) isValid = false;
                }
                
                if (filters.status !== "all") {
                    const itemStatus = (item.UserStatus || "N/A").toLowerCase();
                    const filterStatus = filters.status.toLowerCase();
                    if (itemStatus !== filterStatus) isValid = false;
                }
                
                if (filters.userRating !== "all") {
                    const itemRating = parseInt(item.userRating) || 0;
                    if (filters.userRating === "0-5" && itemRating > 5) {
                        isValid = false;
                    } else if (filters.userRating === "6-10") {
                        if (!(itemRating >= 6 && itemRating <= 10)) {
                            isValid = false;
                        }
                    } else if (!isNaN(parseInt(filters.userRating))) {
                        if (parseInt(itemRating) !== parseInt(filters.userRating)) {
                            isValid = false;
                        }
                    }
                }

                return isValid;
            }).sort((a, b) => {
                if (filters.time === "newest") {
                    return new Date(b.addedAt) - new Date(a.addedAt);
                } else if (filters.time === "oldest") {
                    return new Date(a.addedAt) - new Date(b.addedAt);
                } else {
                    return 0; 
                }
            });
            setAnime(filteredData);
        }
        fetchData();
    }, [filters, searchType]);

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const res = await fetch('/api/watchlist/get', {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await res.json();

                const animeList = (data?.watchlist?.[searchType] || []).sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

                setAnime(animeList || []);
                setSelectedGenre([]);

                setSelectionType(
                    searchType === "anime" ? animeTypes : mangaTypes
                );
            } catch (err) {
                console.error('Error fetching anime:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnime();
    }, [searchType]);

    useEffect(() => {
        const fetch = async () => {
            const apitype = searchType === "anime" ? "anime" : "manga";
            const allGenresData = await allGenres();
            const names = allGenresData.data?.GenreCollection || [];
            console.log("Fetched genres:", names,allGenresData);
            setallGenreOption(names);
            setSelectedGenre([]);
            
            if (searchType === "anime") {
                setSelectionType(animeTypes);
            } else {
                setSelectionType(mangaTypes);
            }
        }
        fetch();
    }, [searchType]);

    useEffect(() => {
        setFilters((prev) => ({
            ...prev, Genre: SelectedGenre
        }));
    }, [SelectedGenre]);

    useEffect(() => {
        setFilters((prev) => ({
            ...prev, Type: SelectedType
        }));
    }, [SelectedType]);

    useEffect(() => {
        setFilters((prev) => ({
            ...prev, IsFavorite: isFavoriteSelect
        }));
    }, [isFavoriteSelect]);

    if (loading) {
        return(
            <div className="container mx-auto flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bgsecondary"></div>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Added {searchType ? searchType.charAt(0).toUpperCase() + searchType.slice(1) : ""}</h1>
                <p>This is the user’s added {searchType ? searchType : "items"} page.</p>
            </div>
            
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
            
            <div className='container w-full flex mx-auto mt-8 gap-10 relative'>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 px-5 lg:px-0 md:px-0 grow'>
                    {
                        anime.length > 0 ? (
                            anime?.map((item) => {
                                return (
                                    <div key={item.mal_id} className='group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-bgsecondary/10 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 h-fit'>
                                        <div className='aspect-2/3 overflow-hidden relative'>
                                            <img src={item.image} alt={item.title} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                                            <div className='absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
                                                <span className="bg-bgsecondary text-white text-xs font-bold px-2 py-1 rounded">
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg text-white dark:text-white mb-1 line-clamp-1 group-hover:text-bgsecondary transition-colors">{item.title}</h3>
                                            <div className="flex justify-between items-center text-xs text-white dark:text-slate-400 mb-4">
                                                <span className='flex items-center'><span className="material-symbols-outlined">
                                                    calendar_month
                                                </span>
                                                    {new Date(item.addedAt).toLocaleDateString()}</span>
                                                {
                                                    item.priority === 3 ? (<span className='inline-block bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start'>High</span>) : item.priority === 2 ? (<span className='inline-block bg-yellow-500/10 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start'>Medium</span>) : item.priority === 1 ? (<span className='inline-block bg-red-500/10 text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start'>Low</span>) : (<span >{item.UserStatus}</span>)
                                                }
                                            </div>
                                            <button className="w-full py-2.5 rounded-lg bg-bgsecondary/20 dark:bg-bgsecondary/20 text-bgsecondary dark:text-bgsecondary/50 font-semibold text-sm hover:bg-bgsecondary hover:text-white dark:hover:bg-bgsecondary dark:hover:text-white transition-all"
                                                onClick={() => {
                                                    // searchType strictly maps to Anilist type
                                                    router.push(`${baseUserPath}/items?id=${item.mal_id}&type=${searchType}`);
                                                }}>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-3 text-center py-10">
                                <p className="text-xl text-gray-500">No items found matching your filters.</p>
                            </div>
                        )
                    }
                </div>

                <section className={`
                    ${isMobileFilterOpen ? "fixed inset-0 md:inset-1/2 z-50 md:w-1/2 h-fit md:top-1/5 overflow-y-auto rounded-none" : "hidden"}
                    lg:block lg:w-1/4 lg:sticky lg:top-20 lg:h-fit lg:max-h-[800px] lg:rounded-lg 
                    bg-[#1F2937] p-6 shadow-lg scrollbar-hide overflow-auto
                `}>
                    <div className="absolute top-1 right-4 lg:hidden flex items-center justify-center">
                        <button
                            className="text-white p-1 rounded-lg"
                            onClick={() => setIsMobileFilterOpen(false)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="flex items-center justify-between mb-6 mt-5">
                        <h2 className="text-xl font-bold text-text-primary">Filters</h2>
                        <button className="text-sm text-red-400 hover:text-red-500 font-medium" onClick={() => filterReset()}>Reset</button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Time</label>
                            <div className='grid grid-cols-2 gap-2'>
                                <button className={
                                    filters.time === "newest" ? "px-3 py-1.5 rounded-lg hover:bg-border-color text-bgsecondary transition bg-bgsecondary/10" :
                                        "px-3 py-1.5 rounded-lg bg-[#374151] hover:bg-border-color text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"} onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({ ...prev, time: prev.time === value ? "newest" : value }))
                                            }
                                        } value={"newest"}>Newest</button>
                                <button className={
                                    filters.time === "oldest" ? "px-3 py-1.5 rounded-lg hover:bg-border-color text-bgsecondary transition bg-bgsecondary/10" :
                                        "px-3 py-1.5 rounded-lg bg-[#374151] hover:bg-border-color text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"} onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({ ...prev, time: prev.time === value ? "newest" : value }))
                                            }
                                        } value={"oldest"}>Oldest</button>
                                <button className={
                                    filters.time === "today" ? "px-3 py-1.5 rounded-lg hover:bg-border-color text-bgsecondary transition bg-bgsecondary/10" :
                                        "px-3 py-1.5 rounded-lg bg-[#374151] hover:bg-border-color text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"} onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({ ...prev, time: prev.time === value ? "newest" : value }))
                                            }
                                        } value={"today"}>Today</button>
                                <button className={
                                    filters.time === "week" ? "px-3 py-1.5 rounded-lg hover:bg-border-color text-bgsecondary transition bg-bgsecondary/10" :
                                        "px-3 py-1.5 rounded-lg bg-[#374151] hover:bg-border-color text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"} onClick={
                                            (e) => {
                                                const value = e.target.value
                                                setFilters((prev) => ({ ...prev, time: prev.time === value ? "newest" : value }))
                                            }
                                        } value={"week"}>This week</button>
                                <button className={
                                    filters.time === "month" ? "px-3 py-1.5 rounded-lg col-span-2 hover:bg-border-color text-bgsecondary transition bg-bgsecondary/10" :
                                        "px-3 py-1.5 rounded-lg bg-[#374151] col-span-2 hover:bg-border-color text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"}
                                    onClick={
                                        (e) => {
                                            const value = e.target.value
                                            setFilters((prev) => ({ ...prev, time: prev.time === value ? "newest" : value }))
                                        }
                                    }
                                    value={"month"}>This month</button>
                            </div>
                        </div>
                        <hr className="border-t border-border-color" />
                        
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Genre</label>
                            <div className='flex w-full gap-2 flex-wrap'>
                                <select
                                    className="w-full appearance-none rounded-lg bg-[#374151] px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50" onChange={(e) => {
                                        setSelectedGenre(prev => {
                                            if (!prev.includes(e.target.value)) return [...prev, e.target.value];
                                            return prev; 
                                        });
                                    }}
                                    value=""
                                >
                                    <option value="" disabled>Select a genre</option>
                                    {allGenreOption?.map((genre, index) => (
                                        <option key={index} value={genre} >
                                            {genre}
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-2 flex flex-wrap gap-2 space-y-1">
                                    {SelectedGenre.length > 0 && SelectedGenre?.map((item, index) => (
                                        <div className='relative' key={index}>
                                            <span className="mr-2 px-2 py-1 bg-gray-700 text-gray-200 rounded pr-5">
                                                {item}
                                            </span>
                                            <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer hover:scale-105" style={{ fontSize: "14px" }}
                                                onClick={() => {
                                                    setSelectedGenre(prev => prev.filter(genre => genre !== item))
                                                }}
                                            >
                                                close
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <hr className="border-t border-border-color" />
                        
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Type</label>
                            <div className='flex w-full gap-2 flex-wrap'>
                                <select
                                    className="w-full appearance-none rounded-lg bg-[#374151] px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50" onChange={(e) => {
                                        setSelectedType(prev => {
                                            if (!prev.includes(e.target.value)) return [...prev, e.target.value];
                                            return prev;
                                        })
                                    }}
                                    value=""
                                >
                                    <option value="" disabled>Select a type</option>
                                    {
                                        SelectionType?.map((item, index) => (
                                            <option key={index} value={item.value} >
                                                {item.label}
                                            </option>
                                        ))
                                    }
                                </select>
                                <div className="mt-2 flex flex-wrap gap-2 space-y-1">
                                    {SelectedType.length > 0 && SelectedType?.map((itemValue, index) => {
                                        const typeObj = SelectionType.find(t => t.value === itemValue);
                                        const displayLabel = typeObj ? typeObj.label : itemValue;
                                        return (
                                            <div className='relative' key={index}>
                                                <span className="mr-2 px-2 py-1 bg-gray-700 text-gray-200 rounded pr-5">
                                                    {displayLabel}
                                                </span>
                                                <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer hover:scale-105" style={{ fontSize: "14px" }}
                                                    onClick={() => {
                                                        setSelectedType(prev => prev.filter(t => t !== itemValue))
                                                    }}
                                                >
                                                    close
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <hr className="border-t border-border-color" />
                        
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Priority</label>
                            <div className='flex w-full gap-2'>
                                <button
                                    className={
                                        filters.priority === "low" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition w-full hover:bg-bgsecondary/10"}
                                    onClick={(e) => setFilters((prev) => ({ ...prev, priority: prev.priority === e.target.value ? "all" : e.target.value }))}
                                    value={"low"}
                                >Low</button>
                                <button className={
                                    filters.priority === "medium" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                        "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition w-full hover:bg-bgsecondary/10"}
                                    onClick={(e) => setFilters((prev) => ({ ...prev, priority: prev.priority === e.target.value ? "all" : e.target.value }))}
                                    value={"medium"}
                                >Medium</button>
                                <button className={
                                    filters.priority === "high" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                        "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition w-full hover:bg-bgsecondary/10"}
                                    onClick={(e) => setFilters((prev) => ({ ...prev, priority: prev.priority === e.target.value ? "all" : e.target.value }))}
                                    value={"high"}
                                >High</button>
                            </div>
                        </div>
                        <hr className="border-t border-border-color" />
                        
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">UserRating</label>
                            <div className='flex flex-col w-full gap-2'>
                                <div className='flex w-full gap-2'>
                                    <button
                                        className={
                                            filters.userRating === "0-5" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                                "px-3 w-full py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"}
                                        onClick={(e) => setFilters((prev) => ({ ...prev, userRating: prev.userRating === e.target.value ? "all" : e.target.value }))}
                                        value={"0-5"}
                                    >0-5</button>
                                    <button
                                        className={
                                            filters.userRating === "6-10" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                                                "px-3 w-full py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"}
                                        onClick={(e) => setFilters((prev) => ({ ...prev, userRating: prev.userRating === e.target.value ? "all" : e.target.value }))}
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
                        
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">UserStatus</label>
                            <div className='flex w-full gap-2 flex-wrap'>
                                <button
                                    className={
                                        filters.status === "continue" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                    }
                                    onClick={(e) => setFilters((prev) => ({ ...prev, status: prev.status === e.target.value ? "all" : e.target.value }))}
                                    value={"continue"}
                                >Continue</button>
                                <button
                                    className={
                                        filters.status === "completed" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                    }
                                    onClick={(e) => setFilters((prev) => ({ ...prev, status: prev.status === e.target.value ? "all" : e.target.value }))}
                                    value={"completed"}
                                >Watched</button>
                                <button
                                    className={
                                        filters.status === "planning" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                    }
                                    onClick={(e) => setFilters((prev) => ({ ...prev, status: prev.status === e.target.value ? "all" : e.target.value }))}
                                    value={"planning"}
                                >Planned</button>
                                <button
                                    className={
                                        filters.status === "onhold" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                    }
                                    onClick={(e) => setFilters((prev) => ({ ...prev, status: prev.status === e.target.value ? "all" : e.target.value }))}
                                    value={"onhold"}
                                >Pause</button>
                                <button
                                    className={
                                        filters.status === "dropped" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                    }
                                    onClick={(e) => setFilters((prev) => ({ ...prev, status: prev.status === e.target.value ? "all" : e.target.value }))}
                                    value={"dropped"}
                                >Drop</button>
                                <button
                                    className={
                                        filters.status === "rewatching" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                                            "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                                    }
                                    onClick={(e) => setFilters((prev) => ({ ...prev, status: prev.status === e.target.value ? "all" : e.target.value }))}
                                    value={"rewatching"}
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
            </div>
        </>
    );
}