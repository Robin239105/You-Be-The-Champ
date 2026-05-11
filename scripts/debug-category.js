const https = require('https');

function quickTest(url, callback) {
  const req = https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          callback(null, JSON.parse(data));
        } catch (e) {
          callback(e, null);
        }
      } else {
        callback(new Error(`HTTP ${res.statusCode}`), null);
      }
    });
  });
  
  req.on('error', callback);
  req.setTimeout(3000, () => {
    req.destroy();
    callback(new Error('Timeout'), null);
  });
}

async function debugCategory() {
  console.log('🔍 Debugging Category Products...\n');
  
  // Test 1: Get all products
  quickTest('https://you-be-the-champ.vercel.app/api/products?limit=10', (err, data) => {
    if (err) {
      console.log('❌ Products API failed:', err.message);
      return;
    }
    
    console.log('✅ Products API working');
    console.log('Sample products:');
    
    data.data.slice(0, 3).forEach((product, i) => {
      console.log(`\nProduct ${i+1}: ${product.name}`);
      console.log('Categories:');
      if (product.categories) {
        product.categories.forEach(cat => {
          const name = typeof cat === 'object' ? cat.name : cat;
          console.log(`  - ${name}`);
        });
      } else {
        console.log('  - No categories');
      }
    });
    
    // Test 2: Check for New York products
    const nyProducts = data.data.filter(p => {
      if (!p.categories) return false;
      return p.categories.some(cat => {
        const name = typeof cat === 'object' ? cat.name : cat;
        return name && name.toLowerCase().includes('new york');
      });
    });
    
    console.log(`\n🏙️ Products with 'New York' in categories: ${nyProducts.length}`);
    
    if (nyProducts.length > 0) {
      nyProducts.forEach(p => {
        console.log(`  - ${p.name}`);
        p.categories.forEach(cat => {
          const name = typeof cat === 'object' ? cat.name : cat;
          if (name.includes('New York')) console.log(`    → ${name}`);
        });
      });
    }
    
    // Test 3: Check exact category match
    const exactMatch = data.data.filter(p => {
      if (!p.categories) return false;
      return p.categories.some(cat => {
        const name = typeof cat === 'object' ? cat.name : cat;
        return name === 'Your City > New York City Pro Teams';
      });
    });
    
    console.log(`\n🎯 Exact category matches: ${exactMatch.length}`);
    
    if (exactMatch.length === 0) {
      console.log('⚠️ No products found with exact category name!');
      console.log('This explains why the category page shows no products.');
    }
  });
}

debugCategory();
