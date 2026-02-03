"use client"

import React from 'react'
import Image from 'next/image'
import Router from 'next/router'
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useSearchParams, usePathname, useParams } from 'next/navigation'
import { useState, useEffect } from 'react';
import { constructNow } from 'date-fns';
import { authOptions } from '../api/auth/[...nextauth]/route';

const Navbar = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams();
  const userName = params.userName;
  const baseUserPath = pathname.split("/").slice(0, 3).join("/");
  //this is start of responsible variable
  const [OpenMenu, setOpenMenu] = useState(false)
  const [MenuBrowser, setMenuBrowser] = useState(false)
  const [OpenSeachBar, setOpenSeachBar] = useState(false)
  const [MobileSearch, setMobileSearch] = useState();
  //end of responsive variable
  const { data: session, status } = useSession();


  const router = useRouter()
  let signOutHandle = async () => {
    await signOut({ redirect: false });

    router.push('/')
  }
  let handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const query = event.target.value;
      if (status === "authenticated") {

        router.push(`/user/${userName}/search?q=${query}&type=anime`);
      } else {

        router.push(`/Search?q=${query}&type=anime`);
      }
    }
  }
  let closeMenu = () => {
    setOpenMenu(false);
  }
 
  return (
    <>
      {status === "authenticated" ? (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 '>
          <div className='flex items-center justify-between h-16'>


            <div className='flex items-center justify-center gap-2'>
              {/* this will for phone hamburger*/}
              <div className='lg:hidden flex' onClick={() => setOpenMenu(!OpenMenu)}>
                <span className="material-symbols-outlined">
                  {OpenMenu ? "close" : "menu"}
                </span>
              </div>
              <span className='text-2xl font-bold text-bgsecondary'>AniWatchList</span>
            </div>


            {/* this will for the Destop */}
            <div className='hidden lg:flex'>
              <nav className="flex items-center gap-6 text-sm font-medium">
                <div className="text-textcolor hover:text-bgsecondary transition-colors cursor-pointer" onClick={() => router.push(`/user/${userName}`)} >Home</div>
                <div className="text-textcolor hover:text-bgsecondary transition-colors cursor-pointer" onClick={() => router.push(`/user/${userName}/added?type=manga`)}>Manga</div>
                <div className="text-textcolor hover:text-bgsecondary transition-colors cursor-pointer" onClick={() => router.push(`/user/${userName}/added?type=anime`)}>Anime</div>
                <div className="text-textcolor hover:text-bgsecondary transition-colors cursor-pointer" onClick={() => router.push(`/user/${userName}/view`)}>Screenshot</div>
                <div className='relative group inline-block'>
                  <div className=" text-textcolor hover:text-bgsecondary transition-colors cursor-pointer">Browse
                  </div>
                  <div className="absolute left-0 hidden group-hover:flex flex-col z-50 pt-2 w-max min-w-[120px]">

                    {/* Actual Menu Box (Separated so we can use padding above for the hover bridge) */}
                    <div className="bg-[#1e293b] rounded-lg px-4 py-3 shadow-xl border border-slate-700">
                      <ul className="flex flex-col gap-3 text-sm text-slate-300">
                        <li className="hover:text-white cursor-pointer transition-colors" onClick={() => router.push(`/user/${userName}/browse?type=anime`)}>Anime</li>
                        <li className="hover:text-white cursor-pointer transition-colors" onClick={() => router.push(`/user/${userName}/browse?type=manga`)}>Manga</li>
                      </ul>
                    </div>

                  </div>
                </div>

              </nav>
            </div>
            {/* this will for the Destop */}
            <div className="hidden md:flex items-center space-x-3 ">
              <div className="relative hidden sm:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-textcolor text-xl">search</span>
                <input className="w-48 pl-10 pr-4 py-2 text-sm rounded-lg border-border-color bg-gray-100 dark:bg-background-tertiary/50 focus:ring-3 focus:ring-bgsecondary focus:border-bgsecondary outline-none transition text-[#646965]" placeholder="Search..." type="text"
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button className="p-2 rounded-full hover:bg-textcolor/30 transition-colors">
                <span className="material-symbols-outlined text-xl text-textcolor" onClick={() => router.push(`/user/${userName}/screenshot`)}>upload_file</span>
              </button>
              <button className="p-2 rounded-full hover:bg-textcolor/30  transition-colors">
                <span className="material-symbols-outlined text-xl text-textcolor" onClick={() => router.push(`/user/${userName}/view`)}>photo_library</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-textcolor bg-transparent border border-textcolor rounded-lg shadow-sm hover:bg-textcolor/30 hover:border-textcolor/30  hover:text-bgsecondary transition-all" onClick={() => signOutHandle()}>
                Sign Out
                <span className="material-symbols-outlined text-lg ml-2" >logout</span>
              </button>
            </div>


            {/* this is for search and image upload for phone */}
            <div>
              <button className="md:hidden p-2 text-textcolor dark:text-gray-400  transition-colors" onClick={() => setOpenSeachBar(!OpenSeachBar)}>
                <span className="material-symbols-outlined">search</span>
              </button>
              <button className="md:hidden p-2 text-textcolor dark:text-gray-400 transition-colors relative group" title="Upload">
                <span className="material-symbols-outlined" onClick={() => router.push(`/user/${userName}/screenshot`)}>upload_file</span>
              </button>
            </div>

            {/* on clicking hamburger this menu bar will open */}
            <div className={`${OpenMenu ? 'block' : 'hidden'} bg-bgprimary border-b border-gray-200 dark:border-gray-800 shadow-lg absolute w-full left-0 top-16 z-10 transition-all `} id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <div className="flex items-center gap-3 text-textcolor  hover:bg-gray-50 dark:hover:bg-surface-dark px-3 py-3 rounded-md text-base font-medium transition-colors" onClick={() => { router.push(`/user/${userName}`); closeMenu(); }}>
                  <span className="material-symbols-outlined">home</span>
                  Home
                </div>
                <div className="flex items-center gap-3 text-textcolor hover:bg-gray-50 dark:hover:bg-surface-dark px-3 py-3 rounded-md text-base font-medium transition-colors" onClick={() => { router.push(`/user/${userName}/added?type=manga`); closeMenu(); }}>
                  <span className="material-symbols-outlined">menu_book</span>
                  Manga
                </div>
                <div className="flex items-center gap-3 text-textcolor hover:bg-gray-50 dark:hover:bg-surface-dark px-3 py-3 rounded-md text-base font-medium transition-colors" onClick={() => { router.push(`/user/${userName}/added?type=anime`); closeMenu(); }}>
                  <span className="material-symbols-outlined">movie</span>
                  Anime
                </div>
                <div className="flex items-center gap-3 text-textcolor hover:bg-gray-50 dark:hover:bg-surface-dark px-3 py-3 rounded-md text-base font-medium transition-colors" onClick={() => { router.push(`/user/${userName}/view`); closeMenu(); }}>
                  <span className="material-symbols-outlined">image</span>
                  Screenshot
                </div>
                <div className="flex items-center gap-3 text-textcolor hover:bg-gray-50 dark:hover:bg-surface-dark px-3 py-3 rounded-md text-base font-medium transition-colors" onClick={() => setMenuBrowser(!MenuBrowser)}>
                  <span className="material-symbols-outlined">grid_view</span>
                  Browse
                </div>
                <div className={`${MenuBrowser ? 'flex' : 'hidden'} flex-col gap-3 text-textcolor dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-dark px-12 py-3 rounded-md text-base font-medium transition-colors`} >
                  <span className="py-2" onClick={() => { router.push(`/user/${userName}/browse?type=anime`); closeMenu(); }}>Anime</span>
                  <span className="py-2" onClick={() => { router.push(`/user/${userName}/browse?type=manga`); closeMenu(); }}>Manga</span>

                </div>
              </div>
              <div className="pt-2 pb-2 border-t border-gray-200 dark:border-gray-800">
                <div className="px-2 space-y-2">
                  <div className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-teal-600 transition-colors shadow-md" onClick={() => signOutHandle()}>
                    Sign Out
                    <span className="material-symbols-outlined">logout</span>
                  </div>
                </div>
              </div>
            </div>


          </div>
          {/* this is searchbar for the mobile screen */}
          <div className={`${OpenSeachBar ? 'flex' : 'hidden'} w-full px-4 pb-4 items-center justify-center`}>
            {/* Search Container */}
            <div className="flex w-full max-w-md items-center rounded-full border border-gray-300 bg-gray-100 px-2 shadow-sm transition-all focus-within:border-bgsecondary focus-within:ring-1 focus-within:ring-bgsecondary dark:border-gray-700 dark:bg-gray-800">

              {/* Input */}
              <input
                type="text"
                placeholder="Search anime/manga..."
                className="w-full bg-transparent px-3 py-2 text-sm text-gray-700 placeholder-gray-500 outline-none dark:text-gray-200 dark:placeholder-gray-400"
                value={MobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              {/* Search Button */}
              <button className="flex items-center justify-center rounded-full p-2 text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                onClick={() => {
                  if (MobileSearch !== "" || MobileSearch.length > 0) {
                    router.push(`/user/${userName}/search?q=${MobileSearch}&type=anime`);
                  }
                }}
              >
                <span className="material-symbols-outlined text-[22px]">
                  search
                </span>
              </button>

            </div>
          </div>
        </div>
      ) : (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 '>
          <div className='flex items-center justify-between h-16'>


            <div className='flex items-center justify-center gap-2'>
              {/* this will for phone hamburger*/}
              <div className='lg:hidden flex' onClick={() => setOpenMenu(!OpenMenu)}>
                <span className="material-symbols-outlined">
                  {OpenMenu ? "close" : "menu"}
                </span>
              </div>
              <span className='text-2xl font-bold text-bgsecondary'>AniWatchList</span>
            </div>


            {/* this will for the Destop */}
            <div className='hidden lg:flex'>
              <nav className="flex items-center gap-6 text-sm font-medium">
                <div className="text-textcolor hover:text-bgsecondary transition-colors cursor-pointer" onClick={() => router.push(`/`)}>Home</div>
                <div className="text-textcolor hover:text-bgsecondary transition-colors cursor-pointer" onClick={() => router.push(`/firstSignUp`)}>Manga</div>
                <div className="text-textcolor hover:text-bgsecondary transition-colors cursor-pointer" onClick={() => router.push(`/firstSignUp`)}>Anime</div>
                <div className="text-textcolor hover:text-bgsecondary transition-colors cursor-pointer" onClick={() => router.push(`/firstSignUp`)}>Screenshot</div>
                <div className='relative group inline-block'>
                  <div className=" text-textcolor hover:text-bgsecondary transition-colors">Browse
                  </div>
                  <div className="absolute left-0 hidden group-hover:flex flex-col z-50 pt-2 w-max min-w-[120px]">

                    {/* Actual Menu Box (Separated so we can use padding above for the hover bridge) */}
                    <div className="bg-[#1e293b] rounded-lg px-4 py-3 shadow-xl border border-slate-700">
                      <ul className="flex flex-col gap-3 text-sm text-slate-300">
                        <li className="hover:text-white cursor-pointer transition-colors" onClick={() => router.push(`/brwsr?type=anime`)}>Anime</li>
                        <li className="hover:text-white cursor-pointer transition-colors" onClick={() => router.push(`/brwsr?type=manga`)}>Manga</li>
                      </ul>
                    </div>

                  </div>
                </div>

              </nav>
            </div>
            {/* this will for the Destop */}
            <div className="hidden md:flex items-center space-x-3 ">
              <div className="relative hidden sm:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-textcolor text-xl">search</span>
                <input className="w-48 pl-10 pr-4 py-2 text-sm rounded-lg border-border-color bg-gray-100 dark:bg-background-tertiary/50 focus:ring-3 focus:ring-bgsecondary focus:border-bgsecondary outline-none transition text-[#646965]" placeholder="Search..." type="text"
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button className="p-2 rounded-full hover:bg-textcolor/30 transition-colors">
                <span className="material-symbols-outlined text-xl text-textcolor" onClick={() => router.push(`/firstSignUp`)}>upload_file</span>
              </button>
              <button className="p-2 rounded-full hover:bg-textcolor/30  transition-colors">
                <span className="material-symbols-outlined text-xl text-textcolor" onClick={() => router.push(`/firstSignUp`)}>photo_library</span>
              </button>

              <button className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-textcolor bg-transparent border border-textcolor rounded-lg shadow-sm hover:bg-textcolor/30 hover:border-textcolor/30  hover:text-bgsecondary transition-all" onClick={() => router.push(`/login`)}>
                <span>Log In</span>
                <span className="material-symbols-outlined text-lg">
                  login
                </span>
              </button>
            </div>


            {/* this is for search and image upload for phone */}
            <div>
              <button className="md:hidden p-2 text-textcolor dark:text-gray-400  transition-colors" onClick={() => setOpenSeachBar(!OpenSeachBar)}>
                <span className="material-symbols-outlined">search</span>
              </button>

            </div>

            {/* on clicking hamburger this menu bar will open */}
            <div className={`${OpenMenu ? 'block' : 'hidden'} bg-bgprimary border-b border-gray-200 dark:border-gray-800 shadow-lg absolute w-full left-0 top-16 z-100`} id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <div className="flex items-center gap-3 text-textcolor  hover:bg-gray-50 dark:hover:bg-surface-dark px-3 py-3 rounded-md text-base font-medium transition-colors" onClick={() => {router.push(`/`); closeMenu(); }}>
                  <span className="material-symbols-outlined">home</span>
                  Home
                </div>
                <div className="flex items-center gap-3 text-textcolor hover:bg-gray-50 dark:hover:bg-surface-dark px-3 py-3 rounded-md text-base font-medium transition-colors" onClick={() => {router.push(`/firstSignUp`); closeMenu(); }}>
                  <span className="material-symbols-outlined">menu_book</span>
                  Manga
                </div>
                <div className="flex items-center gap-3 text-textcolor hover:bg-gray-50 dark:hover:bg-surface-dark px-3 py-3 rounded-md text-base font-medium transition-colors" onClick={() => {router.push(`/firstSignUp`); closeMenu(); }}>
                  <span className="material-symbols-outlined">movie</span>
                  Anime
                </div>
                <div className="flex items-center gap-3 text-textcolor hover:bg-gray-50 dark:hover:bg-surface-dark px-3 py-3 rounded-md text-base font-medium transition-colors" onClick={() => {router.push(`/firstSignUp`); closeMenu(); }}>
                  <span className="material-symbols-outlined">image</span>
                  Screenshot
                </div>
                <div className="flex items-center gap-3 text-textcolor hover:bg-gray-50 dark:hover:bg-surface-dark px-3 py-3 rounded-md text-base font-medium transition-colors" onClick={() => setMenuBrowser(!MenuBrowser)}>
                  <span className="material-symbols-outlined">grid_view</span>
                  Browse
                </div>
                <div className={`${MenuBrowser ? 'flex' : 'hidden'} flex-col gap-3 text-textcolor dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-dark px-12 py-3 rounded-md text-base font-medium transition-colors`} >
                  <span className="py-2" onClick={() => {router.push(`/brwsr?type=anime`); closeMenu();}}>Anime</span>
                  <span className="py-2" onClick={() => {router.push(`/brwsr?type=manga`); closeMenu();}}>Manga</span>

                </div>
              </div>
              <div className="pt-2 pb-2 border-t border-gray-200 dark:border-gray-800">
                <div className="px-2 space-y-2">
                  <div className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-teal-600 transition-colors shadow-md" onClick={() => {router.push(`/login`); closeMenu();}}>
                    Log In
                    <span className="material-symbols-outlined">login</span>
                  </div>
                </div>
              </div>
            </div>


          </div>
          {/* this is searchbar for the mobile screen */}
          <div className={`${OpenSeachBar ? 'flex' : 'hidden'} w-full px-4 pb-4 items-center justify-center`}>
            {/* Search Container */}
            <div className="flex w-full max-w-md items-center rounded-full border border-gray-300 bg-gray-100 px-2 shadow-sm transition-all focus-within:border-bgsecondary focus-within:ring-1 focus-within:ring-bgsecondary dark:border-gray-700 dark:bg-gray-800">

              {/* Input */}
              <input
                type="text"
                placeholder="Search anime/manga..."
                className="w-full bg-transparent px-3 py-2 text-sm text-gray-700 placeholder-gray-500 outline-none dark:text-gray-200 dark:placeholder-gray-400"
                value={MobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              {/* Search Button */}
              <button className="flex items-center justify-center rounded-full p-2 text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                onClick={() => {
                  if (MobileSearch !== "" || MobileSearch.length > 0) {
                    router.push(`/Search?q=${MobileSearch}&type=anime`);
                  }
                }}
              >
                <span className="material-symbols-outlined text-[22px]">
                  search
                </span>
              </button>

            </div>
          </div>
        </div>
      )}
      {/* ) : (



        <div className='bg-[#239BA7] text-white flex justify-between items-center p-4'>
          <div>
            <h1 className='bg-[#FFFFCF text-3xl font-bold'>AniWatchList</h1>
          </div>
          <div className='flex justify-between items-center gap-8'>
            <ul className='flex gap-8'>
              <Link href="/">Home</Link>
              <Link href='/manga'>Manga</Link>
              <Link href='/anime'>Anime</Link>
              <li >Movie</li>

            </ul>
            <div className='bg-white text-black flex gap-4  rounded-lg'>
              <button onClick={() => router.push("/login")} className='p-2'>login</button>

              <button onClick={() => router.push("/signup")} className='bg-[#E1AA36] rounded-lg p-2 text-white'>Sign In</button>

            </div>
          </div>
        </div>)} */}
    </>
  )
}

export default Navbar
