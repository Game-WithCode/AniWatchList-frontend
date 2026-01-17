'use client'
import React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'


const SearchOption = () => {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const option = searchParams.get('type') || 'anime'

  function handleChange(e) {
    const newType = e.target.value

    const params = new URLSearchParams(searchParams.toString())
    params.set('type', newType)
    params.set('page', '1') // reset page on filter change (important)

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='text-center mt-10 text-2xl mb-4 flex justify-center items-center gap-2'>
      Select Category to Search:
      <select
        value={option}
        onChange={handleChange}
        className="border-2 border-gray-300 rounded-lg p-2 text-xl bg-bgprimary"
      >
        <option value="anime">Anime</option>
        <option value="manga">Manga</option>
      </select>
    </div>
  )
}

export default SearchOption
