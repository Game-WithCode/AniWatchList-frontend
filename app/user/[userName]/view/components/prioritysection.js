import React from 'react'
import { useState, useEffect } from 'react';
import Details from './details';
import { itemfind } from '@/lib/hooks/itemfind';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const PrioritySection = ({
    item
}) => {

    const [ReceivedItem, setReceivedItem] = useState([]);


    useEffect(() => {
        const updatedItems = item.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
        setReceivedItem(updatedItems || []);
    }, [item]);
    const [expandedSections, setExpandedSections] = useState(false)
    // const [expandedSections, setExpandedSections] = useState({
    //     High_priority: false,
    //     Medium_priority: false,
    //     Low_priority: false,
    // });
    const [canshow, setCanshow] = useState(false);
    //secific item detail handler so it pass to detail component
    const [selectedItem, setSelectedItem] = useState(null);
    let toggleSection = (section) => {
        setExpandedSections(!expandedSections)
    }
    let detailHandler = (item) => {
        setSelectedItem(item);
        setCanshow(true);
    }
    let upadating = async () => {
        const item = await itemfind();
        const foundItem = (item?.watchlist?.screenshots || []).find(item => item._id === selectedItem._id);
        // 1. Update selectedItem correctly
     
        if (!foundItem) {
    
            const updatedItems = ReceivedItem.filter(
                i => i._id !== selectedItem._id
            ).sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

            setReceivedItem(updatedItems);
            return ""

        }
        setSelectedItem(foundItem);
        const updatedReceivedItems = ReceivedItem?.map(i => {
            if (i._id === selectedItem._id) {
                return foundItem;   // replace with updated value
            }
            return i;               // return original for all others
        }).sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
        setReceivedItem(updatedReceivedItems);
        // Update state (if you have a state for receivedItem)

    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                theme="colored"
            />
            {
                canshow ? <Details selectedItem={selectedItem} onClose={() => setCanshow(false)} isUpadated={() => upadating()} /> : null
            }
            <div className='flex gap-2 items-center '>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  w-full h-fit">

                    {
                        ReceivedItem == null || ReceivedItem == undefined ? (
                            <p className="text-center col-span-full">No screenshots in this priority.</p>
                        ) : ReceivedItem.length > 0 ? (
                            ReceivedItem?.map((item, index) => {
                                if (!expandedSections && index >= 4) return null; // Limit to 4 items

                                return (
                                    <div key={index} className="bg-background-secondary/70 border border-border-color rounded-xl shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group max-h-fit"
                                        onClick={() => detailHandler(item)}
                                    >
                                        <div className="relative">
                                            <img alt={`Anime screenshot ${index + 1}`} className="w-full h-48 object-cover" src={item.imageUrl} />
                                            <div className="absolute top-3 right-3 text-xs font-medium text-text-secondary bg-[#565A5F] backdrop-blur-3xl text-white px-2.5 py-1 rounded-full">{new Date(item.createAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className="p-4 flex flex-col grow">
                                            <div className=" flex gap-2">
                                                {
                                                    item.priority === 3 ? (
                                                        <span className="inline-block bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start">High</span>
                                                    ) : item.priority === 2 ? (
                                                        <span className="inline-block bg-yellow-500/10 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start">Medium</span>
                                                    ) : (
                                                        <span className="inline-block bg-red-500/10 text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start">Low</span>
                                                    )
                                                }
                                                <span className="inline-block bg-cyan-500/10 text-bgsecondary text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start">{item.category}</span>
                                            </div>
                                            {/* <span className="inline-block bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start"></span> */}
                                            <h3 className="font-bold text-lg text-text-primary group-hover:text-bgsecondary transition-colors">{item.title}</h3>
                                            <p className="text-sm text-text-secondary mt-1">{item.description}</p>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-center col-span-full">No screenshots Save yet.</p>
                        )
                    }
                </div>
                {ReceivedItem == null || ReceivedItem == undefined ? null : ReceivedItem.length <= 4 ? null : (
                    <span className="material-symbols-outlined cursor-pointer text-3xl font-bold hover:scale-105 self-start mt-40" style={{ fontSize: '32px' }}
                        onClick={() => toggleSection()}>
                        {expandedSections ? 'expand_circle_up' : 'expand_circle_down'}
                    </span>
                )}

                {/* <span className="material-symbols-outlined cursor-pointer text-3xl font-bold hover:scale-105 self-start mt-40" style={{ fontSize: '32px' }}
                    onClick={() => toggleSection(sectionkey)
                            
                        }>
                {/* <span className="material-symbols-outlined cursor-pointer text-3xl font-bold hover:scale-105 self-start mt-40" style={{ fontSize: '32px' }}
                    onClick={() => toggleSection(sectionkey)}>
                    {expandedSections[sectionkey] ? 'expand_circle_up' : 'expand_circle_down'}
                </span> */}
            </div>
        </>
    )
}

export default PrioritySection
