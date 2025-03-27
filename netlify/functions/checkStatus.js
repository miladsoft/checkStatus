const fetch = require('node-fetch');

exports.handler = async function(event) {
  // Get URL from query parameters
  const url = event.queryStringParameters?.url;

  try {
    if (url) {
      // Check single website
      const startTime = Date.now();
      try {
        const response = await fetch(url);
        const endTime = Date.now();
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            url: url,
            status: response.status,
            responseTime: endTime - startTime,
            isUp: response.ok,
            lastChecked: new Date().toISOString()
          })
        };
      } catch (error) {
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            url: url,
            status: 0,
            responseTime: 0,
            isUp: false,
            lastChecked: new Date().toISOString(),
            error: error.message
          })
        };
      }
    }

    // If no URL provided, check default sites
    const sites = [
      { name: 'Google', url: 'https://google.com' },
      { name: 'GitHub', url: 'https://github.com' }
    ];

    const results = await Promise.all(
      sites.map(async (site) => {
        try {
          const startTime = Date.now();
          const response = await fetch(site.url);
          const endTime = Date.now();
          
          return {
            name: site.name,
            url: site.url,
            status: response.status,
            responseTime: endTime - startTime,
            isUp: response.ok,
            lastChecked: new Date().toISOString()
          };
        } catch (error) {
          return {
            name: site.name,
            url: site.url,
            status: 0,
            responseTime: 0,
            isUp: false,
            lastChecked: new Date().toISOString(),
            error: error.message
          };
        }
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(results)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
