import React, { use } from 'react'
import { useRef, useState, useEffect } from "react";
import Zoom from 'react-medium-image-zoom'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import 'react-medium-image-zoom/dist/styles.css'
import { itemfind } from '@/lib/hooks/itemfind';
import { set } from 'mongoose';
import { toast, ToastContainer } from "react-toastify";
import { Heart } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
const Details = ({ selectedItem, onClose, isUpadated }) => {
  const [DetailsPacket, setDetailsPacket] = useState({
    _id: '',
    title: '',
    description: '',
    priority: 0,
    userStatus: "continue",
    category: '',
    userRating: 0,
    rewatches: 0,
    totalEP: 0,
    currentEP: 0,
    notes: '',
    isFavorite: false
  });
  const [isTitleEditMode, setIsTitleEditMode] = useState(false);
  const [isDescriptionEditMode, setIsDescriptionEditMode] = useState(false);
  const [ShowOptions, setShowOptions] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await itemfind();
      const foundItem = data?.watchlist?.screenshots || [];
      // Initialize DetailsPacket with selectedItem data
      foundItem.forEach((item) => {
        if (item._id === selectedItem._id) {
          setDetailsPacket({
            _id: item._id || '',
            title: item.title || '',
            description: item.description || '',
            priority: item.priority || 1,
            userStatus: item.userStatus || "planning",
            category: item.category || '',
            userRating: item.userRating || 0,
            rewatches: item.rewatches || 0,
            totalEP: item.totalEP || 0,
            currentEP: item.currentEP || 0,
            isFavorite: item.favorite || false,
            notes: item.notes || ''
          });
        }
      });
    }
    fetchData();
  }, []);

  const handleDoubleClick = () => {
  
    const api = ref.current;

    if (!api) return;

    const currentScale = api.instance.transformState.scale;
    const maxScale = api.instance.props.maxScale;

    if (currentScale >= maxScale) {
      // reset to original
      api.resetTransform(200);
    } else {
      // zoom in
      api.zoomIn(200);
    }
  };
  let saveChangeHandler = async () => {
   
    try {
      const res = await fetch('/api/watchlist/updateScreenshot', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DetailsPacket),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Item Updated successfully!`);
       
        isUpadated()
        // Optionally close the details view after saving
        onClose();
      } else {
        console.error("Error saving details:", data);
        toast.error("❌ Something went wrong. Try again!");
      }
    } catch (error) {
      console.error("Error saving details:", error);
      toast.error("❌ Something went wrong. Try again!");
    }
  }

  let handlerDelete = async () => {
    const res = await fetch(`/api/watchlist/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mal_id: DetailsPacket._id,
        itemType: "screenshots",
      }),
    });
    const result = await res.json();
    if (res.status === 200) {
      toast.success(`Item deleted successfully!`);
      onClose();
      isUpadated();
    } else {
      toast.error("❌ Something went wrong. Try again!");
    }
  }

  return (
    <>
   
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md">
        <div className="bg-background-deep w-full max-w-5xl rounded-2xl md:rounded-3xl overflow-hidden border border-slate-800 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] flex flex-col md:flex-row max-h-[95vh]">
          <div className="relative h-120 md:h-auto  w-full md:w-5/12 lg:w-2/5 bg-slate-950/50 p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800/50">
            <div className="overflow-hidden  flex-1 bg-gray-100 dark:bg-gray-800 p-6 flex items-center justify-center w-full md:h-full relative rounded-lg">

              <TransformWrapper
                ref={ref}
                initialScale={1}
                minScale={1}
                maxScale={5}
                // ✅ 1. Enable Scroll Zoom (Smooth step)
                wheel={{ step: 0.2, disabled: false }}
                // ✅ 2. Enable Double Click Zoom
                doubleClick={{ disabled: false, mode: "zoomIn" }}
                // Optional: Smooth animation settings
                alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
              >
                {/* We use the render props pattern here ({ zoomIn, zoomOut... }) 
         in case you want to add external buttons later, but it's not strictly required.
      */}
                <TransformComponent
                  // ✅ 3. Force the wrapper to fill the parent container
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <div className='h-full w-full flex items-center justify-center'
                    onDoubleClick={handleDoubleClick}>
                    <img
                      src={selectedItem.imageUrl}
                      alt="Screenshot"
                      // ✅ 4. Use 'object-contain' so the whole image is visible and zoomable without cropping
                      className="max-w-full max-h-full object-contain transition-transform duration-700"

                    />
                  </div>
                </TransformComponent>
              </TransformWrapper>

              {/* Gradient Overlay (Make sure pointer-events is none so it doesn't block clicks!) */}
              <div className="absolute inset-0 bg-linear-to-t from-background-deep/90 via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative bg-background-deep w-full overflow-hidden ">
            <button className="sticky top-4 self-end mr-4 z-50 p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition-colors" onClick={() => onClose()}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="p-6 md:p-8 lg:p-10 lg:pt-2 overflow-y-auto custom-scrollbar h-full scrollbar-hide">
              <div className="flex flex-col gap-6 mb-8 border-b border-slate-800/50 pb-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">

                      {
                        isTitleEditMode ? (
                          <input
                            className="text-lg text-white font-bold mb-2 shadow-sm border-gray-300 border-2 p-1 outline-none focus:border-bgsecondary focus:ring-2 focus:ring-bgsecondary/50 dark:focus:ring-bgsecondary/30 rounded w-30 md:w-50"
                            value={DetailsPacket.title}
                            onChange={(e) => setDetailsPacket(prev => ({ ...prev, title: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setDetailsPacket(prev => ({ ...prev, title: e.target.value }));
                                setIsTitleEditMode(false);
                              }
                            }}
                            autoFocus
                          />) : (
                          // <h2 className='text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100 cursor-pointer' onClick={() => setIsTitleEditMode(true)}>{DetailsPacket.title}</h2>
                          <h2 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">{DetailsPacket.title}</h2>
                          // <h2 className='text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100 '>{DetailsPacket.title}</h2>
                        )
                      }
                      <button className="text-slate-600 hover:text-bgsecondary transition-colors mt-1" onClick={() => setIsTitleEditMode(!isTitleEditMode)}>
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-bgsecondary/10 border border-bgsecondary/20 text-bgsecondary hover:bg-bgsecondary/20 hover:text-white transition-all"
                        onClick={() => setDetailsPacket((prev) => ({ ...prev, isFavorite: !DetailsPacket.isFavorite }))}>
                        <span className={`material-symbols-outlined text-bgsecondary ${DetailsPacket.isFavorite ? '[font-variation-settings:"FILL"_1]' : ''} text-xl`} >
                          favorite
                        </span>
                      </button>
                      <div className="h-8 w-px bg-slate-800"></div>
                      <div className="text-sm relative" >
                        <button  >
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Priority</p>
                          <p className="text-slate-200 font-medium">{DetailsPacket.priority === 3 ? 'High' : DetailsPacket.priority === 2 ? 'Medium' : 'Low'}</p>
                        </button>

                      </div>

                    </div>
                  </div>
                  <div className="relative mr-8 md:mr-10">
                    <button className="flex items-center gap-2 pl-4 pr-3 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold hover:bg-primary/20 transition-all" onClick={() => setShowOptions(!ShowOptions)}>
                      {DetailsPacket.priority === 3 ? 'High' : DetailsPacket.priority === 2 ? 'Medium' : 'Low'}
                      <span className="material-symbols-outlined text-lg">{ShowOptions ? 'expand_less' : 'expand_more'}</span>
                    </button>
                    {ShowOptions && (
                      <div className="absolute mt-2 w-30 md:w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        {/* Options content here */}
                        <ul className="py-1">
                          <li
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => { setDetailsPacket(prev => ({ ...prev, priority: 1 })); setShowOptions(false); }}
                          >
                            Low
                          </li>
                          <li
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => { setDetailsPacket(prev => ({ ...prev, priority: 2 })); setShowOptions(false); }}
                          >
                            Medium
                          </li>
                          <li
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => { setDetailsPacket(prev => ({ ...prev, priority: 3 })); setShowOptions(false); }}
                          >
                            High
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold w-24">Uploaded At:</span>
                    <span className="text-slate-400">{new Date(selectedItem.uploadedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold w-24">Category:</span>
                    <span className="text-slate-400"> {DetailsPacket.category}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2">

                    {
                      isDescriptionEditMode ? (
                        <input
                          className="text-sm text-white font-bold mb-2 shadow-sm border-gray-300 border-2 p-1 outline-none focus:border-bgsecondary focus:ring-2 focus:ring-bgsecondary/50 dark:focus:ring-bgsecondary/30 rounded w-30 md:w-50"
                          value={DetailsPacket.description}
                          onChange={(e) => setDetailsPacket(prev => ({ ...prev, description: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setDetailsPacket(prev => ({ ...prev, description: e.target.value }));
                              setIsDescriptionEditMode(false);
                            }
                          }}
                          autoFocus
                        />) : (
                        // <h2 className='text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100 cursor-pointer' onClick={() => setIsTitleEditMode(true)}>{DetailsPacket.title}</h2>
                        <span className="text-slate-400 italic">{DetailsPacket.description}</span>
                        // <p className='text-gray-700 max-h-20 w-fit'>{DetailsPacket.description}</p>
                      )
                    }
                    <button className="text-slate-600 hover:text-primary transition-colors" onClick={() => setIsDescriptionEditMode(!isDescriptionEditMode)}>
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] ml-1">User Status</label>
                  <div className="relative">
                    <select className="glass-input rounded-xl w-full pl-3 pr-8 py-2.5 appearance-none text-sm font-medium" id="user-status"
                      value={(DetailsPacket.userStatus)}
                      onChange={(e) => setDetailsPacket(prev => ({ ...prev, userStatus: e.target.value }))}
                    >
                      <option value="Continue">Set As Continue </option>
                      <option value="Future">Set As Future </option>
                      <option value="Completed">Completed</option>
                      <option value="Paused">Paused</option>
                      <option value="Dropped">Dropped</option>
                      <option value="Planning">Plan to Watch</option>
                      <option value="Rewatch">Plan to Rewatch</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-lg">expand_more</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] ml-1">Category</label>
                  <div className="relative">
                    <select className="glass-input rounded-xl w-full pl-3 pr-8 py-2.5 appearance-none text-sm font-medium" id="user-status"
                      value={DetailsPacket.category}
                      onChange={(e) => setDetailsPacket(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value={"anime"}>Anime</option>
                      <option value={"manga"}>Manga</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-lg">expand_more</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] ml-1">User Rating</label>
                  <div className="relative">
                    {/* <input className="glass-input rounded-xl w-full pl-3 pr-10 py-2.5 text-sm font-medium" max="10" min="0" placeholder="0" type="number" value="0" /> */}
                    <input className="glass-input rounded-xl w-full pl-3 pr-10 py-2.5 text-sm font-medium" id="user-rating" type="number"
                      value={DetailsPacket.userRating}
                      onChange={(e) => {
                        e.target.value > 10 ? setDetailsPacket(prev => ({ ...prev, userRating: 10 })) :
                          e.target.value < 0 ? setDetailsPacket(prev => ({ ...prev, userRating: 0 })) :
                            setDetailsPacket(prev => ({ ...prev, userRating: e.target.value }))
                      }
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">/10</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] ml-1">Rewatches</label>
                  {/* <input className="glass-input rounded-xl w-full px-3 py-2.5 text-sm font-medium" placeholder="0" type="number" value="0" /> */}
                  <input className="glass-input rounded-xl w-full px-3 py-2.5 text-sm font-medium" id="rewatches" type="number"
                    value={DetailsPacket.rewatches}
                    onChange={(e) => {
                      e.target.value < 0 ? setDetailsPacket(prev => ({ ...prev, rewatches: 0 })) :
                        setDetailsPacket(prev => ({ ...prev, rewatches: e.target.value }))
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-extrabold text-slate-500 uppercase tracking-[0.15em] ml-1">Total Episodes/Chapters</label>
                  {/* <input className="glass-input rounded-xl w-full px-3 py-2.5 text-sm font-medium" placeholder="0" type="number" value="0" /> */}
                  <input className="glass-input rounded-xl w-full px-3 py-2.5 text-sm font-medium" id="total-episodes" type="number"
                    value={DetailsPacket.totalEP}
                    onChange={(e) => {
                      e.target.value < 0 ? setDetailsPacket(prev => ({ ...prev, totalEP: 0 })) :
                        setDetailsPacket(prev => ({ ...prev, totalEP: e.target.value }))
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] ml-1">Current Episode</label>
                  {/* <input className="glass-input rounded-xl w-full px-3 py-2.5 text-sm font-medium" placeholder="0" type="number" value="0" /> */}
                  <input className="glass-input rounded-xl w-full px-3 py-2.5 text-sm font-medium" id="current-episodes" type="number"
                    value={DetailsPacket.currentEP}
                    onChange={(e) => {
                      (e.target.value > DetailsPacket.totalEP && DetailsPacket.totalEP !== 0) ? setDetailsPacket(prev => ({ ...prev, currentEP: DetailsPacket.totalEP })) :
                        e.target.value < 0 ? setDetailsPacket(prev => ({ ...prev, currentEP: 0 })) :
                          setDetailsPacket(prev => ({ ...prev, currentEP: e.target.value }))
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2 mb-8">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] ml-1">Notes</label>
                {/* <textarea className="glass-input rounded-2xl w-full p-4 resize-none text-sm leading-relaxed min-h-[120px]" placeholder="Add your notes here..."></textarea> */}
                 <textarea
                className='glass-input rounded-2xl w-full p-4 resize-none text-sm leading-relaxed min-h-[120px]'
                placeholder='Add your notes here...'
                id="notes"
                value={DetailsPacket.notes}
                onChange={(e) => setDetailsPacket(prev => ({ ...prev, notes: e.target.value }))}
              ></textarea>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-800/50 mt-auto">
                <button className="px-6 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 hover:border-red-600 transition-all text-sm font-bold shadow-lg shadow-red-500/5 active:scale-95" onClick={() => handlerDelete()}>
                  Delete
                </button>
                <button className="px-8 py-2.5 rounded-xl bg-bgsecondary text-slate-900 hover:bg-teal-400 transition-all text-sm font-bold shadow-lg shadow-bgsecondary/20 active:scale-95"  onClick={() => saveChangeHandler()}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



    
    </>
  )
}

export default Details