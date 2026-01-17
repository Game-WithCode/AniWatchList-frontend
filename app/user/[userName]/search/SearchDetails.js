// 'use client';

// import { useState, useMemo, useEffect } from 'react';
// import Link from 'next/link';
// import { yearList } from './Components/YearList';
// import { allGenres } from '@/lib/hooks/Allgenre';
// import PaginationButtons from './Components/PaginationButton.js';

// import SearchOption from '@/app/components/searchOption';
// export default function SearchDetail({ rawData, items, userName, type, query }) {
//     const [ListData, setListData] = useState(items)
//     const [ratingSelection, setRatingSelection] = useState(0);
//     const [isfilterAppled, setIsfilterAppled] = useState(false);
//     const [allGenreOption, setallGenreOption] = useState([]);
//     const [SelectedGenre, setSelectedGenre] = useState([])
//     const [SelectionType, setSelectionType] = useState([])
//     const [SelectedType, setSelectedType] = useState([])
//     const seasons = [
//         { label: "Winter", value: "winter" },
//         { label: "Spring", value: "spring" },
//         { label: "Summer", value: "summer" },
//         { label: "Fall", value: "fall" }, // also called Autumn
//     ];
//     const airingStatusList = [
//         { label: "Currently Airing", value: "airing" },
//         { label: "Finished Airing", value: "completed" },
//         { label: "Not Yet Aired", value: "upcoming" },
//         { label: "Cancelled", value: "cancelled" },
//     ];
//     const animeTypes = [
//         { label: "TV", value: "tv" },
//         { label: "Movie", value: "movie" },
//         { label: "OVA", value: "ova" },
//         { label: "ONA", value: "ona" },
//         { label: "Special", value: "special" },
//         { label: "Music", value: "music" }
//     ];
//     const mangaTypes = [
//         { label: "Manga", value: "manga" },
//         { label: "Light Novel", value: "lightnovel" },
//         { label: "One-shot", value: "oneshot" },
//         { label: "Doujinshi", value: "doujin" },
//         { label: "Manhwa", value: "manhwa" },
//         { label: "Manhua", value: "manhua" }
//     ];
//     const [filters, setFilters] = useState({
//         Year: "all",
//         Genre: ["all"],
//         Type: ["all"],
//         season: "all",
//         userRating: "all",
//         AiringStatus: "all"

//     });
//     let filterReset = () => {
//         setFilters({
//             Year: "all",         // newest | oldest
//             Genre: ["all"],
//             Type: ["all"],
//             season: "all",
//             userRating: "all",
//             AiringStatus: "all"

//         })
//         setRatingSelection(0)
//         setIsfilterAppled(false)
//         setSelectedGenre([])
//         setSelectedType([])
//         setListData(items)
//     }
//     useEffect(() => {

//         let fetchData = async () => {
//             console.log("upadating filter", filters)

//             const hasActiveFilter =
//                 filters.Year !== "all"||
//             filters.season !== "all"||
//             filters.Genre[0] !== "all" ||
//                 filters.Type[0] !== "all" ||
//                 filters.status !== "all" ||
//                 filters.userRating !== "all" ||
//                 filters.AiringStatus !== "all";

//             setIsfilterAppled(hasActiveFilter);
//             const filteredData = items.filter((item) => {
//                 console.log('item scores', parseInt(item.score))
//                 // Implement filtering logic based on filters state

//                 let isValid = true;
//                 // Example: Filter by priority
//                 // if (filters.priority !== "all") {
//                 //     if (filters.priority === "high" && item.priority < 3) isValid = false;
//                 //     else if (filters.priority === "medium" && item.priority !== 2) isValid = false;
//                 //     else if (filters.priority === "low" && item.priority > 1) isValid = false;
//                 // }

