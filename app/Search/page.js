"use client"
import React from 'react'
import { useSearchParams, usePathname, useRouter,useParams } from 'next/navigation'
import { Browse } from '@/lib/hooks/Browse'
import { yearList } from "@/app/components/yearList";
import { useEffect, useState } from 'react'
import { allGenres } from '@/lib/hooks/Allgenre';
import PaginationButtons from "@/app/components/PaginationButton";
import Link from 'next/link'
// import SearchDetail from './SearchDetails'
const Search = () => {
  const searchParams = useSearchParams()
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams(); 
  const userName = params.userName;
  const search = searchParams.get('q').toString() || "";
  const searchType = searchParams.get('type').toString() || "";
  const [allGenreOption, setallGenreOption] = useState([])
  const [itemList, setitemList] = useState([])
  const [SelectedGenre, setSelectedGenre] = useState([])
  const [SelectionType, setSelectionType] = useState([])
  const [airingStatusObj, setairingStatusObj] = useState([])
  const [isOpen, setisOpen] = useState(false)
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const animeTypes = [
    { label: "TV", value: "tv" },
    { label: "Movie", value: "movie" },
    { label: "OVA", value: "ova" },
    { label: "ONA", value: "ona" },
    { label: "Special", value: "special" },
    { label: "Music", value: "music" }
  ];
  const mangaTypes = [
    { label: "Manga", value: "manga" },
    { label: "Light Novel", value: "lightnovel" },
    { label: "One-shot", value: "oneshot" },
    { label: "Doujinshi", value: "doujin" },
    { label: "Manhwa", value: "manhwa" },
    { label: "Manhua", value: "manhua" }
  ];

  const airingStatusList = [
    { label: "Currently Airing", value: "airing" },
    { label: "Finished Airing", value: "complete" },
    { label: "Not Yet Aired", value: "upcoming" },
  ];
  const mangaStatusList = [
    { label: "Currently Airing", value: "publishing" },
    { label: "On Break", value: "hiatus" },
    { label: "Discontinued", value: "discontinued" },
    { label: "Finished Airing", value: "complete" },
    { label: "Not Yet Aired", value: "upcoming" },
  ];
  const orderListOptions = [
    { label: "Popularity", value: "popularity" },
    { label: "Rank", value: "rank" },
    { label: "Title", value: "title" },
    { label: "Release Date", value: "start_date" },
    { label: "End Date", value: "end_date" },
    { label: "Score", value: "score" },
    ...(searchType === "anime" ? [{ label: "Episode", value: "episodes" }] : []),

    // You can also add a Manga check for "Chapters"
    ...(searchType === "manga" ? [{ label: "Chapters", value: "chapters" }] : []),
  ];
  const [filters, setFilters] = useState({
    Year: "all",
    Genre: ["all"],
    Type: "all",
    minScore: 0,
    maxScore: 0,
    AiringStatus: "all",
    orderBy: "all",
    SearchType:searchType||"anime"
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = {
          query: search,
          SearchTypeCategory: searchType,
          page: searchParams.get('page'),
          type: searchParams.get('itemtype'),
          minScore: searchParams.get('minScore'),
          maxScore: searchParams.get('maxScore'),
          status: searchParams.get('status'),
          genres: searchParams.get('genres'),
          orderBy: searchParams.get('orderBy'),
          startYear: searchParams.get('startYear'),
        };
        const item = await Browse("Search", queryParams);
        setitemList(item)
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
        if (params.get("itemtype") !== null) {
          setFilters((prev) => ({
            ...prev,
            Type: params.get('itemtype')
          }))
        } else {
          setFilters((prev) => ({
            ...prev,
            Type: "all"
          }))
        }
        //First for type (maovie,ova)
        if (params.get("minScore") !== null) {
          setFilters((prev) => ({
            ...prev,
            minScore: params.get('minScore')
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
            maxScore: params.get('maxScore')
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
        if (params.get("type") !== null) {
          setFilters((prev) => ({
            ...prev,
            SearchType: params.get('type')
          }))
        }
        if (params.get("genres") !== null) {
          // 1. Get the string (e.g., "1,2,3")
          const genreString = params.get('genres');

          // 2. Split it and Map it
          // Check if genreString exists first to avoid errors if the URL param is missing
          const arrGenreId = genreString
            ? genreString.split(',').map(id => parseInt(id))
            : [];
          const currentGenre = arrGenreId.map((id) => {
            return allGenreOption.find((item) => item.malId === id);
          })
            .filter((item) => item !== undefined);

   
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


  //filter data
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let fetchData = async () => {

      params.set('type', filters.SearchType);
      if (filters.Year == null || filters.Year == "all") {
        params.delete('startYear');
      } else {
        params.set('startYear', filters.Year);
      }
      //this will for genres 
      if (filters.Genre.length < 1 || filters.Genre[0] == null) {
        params.delete('genres');
      } else {
        // 2. Extract only the IDs from the array of objects
        const genreIds = filters.Genre.map((g) => g.malId).join(",");


        // 3. Set the correct parameter name ('genres', not 'startYear')
        params.set('genres', genreIds);
      }
      //for type
      if (filters.Type == "all" || filters.Type == null) {
        params.delete('itemtype');
      } else {
        // 2. Extract only the IDs from the array of objects


        // 3. Set the correct parameter name ('genres', not 'startYear')
        params.set('itemtype', filters.Type);
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
      // --- 2. NEW LOGIC: Compare and Reset Page ---

      // Get the strings to compare if the URL is actually changing
      const currentUrlString = searchParams.toString();
      const newUrlString = params.toString();

      // If the URL parameters are different, it means the filters (Year, Genre, etc.) have changed.
      // We must check this condition to avoid an infinite loop or breaking normal pagination.
      if (currentUrlString !== newUrlString) {

        // Reset page to 1
        params.set('page', '1');

        router.push(`${pathname}?${params.toString()}`);
      }
      router.push(`${pathname}?${params.toString()}`);
    }

    fetchData()
  }, [filters]);

  //for genres
  useEffect(() => {

    setFilters((prev) => ({
      ...prev, Genre: SelectedGenre
    }))

  }, [SelectedGenre])


  useEffect(() => {
    const fetch = async () => {
      const allGenresData = await allGenres(searchType);
      const genreData = allGenresData.data.map(item => ({
        name: item.name,
        malId: item.mal_id
      }));
      setallGenreOption(genreData);
      if (searchType == 'anime') {
        setSelectionType(animeTypes)
        setairingStatusObj(airingStatusList)
      } else {
        setSelectionType(mangaTypes)
        setairingStatusObj(mangaStatusList)

      }
      if (searchType === "anime") {
        orderListOptions.push({
          label: "Episode",
          value: "episodes"
        })

      }

    }
    fetch()

  }, [searchParams])

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
      Type: "all",
      minScore: 0,
      maxScore: 0,
      AiringStatus: "all",
      orderBy: "all"
    })
    setSelectedGenre([])

    router.push(`${pathname}?${newParams.toString()}`);
  }
  let SearchTypeChanger = (newType) => {
    const params = new URLSearchParams(searchParams.toString());
    const newParams = new URLSearchParams()

    // 1. Preserve the search query ('q')
    const currentQuery = params.get('q');
    if (currentQuery) {
      newParams.set('q', currentQuery)
    }

    // 2. Set the new Type correctly (matches your reading logic)
    newParams.set('type', newType)

    // 3. Reset all filters
    setFilters({
      Year: "all",
      Genre: ["all"],
      Type: "all",
      minScore: 0,
      maxScore: 0,
      AiringStatus: "all",
      orderBy: "all",
      SearchType:newType
    })
    setSelectedGenre([])

    // 4. Close the dropdown menu
    setisOpen(false)

    // 5. Navigate
    router.push(`${pathname}?${newParams.toString()}`);
  }

return (
    <>

      <div className='container mx-auto flex flex-col justify-center items-center gap-2'>
        <h1 className='font-bold text-2xl'>You searched: <span className='text-bgsecondary text-3xl'>{search}</span></h1>

        <div className='relative group inline-block'>
          <div className="flex gap-2 justify-center items-center text-textcolor hover:text-bgsecondary transition-colors border rounded-lg px-4 py-1 font-bold text-xl" onClick={() => setisOpen(!isOpen)}>{searchType === "anime" ? "Anime" : "Manga"}
            <span className="material-symbols-outlined">
              {isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            </span>
          </div>
          {
            isOpen && (
              <div className="absolute left-0 flex-col z-50 pt-2 w-max min-w-[120px]">

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

<div className='container w-full flex  mx-auto mt-10 gap-10 justify-center'>
        <div className='flex flex-col max-w-2/3'>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 ">
            {/* card 1 */}

            {itemList?.data?.map((item, index) => {
              const type = (item.type === "TV" || item.type === "Movie" || item.type === "OVA" || item.type === "ONA" || item.type === "Special") ? "anime" : "manga";


              return (
                <div key={`${item.mal_id}-${index

                  }`} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-bgsecondary/10 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 h-fit">
                  <figure className='aspect-2/3 overflow-hidden relative'>
                    <img
                      src={item.images.webp.large_image_url}
                      alt="Anime"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
                      <span className="bg-bgsecondary text-white text-xs font-bold px-2 py-1 rounded">
                        {item.type}
                      </span>
                    </div>
                  </figure>
                  <div className="card-body flex flex-col gap-2 p-2 w-full">
                    <h2 className="font-bold text-lg text-white dark:text-white mb-1 line-clamp-1 group-hover:text-bgsecondary transition-colors">{item.title_english ? item.title_english : item.title}</h2>
                    <p className="text-gray-400 h-16 overflow-hidden ">
                      {item.synopsis ?? "No synopsis available."}
                    </p>
                    <div className="card-actions flex justify-center mt-2 w-full">
                      <button className="w-full py-2.5 rounded-lg bg-bgsecondary/20 dark:bg-bgsecondary/20 text-bgsecondary dark:text-bgsecondary/50 font-semibold text-sm hover:bg-bgsecondary hover:text-white dark:hover:bg-bgsecondary dark:hover:text-white transition-all" onClick={() => router.push(`/firstSignUp`)}>
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
              currentPage={itemList?.pagination?.current_page || 1}

              // You already had it here, but ensure itemList is checked too
              totalPages={itemList?.pagination?.last_visible_page || 1}
            />

          </div>
        </div>


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
          <div className="flex items-center justify-between mb-6 mt-4">
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
                      yearList.map((item, index) => (
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
   
                    //get the genre mal id 
                    const selectedId = parseInt(e.target.value);
                    // get the full genre object from the list 
                    const selectedGenreObj = allGenreOption.find((item) => item.malId === selectedId
                    )
        
                    //set the malId and name 
                    if (selectedGenreObj) {
                      setSelectedGenre((prev) => {
                        const isDuplicate = prev.some((g) => g.malId === selectedId)
                        if (isDuplicate) return prev
                        return [
                          ...prev,
                          { malId: selectedId, name: selectedGenreObj.name }
                        ]
                      })
                    }

                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Select a genre</option>
                  {allGenreOption.map((genre, index) => (
                    <option key={"genres" + genre.malId + index} value={genre.malId} >
                      {genre.name}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex flex-wrap gap-2 space-y-1">
                  {SelectedGenre.length > 0 && SelectedGenre.map((item, index) => (
                    <div className='relative' key={"selectedGenre" + item.malId + index}>
                      <span className="mr-2 px-2 py-1 bg-gray-700 text-gray-200 rounded pr-5">
                        {item.name}
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
              <label className="block text-sm font-medium text-text-primary mb-2">Type</label>
              <div className='flex w-full gap-2 flex-wrap relative'>

                <select
                  className="w-full appearance-none rounded-lg bg-[#374151]  px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50"
                  onChange={(e) => {
 
                    const value = e.target.value
                    setFilters((prev) => ({
                      ...prev,
                      Type: prev.Type === value ? "all" : value
                    }))
                  }}
                  value={
                    filters.Type == "all" ? "" : filters.Type
                  }
                >
                  <option value="" disabled>Select a type</option>
                  {
                    SelectionType.map((item, index) => (
                      <option key={"type" + index} value={item.value} >
                        {item.label}
                      </option>
                    ))
                  }
                </select>
                {filters.Type !== "all" &&
                  <div className='absolute top-1/2 right-3 -translate-y-1/2 text-center flex items-center cursor-pointer'
                    onClick={
                      () => {
                        setFilters((prev) => ({
                          ...prev,
                          Type: "all"
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
                    airingStatusObj.map((item, index) => (
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
                      filters.maxScore == 5 ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                        "px-3 w-full py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"}
                    onClick={
                      (e) => {

                        const value = e.target.value
                        setFilters((prev) => ({
                          ...prev,
                          minScore: 0,
                          maxScore: 5,
                        }))
                      }
                    }
                    value={"0-5"}
                  >0-5</button>
                  <button
                    className={
                      filters.maxScore == 10 ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
                        "px-3 w-full py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"}
                    onClick={
                      (e) => {
                        const value = e.target.value
                        setFilters((prev) => ({
                          ...prev,
                          minScore: 6,
                          maxScore: 10,
                        }))
                      }
                    }
                    value={"6-10"}
                  >6-10</button>
                </div>

              </div>
            </div>
            <hr className="border-t border-border-color" />
            {/* order Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Order By</label>
              <div className='flex w-full gap-2 flex-wrap'>
                {
                  orderListOptions.map((item, index) => (
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
      </div>
    </>
  )
}

export default Search
