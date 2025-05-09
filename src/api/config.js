// Metropolitan Museum of Art API
export const MET_API = {
  baseUrl: 'https://collectionapi.metmuseum.org/public/collection/v1',
  searchEndpoint: '/search',
  objectEndpoint: '/objects'
};

// Harvard Art Museums API
const harvardApiKey = import.meta.env.VITE_HARVARD_API_KEY;

// check if API exists
if (!harvardApiKey) {
  console.error('Harvard API key is missing!');
}

export const HARVARD_API = {
  baseUrl: 'https://api.harvardartmuseums.org',
  objectEndpoint: '/object',
  apiKey: harvardApiKey || 'missing_api_key' 
};

// encode URI components
export const encodeSearchParams = (params) => {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    })
    .join('&');
};