//                 //create more filters here based on time, userRating, status etc.
//                 const date = Date.now();
//                 if (filters.Year !== "all") {
//                     let itemYear
//                     if (type == "anime") {
//                         itemYear = item.year ? item.year : item.aired.prop.from.year;
//                     } else {
//                         itemYear = item.year ? item.year : item.published.prop.from.year;

//                     }

//                     if (filters.Year !== itemYear) isValid = false
//                 }
//                 if (filters.season !== "all") {

//                     if (filters.season !== item.season) {
//                         isValid = false
//                     }
//                 }
//                 if (filters.AiringStatus !== "all") {

//                     if (filters.AiringStatus !== item.status) {
//                         isValid = false
//                     }
//                 }
//                 //Genre filter(anime/manga)
//                 if (filters.Genre.length > 0 && filters.Genre[0] !== "all") {
//                     // setIsfilterAppled(true);

//                     const itemCategory = item.genres.map(i => i.name)
//                     const filterCategory = filters.Genre;
//                     const hasMatch = filterCategory.some(fg => itemCategory.includes(fg));
//                     if (!hasMatch) isValid = false;

//                 }
//                 //type filter(anime/manga)
//                 if (filters.Type.length > 0 && filters.Type[0] !== "all") {
//                     // setIsfilterAppled(true);

//                     const itemCategory = (item.type || []);
//                     const filterCategory = filters.Type;
//                     const hasMatch = filterCategory.some(fc =>
//                         itemCategory.includes(fc)
//                     );
//                     if (!hasMatch) isValid = false;

//                 }
//                 // //Stauts filter (continue/watched/planned/pause/drop)
//                 // if (filters.status !== "all") {
//                 //     // setIsfilterAppled(true)
//                 //     const itemStatus = (item.UserStatus || "N/A").toLowerCase();
//                 //     const filterStatus = filters.status.toLowerCase();
//                 //     if (itemStatus !== filterStatus) isValid = false;
//                 // }
//                 //userRating filter (0-5/6-10)
//                 if (filters.userRating !== "all") {
//                     // setIsfilterAppled(true)
//                     const itemRating = parseInt(item.score) || 0;

//                     if (filters.userRating === "0-5" && itemRating > 5) {
//                         isValid = false;
//                     } else if (filters.userRating === "6-10") {
//                         if (!(itemRating >= 6 && itemRating <= 10)) {
//                             isValid = false;
//                         }
//                         // console.log
//                         // isValid = false;
//                     }
//                 }
//                 //priority filter is already done above

//                 return isValid;
//             })
//             // .sort((a, b) => {
//             //     if (filters.time === "newest") {
//             //         return new Date(b.addedAt) - new Date(a.addedAt);
//             //     } else if (filters.time === "oldest") {
//             //         return new Date(a.addedAt) - new Date(b.addedAt);
//             //     } else {
//             //         return 0; // no sorting
//             //     }
//             // });
//             console.log("Filtered Screenshots:", filteredData);
//             setListData(filteredData)
//         }
//         //  let fetchData = async () => {
//         //     console.log('filter Appeared')
//         //  }
//         fetchData()
//         // You can implement filtering logic here based on the `filters` state

//     }, [filters]);
//     useEffect(() => {

//         setFilters((prev) => ({
//             ...prev, Genre: SelectedGenre
//         }))

//     }, [SelectedGenre])
//     useEffect(() => {
//         setFilters((prev) => ({
//             ...prev, Type: SelectedType
//         }))
//     }, [SelectedType]);
//     useEffect(() => {

//         const fetch = async () => {

//             const allGenresData = await allGenres(type);
//             const names = allGenresData.data.map(item => item.name);
//             setallGenreOption(names);
//             if (type == 'anime') {
//                 setSelectionType(animeTypes)
//             } else {
//                 setSelectionType(mangaTypes)

//             }

//         }
//         fetch()

//     }, [])
//     useEffect(() => {
//         console.log('query change')


//     }, [query])

