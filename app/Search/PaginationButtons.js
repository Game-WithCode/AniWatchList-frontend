'use client';
import { useRouter } from 'next/navigation';

export default function PaginationButtons({ currentPage, totalPages, name }) {
  const router = useRouter();

  const goToPage = (page) => {


    router.push(`/Search/${name}?page=${page}`);
  };

  return (
    <div className='flex justify-center gap-6 my-10'>
      {currentPage == 1 ? <button
        onClick={() => goToPage(Math.max(currentPage - 1, 1))}
        className='px-2.5 rounded-lg text-2xl bg-[#D9D9D9] '
        disabled={currentPage <= 1}
      >
        &lt;
      </button> : <button
        onClick={() => goToPage(Math.max(currentPage - 1, 1))}
        className='px-2.5 rounded-lg text-2xl bg-[#D9D9D9] hover:bg-[#239BA7] hover:text-white hover:scale-125'
        disabled={currentPage <= 1}
      >
        &lt;
      </button>}


      <span className="text-xl">{currentPage}</span>

      {totalPages == currentPage ? <button
        onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
        className='px-2.5 rounded-lg text-2xl bg-[#D9D9D9] '
        disabled={currentPage >= totalPages}
      >
        &gt;
      </button> : <button
        onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
        className='px-2.5 rounded-lg text-2xl bg-[#D9D9D9] hover:bg-[#239BA7] hover:text-white hover:scale-125'
        disabled={currentPage >= totalPages}
      >
        &gt;
      </button>}
    </div>
  );
}
