
"use client";
import React, { useState, useEffect, use } from "react";
import { ChevronDown, ChevronUp, Plus, Heart } from "lucide-react";
import { toast } from 'react-toastify';

import { itemfind,getItemDetails } from "@/lib/hooks/itemfind";
import UpdateForm from "./updateForm";
import { set } from "mongoose";



export default function ContinueBtn({ item }) {
  //create a state variable which hold all items or database variables and also hold the current item status and also hold the favorite status of the item
  const [currentItem, setCurrentItem] = useState({
    isFavorite: false,
    itemType:null,
  });
  const [appearance, setAppearance] = useState({
    isOpen: false,
    canAppear: false,
    selectedOption: "",
  });
 
 

  //To get know the current item status and also the favorite status of the item from the database and set the state variables accordingly
  useEffect(() => {
    const fetchItem = async () => {
      //first select the item type and then fetch the item from the database and then set the state variables accordingly
      setCurrentItem(prevState => ({
        ...prevState,
        itemType: item.type.toLowerCase()
      }));
      try {
        // Fetch the item from the database and set the state variables accordingly
        const data = await itemfind();
        //filter the data to get the current item based on the item type and mal_id
        
        const foundItem = await getItemDetails(item.id, item.type.toLowerCase());
        const current = foundItem?.UserStatus || "";
        //set the state variables accordingly
        setAppearance(prevState => ({
          ...prevState,
          selectedOption: current
        }));
        setCurrentItem(prevState => ({
          ...prevState,
          isFavorite: foundItem?.favorite || false
        }));
        console.log("Current item status:", current);

      } catch (err) {
        console.error('Error fetching item:', err);

      }
    };
    fetchItem();
  }, []);

  //by this we change the selected options and open the update form and also set the canAppear to true so that the update form will appear and also set the selected option to the current item status
  let handleSelect = (status) => {
    setAppearance(prevState => ({
      ...prevState,
      canAppear: true,
      selectedOption: status
    }));
  }
  //by this we can add the item to the favorite list and also remove it from the favorite list and also set the isFavorite state variable accordingly
  let addFavorite = async () => {
    try {
      const foundItem = await getItemDetails(item.id, item.type.toLowerCase());

      if (!foundItem) {
        toast.error("Please save the item first!");
        return;
      }

      const newFavoriteStatus = !currentItem.isFavorite;
      setCurrentItem(prevState => ({
        ...prevState,
        isFavorite: newFavoriteStatus
      }));
      const res = await fetch(`/api/watchlist/update/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mal_id: item.id,
          favorite: newFavoriteStatus,
          itemType: currentItem.itemType,
        }),
      });
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
  //when user is done in the update form and click on close button then we will update the selected option to the current item status and also set the canAppear to false so that the update form will disappear
  let updateSelectedOption = async () => {
    try {
      const foundItem = await getItemDetails(item.id, item.type.toLowerCase());
      const current = foundItem?.UserStatus || "";
      setAppearance(prevState => ({
        ...prevState,
        selectedOption: current
      }));

    } catch (err) {
      console.error('Error fetching item:', err);
    }
  }
  return (
    <>

      {appearance.canAppear && (
        <UpdateForm
          item={item}
          status={appearance.selectedOption ?? ""}
          onClose={() => {
            setAppearance(prevState => ({
              ...prevState,
              canAppear: false,
              isOpen: false,
            }));
            updateSelectedOption();
          }}
        />
      )}

      {/* add add to let button onclick it set as continue and more option will appear like save and continue button */}
      {/* also favorite buttton will be here */}

      <div className='flex justify-center gap-4 '>

        <div className="flex flex-col">

          <div className="flex items-center gap-2 px-6 py-2.5 rounded border border-bgsecondary text-bgsecondary hover:bg-bgsecondary/10 transition-colors font-semibold" onClick={() => setAppearance(prevState => ({ ...prevState, isOpen: !prevState.isOpen }))}>
            <span><Plus /></span>
            <span className="font-semibold" ><span onClick={() => {
              if (appearance.selectedOption) {
                handleSelect(appearance.selectedOption);
               setAppearance(prevState => ({ ...prevState, canAppear: true }));
              }
            }}>{appearance.selectedOption && appearance.selectedOption.trim ? `Set as ${appearance.selectedOption}` : `Add to List`}</span></span>
          </div>

          <div className={`${appearance.isOpen ? 'block' : 'hidden'} overflow-hidden  border-2 border-[#bdb9b9] rounded-lg shadow-sm mt-2 w-40 `}>
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
          <span className={`material-symbols-outlined text-bgsecondary ${currentItem.isFavorite ? '[font-variation-settings:"FILL"_1]' : ''} text-xl`} >
            favorite
          </span>
          {/* {isFavorite ? <Heart fill="bgscondary" strokeWidth={0} /> : <Heart />} */}
        </div>
      </div>
    </>

  );
}
