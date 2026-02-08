
const axios = require('axios');

const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

async function run() {
    try {
        console.log('1. Testing Guest Registration...');
        const timestamp = Date.now();
        const guestUser = {
            name: `Guest User`,
            email: `guest${timestamp}@example.com`,
            password: `Guest@${timestamp}`,
            rePassword: `Guest@${timestamp}`,
            phone: '01012345678'
        };
        console.log('Payload:', guestUser);

        const regRes = await axios.post(`${API_BASE_URL}/auth/signup`, guestUser);
        const token = regRes.data.token;
        if (!token) throw new Error('No token returned');
        console.log('✅ Registration SUCCESS. Token:', token.substring(0, 20) + '...');

        console.log('2. Testing Add to Cart...');
        // Need a valid product ID. Let's fetch one.
        const prodRes = await axios.get(`${API_BASE_URL}/products?limit=1`);
        const productId = prodRes.data.data[0]._id || prodRes.data.data[0].id;
        console.log('Using Product ID:', productId);

        const cartRes = await axios.post(
            `${API_BASE_URL}/cart`,
            { productId },
            { headers: { token: token } } // Testing the 'token' header specifically
        );

        console.log('✅ Add to Cart SUCCESS. Cart ID:', cartRes.data.cartId || cartRes.data.data._id);

        console.log('3. Testing Get Products WITH Token...');
        const productsRes = await axios.get(
            `${API_BASE_URL}/products?limit=1`,
            { headers: { token: token } }
        );
        console.log('✅ Get Products WITH Token SUCCESS. Count:', productsRes.data.metadata.limit);

    } catch (error) {
        console.error('❌ FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

run();