//     let captizeLetter = (str) => {
//         if (str.length == 0) {
//             return str
//         }
//         return str.charAt(0).toUpperCase() + str.slice(1);
//     }
//     useEffect(() => {
//         setListData(items)
//         filterReset() // optional but recommended
//     }, [items])
//     console.log(items)
//     return (<>
//         <div className='text-center mt-20 text-3xl font-bold'>You searched for: <span className='text-4xl text-bgsecondary'>{captizeLetter(query)}</span></div>
//         {/* show in which category user want to search like anime manga movie in drop down*/}
//         <SearchOption />





//         <div className="container w-full flex  mx-auto mt-10 gap-10">
//             <div className='flex flex-col max-w-2/3'>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 ">
//                     {/* card 1 */}

//                     {ListData.map((item, index) => {
//                         const type = (item.type === "TV" || item.type === "Movie" || item.type === "OVA" || item.type === "ONA" || item.type === "Special") ? "anime" : "manga";


//                         return (
//                             <div key={`${item.mal_id}-${index

//                                 }`} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-bgsecondary/10 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 h-fit">
//                                 <figure className='aspect-2/3 overflow-hidden relative'>
//                                     <img
//                                         src={item.images.jpg.image_url}
//                                         alt="Anime"
//                                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                                     />
//                                     <div className='absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
//                                         <span className="bg-bgsecondary text-white text-xs font-bold px-2 py-1 rounded">
//                                             {item.type}
//                                         </span>
//                                     </div>
//                                 </figure>
//                                 <div className="card-body flex flex-col gap-2 p-2">
//                                     <h2 className="font-bold text-lg text-white dark:text-white mb-1 line-clamp-1 group-hover:text-bgsecondary transition-colors">{item.title_english ? item.title_english : item.title}</h2>
//                                     <p className="text-gray-400 h-16 overflow-hidden ">
//                                         {item.synopsis ?? "No synopsis available."}
//                                     </p>
//                                     <div className="card-actions flex justify-center mt-2 w-full">
//                                         <Link href={`/user/${userName}/items?id=${item.mal_id}&type=${type}`} className='w-full'>
//                                             <button className="w-full py-2.5 rounded-lg bg-bgsecondary/20 dark:bg-bgsecondary/20 text-bgsecondary dark:text-bgsecondary/50 font-semibold text-sm hover:bg-bgsecondary hover:text-white dark:hover:bg-bgsecondary dark:hover:text-white transition-all">
//                                                 View Details
//                                             </button>
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//                 <div className="mt-10 mb-5 flex justify-center">
//                     <PaginationButtons currentPage={rawData.pagination.current_page} totalPages={rawData.pagination?.last_visible_page || 1} query={query} type={type} />

//                 </div>
//             </div>


//             {/* this for filter section */}

//             <section className='w-1/5 m-auto mt-5 bg-[#1F2937] p-6 rounded-lg shadow-lg sticky top-20 h-fit  overflow-auto max-h-[800px]  scrollbar-hide'>
//                 <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-xl font-bold text-text-primary">Filters</h2>
//                     <button className="text-sm text-red-400 hover:text-red-500 font-medium" onClick={() => filterReset()}>Reset</button>
//                 </div>
//                 {/* boday part */}
//                 <div className="space-y-4">
//                     {/* year Filter */}
//                     <div>
//                         <label className="block text-sm font-medium text-text-primary mb-2">Year</label>
//                         <div className='flex w-full gap-2 flex-wrap'>
//                             <select
//                                 className="w-full appearance-none rounded-lg bg-[#374151]  px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50"
//                                 onChange={(e) => {
//                                     const value = parseInt(e.target.value)
//                                     setFilters((prev) => ({
//                                         ...prev,
//                                         Year: prev.Year === value ? "all" : value
//                                     }))
//                                 }}
//                                 value={
//                                     filters.Year == "all" ? "" : filters.Year
//                                 }
//                             >
//                                 <option value="" disabled>Select a Year</option>
//                                 {
//                                     yearList ? (
//                                         yearList.map((item, index) => (
//                                             <option key={index} value={item} >
//                                                 {item}
//                                             </option>
//                                         ))
//                                     ) : ""
//                                 }

