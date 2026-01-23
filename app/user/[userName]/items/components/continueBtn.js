
"use client";
import React, { useState, useEffect, use } from "react";
import { ChevronDown, ChevronUp, Plus, Heart } from "lucide-react";
import { toast } from 'react-toastify';
import { ItemPresentCheck } from "@/lib/hooks/itemPresent"
import { itemfind } from "@/lib/hooks/itemfind";
import UpdateForm from "./updateForm";
import { set } from "mongoose";
import { getCategory } from "@/lib/hooks/getType";

export default function ContinueBtn({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEpisodes, setSelectedEpisodes] = useState([]);
  const [canAppear, setCanAppear] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const categoryType =  getCategory(item.type);
               

  const episodes = Array.from({ length: item.episodes }, (_, i) => i + 1);
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await itemfind();
        const animeList = data?.watchlist?.[categoryType] || []

        const foundItem = animeList.find(items => items.mal_id == item.mal_id)
        const current = foundItem?.UserStatus || [];
        setSelectedOption(current);
        setIsFavorite(foundItem?.favorite || false);
 
      } catch (err) {
        console.error('Error fetching item:', err);

      }
    };
    fetchItem();
  }, []);


  let handleSelect = (status) => {
  
    setSelectedOption(status);
    setCanAppear(true);
  }

  let addFavorite = async () => {
    try {
      const testItem = await itemfind();
      const foundItem = (testItem?.watchlist?.[categoryType] || []).find(i => i.mal_id === item.mal_id);

      if (!foundItem) {
        toast.error("Please save the item first!");
        return;
      }

      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      const res = await fetch(`/api/watchlist/update/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mal_id: item.mal_id,
          favorite: newFavoriteStatus,
          itemType: categoryType,
        }),
      });
      const result = await res.json();
      if (res.status === 200) {
        toast.success(`Item ${newFavoriteStatus ? "added to" : "removed from"} favorites!`);
      } else {
        toast.error("❌ Something went wrong. Try again!");
      }

    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("❌ Something went wrong. Try again!");
    }

  }
  let updateSelectedOption = async () => {
    try {
      const data = await itemfind();
      const animeList = data?.watchlist?.[categoryType] || []
      const foundItem = animeList.find(items => items.mal_id == item.mal_id)
      const current = foundItem?.UserStatus || "";
      setSelectedOption(current);

    } catch (err) {
      console.error('Error fetching item:', err);
    }
  }
  return (
    <>

      {canAppear && (
        <UpdateForm
          item={item}
          status={selectedOption}
          onClose={() => { setCanAppear(false); setIsOpen(false); updateSelectedOption(); }}
        />
      )}

      {/* add add to let button onclick it set as continue and more option will appear like save and continue button */}
      {/* also favorite buttton will be here */}

      <div className='flex justify-center gap-4 '>

        <div className="flex flex-col">

          <div className="flex items-center gap-2 px-6 py-2.5 rounded border border-bgsecondary text-bgsecondary hover:bg-bgsecondary/10 transition-colors font-semibold" onClick={() => setIsOpen(!isOpen)}>
            <span><Plus /></span>
            <span className="font-semibold" ><span onClick={() => {
              if (selectedOption) {
                handleSelect(selectedOption);
                setCanAppear(true);
              }
            }}>{selectedOption && selectedOption.trim ? `Set as ${selectedOption}` : `Add to List`}</span></span>
          </div>

          <div className={`${isOpen ? 'block' : 'hidden'} overflow-hidden  border-2 border-[#bdb9b9] rounded-lg shadow-sm mt-2 w-40 `}>
            <ul className="flex flex-col items-center font-semibold">
              <li className="hover:bg-[#239BA7] hover:text-white cursor-pointer w-full text-center p-2 " onClick={() => handleSelect("Planning")}>Set as Planning</li>
              <li className="hover:bg-[#239BA7] hover:text-white cursor-pointer w-full text-center p-2 " onClick={() => handleSelect("Future")}>Set as Future</li>
              <li className="hover:bg-[#239BA7] hover:text-white cursor-pointer w-full text-center p-2 " onClick={() => handleSelect("Continue")}>Set as Watching</li>
              <li className="hover:bg-[#239BA7] hover:text-white cursor-pointer w-full text-center p-2 " onClick={() => handleSelect("Completed")}>Set as Completed</li>
              <li className="hover:bg-[#239BA7] hover:text-white cursor-pointer w-full text-center p-2 " onClick={() => handleSelect("Paused")}>Set as Paused</li>
              <li className="hover:bg-[#239BA7] hover:text-white cursor-pointer w-full text-center p-2 " onClick={() => handleSelect("Dropped")}>Set as Dropped</li>
              <li className="hover:bg-[#239BA7] hover:text-white cursor-pointer w-full text-center p-2 " onClick={() => handleSelect("Rewatch")}>Set as Rewatch</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center p-2.5 rounded border border-white/20 text-white hover:bg-white/5 transition-colors h-fit" onClick={addFavorite}>
          {/* <span class="material-symbols-outlined text-xl text-bgsecondary fill">favorite</span> */}
          <span className={`material-symbols-outlined text-bgsecondary ${isFavorite ? '[font-variation-settings:"FILL"_1]' : ''} text-xl`} >
  favorite
</span>
          {/* {isFavorite ? <Heart fill="bgscondary" strokeWidth={0} /> : <Heart />} */}
        </div>
      </div>
    </>

  );
}
