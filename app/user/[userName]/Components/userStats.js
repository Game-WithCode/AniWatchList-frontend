"use client"
import React from 'react'
import { itemfind } from '@/lib/hooks/itemfind'
import { useState, useEffect } from 'react'
import { ActivityFeed, getActionVerb } from "./ActivityFeed"

import { formatDistanceToNow } from 'date-fns'; // Optional: for "2 hours ago" format 
import { useRouter } from "next/navigation";
import { usePathname, useParams } from 'next/navigation'
import { getCategory } from '@/lib/hooks/getType'
const UserStats = () => {
    const intialStats = {
        Total: 0,
        CompletedNo: 0,
        Planned: 0,
        Onhold: 0,
        WatchingNo: 0,
        RewatchedNo: 0,
        FutureNo: 0,
    }
    const pathname = usePathname()
    const { userName } = useParams()
    const router = useRouter()
    const [animeData, setAnimeData] = useState(intialStats);
    const [mangaData, setMangaData] = useState(intialStats);
    const [screenShotData, setScreenShotData] = useState(intialStats);
    const [activityFeedData, setActivityFeedData] = useState([])
    const [SelectedTab, setSelectedTab] = useState('all')
    const [isScreenshotDataOpen, setisScreenshotDataOpen] = useState(false)
    const [TotalCalulative, setTotalCalulative] = useState({
        Total: 0,
        TotalAnime: 0,
        TotalManga: 0,
        TotalScreenshot: 0
    })
    const calculateStats = (list) => {
        if (!list) return intialStats;
        return {
            Total: list?.length,
            CompletedNo: list.filter((i) => i.UserStatus?.toLowerCase() == "completed").length,
            Planned: list.filter((i) => i.UserStatus?.toLowerCase() == "planning").length,
            Onhold: list.filter((i) => i.UserStatus?.toLowerCase() == "paused").length,
            WatchingNo: list.filter((i) => i.UserStatus?.toLowerCase() == "continue").length,
            RewatchedNo: list.filter((i) => i.UserStatus?.toLowerCase() == "rewatch").length,
            FutureNo: list.filter((i) => i.UserStatus?.toLowerCase() == "future").length,
            DroppedNo: list.filter((i) => i.UserStatus?.toLowerCase() == "dropped").length,
        }
    }
    const FavoriteStats = (list) => {
        if (!list) return intialStats;
        const FavoriteItem = list.filter((item) => item.favorite === true)
        // const TotalAnime = FavoriteItem.filter((item)=> getCategory(item.category) ==="anime")
        // const TotalManga = FavoriteItem.filter((item)=> getCategory(item.category) ==="manga")

    
        return {
            Total: FavoriteItem?.length,
            CompletedNo: FavoriteItem.filter((i) => i.UserStatus?.toLowerCase() == "completed").length,
            Planned: FavoriteItem.filter((i) => i.UserStatus?.toLowerCase() == "planning").length,
            Onhold: FavoriteItem.filter((i) => i.UserStatus?.toLowerCase() == "paused").length,
            WatchingNo: FavoriteItem.filter((i) => i.UserStatus?.toLowerCase() == "continue").length,
            RewatchedNo: FavoriteItem.filter((i) => i.UserStatus?.toLowerCase() == "rewatch").length,
            FutureNo: FavoriteItem.filter((i) => i.UserStatus?.toLowerCase() == "future").length,
        }
    }
    const getPercentage = (given, Total) => {
        if (Total == 0) return 0;
        return Math.round((given / Total) * 100);
    }
    useEffect(() => {
        const fetchAllStats = async () => {
            // Fetch once, distribute data to all states
            const item = await itemfind();

            if (item?.watchlist) {
                setAnimeData(calculateStats(item.watchlist.anime));
                setMangaData(calculateStats(item.watchlist.manga));
                setScreenShotData(calculateStats(item.watchlist.screenshots));
                setActivityFeedData(ActivityFeed(item.watchlist))

            }
            setTotalCalulative({
                Total: animeData.Total + mangaData.Total + screenShotData.Total,
                TotalAnime: animeData.Total,
                TotalManga: mangaData.Total,
                TotalScreenshot: screenShotData.Total
            })

        };
        fetchAllStats();

    }, [])
    const animeCompletedPct = getPercentage(animeData.WatchingNo, animeData.Total);
    const animePlannedPct = getPercentage(animeData.Planned, animeData.Total);

    // 2. Calculate the "Stops" for the gradient
    // Stop 1 is where Completed ends
    const stop1 = animeCompletedPct;
    // Stop 2 is where Completed + Planning ends
    const stop2 = animeCompletedPct + animePlannedPct;

    const mangaContinuePct = getPercentage(mangaData.WatchingNo, mangaData.Total);
    const mangaPlannedPct = getPercentage(mangaData.Planned, mangaData.Total);
    // 2. Calculate the "Stops" for the gradient
    // Stop 1 is where Completed ends
    const mangastop1 = mangaContinuePct;
    // Stop 2 is where Completed + Planning ends
    const mangastop2 = mangaContinuePct + mangaPlannedPct;

    useEffect(() => {
        const fetch = async () => {
            if (SelectedTab == "all") {
                setTotalCalulative({
                    Total: animeData.Total + mangaData.Total + screenShotData.Total,
                    TotalAnime: animeData.Total,
                    TotalManga: mangaData.Total,
                    TotalScreenshot: screenShotData.Total
                })
            } else if (SelectedTab == "favorite") {

                const data = await itemfind();
                const allItems = [
                    ...(data.watchlist.anime || []),       // If data.anime is undefined, use []
                    ...(data.watchlist.manga || []),       // If data.manga is undefined, use []
                    ...(data.watchlist.screenshots || [])  // If data.screenshots is undefined, use []
                ];
                const Totalanime = FavoriteStats(data.watchlist.anime || []); // Safe fallback: pass empty array if missing
                const TotalManga = FavoriteStats(data.watchlist.manga || []); // Safe fallback: pass empty array if missing
                const TotalScreenshot = FavoriteStats(data.watchlist.screenshots || []); // Safe fallback: pass empty array if missing
         
                setTotalCalulative({
                    Total: Totalanime.Total + TotalManga.Total + TotalScreenshot.Total,
                    TotalAnime: Totalanime.Total,
                    TotalManga: TotalManga.Total,
                    TotalScreenshot: TotalScreenshot.Total
                })
            }
        }

        fetch()

    }, [SelectedTab, animeData, mangaData, screenShotData])




    return (
        <>
            <section className='w-full container mx-auto px-10 md:px-10 lg:px-20 mt-10'>
                <h2 className="text-2xl font-bold mb-6  dark:text-white flex items-center gap-2 ">
                    <span className="material-symbols-outlined text-bgsecondary">bar_chart</span>
                    Stats at a Glance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  ">
                    <div className="relative  rounded-2xl p-6 border  shadow-[0_0_15px_rgba(59,130,246,0.15)]   flex flex-col justify-between h-[340px] md:row-span-2  bg-[#0F172A] overflow-hidden text-[#64748b] lg:col-start-1 md:row-start-1">
                        <div className="h-1 w-full bg-linear-to-r from-teal-500 to-teal-900 top-0 absolute left-0"></div>
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-9xl">library_books</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-bgsecondary ">{SelectedTab === "all" ? "Total Library" : SelectedTab === "favorite" ? "Total Favorite" : SelectedTab === "screenshot" ? "Total Screenshot" : "libary book"}</h3>
                            {
                                SelectedTab !== "screenshot" && (
                                    <>
                                        <div className="mt-4">
                                            <span className="text-7xl font-bold tracking-tighter text-white">{TotalCalulative.Total}</span>
                                        </div>
                                        <div className="mt-4 text-sm space-y-1 text-white">
                                            <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-textcolor">play_circle</span> {TotalCalulative.TotalAnime} Anime</p>
                                            <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-textcolor">menu_book</span> {TotalCalulative.TotalManga} Manga</p>
                                            <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-[#64748b]">image</span> {TotalCalulative.TotalScreenshot} Screenshots</p>
                                        </div>
                                    </>
                                )
                            }
                            {
                                isScreenshotDataOpen ? (
                                    <>
                                        <div className="mt-4">
                                            <span className="text-7xl font-bold tracking-tighter text-white">{screenShotData.Total}</span>
                                        </div>
                                        <div className="space-y-2 text-sm max-h-25 overflow-auto scrollbar-hide">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-white">
                                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> Continue
                                                </div>
                                                <span className="font-bold text-white">{screenShotData.WatchingNo}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-white">
                                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> Completed
                                                </div>
                                                <span className="font-bold text-white">{screenShotData.CompletedNo}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-white">
                                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> On Hold
                                                </div>
                                                <span className="font-bold text-white">{screenShotData.Onhold}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-white">
                                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> ReWatched
                                                </div>
                                                <span className="font-bold text-white">{screenShotData.RewatchedNo}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-white">
                                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> Dropped
                                                </div>
                                                <span className="font-bold text-white">{screenShotData.DroppedNo}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-white">
                                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> Future
                                                </div>
                                                <span className="font-bold text-white">{screenShotData.FutureNo}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-white">
                                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> Planned
                                                </div>
                                                <span className="font-bold text-white">{screenShotData.Planned}</span>
                                            </div>


                                        </div>
                                    </>
                                ) : ""
                            }


                        </div>
                        <div className="flex justify-between mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
                            <button className={`p-2 ${SelectedTab == "all" ? "bg-gray-100" : "hover:bg-gray-100"} dark:hover:bg-gray-700 rounded-lg transition`}
                                onClick={() => {
                                    setisScreenshotDataOpen(false)
                                    setSelectedTab("all")
                                }}
                            ><span className="material-symbols-outlined text-accent-blue">play_arrow</span></button>
                            <button className={`p-2 ${SelectedTab == "favorite" ? "bg-gray-100" : "hover:bg-gray-100"} dark:hover:bg-gray-700 rounded-lg transition`}
                                onClick={() => {
                                    setisScreenshotDataOpen(false)
                                    setSelectedTab("favorite")
                                }}
                            ><span className="material-symbols-outlined text-gray-400" >book</span></button>
                            <button className={`p-2 ${SelectedTab == "screenshot" ? "bg-gray-100" : "hover:bg-gray-100"} dark:hover:bg-gray-700 rounded-lg transition`}
                                onClick={() => {
                                    setSelectedTab("screenshot")
                                    setisScreenshotDataOpen(!isScreenshotDataOpen)
                                }}
                            ><span className="material-symbols-outlined text-gray-400">photo_camera</span></button>
                        </div>
                    </div>
                    {/* anime status */}
                    <div className="bg-[#0F172A] rounded-2xl p-5 border shadow-sm relative overflow-hidden h-40 flex items-center gap-4">
                        <div className="relative w-24 h-24 shrink-0">
                            <div className="w-full h-full rounded-full" style={{
                                background: `conic-gradient(
                #06b6d4 0% ${stop1}%, 
                #f0b100 ${stop1}% ${stop2}%, 
                #334155 ${stop2}% 100%
            )`
                            }}></div>
                            <div className="absolute inset-2 bg-card-light dark:bg-card-dark rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-accent-green">{stop2}%</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-2 text-xs">
                            <div className="font-medium text-textcolor uppercase tracking-wide">Anime Status</div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                <span className="text-white ">Watching: {animeData.WatchingNo}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span className="text-white">Planned: {animeData.Planned}</span>
                            </div>
                        </div>
                    </div>
                    {/* animebreakdown */}
                    <div className="bg-[#0F172A] rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm h-40 flex flex-col justify-center lg:col-start-2 md:row-start-2">
                        <div className="font-medium text-textcolor uppercase tracking-wide text-xs mb-3">Anime Breakdown</div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> Completed
                                </div>
                                <span className="font-bold text-white">{animeData.CompletedNo}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> On Hold
                                </div>
                                <span className="font-bold ">{animeData.Onhold}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> ReWatched
                                </div>
                                <span className="font-bold text-white">{animeData.RewatchedNo}</span>
                            </div>
                        </div>
                    </div>
                    {/* manga status */}
                    <div className="bg-[#0F172A] rounded-2xl p-5 border shadow-sm relative overflow-hidden h-40 flex items-center gap-4 lg:col-start-3 lg:row-start-1 md:row-start-3">
                        <div className="relative w-24 h-24 shrink-0">
                            <div className="w-full h-full rounded-full" style={{
                                background: `conic-gradient(
                #06b6d4 0% ${mangastop1}%, 
                #f0b100 ${mangastop1}% ${mangastop2}%, 
                #334155 ${mangastop2}% 100%
            )`
                            }}></div>
                            <div className="absolute inset-2 bg-card-light dark:bg-card-dark rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-accent-green">{mangastop2}%</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-2 text-xs">
                            <div className="font-medium text-textcolor uppercase tracking-wide">Manga Status</div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                <span className="text-white ">Watching: {mangaData.WatchingNo}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span className="text-white">Planned: {mangaData.Planned}</span>
                            </div>
                        </div>
                    </div>
                    {/* manga breakdown */}
                    <div className="bg-[#0F172A] rounded-2xl p-5 border border-gray-200 dark:border-gray-700 sm:row-start-2 md:row-start-4 shadow-sm h-40 flex flex-col justify-center lg:col-start-3 lg:row-start-2">
                        <div className="font-medium text-textcolor uppercase tracking-wide text-xs mb-3">Manga Breakdown</div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> Completed
                                </div>
                                <span className="font-bold text-white">{mangaData.CompletedNo}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> On Hold
                                </div>
                                <span className="font-bold ">{mangaData.Onhold}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span> ReWatched
                                </div>
                                <span className="font-bold text-white">{mangaData.RewatchedNo}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0F172A] rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm md:row-span-2 lg:col-start-4 lg:row-start-1 h-[340px] flex flex-col ">
                        <h3 className="text-md font-semibold text-textcolor ">Activity Feed</h3>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mt-3 scrollbar-hide">
                            {
                                activityFeedData?.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3"
                                        onClick={() => {
                                            if (activity.type == "anime" || activity.type == "manga") {
                                                router.push(`/user/${userName}/items?id=${activity.id}&type=${activity.type}`)
                                            }
                                        }}
                                    >
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-accent-purple shrink-0"></div>
                                        <div>
                                            <p className="text-sm text-gray-300"><span className="text-accent-blue font-medium">{getActionVerb(activity.status, activity.type)}:</span> {activity.title}</p>
                                            <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(activity.updatedAt), { addSuffix: true })}</span>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                activityFeedData.length === 0 && (<p className="text-center text-gray-500 mt-10">No recent activity.</p>
                                )
                            }


                        </div>
                    </div>



                </div>
            </section>
        </>
    )
}

export default UserStats
