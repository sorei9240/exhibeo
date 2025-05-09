import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useArtworks } from '../hooks/useArtworks';
import SearchBar from '../components/SearchBar';
import ArtworkList from '../components/ArtworkList';
import Filters from '../components/Filters';
import LoadingSpinner from '../components/LoadingSpinner';
import { getFeaturedArtworks } from '../api';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    searchResults,
    isSearching,
    searchError,
    searchArtworks,
    goToPage,
    updateFilters,
  } = useArtworks();

  // state for browse artworks
  const [browseArtworks, setBrowseArtworks] = useState([]);
  const [isBrowseLoading, setIsBrowseLoading] = useState(true);
  const [browseError, setBrowseError] = useState(null);
  
  // track if it is an initial load or a refresh
  const [randomSeed, setRandomSeed] = useState(Date.now());

  // Get current search parameters from URL
  const queryTerm = searchParams.get('q');
  const source = searchParams.get('source') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sortBy = searchParams.get('sort') || 'relevance';
  const medium = searchParams.get('medium') || '';

  // Init search on parameter changes & component mount
  useEffect(() => {
    if (queryTerm) {
      searchArtworks({
        searchTerm: queryTerm,
        sources: source === 'all' ? ['all'] : [source],
        page: page,
        filters: {
          sortBy: sortBy,
          medium: medium
        }
      });
    }
  }, [queryTerm, source, page, sortBy, medium, searchArtworks]);

  // load browse artworks on mount and when randomSeed changes
  useEffect(() => {
    const loadBrowseArtworks = async () => {
      setIsBrowseLoading(true);
      setBrowseError(null);
      
      try {
        // get random artworks by 
        const artworks = await getFeaturedArtworks(30, true);
        
        // shuffle for randomness
        const shuffled = [...artworks].sort(() => 0.5 - Math.random());
        
        // take the first 20 artworks after shuffling
        setBrowseArtworks(shuffled.slice(0, 20));
      } catch (error) {
        console.error('Error loading browse artworks:', error);
        setBrowseError(error.message || 'Failed to load artworks');
      } finally {
        setIsBrowseLoading(false);
      }
    };
    
    // Only load browse artworks if there's no search query
    if (!queryTerm) {
      loadBrowseArtworks();
    }
  }, [queryTerm, randomSeed]);

  // Handle new search submissions
  const handleSearch = (params) => {
    searchArtworks(params);
  };

  // Page navigation handler
  const handlePageChange = (newPage) => {
    if (newPage > 0 && (searchResults?.pagination?.totalPages === undefined || newPage <= searchResults.pagination.totalPages)) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('page', newPage.toString());
        return newParams;
      });
      goToPage(newPage);
    }
  };

  // filter change handler
  const handleFilterChange = (filters) => {
    updateFilters(filters);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (filters.sortBy) newParams.set('sort', filters.sortBy);
      if (filters.medium) newParams.set('medium', filters.medium);
      else newParams.delete('medium');
      return newParams;
    });
  };

  // refresh the browse artworks
  const refreshBrowseArtworks = () => {
    setRandomSeed(Date.now());
  };

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="lg:sticky lg:top-4 lg:z-10 lg:shadow-md lg:pb-4 lg:bg-gray-50">
        <SearchBar 
          onSearch={handleSearch}
          initialSearchTerm={queryTerm || ''}
        />
      </div>

      {/* Search results header & filters */}
      {queryTerm && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results for "{queryTerm}"
            </h1>
            {!isSearching && searchResults?.pagination && (
              <p className="text-gray-600 mt-2">
                Showing {searchResults.pagination.total} {searchResults.pagination.total === 1 ? 'result' : 'results'}
                {source !== 'all' && (
                  <span className="ml-1">
                    from {source === 'metropolitan' ? 'The Metropolitan Museum' : 'Harvard Art Museums'}
                  </span>
                )}
                {medium && (
                  <span className="ml-1">
                    in {medium.charAt(0).toUpperCase() + medium.slice(1)}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Filters component */}
          {searchResults?.artworks?.length > 0 && (
            <Filters 
              onFilterChange={handleFilterChange}
              currentFilters={{
                sortBy: sortBy || 'relevance',
                medium: medium || ''
              }}
            />
          )}
        </div>
      )}

      {/* Loading state for search */}
      {isSearching && queryTerm && (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Search results when search is active */}
      {queryTerm && !isSearching && (
        <ArtworkList
          artworks={searchResults?.artworks || []}
          isLoading={isSearching}
          error={searchError}
          pagination={searchResults?.pagination}
          onPageChange={handlePageChange}
          emptyMessage={`No results found for "${queryTerm}". Try a different search term or source.`}
        />
      )}

      {/* Browse artworks when no search term */}
      {!queryTerm && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Browse Our Collections</h2>
              <p className="text-gray-600 mt-2">
                Explore artworks from The Metropolitan Museum of Art and Harvard Art Museums
              </p>
            </div>
            
            {/* Refresh button for browse artworks */}
            <button
              onClick={refreshBrowseArtworks}
              className="mt-4 sm:mt-0 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
              disabled={isBrowseLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Show New Artworks
            </button>
          </div>
          
          {isBrowseLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : browseError ? (
            <div className="text-center text-red-600 py-8">
              <p>Unable to load artworks. Please try again later.</p>
            </div>
          ) : (
            <>
              <ArtworkList
                artworks={browseArtworks || []}
                isLoading={false}
                emptyMessage="No artworks available at the moment."
                showAddToExhibition={true}
              />
              
              <div className="text-center pt-4 pb-8">
                <p className="text-gray-600">
                  Use the search bar above to find specific artworks, artists, or periods
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;