import axios from 'axios';
import { MET_API, encodeSearchParams } from './config';

/**
 * search met collection
 * @param {Object} params 
 * @param {string} params.searchTerm 
 * @param {number} params.page 
 * @param {number} params.pageSize 
 * @param {string} params.departmentId 
 * @param {boolean} params.excludeXrays 
 * @returns {Promise<Object>}
 */
export const searchArtworks = async ({ 
  searchTerm, 
  page = 1, 
  pageSize = 20, 
  departmentId = null,
  excludeXrays = true 
}) => {
  try {
    // offset for pagination
    const offset = (page - 1) * pageSize;
    
    // modify search term to exclude X-rays if needed
    let queryTerm = searchTerm;
    if (excludeXrays) {
      // add exclusions for X-ray related terms
      queryTerm = `${searchTerm} -xray -"x ray" -"x-ray" -radiograph`;
    }
    
    const params = {
      q: queryTerm,
      limit: pageSize,
    };
    
    // department filter
    if (departmentId) {
      params.departmentId = departmentId;
    }
    
    const searchUrl = `${MET_API.baseUrl}${MET_API.searchEndpoint}?${encodeSearchParams(params)}`;
    const { data } = await axios.get(searchUrl);
    
    // return results w/ pagination
    const totalResults = data.total || 0;
    const objectIDs = data.objectIDs || [];
    
    // get current page
    const paginatedIDs = objectIDs.slice(offset, offset + pageSize);
    
    // fetch info for artwork on page
    const artworks = await Promise.all(
      paginatedIDs.map(id => getArtworkById(id, excludeXrays))
    );
    
    // filter out nulls and x-rays
    const validArtworks = artworks.filter(artwork => artwork !== null);
    
    return {
      artworks: validArtworks,
      pagination: {
        total: totalResults,
        page,
        pageSize,
        totalPages: Math.ceil(totalResults / pageSize),
        hasMore: offset + pageSize < totalResults
      },
      source: 'metropolitan'
    };
  } catch (error) {
    console.error('Error searching Met Museum artworks:', error);
    throw new Error('Failed to search Metropolitan Museum artworks');
  }
};

/**
 * get info about a specific work
 * @param {number} id 
 * @param {boolean} excludeXrays 
 * @returns {Promise<Object|null>} 
 */
export const getArtworkById = async (id, excludeXrays = true) => {
  try {
    const { data } = await axios.get(`${MET_API.baseUrl}${MET_API.objectEndpoint}/${id}`);
    
    // exclude results w no image
    if (!data.primaryImage) {
      return null;
    }
    
    // x-ray exclusion check
    if (excludeXrays) {
      const title = (data.title || '').toLowerCase();
      const description = (data.objectName || '').toLowerCase();
      const xrayTerms = ['x-ray', 'xray', 'radiograph', 'radiography', 'x ray'];
      
      if (xrayTerms.some(term => title.includes(term) || description.includes(term))) {
        return null;
      }
    }
    
    // convert API results to standard format
    return {
      id: data.objectID,
      title: data.title,
      artist: data.artistDisplayName,
      date: data.objectDate,
      medium: data.medium,
      dimensions: data.dimensions,
      department: data.department,
      culture: data.culture,
      imageUrl: data.primaryImage,
      thumbnailUrl: data.primaryImageSmall,
      objectUrl: data.objectURL,
      provenance: data.creditLine,
      description: data.objectDescription || data.objectName,
      source: 'metropolitan'
    };
  } catch (error) {
    console.error(`Error fetching Met Museum artwork with ID ${id}:`, error);
    return null;
  }
};

/**
 * get from met
 * @returns {Promise<Array>}
 */
export const getDepartments = async () => {
  try {
    const { data } = await axios.get(`${MET_API.baseUrl}/departments`);
    return data.departments;
  } catch (error) {
    console.error('Error fetching Met Museum departments:', error);
    return [];
  }
};

/**
 * add a list of featured works
 * @param {number} limit 
 * @param {boolean} excludeXrays
 * @returns {Promise<Array>}
 */
export const getFeaturedArtworks = async (limit = 10, excludeXrays = true) => {
  try {
    // add some popular artwork
    const featuredIds = [
      436535, // Van Gogh - Wheat Field with Cypresses
      436524, // Monet - Garden at Sainte-Adresse
      438722, // Van Gogh - Irises
      45734,  // Monet - Water Lilies
      10416,  // Botticelli - Last Communion of St. Jerome
      11417,  // Bruegel - The Harvesters
      437133, // Seurat - A Sunday on La Grande Jatte
      435809, // Rembrandt - Self-Portrait
      437527, // Georges de La Tour - The Fortune Teller
      459106  // Cézanne - Mont Sainte-Victoire
    ];
    
    // get details
    const artworks = await Promise.all(
      featuredIds.slice(0, limit).map(id => getArtworkById(id, excludeXrays))
    );
    
    // filter out nulls
    return artworks.filter(artwork => artwork !== null);
  } catch (error) {
    console.error('Error fetching Met Museum featured artworks:', error);
    return [];
  }
};