const https = require('https');

// Simple API test function with timeout
function testAPI(url, timeout = 5000) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          success: res.statusCode === 200,
          data: data.length > 200 ? data.substring(0, 200) + '...' : data
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({ status: 'ERROR', success: false, error: err.message });
    });
    
    req.setTimeout(timeout, () => {
      req.destroy();
      resolve({ status: 'TIMEOUT', success: false, error: 'Request timeout' });
    });
  });
}

async function testLiveAPIs() {
  console.log('🌍 TESTING LIVE APIS ON VERCEL\n');
  
  const tests = [
    { name: 'Health Check', url: 'https://you-be-the-champ.vercel.app/api/health' },
    { name: 'Products API', url: 'https://you-be-the-champ.vercel.app/api/products?limit=2' },
    { name: 'Categories API', url: 'https://you-be-the-champ.vercel.app/api/categories' },
    { name: 'Blog API', url: 'https://you-be-the-champ.vercel.app/api/blog?limit=2' },
    { name: 'Settings API', url: 'https://you-be-the-champ.vercel.app/api/settings' }
  ];
  
  for (const test of tests) {
    console.log(`Testing ${test.name}...`);
    const result = await testAPI(test.url);
    
    if (result.success) {
      console.log(`✅ ${test.name}: Status ${result.status}`);
      if (result.data) {
        try {
          const parsed = JSON.parse(result.data);
          if (parsed.success) {
            console.log(`   Response: SUCCESS`);
            if (parsed.data && Array.isArray(parsed.data)) {
              console.log(`   Items: ${parsed.data.length}`);
            }
          } else {
            console.log(`   Response: ${parsed.message || 'Unknown error'}`);
          }
        } catch (e) {
          console.log(`   Response: Invalid JSON`);
        }
      }
    } else {
      console.log(`❌ ${test.name}: ${result.error || 'Failed'}`);
    }
    console.log('');
  }
  
  console.log('🎯 LIVE API TEST COMPLETE');
}

testLiveAPIs().catch(console.error);
