"use client"
import React from 'react'
import { useRef } from 'react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Coursel = ({ slider,itemType }) => {
    
    const scrollRef = useRef(null);
    const { data: session, status } = useSession();
    const router = useRouter()
    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left"
                ? scrollLeft - clientWidth
                : scrollLeft + clientWidth;

            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    }
    return (
        <>
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6 container mx-auto">
                    <h2 className="flex items-center lg:gap-3 md:gap-1.5 lg:text-2xl md:text-lg font-bold text-bgsecondary ">
                        <span className="material-symbols-outlined text-primary lg:text-3xl md:text-2xl">local_fire_department</span>
                        Trending &amp; Recommended {itemType =="anime"? "Anime":"Manga"}
                    </h2>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-full  border border-white text-white  hover:bg-bgsecondary transition-all" onClick={() => scroll("left")}>
                            <span className="material-symbols-outlined text-xl">chevron_left</span>
                        </button>
                        <button className="p-2 rounded-full  border border-white text-white  hover:bg-bgsecondary transition-all" onClick={() => scroll("right")}>
                            <span className="material-symbols-outlined text-xl">chevron_right</span>
                        </button>
                    </div>
                </div>
                <div ref={scrollRef} className=" scrollbar-hide carousel-container flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-mx-26">
                    {
                        slider.map((item, index) => (
                            <div key={item.mal_Id} className="flex-none w-72 snap-start">

                                <div className="relative group rounded-xl overflow-hidden  border border-white shadow-soft h-[400px]">
                                    <img alt="Top Anime" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-40" src={item.Images} />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 w-full p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-white bg-bgsecondary rounded-md">Trending</span>
                                        <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-[#3A2A00] bg-[#FFB800]  rounded-md mx-2">{item.RawType}</span>
                                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
                                        <div className="flex items-center gap-2 mb-2 text-gray-300 text-xs">
                                            <span className="flex items-center"><span className="material-symbols-outlined text-[14px] mr-1 text-yellow-400">star</span> {item.Scores}</span>
                                            {
                                                item.Genre.map((i, ind) => {
                                                    if (ind > 2) {
                                                        return
                                                    } else {
                                                        return (
                                                            <div key={ind}>
                                                                <span>•</span>
                                                                <span>{i}</span>
                                                            </div>
                                                        )
                                                    }

                                                })
                                            }

                                        </div>
                                        <p className="hidden text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-3 max-h-10 overflow-hidden group-hover:flex">
                                            {item.description}
                                        </p>
                                        <button className="w-full py-2 bg-white/10 hover:bg-bgsecondary backdrop-blur-sm border border-white/20 text-white text-sm font-semibold rounded-lg transition-colors"
                                            onClick={() => router.push(`/firstSignUp`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </section>
        </>
    )
}

export default Coursel
