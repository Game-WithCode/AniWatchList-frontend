import React from 'react'


import ContinueBtn from './components/continueBtn';
import { itemfind } from '@/lib/hooks/itemfind';

export default async function ItemsPage({ params, searchParams }) {
    let params1 = await params;
    let searchDetail = await searchParams;





    let { id, type } = searchDetail;
    if (!id || !type) {
        return <p>Missing id or type in URL</p>;
    }

    if (type == 'movies') {
        type = 'anime';
    }

     const api = process.env.NEXT_PUBLIC_BACKEND_URL
    const res = await fetch(`${api}/api/${type}/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) {
        console.error("Fetch failed with status:", res.status);
        const text = await res.text(); // helpful for debugging
        console.error("Response text:", text);
        return <p>Error: Unable to fetch data ({res.status})</p>;
    }
    const data = await res.json();
    const item = data.data;

    if (!item) return <p>Item not found</p>;
    // const result = await fetch("/api/watchlist/add", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //         mal_id: anime.mal_id,
    //         title: anime.title,
    //         image: anime.images.jpg.image_url,
    //         type: anime.type,
    //     }),
    // });
    return (
        <>
            <main className=" detailContainer  p-6">
                {type === 'anime' ? (
                    <div key={item.mal_id} className="flex flex-col lg:flex-row gap-12 mx-auto">
                        <div className="shrink-0 mx-auto lg:mx-0">
                            <div className="w-64 sm:w-72 lg:w-80 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900">
                                <img className="w-full h-full object-cover"
                                    src={item.images.webp.large_image_url}
                                    alt={item.title_english || item.title}
                                />
                            </div>
                        </div>
                        <div className="flex-1 space-y-8 pt-4">
                            <div>
                                <h1 className="text-4xl lg:text-6xl font-bold font-display text-white leading-tight mb-4">
                                    {item.title_english || item.title}
                                </h1>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {item.genres && item.genres.length > 0 ? (
                                        item.genres?.map((genre) => <span key={genre.mal_id} className="px-3 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded border border-white/5"> {genre.name} </span>)
                                    ) : (
                                        "N/A"
                                    )}
                                    <span className="px-3 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded border border-white/5">Adventure</span>
                                    <span className="px-3 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded border border-white/5">Drama</span>
                                    <span className="px-3 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded border border-white/5">Fantasy</span>
                                </div>
                            </div>
                            <div className="max-w-3xl">
                                <p className="text-slate-400 text-lg leading-relaxed ">
                                    {item.synopsis}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-12 max-w-4xl py-6 border-y border-slate-800/50">
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">IMDB Rating</span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-bgsecondary text-xl"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            stars
                                        </span>
                                        <span className="text-white text-lg font-bold">{item.score || 'N/A'}<span className="text-slate-500 font-normal text-sm">/10</span></span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">Ranking</span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-bgsecondary text-xl"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            bar_chart
                                        </span>

                                        <span className="text-white text-lg font-bold">#{item.rank || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">Episode</span>
                                    <div className="flex items-center gap-2 text-white text-lg font-bold">
                                        {item.episodes || 'N/A'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">Duration</span>
                                    <div className="flex items-center gap-2 text-white text-lg font-bold">
                                        {item.duration || 'N/A'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">Status</span>
                                    <div className="flex items-center gap-2 text-white text-lg font-bold">
                                        {item.status || 'N/A'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">Popularity</span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-bgsecondary text-xl"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            signal_cellular_alt
                                        </span>
                                        <span className="text-white text-lg font-bold">{item.popularity || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div key={item.mal_id} className="flex flex-col lg:flex-row gap-12 mx-auto">
                        <div className="shrink-0 mx-auto lg:mx-0">
                            <div className="w-64 sm:w-72 lg:w-80 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900">
                                <img className="w-full h-full object-cover"
                                    src={item.images.webp.large_image_url}
                                    alt={item.title_english || item.title}
                                />
                            </div>
                        </div>
                        <div className="flex-1 space-y-8 pt-4">
                            <div>
                                <h1 className="text-4xl lg:text-6xl font-bold font-display text-white leading-tight mb-4">
                                    {item.title_english || item.title}
                                </h1>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {item.genres && item.genres.length > 0 ? (
                                        item.genres?.map((genre) => <span key={genre.mal_id} className="px-3 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded border border-white/5"> {genre.name} </span>)
                                    ) : (
                                        "N/A"
                                    )}
                                    <span className="px-3 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded border border-white/5">Adventure</span>
                                    <span className="px-3 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded border border-white/5">Drama</span>
                                    <span className="px-3 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded border border-white/5">Fantasy</span>
                                </div>
                            </div>
                            <div className="max-w-3xl">
                                <p className="text-slate-400 text-lg leading-relaxed ">
                                    {item.synopsis}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-12 max-w-4xl py-6 border-y border-slate-800/50">
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">IMDB Rating</span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-bgsecondary text-xl"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            stars
                                        </span>
                                        <span className="text-white text-lg font-bold">{item.score || 'N/A'}<span className="text-slate-500 font-normal text-sm">/10</span></span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">Ranking</span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-bgsecondary text-xl"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            bar_chart
                                        </span>

                                        <span className="text-white text-lg font-bold">#{item.rank || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">Volume</span>
                                    <div className="flex items-center gap-2 text-white text-lg font-bold">
                                        {item.volumes || 'N/A'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">Chapter</span>
                                    <div className="flex items-center gap-2 text-white text-lg font-bold">
                                        {item.chapters || 'N/A'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">Status</span>
                                    <div className="flex items-center gap-2 text-white text-lg font-bold">
                                        {item.status || 'N/A'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-white font-bold text-sm block">Popularity</span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-bgsecondary text-xl"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            signal_cellular_alt
                                        </span>
                                        <span className="text-white text-lg font-bold">{item.popularity || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                )

                }

            </main>
            {/* <div className="actionButtons mx-auto mb-20">
                <form key={item.mal_id} action={addToWatchlist} className="flex flex-col justify-center items-center gap-5">
                    <div className=" container flex flex-col justify-center items-center gap-5 mx-auto">
                        <input type="hidden" name="mal_id" value={item.mal_id} />
                        <input type="hidden" name="title" value={item.title} />
                        <input type="hidden" name="image" value={item.images.jpg.image_url} />
                        <input type="hidden" name="type" value="anime" />
                        <input type="hidden" name="category" value="anime" />
                        <button className=" flex w-fit  bg-[#E1AA36] text-white font-bold py-2 px-4 rounded-lg cursor-pointer hover:bg-[#eeba4a]  hover:scale-110  focus:ring-offset-2" type='submit'>
                            <lord-icon
                                src="https://cdn.lordicon.com/tsrgicte.json"
                                trigger="hover"
                                style={{ width: "25px", height: "25px" }}>
                            </lord-icon>
                            <span>Add to WatchList</span>
                        </button>
                        <button className="w-fit bg-[#E8E867]  text-black font-bold py-2 px-8 rounded-lg cursor-pointer hover:bg-[#dbdb49]   hover:scale-110  ">Mark as Watched</button>
                    </div>
                </form>
            </div> */}

            <ContinueBtn item={item} />
            <div >
                <div className="container mx-auto mb-20 flex flex-col justify-center items-center gap-10 mt-10">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-px bg-linear-to-r from-transparent to-white/10 grow"></div>
                            <h2 className="text-3xl font-bold text-white text-center tracking-tight drop-shadow-lg">Official Trailer</h2>
                            <div className="h-px bg-linear-to-l from-transparent to-white/10 grow"></div>
                        </div>
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group ring-1 ring-white/5 hover:ring-primary/30 transition-all duration-500">
                            {item.trailer && item.trailer.embed_url ? (
                                <iframe

                                    src={item.trailer.embed_url}
                                    title={`${item.title_english || item.title} Trailer`}
                                    frameBorder="0"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-sm md:w-xl h-64 md:h-96"
                                ></iframe>
                            ) : (
                                <p className="text-xl ml-2 mt-2">No trailer available</p>
                            )}
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}


