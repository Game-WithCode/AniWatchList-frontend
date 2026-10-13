"use client"
import React from 'react'
import { useSearchParams, usePathname, useRouter, useParams } from 'next/navigation'

import { searchAnilistMedia } from '@/lib/action/searchAnilistMedia'
import { yearList } from './components/yearList'
import { useEffect, useState } from 'react'
import { allGenres } from '@/lib/hooks/Allgenre';
import PaginationButtons from './components/PaginationButton.js';
import Link from 'next/link'
const BrowsePage = ({ }) => {
  const searchParams = useSearchParams()
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const userName = params.userName;
  const search = searchParams.get('type').toString() || "";
  const query = searchParams.get('q') || "";
  const [allGenreOption, setallGenreOption] = useState([])
  const [itemList, setitemList] = useState([])
  const [SelectedGenre, setSelectedGenre] = useState([])
  const [SelectionType, setSelectionType] = useState([])
  const [isOpen, setisOpen] = useState(false)
  const [airingStatusObj, setairingStatusObj] = useState([
    { label: "Currently Airing", value: "RELEASING" },
    { label: "Finished Airing", value: "FINISHED" },
    { label: "Not Yet Aired", value: "NOT_YET_RELEASED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Hiatus", value: "HIATUS" },
  ])
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  //this variable to show that anime or manga is loading 
  const [isLoading, setIsLoading] = useState(false);

  const animeTypes = [
    { label: "TV", value: "TV" },
    { label: "TV Short", value: "TV_SHORT" },
    { label: "OVA", value: "OVA" },
    { label: "ONA", value: "ONA" },
    { label: "Special", value: "SPECIAL" },
    { label: "Music", value: "MUSIC" },
    { label: "Movie", value: "MOVIE" },
  ];
  const mangaTypes = [
    { label: "Manga", value: "MANGA" },
    { label: "Novel", value: "NOVEL" },
    { label: "One shot", value: "ONE_SHOT" }
  ];
  const orderListOptions = [
    { label: "Popularity", value: "POPULARITY_DESC" },
    { label: "Rank", value: "SCORE_DESC" },
    { label: "Title", value: "TITLE_ENGLISH_DESC" },
    { label: "Release Date", value: "START_DATE_DESC" },
    { label: "End Date", value: "END_DATE_DESC" },
    { label: "Score", value: "score" },
    ...(search === "anime" ? [{ label: "Episode", value: "EPISODES_DESC" }] : []),

    // You can also add a Manga check for "Chapters"
    ...(search === "manga" ? [{ label: "Chapters", value: "CHAPTERS_DESC" }] : []),
  ];
  // useEffect(() => {
  //   if (!search) return

  //   const fetchData = async () => {
  //     try {
  //       const item = await Browse(search);
  //       setitemList(item)

  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }

  //   fetchData()
  // }, [search])
  const [filters, setFilters] = useState({
    Year: "all",
    Genre: ["all"],
    format: "all",
    minScore: 0,
    maxScore: 0,
    AiringStatus: "all",
    orderBy: "all"
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const queryParams = {
          search: searchParams.get('q'),
          page: searchParams.get('page'),
          type: searchParams.get('type'),
          averageScoreLesser: searchParams.get('maxScore'),
          averageScoreGreater: searchParams.get('minScore'),
          status: searchParams.get('status'),
          genre: searchParams.get('genres'),
          sort: searchParams.get('orderBy'),
          startDate: searchParams.get('startYear'),
          format: searchParams.get('format')
        };
        const item = await searchAnilistMedia({ ...queryParams });
        setitemList(item)
        setIsLoading(false);
        setIsMobileFilterOpen(false); // Close mobile filter on filter change
        //set the filter according to url
        const params = new URLSearchParams(searchParams.toString());
        //First for year
        if (params.get("startYear") !== null) {
          setFilters((prev) => ({
            ...prev,
            Year: params.get('startYear')
          }))

        } else {
          setFilters((prev) => ({
            ...prev,
            Year: "all"
          }))
        }
        //First for type (maovie,ova)
        if (params.get("format") !== null) {
          setFilters((prev) => ({
            ...prev,
            format: params.get('format')
          }))
        } else {
          setFilters((prev) => ({
            ...prev,
            format: "all"
          }))
        }
        //First for type (maovie,ova)
        if (params.get("minScore") !== null) {
          setFilters((prev) => ({
            ...prev,
            minScore: parseInt(params.get('minScore'))
          }))
        } else {
          setFilters((prev) => ({
            ...prev,
            minScore: 0
          }))
        }
        //for max
        if (params.get("maxScore") !== null) {
          setFilters((prev) => ({
            ...prev,
            maxScore: parseInt(params.get('maxScore'))
          }))
        } else {
          setFilters((prev) => ({
            ...prev,
            maxScore: 0
          }))
        }
        //airing Status
        if (params.get("status") !== null) {
          setFilters((prev) => ({
            ...prev,
            AiringStatus: params.get('status')
          }))
        } else {
          setFilters((prev) => ({
            ...prev,
            AiringStatus: "all"
          }))
        }

        if (params.get("orderBy") !== null) {
          setFilters((prev) => ({
            ...prev,
            orderBy: params.get('orderBy')
          }))
        } else {
          setFilters((prev) => ({
            ...prev,
            orderBy: "all"
          }))
        }
        if (params.get("genres") !== null) {
          // 1. Get the string (e.g., "action,comedy,drama") from the URL parameter
          const genreString = params.get('genres');

          // 2. Split it and Map it
          // Check if genreString exists first to avoid errors if the URL param is missing
          const currentGenre = genreString
            ? genreString.split(',')?.map(i => i)
            : [];
          // const currentGenre = arrGenreId?.map((i) => {
          //   return allGenreOption?.data?.GenreCollection?.find((item) => item === i);
          // })
          //   .filter((item) => item !== undefined);


          // 4. Update State
          setSelectedGenre(currentGenre)
        } else {
          setFilters((prev) => ({
            ...prev,
            Genre: ["all"]
          }))
          setSelectedGenre([])

        }

      } catch (err) {
        console.error(err)
      }
    }

    fetchData()


  }, [searchParams.toString()])
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let fetchData = async () => {
      //for yearList

      if (filters.Year == null || filters.Year == "all") {
        params.delete('startYear');
      } else {
        params.set('startYear', filters.Year);
      }
      //this will for genres 
      if (filters.Genre.length < 1 || filters.Genre[0] == null) {
        params.delete('genres');
      } else {
        // 2. Extract genre from the array of objects
        const genres = filters.Genre?.map((g) => g).join(",");

        // 3. Set the correct parameter name ('genres', not 'startYear')
        params.set('genres', genres);
      }
      //for type
      if (filters.format == "all" || filters.format == null) {
        params.delete('format');
      } else {
        // 2. Extract only the IDs from the array of objects


        // 3. Set the correct parameter name ('genres', not 'startYear')
        params.set('format', filters.format);
      }
      //airing status update
      if (filters.AiringStatus == "all" || filters.AiringStatus == null) {
        params.delete('status');
      } else {
        // 2. Extract only the IDs from the array of objects


        // 3. Set the correct parameter name ('genres', not 'startYear')
        params.set('status', filters.AiringStatus);
      }

      //for score
      if (filters.maxScore == 0 || filters.maxScore == null) {
        params.delete('maxScore');
        params.delete('minScore');
      } else {
        params.set('maxScore', filters.maxScore);
        params.set('minScore', filters.minScore);
      }
      //for Status
      if (filters.orderBy == "all" || filters.orderBy == null) {
        params.delete('orderBy');
      } else {
        params.set('orderBy', filters.orderBy);

      }



      router.push(`${pathname}?${params.toString()}`);

    }

    fetchData()
  }, [filters]);
  useEffect(() => {
    const fetch = async () => {
      const allGenresData = await allGenres(search);

      setallGenreOption(allGenresData);
      if (search == 'anime') {
        setSelectionType(animeTypes)

      } else {
        setSelectionType(mangaTypes)


      }
      if (search === "anime") {
        orderListOptions.push({
          label: "Episode",
          value: "episodes"
        })

      }

    }
    fetch()

  }, [])
  useEffect(() => {

    setFilters((prev) => ({
      ...prev, Genre: SelectedGenre
    }))

  }, [SelectedGenre])

  useEffect(() => {
    const fetchFilterData = async () => {
      // Re-fetch genres based on the new type
      const allGenresData = await allGenres();
      setallGenreOption(allGenresData);

      // Re-assign the dropdown arrays dynamically
      if (search === 'anime') {
        setSelectionType(animeTypes);
      } else {
        setSelectionType(mangaTypes);
      }
    };

    fetchFilterData();

    // The critical fix: React will now execute this effect whenever the URL 'type' changes.
  }, [search]);
  let filterReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    const newParams = new URLSearchParams()
    const currentType = params.get('type');
    if (currentType) {
      newParams.set('type', currentType)
    }
    setFilters({
      Year: "all",
      Genre: ["all"],
      format: "all",
      minScore: 0,
      maxScore: 0,
      AiringStatus: "all",
      orderBy: "all"
    })
    setSelectedGenre([])

    router.push(`${pathname}?${newParams.toString()}`);
  }
  // console.log("allGenreOption", allGenreOption)
  // console.log("itemList", itemList)
  let SearchTypeChanger = (newType) => {
    const params = new URLSearchParams();
    const currentQuery = searchParams.get('q');

    if (currentQuery) {
      params.set('q', currentQuery);
    }

    params.set('type', newType);
    setisOpen(false);

    // Pushing a fresh URL with no filter parameters will automatically 
    // trigger your existing useEffect([searchParams]) to reset the filter state.
    router.push(`${pathname}?${params.toString()}`);
  }
  console.log("itemList?.data?.Page?.pageInfo?.total", itemList)
  return (
    <>
      <div className='container mx-auto flex flex-col justify-center items-center gap-2'>
        <h1 className='font-bold text-2xl'>You searched: <span className='text-bgsecondary text-3xl'>{query}</span></h1>

        <div className='relative group inline-block'>
          <div className="flex gap-2 justify-center items-center text-textcolor hover:text-bgsecondary transition-colors border rounded-lg px-4 py-1 font-bold text-xl" onClick={() => setisOpen(!isOpen)}>{search === "anime" ? "Anime" : "Manga"}
            <span className="material-symbols-outlined">
              {isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            </span>
          </div>
          {
            isOpen && (
              <div className="absolute left-0 flex-col z-50 pt-2 w-max min-w-30">

                {/* Actual Menu Box (Separated so we can use padding above for the hover bridge) */}
                <div className="bg-[#1e293b] rounded-lg px-4 py-3 shadow-xl border border-slate-700">
                  <ul className="flex flex-col gap-3 text-sm text-slate-300">
                    <li
                      className="hover:text-white cursor-pointer transition-colors"
                      onClick={() => SearchTypeChanger("anime")}
                    >
                      Anime
                    </li>
                    <li
                      className="hover:text-white cursor-pointer transition-colors"
                      onClick={() => SearchTypeChanger("manga")}
                    >
                      Manga
                    </li>
                  </ul>
                </div>

              </div>
            )
          }


        </div>

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
      {isLoading && (
        <div className="container mx-auto flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bgsecondary"></div>
        </div>
      )}
      <div className='container w-full flex  mx-auto mt-10 gap-10 justify-center'>
        <div className='flex flex-col max-w-2/3'>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 ">
            {/* card 1 */}

            {itemList?.data?.Page?.media?.map((item, index) => {
              const type = item.type.toLowerCase();
              if (isLoading) {
                return null; // Skip rendering items while loading
              }

              return (
                <div key={`${item.id}-${index

                  }`} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-bgsecondary/10 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 h-fit">
                  <figure className='aspect-2/3 overflow-hidden relative'>
                    <img
                      src={item.coverImage?.extraLarge || item.coverImage?.large || "/default-cover.jpg"}
                      alt="Anime"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
                      <span className="bg-bgsecondary text-white text-xs font-bold px-2 py-1 rounded">
                        {item.type}
                      </span>
                    </div>
                  </figure>
                  <div className="card-body flex flex-col gap-2 p-2">
                    <h2 className="font-bold text-lg text-white dark:text-white mb-1 line-clamp-1 group-hover:text-bgsecondary transition-colors">{item.title?.english || item.title?.romaji || "Unknown Title"}</h2>
                    <p className="text-gray-400 h-16 overflow-hidden ">
                      {item.description ?? "No synopsis available."}
                    </p>
                    <div className="card-actions flex justify-center mt-2 w-full">
                      <button className="w-full py-2.5 rounded-lg bg-bgsecondary/20 dark:bg-bgsecondary/20 text-bgsecondary dark:text-bgsecondary/50 font-semibold text-sm hover:bg-bgsecondary hover:text-white dark:hover:bg-bgsecondary dark:hover:text-white transition-all" onClick={() => router.push(`/user/${userName}/items?id=${item.id}&type=${type}`)}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
          <div className="mt-10 mb-5 flex justify-center">
            <PaginationButtons
              // Add ?. before accessing current_page
              currentPage={itemList?.data?.Page?.pageInfo?.currentPage || 1}

              // You already had it here, but ensure itemList is checked too
              totalPages={itemList?.data?.Page?.pageInfo?.total || 1}
              hasNextPage={itemList?.data?.Page?.pageInfo?.hasNextPage || false}
            />

          </div>
        </div>
        {/* <div className="mt-10 mb-5 flex justify-center">
          <PaginationButtons currentPage={rawData.pagination.current_page} totalPages={rawData.pagination?.last_visible_page || 1} query={query} type={type} />

        </div> */}
        {/* this for filter section */}
        <section className={`
    // 1. Mobile State Logic (Fixed overlay when open)
    ${isMobileFilterOpen ? "fixed inset-0 md:inset-1/2 z-50 md:w-1/2  h-fit md:top-20 overflow-y-auto rounded-none" : "hidden"}

    // 2. Desktop State (Always visible sidebar)
    lg:block lg:w-1/4 lg:sticky lg:top-20 lg:h-fit lg:max-h-[800px] lg:rounded-lg 
    
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
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Year</label>
              <div className='flex w-full gap-2 flex-wrap relative'>
                <select
                  className="w-full appearance-none rounded-lg bg-[#374151]  px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50"
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    setFilters((prev) => ({
                      ...prev,
                      Year: prev.Year === value ? "all" : value
                    }))

                  }}
                  value={
                    filters.Year == "all" ? "" : filters.Year
                  }
                >
                  <option value="" disabled>Select a Year</option>
                  {
                    yearList ? (
                      yearList?.map((item, index) => (
                        <option key={"y" + index} value={item} >
                          {item}
                        </option>
                      ))
                    ) : ""
                  }

                </select>
                {filters.Year !== "all" &&
                  <div className='absolute top-1/2 right-3 -translate-y-1/2 text-center flex items-center cursor-pointer'
                    onClick={
                      () => {
                        setFilters((prev) => ({
                          ...prev,
                          Year: "all"
                        })
                        )
                      }
                    }
                  >
                    <span className="material-symbols-outlined">
                      close
                    </span>
                  </div>
                }


              </div>


            </div>
            <hr className="border-t border-border-color" />
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Genre</label>
              <div className='flex w-full gap-2 flex-wrap'>

                <select
                  className="w-full appearance-none rounded-lg bg-[#374151]  px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50"
                  onChange={(e) => {

                    //get the selected genre name from the select option
                    const selectedGenreName = e.target.value;
                    // Check if the selected genre is already in the SelectedGenre array
                    const isDuplicate = SelectedGenre.some((g) => g === selectedGenreName);
                    if (!isDuplicate) {
                      setSelectedGenre((prev) => [...prev, selectedGenreName]);
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Select a genre</option>
                  {allGenreOption?.data?.GenreCollection?.map((genre, index) => (
                    <option key={"genres" + index} value={genre} >
                      {genre}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex flex-wrap gap-2 space-y-1">
                  {SelectedGenre.length > 0 && SelectedGenre?.map((item, index) => (
                    <div className='relative' key={"selectedGenre" + index}>
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
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Format</label>
              <div className='flex w-full gap-2 flex-wrap relative'>

                <select
                  className="w-full appearance-none rounded-lg bg-[#374151]  px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50"
                  onChange={(e) => {

                    const value = e.target.value
                    setFilters((prev) => ({
                      ...prev,
                      format: prev.format === value ? "all" : value
                    }))
                  }}
                  value={
                    filters.format == "all" ? "" : filters.format
                  }
                >
                  <option value="" disabled>Select a format</option>
                  {
                    SelectionType?.map((item, index) => (
                      <option key={"type" + index} value={item.value} >
                        {item.label}
                      </option>
                    ))
                  }
                </select>
                {filters.format !== "all" &&
                  <div className='absolute top-1/2 right-3 -translate-y-1/2 text-center flex items-center cursor-pointer'
                    onClick={
                      () => {
                        setFilters((prev) => ({
                          ...prev,
                          format: "all"
                        })
                        )
                      }
                    }
                  >
                    <span className="material-symbols-outlined">
                      close
                    </span>
                  </div>
                }
              </div>
            </div>
            <hr className="border-t border-border-color" />
            {/* Airing Status Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Airing Status</label>
              <div className='flex w-full gap-2 flex-wrap relative'>

                <select
                  className="w-full appearance-none rounded-lg bg-[#374151]  px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50" onChange={(e) => {
                    const value = e.target.value
                    setFilters((prev) => ({
                      ...prev, AiringStatus: value
                    }))

                  }}
                  value={
                    filters.AiringStatus == "all" ? "" : filters.AiringStatus
                  }
                >
                  <option value="" disabled>Select a Status</option>

                  {
                    airingStatusObj?.map((item, index) => (
                      <option key={"Status" + index} value={item.value} >
                        {item.label}
                      </option>
                    ))
                  }
                </select>

                {filters.AiringStatus !== "all" &&
                  <div className='absolute top-1/2 right-3 -translate-y-1/2 text-center flex items-center cursor-pointer'
                    onClick={
                      () => {
                        setFilters((prev) => ({
                          ...prev,
                          AiringStatus: "all"
                        })
                        )
                      }
                    }
                  >
                    <span className="material-symbols-outlined">
                      close
                    </span>
                  </div>
                }


              </div>
            </div>
            <hr className="border-t border-border-color" />
            {/* score Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Score</label>
              <div className='flex flex-col w-full gap-2'>
                <div className='flex w-full gap-2'>
                  <button
                    className={
                      filters.maxScore === 5 ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                        "px-3 w-full py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"
                    }
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        minScore: 0,
                        maxScore: prev.maxScore === 5 ? 0 : 5, // Toggles between 0 and 5
                      }));
                    }}
                  >
                    0-5
                  </button>
                  <button
                    className={
                      filters.maxScore === 10 ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                        "px-3 w-full py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"
                    }
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        minScore: prev.maxScore === 10 ? 0 : 5, // Closes the 51-59 gap
                        maxScore: prev.maxScore === 10 ? 0 : 10, // Toggles between 0 and 10
                      }));
                    }}
                  >
                    5-10
                  </button>
                </div>
              </div>
            </div>
            <hr className="border-t border-border-color" />
            {/* order Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Order By</label>
              <div className='flex w-full gap-2 flex-wrap'>
                {
                  orderListOptions?.map((item, index) => (
                    <button key={"order" + index}
                      className={
                        filters.orderBy == item.value ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 " :
                          "px-3 py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary hover:bg-bgsecondary/10 transition"
                      }
                      onClick={
                        (e) => {
                          const value = e.target.value
                          setFilters((prev) => ({
                            ...prev,
                            orderBy: filters.orderBy === value ? "all" : value
                          }))
                        }
                      }
                      value={item.value}
                    >{item.label}</button>
                  ))
                }
              </div>
            </div>


            {/* this is end of space 4  */}
          </div>
        </section >

      </div >
    </>
  )
}

export default BrowsePage
