import React from 'react';
import ArtworkCard from './ArtworkCard';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';

function ArtworkList({
  artworks = [],
  isLoading = false,
  error = null,
  pagination = null,
  onPageChange,
  emptyMessage = 'No artworks found',
  showAddToExhibition = true
}) {
  // loading state handler
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  // error state handler
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <h3 className="text-lg font-medium">Error</h3>
        <p>{error.message || 'Failed to load artworks. Please try again.'}</p>
      </div>
    );
  }

  // empty state handler
  if (!artworks || artworks.length === 0) {
    return (
      <div className="bg-gray-50 p-8 text-center rounded-lg">
        <h3 className="text-xl font-medium text-gray-700 mb-2">Nothing to Display</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {/* artwork */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map(artwork => (
          <ArtworkCard 
            key={`${artwork.source}-${artwork.id}`} 
            artwork={artwork} 
            showAddToExhibition={showAddToExhibition}
          />
        ))}
      </div>

      {/* pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            hasNextPage={pagination.hasMore}
            hasPrevPage={pagination.page > 1}
          />
        </div>
      )}
    </div>
  );
}

export default ArtworkList;