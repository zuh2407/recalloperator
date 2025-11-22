const axios = require('axios');

async function testAPI() {
    try {
        // Test 1: Login
        console.log('Testing login...');
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            businessId: 'BID-12345',
            password: 'password123'
        });
        console.log('✅ Login successful!');
        console.log('Token:', loginRes.data.token.substring(0, 20) + '...');

        const token = loginRes.data.token;

        // Test 2: Get Products
        console.log('\nTesting products API...');
        const productsRes = await axios.get('http://localhost:3000/api/products', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Products API works!');
        console.log('Products count:', productsRes.data.length);

        // Test 3: Get Logs
        console.log('\nTesting logs API...');
        const logsRes = await axios.get('http://localhost:3000/api/logs', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Logs API works!');
        console.log('Logs count:', logsRes.data.length);

        // Test 4: Get Customers
        console.log('\nTesting customers API...');
        const customersRes = await axios.get('http://localhost:3000/api/customers', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Customers API works!');
        console.log('Customers count:', customersRes.data.length);
        console.log('Customers:', customersRes.data.map(c => c.name));

        console.log('\n🎉 All API tests passed!');
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testAPI();
