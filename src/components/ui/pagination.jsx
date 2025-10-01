'use client'

import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ currentPage, pagesToken, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();


  const goToPage = (page, token = null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    if (token) {
      Cookies.set('pagesToken', token); // ✅ store in cookie
    } else {
      Cookies.remove('pagesToken'); // ✅ clear if not needed
    }

    router.push(`?${params.toString()}`);
  };


  const renderPageButtons = () => {
    const buttons = [];

    const maxVisible = 3;
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i, pagesToken)}
          aria-current={i === currentPage ? 'page' : undefined}
          className={`relative z-10 inline-flex items-center px-4 py-2 focus:z-20 ${i === currentPage ? 'active' : ''
            }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      buttons.push(
        <span key="dots" className="relative z-10 inline-flex items-center px-4 py-2 focus:z-20 dots pointer-events-none">
          ...
        </span>
      );
      buttons.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages, pagesToken)}
          className="relative z-10 inline-flex items-center px-4 py-2 focus:z-20"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex items-center justify-center mt-4 px-4 py-3 sm:px-6 pagination-container">
      <div className="flex sm:flex-1 sm:items-center sm:justify-center">
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md gap-3" dir="ltr">
            <button
              onClick={() => goToPage(currentPage - 1, pagesToken)}
              className="relative z-10 inline-flex items-center px-4 py-2 focus:z-20 prev"
              disabled={currentPage <= 1}
            >
              <span className="sr-only">Previous</span>
              <i className="icon-double-left"></i>
            </button>

            {renderPageButtons()}

            <button
              onClick={() => goToPage(currentPage + 1, pagesToken)}
              className="relative z-10 inline-flex items-center px-4 py-2 focus:z-20 next"
              disabled={currentPage >= totalPages}
            >
              <span className="sr-only">Next</span>
              <i className="icon-double-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
