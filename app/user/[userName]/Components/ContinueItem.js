"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const ContinueItem = ({ itemData, itemType }) => {
  const { data: session, status } = useSession();
  const router = useRouter()

 
  return (
    <>

      <section className="mb-12 container mx-auto ">
        <div className="flex items-center justify-between mb-6 px-3">
          <h2 className="flex items-center gap-3 md:text-2xl text-[20px]  font-bold text-text-primary ">
            <span className="material-symbols-outlined text-primary text-3xl">play_circle</span>
            Continue {itemType == "anime" ? "Watching" : itemType === "manga" ? "Reading" : "Screenshots"}
          </h2>
          <button className="px-4 py-2 text-sm font-medium text-bgsecondary border border-bgsecondary/50 rounded-lg hover:bg-bgsecondary hover:text-white transition-all duration-300"
            onClick={() => {
              const username = session?.user?.name
              if (!username) return

              if (itemType === "view") {
                router.replace(`/user/${username}/view`)
              } else {
                router.replace(`/user/${username}/added?type=${itemType}`)
              }
            }}
          >See More</button>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  self-center px-10 md:px-0">
          {
            itemData !== null && itemData !== undefined && itemData.length > 0 ? (
              itemData?.map((item, index) => {
           
              if (index > 2) return
              return (<div key={index} className=" border border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group">
                <img alt="Anime 1 poster" className="w-full h-48 object-cover" src={item.Image} />
                <div className="p-4 flex flex-col grow">
                  <h3 className="font-bold text-lg text-text-primary group-hover:text-bgsecondary transition-colors">{item.title}</h3>
                  <p className="text-sm text-text-secondary mb-4">Episode {item.currentEpisode} of {item.totalEpisode}</p>
                  <button className="mt-auto w-full bg-bgsecondary text-white py-2.5 rounded-lg font-semibold hover:bg-bgsecondary/50 transition-colors shadow-sm hover:shadow-md"
                    onClick={() => {
                      const username = session?.user?.name
                      if (!username) return

                      if (itemType === "view") {
                        router.replace(`/user/${username}/view`)
                      } else {
                        router.push(`/user/${session.user.name}/items?id=${item.mal_id}&type=${itemType}`)
                      }
                    }}
                  >Continue</button>
                </div>
              </div>)
            })
          ) : (
              <p className="text-center col-span-full">No items to added.</p>
            ) 
          }
          


        </div>
      </section>
    </>
  )
}

export default ContinueItem
