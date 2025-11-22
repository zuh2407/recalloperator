// In-memory database with Multi-tenancy and Supply Chain

// Business Users
const users = [
  { id: 'u1', businessId: 'BID-12345', password: 'password123', name: 'ZuhairStore' },
  { id: 'u2', businessId: 'BID-99999', password: 'password123', name: 'Other Store' }
];

// Supply Chain / Manufacturing Data
const supplyChain = [
  {
    id: 'sc1',
    productId: 'p1',
    manufacturer: 'Fresh Farms Inc',
    batchNumber: 'SP-2024-001',
    productionDate: '2024-11-15',
    expiryDate: '2024-11-25',
    warehouse: 'Warehouse A - Cold Storage',
    temperature: '4°C',
    contaminationRisk: 'Low',
    certifications: ['Organic', 'FDA Approved']
  },
  {
    id: 'sc2',
    productId: 'p2',
    manufacturer: 'Dairy Delights Co',
    batchNumber: 'AM-2024-045',
    productionDate: '2024-11-18',
    expiryDate: '2024-12-18',
    warehouse: 'Warehouse B - Refrigerated',
    temperature: '2°C',
    contaminationRisk: 'Low',
    certifications: ['Non-GMO', 'Vegan']
  },
  {
    id: 'sc3',
    productId: 'p3',
    manufacturer: 'Happy Hens Farm',
    batchNumber: 'EG-2024-112',
    productionDate: '2024-11-20',
    expiryDate: '2024-12-05',
    warehouse: 'Warehouse A - Cold Storage',
    temperature: '3°C',
    contaminationRisk: 'Medium',
    certifications: ['Free-Range', 'Cage-Free']
  },
  {
    id: 'sc5',
    productId: 'p5',
    manufacturer: 'Frozen Foods Ltd',
    batchNumber: 'CN-2024-331',
    productionDate: '2024-10-01',
    expiryDate: '2025-10-01',
    warehouse: 'Warehouse C - Deep Freeze',
    temperature: '-18°C',
    contaminationRisk: 'High', // Potential contamination detected
    certifications: ['HACCP', 'ISO 22000']
  }
];

// Products (Linked to Business ID and Supply Chain)
const products = [
  {
    id: 'p1',
    businessId: 'BID-12345',
    name: 'Organic Baby Spinach',
    batchId: 'SP-2024-001',
    riskScore: 2,
    status: 'Safe',
    category: 'Produce',
    price: 4.99,
    stock: 150
  },
  {
    id: 'p2',
    businessId: 'BID-12345',
    name: 'Premium Almond Milk',
    batchId: 'AM-2024-045',
    riskScore: 1,
    status: 'Safe',
    category: 'Dairy',
    price: 5.99,
    stock: 200
  },
  {
    id: 'p3',
    businessId: 'BID-12345',
    name: 'Free-Range Eggs (12ct)',
    batchId: 'EG-2024-112',
    riskScore: 3,
    status: 'Safe',
    category: 'Dairy',
    price: 6.99,
    stock: 100
  },
  {
    id: 'p4',
    businessId: 'BID-12345',
    name: 'Spicy Hummus',
    batchId: 'HM-2024-882',
    riskScore: 0,
    status: 'Safe',
    category: 'Dips',
    price: 3.99,
    stock: 80
  },
  {
    id: 'p5',
    businessId: 'BID-12345',
    name: 'Frozen Chicken Nuggets',
    batchId: 'CN-2024-331',
    riskScore: 4,
    status: 'Safe',
    category: 'Frozen',
    price: 8.99,
    stock: 120
  },
  {
    id: 'p6',
    businessId: 'BID-12345',
    name: 'Artisan Sourdough Bread',
    batchId: 'SB-2024-099',
    riskScore: 1,
    status: 'Safe',
    category: 'Bakery',
    price: 7.99,
    stock: 60
  }
];

// Customers (Linked to Business ID)
const customers = [
  {
    id: 'c1',
    businessId: 'BID-12345',
    name: 'Zuhair Atham',
    email: 'mail-zuhair2407atham@gmail.com',
    phone: '+15550199',
    purchasedProducts: ['p1', 'p3', 'p5']
  },
  {
    id: 'c2',
    businessId: 'BID-12345',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    phone: '+15550200',
    purchasedProducts: ['p2', 'p6']
  },
  {
    id: 'c3',
    businessId: 'BID-12345',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+15550201',
    purchasedProducts: ['p1', 'p4']
  }
];

const logs = [];

module.exports = {
  products,
  customers,
  users,
  logs,
  supplyChain
};
