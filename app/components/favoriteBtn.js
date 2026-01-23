"use client";
import React from 'react'
import { toast } from 'react-toastify';
export default function FavoriteBtn  ({ item })  {
console.log('SGRFEG',item)

          const categoryType = item.type === "Movie"
              ? "anime"
              : item.type === "TV"
                ? "anime"
                : item.type === "Manga"
                  ? "manga" : item.type === "OVA"
                    ? "anime"
                    : item.type === "ONA"
                      ? "anime"
                    : item.type === "Special"
                    ? "anime" : item.type === "Manhwa"
                      ? "manga"
                      : "anime";
    let favoriteHandler = async (addType) => {
        console.log('stated');
        
        console.log('woiherwi',categoryType);
        
       
        const res = await fetch("/api/watchlist/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mal_id: item.mal_id,
                title: item.title,
                image: item.images.jpg.image_url,
                type: addType,
                category: categoryType,
            }),
        });
        const result = await res.json();
        if (res.status === 201) {
            toast.success(`${categoryType} added successfully!`);
        } else if (res.status === 409) {
            toast.error("item is not added!");
        } else if (res.status === 200) {
            toast.info("item already added!");
        } else {
            toast.error("❌ Something went wrong. Try again!");
        }
    }

    return (
        <>
            <div className='container flex justify-end'>
                <div className='flex items-center'>
                    <span className='font-semibold'>Add to Favorite</span>
                    <span onClick={() => { favoriteHandler('favorite') }}>
                        <lord-icon
                            src="https://cdn.lordicon.com/nvsfzbop.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}>
                        </lord-icon>
                    </span>
                </div>
            </div>
        </>
    )
}


