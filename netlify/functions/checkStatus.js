const fetch = require('node-fetch');

exports.handler = async function(event) {
  const sites = [
    { name: 'Google', url: 'https://google.com' },
    { name: 'GitHub', url: 'https://github.com' }
  ];

  try {
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
