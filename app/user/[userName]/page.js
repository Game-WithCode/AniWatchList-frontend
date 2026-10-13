import React from 'react'
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

import ContinueItem from './Components/ContinueItem';


import { getWatchlistData } from "@/lib/action/getWatchlist";

import UserStats from './Components/userStats';
import Sample from '@/app/components/topSample';
import { GetTrending } from "@/lib/action/GetTrending";
const dashboard = async () => {
  const session = await getServerSession(authOptions);


  const watchlist = await getWatchlistData(session.user.email);
  const sortedAnimeWatchlist = watchlist?.anime?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const sortedMangaWatchlist = watchlist?.manga?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const sortedScreenshotWatchlist = watchlist?.screenshots?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

 
  const ItemDataList = {
    ContinueWatching: [],
    ContinueReading: [],
    ContinueScreenshots: []
  }
  sortedAnimeWatchlist?.forEach((item) => {
    if (item.UserStatus !== "Continue") {
      return
    }

    ItemDataList.ContinueWatching.push({
      mal_id: item.mal_id,
      currentEpisode: item.episodesProgress.length,
      title: item.title,
      totalEpisode: item.totalEpisodes,
      Image: item.image,
    })
  })
  sortedMangaWatchlist?.forEach((item) => {
    if (item.UserStatus !== "Continue") {
      return
    }

    ItemDataList.ContinueReading?.push({
      mal_id: item.mal_id,
      currentEpisode: item.chaptersProgress.length,
      title: item.title,
      totalEpisode: item.totalChapters,
      Image: item.image,
    })
  })
  sortedScreenshotWatchlist?.forEach((item) => {
    if (item.UserStatus.toLowerCase() !== "continue") {
      return
    }


    ItemDataList.ContinueScreenshots.push({
      currentEpisode: item.currentEP,
      title: item.title,
      totalEpisode: item.totalEP,
      Image: item.imageUrl,
    })
  })
const data = await GetTrending({ Type: "ANIME" });
const data2 = await GetTrending({ Type: "MANGA" });
  let fetchTopAnime;
  let fetchTopManga;
  fetchTopAnime = data?.data?.Page?.media || [];
  fetchTopManga = data2?.data?.Page?.media || [];

  return (
    <>
      <div className='relative'>


        {/* create coursel for top anime manga movie */}
        <div className=' w-full  overflow-hidden mt-10'>
          <Sample slider={fetchTopAnime} itemType={"anime"} />
          <Sample slider={fetchTopManga} itemType={"manga"} />
        </div>
        {/* container */}
        {/* section 2 */}
        <div className="section2 min-h-screen">

          <div className='w-full m-auto mt-20 mb-10'>
            <h1 className='text-3xl font-bold text-center'>Welcome Back, {session.user.name}  </h1>
            <p className='text-center text-gray-600 mt-4'>{"Here's a quick overview of your activity and stats."}</p>
            <UserStats />
          </div>
          {/* continue Anime  */}

          <ContinueItem itemData={ItemDataList.ContinueWatching} itemType="anime" />
          <div className="h-px w-full my-12 bg-linear-to-r from-transparent via-[#239BA7] to-transparent"></div>
          {/* continue MangaL */}

          <ContinueItem itemData={ItemDataList.ContinueReading} itemType="manga" />
          <div className="h-px w-full my-12 bg-linear-to-r from-transparent via-[#239BA7] to-transparent"></div>
          {/* top anime */}
          <ContinueItem itemData={ItemDataList.ContinueScreenshots} itemType="view" />
          {/* section 2 */}
        </div>



        {/* container */}
      </div>
    </>
  )
}

export default dashboard
