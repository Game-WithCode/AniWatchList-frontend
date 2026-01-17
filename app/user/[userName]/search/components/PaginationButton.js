'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export default function PaginationButtons({ currentPage, totalPages }) {
    const searchParams = useSearchParams()
    const router = useRouter();
    const pathname = usePathname();
    const goToPage = (page) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page);

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className='flex items-center justify-center gap-4 my-10'>
            {/* Previous Button */}
            <button
                onClick={() => goToPage(Math.max(currentPage - 1, 1))}
                className='p-3 w-12 h-12 rounded-full text-xl font-bold bg-gray-200 text-gray-700 
                   transition-all duration-200 ease-in-out
                   hover:bg-bgsecondary hover:text-white hover:shadow-lg
                   disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none'
                disabled={currentPage <= 1}
            >
                <span className="material-symbols-outlined">
                    chevron_left
                </span>
            </button>

            {/* Current Page Number */}
            <span className="text-2xl font-semibold text-gray-400 px-4 py-2 border-b-2 border-bgsecondary">
                {currentPage}
            </span>

            {/* Next Button */}
            <button
                onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
                className='p-3 w-12 h-12 rounded-full text-xl font-bold bg-gray-200 text-gray-700 
                   transition-all duration-200 ease-in-out
                   hover:bg-bgsecondary hover:text-white hover:shadow-lg
                   disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none'
                disabled={currentPage >= totalPages}
            >
                <span className="material-symbols-outlined">
                    chevron_right
                </span>
            </button>
        </div>
    );
}
