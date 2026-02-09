const axios = require('axios');

const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

async function testPublicAccess() {
    console.log('--- Testing Public API Access ---');

    // 1. Test Products WITHOUT Token
    try {
        console.log('\n1. Fetching Products WITHOUT Token...');
        const res = await axios.get(`${API_BASE_URL}/products?limit=1`);
        console.log('✅ Success! Status:', res.status);
        console.log('   Count:', res.data.metadata?.limit || res.data.results);
    } catch (error) {
        console.error('❌ Failed without token.');
        console.error('   Status:', error.response?.status);
        console.error('   Message:', error.response?.data?.message || error.message);
    }

    // 2. Test Categories WITHOUT Token
    try {
        console.log('\n2. Fetching Categories WITHOUT Token...');
        const res = await axios.get(`${API_BASE_URL}/categories?limit=1`);
        console.log('✅ Success! Status:', res.status);
    } catch (error) {
        console.error('❌ Failed categories without token.');
        console.error('   Status:', error.response?.status);
    }
}

testPublicAccess();
