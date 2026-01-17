// 'use client';
// import Router from 'next/router'
// import { useRouter } from "next/navigation";
// import { useSearchParams, usePathname } from 'next/navigation'
// import React, { use } from 'react'

// const Options = () => {
//     const router = useRouter();
//       const pathname = usePathname()
//       const searchParams = useSearchParams()
//       const baseUserPath = pathname.split("/").slice(0, 3).join("/");

//   return (
//     <>
//     {/* add anime manga movie favorite continous option */}
//     <div className=' flex justify-center gap-15 py-4 mt-0 mb-2 text-xl'>
//         <div className='cursor-pointer  hover:underline' onClick={()=>{router.push(`${baseUserPath}/added?type=anime`)}}>Anime</div>
//         <div className='cursor-pointer  hover:underline' onClick={()=>{router.push(`${baseUserPath}/added?type=manga`)}}>Manga</div>
//         <div className='cursor-pointer  hover:underline'>Movie</div>
//         <div className='cursor-pointer  hover:underline'>Favorite</div>
//         <div className='cursor-pointer  hover:underline'>Continue Watching</div> 
      
//     </div>
//     <div className='h-1 w-full bg-slate-200'></div>
//     {/* end option */}


//     </>
//   )
// }

// export default Options
// do not needed
