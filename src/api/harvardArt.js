/**
 * Harvard Art Museums API Integration
 */
import axios from 'axios';
import { HARVARD_API, encodeSearchParams } from './config';

/**
 * @param {Object} params
 * @param {string} params.searchTerm
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {string} params.classification
 * @returns {Promise<Object>}
 */
export const searchArtworks = async ({ searchTerm, page = 1, pageSize = 20, classification = null }) => {
  try {
    const params = {
      apikey: HARVARD_API.apiKey,
      q: searchTerm,
      page: page,
      size: pageSize,
      hasimage: 1, // is an image
      sort: 'rank', // sort by relevance
      sortorder: 'desc'
    };
    
    // add classification filter
    if (classification) {
      params.classification = classification;
    }
    
    // make search request
    const searchUrl = `${HARVARD_API.baseUrl}${HARVARD_API.objectEndpoint}?${encodeSearchParams(params)}`;
    const { data } = await axios.get(searchUrl);
    // process results
    const artworks = data.records.map(transformHarvardArtwork);
    
    return {
      artworks,
      pagination: {
        total: data.info.totalrecords,
        page: data.info.page,
        pageSize: data.info.size,
        totalPages: Math.ceil(data.info.totalrecords / data.info.size),
        hasMore: data.info.page < Math.ceil(data.info.totalrecords / data.info.size)
      },
      source: 'harvard'
    };
  } catch (error) {
    console.error('Error searching Harvard Art Museums:', error);
    throw new Error('Failed to search Harvard Art Museums');
  }
};

/**
 * @param {number} id 
 * @returns {Promise<Object|null>} 
 */
export const getArtworkById = async (id) => {
  try {
    const { data } = await axios.get(`${HARVARD_API.baseUrl}${HARVARD_API.objectEndpoint}/${id}?apikey=${HARVARD_API.apiKey}`);
    return transformHarvardArtwork(data);
  } catch (error) {
    console.error(`Error fetching Harvard artwork with ID ${id}:`, error);
    return null;
  }
};

/**
 * @param {Object} data 
 * @returns {Object}
 */
const transformHarvardArtwork = (data) => {
  // get best image
  const imageUrl = data.primaryimageurl || 
                   (data.images && data.images.length > 0 ? data.images[0].baseimageurl : null);
  
  // handle thumbnails
  const thumbnailUrl = imageUrl ? `${imageUrl}?height=400` : null;
  
  return {
    id: data.id,
    title: data.title || 'Untitled',
    artist: data.people && data.people.length > 0 
      ? data.people[0].displayname 
      : 'Unknown Artist',
    date: data.dated || 'Unknown Date',
    medium: data.medium || data.technique || '',
    dimensions: data.dimensions,
    department: data.department,
    culture: data.culture,
    imageUrl: imageUrl,
    thumbnailUrl: thumbnailUrl,
    objectUrl: data.url,
    provenance: data.provenance || data.creditline || '',
    description: data.description || data.classification || '',
    source: 'harvard'
  };
};

/**
 * @returns {Promise<Array>}
 */
export const getClassifications = async () => {
  try {
    const { data } = await axios.get(`${HARVARD_API.baseUrl}/classification?apikey=${HARVARD_API.apiKey}&size=100`);
    return data.records;
  } catch (error) {
    console.error('Error fetching Harvard Art Museums classifications:', error);
    return [];
  }
};

/**
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export const getFeaturedArtworks = async (limit = 10) => {
  try {
    const params = {
      apikey: HARVARD_API.apiKey,
      size: limit,
      hasimage: 1,
      sort: 'totalpageviews', // sort by popularity
      sortorder: 'desc',
      fields: 'id,title,people,dated,images,primaryimageurl,url,medium,technique,dimensions,department,culture,provenance,creditline,description,classification'
    };
    
    const { data } = await axios.get(`${HARVARD_API.baseUrl}${HARVARD_API.objectEndpoint}?${encodeSearchParams(params)}`);
    
    return data.records.map(transformHarvardArtwork);
  } catch (error) {
    console.error('Error fetching Harvard Art Museums featured artworks:', error);
    return [];
  }
};