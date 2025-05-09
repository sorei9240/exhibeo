import * as metMuseum from './metMuseum';
import * as harvardArt from './harvardArt';

/**
 * @param {Object} params 
 * @param {string} params.searchTerm 
 * @param {number} params.page 
 * @param {number} params.pageSize 
 * @param {Array<string>} params.sources 
 * @param {Object} params.filters
 * @returns {Promise<Object>}
 */
export const searchAllCollections = async ({ 
  searchTerm, 
  page = 1, 
  pageSize = 20, 
  sources = ['all'],
  filters = {}
}) => {
  try {
    const searchPromises = [];
    const includeAll = sources.includes('all');
    
    // handle X-ray exclusion from filters
    const excludeXrays = filters.excludeXrays !== false; // Default to true if not specified
    
    // add met if requested
    if (includeAll || sources.includes('metropolitan')) {
      searchPromises.push(metMuseum.searchArtworks({ 
        searchTerm, 
        page, 
        pageSize,
        excludeXrays
      }));
    }
    
    // add harvard art if requested
    if (includeAll || sources.includes('harvard')) {
      searchPromises.push(harvardArt.searchArtworks({ 
        searchTerm, 
        page, 
        pageSize,
        excludeXrays 
      }));
    }
    
    const results = await Promise.allSettled(searchPromises);
    const searchResults = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    
    if (searchResults.length === 0) {
      throw new Error('Failed to search any collections');
    }
    
    const combinedArtworks = searchResults.flatMap(result => result.artworks);
    
    // calculate total for pagination
    const maxTotal = Math.max(...searchResults.map(result => result.pagination.total));
    
    return {
      artworks: combinedArtworks,
      pagination: {
        total: maxTotal,
        page,
        pageSize,
        totalPages: Math.ceil(maxTotal / pageSize),
        hasMore: page * pageSize < maxTotal
      },
      sources: searchResults.map(result => result.source)
    };
  } catch (error) {
    console.error('Error searching all collections:', error);
    throw new Error('Failed to search art collections');
  }
};

/**
 * @param {string|number} id 
 * @param {string} source 
 * @returns {Promise<Object|null>}
 */
export const getArtworkById = async (id, source) => {
  switch (source) {
    case 'metropolitan':
      return metMuseum.getArtworkById(id);
    case 'harvard':
      return harvardArt.getArtworkById(id);
    default:
      throw new Error(`Unknown artwork source: ${source}`);
  }
};

/**
 * @param {number} limit
 * @param {boolean} excludeXrays
 * @returns {Promise<Array>}
 */
export const getFeaturedArtworks = async (limit = 10, excludeXrays = true) => {
  try {
    // split between sources
    const perSourceLimit = Math.ceil(limit / 2);
    
    // get artwork from both
    const [metArtworks, harvardArtworks] = await Promise.all([
      metMuseum.getFeaturedArtworks(perSourceLimit, excludeXrays),
      harvardArt.getFeaturedArtworks(perSourceLimit, excludeXrays)
    ]);
    
    // sombine and shuffle
    const combined = [...metArtworks, ...harvardArtworks];
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    
    // return amount requested
    return combined.slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured artworks:', error);
    return [];
  }
};

export { metMuseum, harvardArt };