//                             </select>


//                         </div>


//                     </div>
//                     <hr className="border-t border-border-color" />
//                     {/* Genre Filter */}
//                     <div>
//                         <label className="block text-sm font-medium text-text-primary mb-2">Genre</label>
//                         <div className='flex w-full gap-2 flex-wrap'>

//                             <select
//                                 className="w-full appearance-none rounded-lg bg-[#374151]  px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50" onChange={(e) => {
//                                     setSelectedGenre(prev => {
//                                         // Only add if not already in array
//                                         if (!prev.includes(e.target.value)) {
//                                             return [...prev, e.target.value];
//                                         } else {
//                                             return prev; // no change if it already exists
//                                         }
//                                     });
//                                 }}
//                                 defaultValue=""
//                             >
//                                 <option value="" disabled>Select a genre</option>
//                                 {allGenreOption.map((genre, index) => (
//                                     <option key={index} value={genre} >
//                                         {genre}
//                                     </option>
//                                 ))}
//                             </select>
//                             <div className="mt-2 flex flex-wrap gap-2 space-y-1">
//                                 {SelectedGenre.length > 0 && SelectedGenre.map((item, index) => (
//                                     <div className='relative' key={index}>
//                                         <span className="mr-2 px-2 py-1 bg-gray-700 text-gray-200 rounded pr-5">
//                                             {item}
//                                         </span>
//                                         <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer hover:scale-105" style={{ fontSize: "14px" }}
//                                             onClick={() => {
//                                                 setSelectedGenre(prev => prev.filter(genre => genre !== item))
//                                             }}
//                                         >
//                                             close
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>



//                         </div>
//                     </div>
//                     <hr className="border-t border-border-color" />
//                     {/* Type Filter */}
//                     <div>
//                         <label className="block text-sm font-medium text-text-primary mb-2">Type</label>
//                         <div className='flex w-full gap-2 flex-wrap'>

//                             <select
//                                 className="w-full appearance-none rounded-lg bg-[#374151]  px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50" onChange={(e) => {
//                                     // setSelectedGenre(prev => {
//                                     //     // Only add if not already in array
//                                     //     if (!prev.includes(e.target.value)) {
//                                     //         return [...prev, e.target.value];
//                                     //     } else {
//                                     //         return prev; // no change if it already exists
//                                     //     }
//                                     // });
//                                     setSelectedType(prev => {
//                                         if (!prev.includes(e.target.value)) {
//                                             return [...prev, e.target.value];
//                                         } else {
//                                             return prev; // no change if it already exists
//                                         }

//                                     })
//                                 }}
//                                 value={
//                                     filters.Type == "all" ? "" : filters.Type[filters.Type.length - 1]
//                                 }
//                             >
//                                 <option value="" disabled>Select a type</option>
//                                 {/* {allGenreOption.map((genre, index) => (
//                                         <option key={index} value={genre} >
//                                             {genre}
//                                         </option>
//                                     ))} */}
//                                 {
//                                     SelectionType.map((item, index) => (
//                                         <option key={index} value={item.label} >
//                                             {item.label}
//                                         </option>
//                                     ))
//                                 }
//                             </select>
//                             <div className="mt-2 flex flex-wrap gap-2 space-y-1">
//                                 {SelectedType.length > 0 && SelectedType.map((item, index) => (
//                                     <div className='relative' key={index}>
//                                         <span className="mr-2 px-2 py-1 bg-gray-700 text-gray-200 rounded pr-5">
//                                             {item}
//                                         </span>
//                                         <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer hover:scale-105" style={{ fontSize: "14px" }}
//                                             onClick={() => {
//                                                 setSelectedType(prev => prev.filter(genre => genre !== item))
//                                             }}
//                                         >
//                                             close
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>



