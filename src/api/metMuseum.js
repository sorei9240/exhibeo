import axios from 'axios';
import { MET_API, encodeSearchParams } from './config';

/**
 * search met collection
 * @param {Object} params 
 * @param {string} params.searchTerm 
 * @param {number} params.page 
 * @param {number} params.pageSize 
 * @param {string} params.departmentId 
 * @returns {Promise<Object>}
 */
export const searchArtworks = async ({ searchTerm, page = 1, pageSize = 20, departmentId = null }) => {
  try {
    // offset for pagination
    const offset = (page - 1) * pageSize;
    const params = {
      q: searchTerm,
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
      paginatedIDs.map(id => getArtworkById(id))
    );
    
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
 * @returns {Promise<Object|null>} 
 */
export const getArtworkById = async (id) => {
  try {
    const { data } = await axios.get(`${MET_API.baseUrl}${MET_API.objectEndpoint}/${id}`);
    
    // exclude results with no image
    if (!data.primaryImage) {
      return null;
    }
    
    // convert api results to a standard format
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
 * @returns {Promise<Array>}
 */
export const getFeaturedArtworks = async (limit = 10) => {
  try {
    // add some popular artwork
    const featuredIds = [
      436535, 
      436524,
      438722, 
      45734,
      10416,
      11417,
      437133,
      435809,
      437527,
      459106
    ];
    
    // get details
    const artworks = await Promise.all(
      featuredIds.slice(0, limit).map(id => getArtworkById(id))
    );
    
    // filter out nulls
    return artworks.filter(artwork => artwork !== null);
  } catch (error) {
    console.error('Error fetching Met Museum featured artworks:', error);
    return [];
  }
};