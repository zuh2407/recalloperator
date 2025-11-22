const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing login...');
        const res = await axios.post('http://localhost:3000/api/auth/login', {
            businessId: 'BID-12345',
            password: 'password123'
        });
        console.log('✅ Login successful!');
        console.log('User:', res.data.user);
        console.log('Token (first 50 chars):', res.data.token.substring(0, 50));

        // Decode the JWT manually to see what's in it
        const tokenParts = res.data.token.split('.');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('\nDecoded JWT payload:', JSON.stringify(payload, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testLogin();
