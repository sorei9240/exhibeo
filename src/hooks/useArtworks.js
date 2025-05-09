import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchAllCollections, getArtworkById, getFeaturedArtworks } from '../api';

/**
 * Hook for searching & retrieving artwork data
 */
export function useArtworks() {
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    page: 1,
    pageSize: 20,
    sources: ['all'],
    filters: {
      excludeXrays: true, // default to excluding X-rays
      sortBy: 'relevance',
      medium: ''
    }
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

  const [processedResults, setProcessedResults] = useState(null);

  useEffect(() => {
    if (!searchResults?.artworks) {
      setProcessedResults(null);
      return;
    }

    let processed = [...searchResults.artworks];
    const { sortBy, medium } = searchParams.filters;

    // handle medium filter
    if (medium) {
      const mediumTerms = {
        'paintings': ['painting', 'oil', 'acrylic', 'tempera', 'watercolor'],
        'sculpture': ['sculpture', 'statue', 'bust', 'relief', 'bronze', 'marble'],
        'prints': ['print', 'etching', 'lithograph', 'woodcut', 'engraving'],
        'photographs': ['photograph', 'daguerreotype', 'photographic'],
        'drawings': ['drawing', 'sketch', 'pencil', 'charcoal', 'pastel', 'chalk'],
        'textiles': ['textile', 'tapestry', 'fabric', 'embroidery', 'carpet', 'rug'],
        'ceramics': ['ceramic', 'pottery', 'porcelain', 'earthenware', 'clay'],
        'metalwork': ['metal', 'silver', 'gold', 'bronze', 'iron', 'copper'],
        'glass': ['glass', 'stained glass']
      };

      const terms = mediumTerms[medium] || [medium];
      processed = processed.filter(artwork => {
        const artworkMedium = (artwork.medium || '').toLowerCase();
        const artworkDesc = (artwork.description || '').toLowerCase();
        return terms.some(term => artworkMedium.includes(term) || artworkDesc.includes(term));
      });
    }

    // handle sorting
    if (sortBy && sortBy !== 'relevance') {
      processed.sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return (a.title || '').localeCompare(b.title || '');
          case 'artist':
            return (a.artist || '').localeCompare(b.artist || '');
          case 'date-newest':
            // Try to extract years for sorting
            const yearA = extractYear(a.date);
            const yearB = extractYear(b.date);
            return yearB - yearA;
          case 'date-oldest':
            const yearC = extractYear(a.date);
            const yearD = extractYear(b.date);
            return yearC - yearD;
          default:
            return 0;
        }
      });
    }

    // calculate pagination
    const filteredTotal = processed.length;
    const pageSize = searchResults.pagination.pageSize || 20;
    const totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));
    const currentPage = Math.min(searchParams.page, totalPages);
    
    // display items for current page
    const startIndex = (currentPage - 1) * pageSize;
    const pageItems = processed.slice(startIndex, startIndex + pageSize);

    // update results with pagination
    setProcessedResults({
      ...searchResults,
      artworks: pageItems,
      pagination: {
        ...searchResults.pagination,
        total: filteredTotal,
        totalPages: totalPages,
        page: currentPage,
        hasMore: currentPage < totalPages
      }
    });
  }, [searchResults, searchParams.filters, searchParams.page]);

  // get year from date string
  const extractYear = (dateStr) => {
    if (!dateStr) return 0;
    
    // search for num in date string
    const yearMatch = dateStr.match(/\b(\d{4})\b/);
    if (yearMatch) return parseInt(yearMatch[1], 10);
    
    // try era abbreviations if no 4 digit year is found
    const bceMatch = dateStr.match(/(\d+)\s*(BCE|BC)/i);
    if (bceMatch) return -parseInt(bceMatch[1], 10);
    
    // handle centuries
    const centuryMatch = dateStr.match(/(\d+)(st|nd|rd|th)\s*century/i);
    if (centuryMatch) return parseInt(centuryMatch[1], 10) * 100 - 50; 
    
    return 0; // default 
  };

  // query for featured artworks
  const {
    data: featuredArtworks,
    isLoading: isFeaturedLoading,
    error: featuredError
  } = useQuery({
    queryKey: ['artworks', 'featured', searchParams.filters.excludeXrays],
    queryFn: () => getFeaturedArtworks(10, searchParams.filters.excludeXrays),
    staleTime: 60 * 60 * 1000 // 1 hour
  });

  /**
   * initiate search with given parameters
   */
  const searchArtworks = useCallback((params) => {
    setSearchParams(prevParams => ({
      ...prevParams,
      ...params,
      // reset to page 1 on search term change
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
      page: 1 // Reset to page 1 on filter change
    }));
  }, []);

  /**
   * fetch a single artwork by ID
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
    searchResults: processedResults || searchResults,
    isSearching: isSearching || isRefetchingSearch,
    searchError,
    searchArtworks,
    goToPage,
    updateFilters,
    refetchSearch,
    
    // featured artworks
    featuredArtworks: featuredArtworks || [],
    isFeaturedLoading,
    featuredError,
    
    // single artwork
    fetchArtworkById
  };
}