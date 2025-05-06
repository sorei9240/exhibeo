import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchAllCollections, getArtworkById, getFeaturedArtworks } from '../api';

/**
 * hook for searching & retrieving artwork data
 */
export function useArtworks() {
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    page: 1,
    pageSize: 20,
    sources: ['all'],
    filters: {}
  });

  // query for searching works
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
    refetch: refetchSearch,
    isRefetching: isRefetchingSearch
  } = useQuery({
    queryKey: ['artworks', 'search', searchParams],
    queryFn: () => searchAllCollections(searchParams),
    enabled: !!searchParams.searchTerm, // only run when there's a search term
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true // keep previous data while loading new data
  });

  // query for featured artworks
  const {
    data: featuredArtworks,
    isLoading: isFeaturedLoading,
    error: featuredError
  } = useQuery({
    queryKey: ['artworks', 'featured'],
    queryFn: () => getFeaturedArtworks(10),
    staleTime: 60 * 60 * 1000 // 1 hour
  });

  /**
   * Ssearch with given param
   */
  const searchArtworks = useCallback((params) => {
    setSearchParams(prevParams => ({
      ...prevParams,
      ...params,
      // back to page 1 on change
      page: params.searchTerm !== prevParams.searchTerm ? 1 : params.page || prevParams.page
    }));
  }, []);

  /**
   * navigate to a specific page
   */
  const goToPage = useCallback((pageNumber) => {
    setSearchParams(prevParams => ({
      ...prevParams,
      page: pageNumber
    }));
  }, []);

  /**
   * update search filters
   */
  const updateFilters = useCallback((filters) => {
    setSearchParams(prevParams => ({
      ...prevParams,
      filters: { ...prevParams.filters, ...filters },
      page: 1 // back to page 1 on filter change
    }));
  }, []);

  /**
   * fetch a single work by id
   */
  const fetchArtworkById = useCallback(async (id, source) => {
    if (!id || !source) return null;
    try {
      return await getArtworkById(id, source);
    } catch (error) {
      console.error(`Error fetching artwork ${id} from ${source}:`, error);
      return null;
    }
  }, []);

  return {
    // search state & functions
    searchParams,
    searchResults,
    isSearching: isSearching || isRefetchingSearch,
    searchError,
    searchArtworks,
    goToPage,
    updateFilters,
    refetchSearch,
    
    // featured
    featuredArtworks: featuredArtworks || [],
    isFeaturedLoading,
    featuredError,
    
    // single artwork
    fetchArtworkById
  };
}