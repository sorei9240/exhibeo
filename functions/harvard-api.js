// functions/harvard-api.js
const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { endpoint, ...params } = event.queryStringParameters || {};
  
  if (!endpoint) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing endpoint parameter' }) };
  }

  const apiKey = process.env.HARVARD_API_KEY;
  
  try {
    const baseUrl = 'https://api.harvardartmuseums.org';
    const url = `${baseUrl}${endpoint}`;
    
    // add API key to the parameters
    const requestParams = { ...params, apikey: apiKey };
    
    // make request to Harvard API
    const response = await axios.get(url, { params: requestParams });
    
    // return data from the API
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 5 minute cache
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Harvard API proxy error:', error);
    
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: 'Error fetching data from Harvard API',
        details: error.response?.data || error.message
      })
    };
  }
}