//                         </div>
//                     </div>
//                     <hr className="border-t border-border-color" />
//                     {/* Season Filter */}
//                     <div>
//                         <label className="block text-sm font-medium text-text-primary mb-2">Season</label>
//                         <div className='flex w-full gap-2 flex-wrap'>

//                             <select
//                                 className="w-full appearance-none rounded-lg bg-[#374151]  px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50" onChange={(e) => {
//                                     const value = e.target.value
//                                     setFilters((prev) => ({
//                                         ...prev, season: value
//                                     }))

//                                 }}
//                                 value={
//                                     filters.season == "all" ? "" : filters.season
//                                 }
//                             >
//                                 <option value="" disabled>Select a type</option>
//                                 {/* {allGenreOption.map((genre, index) => (
//                                         <option key={index} value={genre} >
//                                             {genre}
//                                         </option>
//                                     ))} */}
//                                 {
//                                     seasons.map((item, index) => (
//                                         <option key={index} value={item.value} >
//                                             {item.label}
//                                         </option>
//                                     ))
//                                 }
//                             </select>




//                         </div>
//                     </div>
//                     <hr className="border-t border-border-color" />
//                     {/* Airing Status Filter */}
//                     <div>
//                         <label className="block text-sm font-medium text-text-primary mb-2">Airing Status</label>
//                         <div className='flex w-full gap-2 flex-wrap'>

//                             <select
//                                 className="w-full appearance-none rounded-lg bg-[#374151]  px-4 py-2 pr-10 text-gray-300 outline-none transition duration-200 hover:bg-[#374151]/80 focus:ring-2 focus:ring-bgsecondary/50" onChange={(e) => {
//                                     const value = e.target.value
//                                     setFilters((prev) => ({
//                                         ...prev, AiringStatus: value
//                                     }))

//                                 }}
//                                 value={
//                                     filters.AiringStatus == "all" ? "" : filters.AiringStatus
//                                 }
//                             >
//                                 <option value="" disabled>Select a type</option>

//                                 {
//                                     airingStatusList.map((item, index) => (
//                                         <option key={index} value={item.label} >
//                                             {item.label}
//                                         </option>
//                                     ))
//                                 }
//                             </select>




//                         </div>
//                     </div>

//                     <hr className="border-t border-border-color" />
//                     {/* UserRating Filter */}
//                     <div>
//                         <label className="block text-sm font-medium text-text-primary mb-2">UserRating</label>
//                         <div className='flex flex-col w-full gap-2'>
//                             <div className='flex w-full gap-2'>
//                                 <button
//                                     className={
//                                         filters.userRating == "0-5" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
//                                             "px-3 w-full py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"}
//                                     onClick={
//                                         (e) => {

//                                             const value = e.target.value
//                                             setFilters((prev) => ({
//                                                 ...prev,
//                                                 userRating: prev.userRating === value ? "all" : value
//                                             }))
//                                         }
//                                     }
//                                     value={"0-5"}
//                                 >0-5</button>
//                                 <button
//                                     className={
//                                         filters.userRating == "6-10" ? "px-3 py-1.5 rounded-lg text-bgsecondary transition bg-bgsecondary/10 w-full" :
//                                             "px-3 w-full py-1.5 rounded-lg bg-[#374151] text-gray-300 hover:text-bgsecondary transition hover:bg-bgsecondary/10"}
//                                     onClick={
//                                         (e) => {
//                                             const value = e.target.value
//                                             setFilters((prev) => ({
//                                                 ...prev,
//                                                 userRating: prev.userRating === value ? "all" : value
//                                             }))
//                                         }
//                                     }
//                                     value={"6-10"}
//                                 >6-10</button>
//                             </div>

//                         </div>
//                     </div>

//                 </div>
//             </section >
//         </div >
//     </>)
// }