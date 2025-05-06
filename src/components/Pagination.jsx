import React from 'react';

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage = true,
  hasPrevPage = true,
  maxButtons = 7 // max num of pages
}) {
  // calculate page numbers for display
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    // adjust start page if nearing end
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    // always include first page
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }
    
    // add page ranges
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // always include last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const handlePreviousClick = () => {
    if (hasPrevPage && currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleNextClick = () => {
    if (hasNextPage && currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // don't show if only one page
  if (totalPages <= 1) {
    return null;
  }
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav 
      className="flex items-center justify-center space-x-2" 
      aria-label="Pagination"
    >
      {/* previous button */}
      <button
        onClick={handlePreviousClick}
        disabled={!hasPrevPage || currentPage === 1}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${!hasPrevPage || currentPage === 1
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        aria-label="Previous page"
      >
        Previous
      </button>
      
      {/* page nums */}
      <div className="hidden sm:flex space-x-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span 
                key={`ellipsis-${index}`} 
                className="px-4 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>
      
      {/* page counter for mobile */}
      <span className="sm:hidden px-4 py-2 text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      
      {/* next button */}
      <button
        onClick={handleNextClick}
        disabled={!hasNextPage || currentPage === totalPages}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${!hasNextPage || currentPage === totalPages
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;