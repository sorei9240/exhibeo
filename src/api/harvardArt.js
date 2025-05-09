import axios from 'axios';

const isProduction = import.meta.env.PROD;

// use proxy in production
const baseUrl = isProduction 
  ? '/.netlify/functions/harvard-api'
  : 'https://api.harvardartmuseums.org';

// Development mode API key
const devApiKey = import.meta.env.VITE_HARVARD_API_KEY;

/**
 * @param {Object} params
 * @param {string} params.searchTerm
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {string} params.classification
 * @param {boolean} params.excludeXrays
 * @returns {Promise<Object>}
 */
export const searchArtworks = async ({ 
  searchTerm, 
  page = 1, 
  pageSize = 20, 
  classification = null,
  excludeXrays = true 
}) => {
  try {
    const params = {
      q: searchTerm,
      page: page,
      size: pageSize,
      hasimage: 1, // is an image
      sort: 'rank', // sort by relevance
      sortorder: 'desc'
    };
    
    // AAPI for development
    if (!isProduction) {
      params.apikey = devApiKey;
    }
    
    // classification filter
    if (classification) {
      params.classification = classification;
    }
    
    // x-ray exclusion if enabled
    if (excludeXrays) {
      params.excludeterm = 'x-ray,xray,radiograph';
    }
    
    // set up request based on env
    let searchUrl;
    let requestConfig = {};
    
    if (isProduction) {
      // use netlify func for prod
      searchUrl = baseUrl;
      requestConfig = { 
        params: {
          ...params,
          endpoint: '/object'
        }
      };
    } else {
      // API access for dev
      searchUrl = `${baseUrl}/object`;
      requestConfig = { params };
    }
    
    // Make the request
    const { data } = await axios.get(searchUrl, requestConfig);
    
    // process results
    const artworks = data.records.map(transformHarvardArtwork);
    
    // more x-ray filtering
    let filteredArtworks = artworks;
    if (excludeXrays) {
      const xrayTerms = ['x-ray', 'xray', 'radiograph', 'radiography', 'x ray'];
      filteredArtworks = artworks.filter(artwork => {
        const lowerTitle = (artwork.title || '').toLowerCase();
        const lowerDesc = (artwork.description || '').toLowerCase();
        return !xrayTerms.some(term => lowerTitle.includes(term) || lowerDesc.includes(term));
      });
    }
    
    return {
      artworks: filteredArtworks,
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
    let requestUrl;
    let requestConfig = {};
    
    if (isProduction) {
      // netlify func for production
      requestUrl = baseUrl;
      requestConfig = { 
        params: {
          endpoint: `/object/${id}`
        }
      };
    } else {
      // API for dev
      requestUrl = `${baseUrl}/object/${id}`;
      requestConfig = { 
        params: {
          apikey: devApiKey
        }
      };
    }
    
    const { data } = await axios.get(requestUrl, requestConfig);
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
    let requestUrl;
    let requestConfig = {};
    
    if (isProduction) {
      // use netlify func for production
      requestUrl = baseUrl;
      requestConfig = { 
        params: {
          endpoint: '/classification',
          size: 100
        }
      };
    } else {
      // API for dev
      requestUrl = `${baseUrl}/classification`;
      requestConfig = { 
        params: {
          apikey: devApiKey,
          size: 100
        }
      };
    }
    
    const { data } = await axios.get(requestUrl, requestConfig);
    return data.records;
  } catch (error) {
    console.error('Error fetching Harvard Art Museums classifications:', error);
    return [];
  }
};

/**
 * @param {number} limit
 * @param {boolean} excludeXrays
 * @returns {Promise<Array>}
 */
export const getFeaturedArtworks = async (limit = 10, excludeXrays = true) => {
  try {
    const params = {
      size: limit * 2, 
      hasimage: 1,
      sort: 'totalpageviews', // sort by popularity
      sortorder: 'desc',
      fields: 'id,title,people,dated,images,primaryimageurl,url,medium,technique,dimensions,department,culture,provenance,creditline,description,classification'
    };
    
    if (!isProduction) {
      params.apikey = devApiKey;
    }
    
    // x-ray exclusion when enabled 
    if (excludeXrays) {
      params.excludeterm = 'x-ray,xray,radiograph';
    }
    
    let requestUrl;
    let requestConfig = {};
    
    if (isProduction) {
      // netlify func for production
      requestUrl = baseUrl;
      requestConfig = { 
        params: {
          ...params,
          endpoint: '/object'
        }
      };
    } else {
      // direct API for dev
      requestUrl = `${baseUrl}/object`;
      requestConfig = { params };
    }
    
    const { data } = await axios.get(requestUrl, requestConfig);
    
    let artworks = data.records.map(transformHarvardArtwork);
    
    // additional x-ray filters
    if (excludeXrays) {
      const xrayTerms = ['x-ray', 'xray', 'radiograph', 'radiography', 'x ray'];
      artworks = artworks.filter(artwork => {
        const lowerTitle = (artwork.title || '').toLowerCase();
        const lowerDesc = (artwork.description || '').toLowerCase();
        return !xrayTerms.some(term => lowerTitle.includes(term) || lowerDesc.includes(term));
      });
    }
    
    return artworks.slice(0, limit);
  } catch (error) {
    console.error('Error fetching Harvard Art Museums featured artworks:', error);
    return [];
  }
};