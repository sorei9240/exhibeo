import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useArtworks } from '../hooks/useArtworks';
import SearchBar from '../components/SearchBar';
import ArtworkList from '../components/ArtworkList';
import Filters from '../components/Filters';
import LoadingSpinner from '../components/LoadingSpinner';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    searchResults,
    isSearching,
    searchError,
    searchArtworks,
    goToPage,
    updateFilters
  } = useArtworks();

  const queryTerm = searchParams.get('q');
  const source = searchParams.get('source') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // init search on change & on component mount
  useEffect(() => {
    if (queryTerm) {
      searchArtworks({
        searchTerm: queryTerm,
        sources: source === 'all' ? ['all'] : [source],
        page: page
      });
    }
  }, [queryTerm, source, page]);

  // serach submission handler
  const handleSearch = (params) => {
    searchArtworks(params);
  };

  // page navigation handler
  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', newPage.toString());
      return newParams;
    });
    goToPage(newPage);
  };

  // filter change handler
  const handleFilterChange = (filters) => {
    updateFilters(filters);
  };

  return (
    <div className="space-y-8">
      {/* search bar */}
      <div className="lg:sticky lg:top-4 lg:z-10 lg:shadow-md lg:pb-4 lg:bg-gray-50">
        <SearchBar 
          onSearch={handleSearch}
          initialSearchTerm={queryTerm || ''}
        />
      </div>

      {/* search results header & filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {queryTerm && (
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results for "{queryTerm}"
            </h1>
          )}
          {!isSearching && searchResults?.pagination && (
            <p className="text-gray-600 mt-2">
              Showing {searchResults.pagination.total} {searchResults.pagination.total === 1 ? 'result' : 'results'}
              {source !== 'all' && (
                <span className="ml-1">
                  from {source === 'metropolitan' ? 'The Metropolitan Museum' : 'Harvard Art Museums'}
                </span>
              )}
            </p>
          )}
        </div>

        {searchResults?.artworks?.length > 0 && (
          <Filters 
            onFilterChange={handleFilterChange}
            currentFilters={{
              sortBy: searchParams.get('sort') || 'relevance',
              filterBy: searchParams.get('filter') || ''
            }}
          />
        )}
      </div>

      {/* loading state */}
      {isSearching && !searchResults && (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* search results */}
      {!isSearching && queryTerm && (
        <ArtworkList
          artworks={searchResults?.artworks || []}
          isLoading={isSearching}
          error={searchError}
          pagination={searchResults?.pagination}
          onPageChange={handlePageChange}
          emptyMessage={`No results found for "${queryTerm}". Try a different search term or source.`}
        />
      )}

      {/* default - no search term */}
      {!queryTerm && !isSearching && (
        <div className="text-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Search for Artworks</h2>
          <p className="text-gray-600">Enter a search term to find artworks from multiple museum collections.</p>
        </div>
      )}
    </div>
  );
}

export default Search;