const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Get API_URL from environment variable or default to localhost
const API_URL = process.env.API_URL || 'http://localhost:3000'; 

async function sync() {
    try {
        console.log('Reading local product data...');
        const dataPath = path.join(__dirname, '../src/data/productsData.js');
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        
        const jsonString = fileContent.replace('export const productsData = ', '').replace(/;$/, '');
        const allProducts = JSON.parse(jsonString);

        console.log(`Found ${allProducts.length} products. Starting batch sync...`);

        const BATCH_SIZE = 50;
        let totalCreated = 0;
        let totalErrors = 0;

        for (let i = 0; i < allProducts.length; i += BATCH_SIZE) {
            const batch = allProducts.slice(i, i + BATCH_SIZE);
            console.log(`Sending batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} products)...`);

            try {
                const response = await axios.post(`${API_URL}/api/products/import`, {
                    products: batch
                }, {
                    timeout: 60000 // 60 seconds timeout
                });

                if (response.data.success) {
                    totalCreated += response.data.summary.created;
                    console.log(`  ✅ Batch finished. Total synced so far: ${totalCreated}`);
                }
            } catch (err) {
                totalErrors++;
                console.error(`  ❌ Error in batch ${Math.floor(i / BATCH_SIZE) + 1}:`, err.response?.data?.message || err.message);
            }
        }

        console.log('\n--- Sync Finished ---');
        console.log(`Successfully processed products. Check your dashboard at ${API_URL}`);
        
    } catch (error) {
        console.error('❌ Critical Error:', error.message);
    }
}

sync();
