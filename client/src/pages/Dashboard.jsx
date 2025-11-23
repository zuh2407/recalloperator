import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserPlus, X, Activity, Pause, Play, Store } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Analytics from '../components/Analytics';
import RiskMonitor from '../components/RiskMonitor';
import CustomerRegistry from '../components/CustomerRegistry';
import ActivityLog from '../components/ActivityLog';
import SupplyChain from '../components/SupplyChain';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [allProducts, setAllProducts] = useState([]);
    const [allLogs, setAllLogs] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [registerForm, setRegisterForm] = useState({ businessId: '', password: '', name: '' });
    const [agentRunning, setAgentRunning] = useState(false);

    const fetchData = async () => {
        try {
            const [prodRes, logRes, custRes, agentRes] = await Promise.all([
                axios.get('/api/products?businessId=all'),
                axios.get('/api/logs?businessId=all'),
                axios.get('/api/customers?businessId=all'),
                axios.get('/api/agent/status')
            ]);

            setAllProducts(prodRes.data);
            setAllLogs(logRes.data);
            setAllCustomers(custRes.data);
            setAgentRunning(agentRes.data.isRunning);

            // Extract unique stores
            const uniqueStores = [...new Set(prodRes.data.map(p => p.businessId))];

            // Fetch business names
            const storeList = await Promise.all(
                uniqueStores.map(async (bid) => {
                    try {
                        const userRes = await axios.get(`/api/auth/business/${bid}`);
                        return { businessId: bid, name: userRes.data.name };
                    } catch (error) {
                        return { businessId: bid, name: bid };
                    }
                })
            );

            setStores(storeList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        if (!agentRunning) {
            const interval = setInterval(fetchData, 2000); // Poll data every 2 seconds
            return () => clearInterval(interval);
        }
    }, [agentRunning]);

    useEffect(() => {
        let agentInterval;
        if (agentRunning) {
            agentInterval = setInterval(async () => {
                try {
                    // Send current products state to server for processing (Stateless Vercel fix)
                    const res = await axios.post('/api/agent/tick', { products: allProducts });

                    if (res.data.products) {
                        setAllProducts(res.data.products);
                    }
                    if (res.data.logs && res.data.logs.length > 0) {
                        setAllLogs(prev => [...prev, ...res.data.logs]);
                    }
                } catch (error) {
                    console.error('Agent tick failed:', error);
                }
            }, 3000); // Trigger every 3 seconds
        }
        return () => {
            if (agentInterval) clearInterval(agentInterval);
        };
    }, [agentRunning, allProducts]);

    const products = selectedStore === 'all' ? allProducts : allProducts.filter(p => p.businessId === selectedStore);
    const logs = selectedStore === 'all' ? allLogs : allLogs.filter(l => l.businessId === selectedStore);
    const customers = selectedStore === 'all' ? allCustomers : allCustomers.filter(c => c.businessId === selectedStore);

    const toggleMonitoring = async () => {
        try {
            if (agentRunning) {
                await axios.post('/api/agent/stop');
                setAgentRunning(false);
                setAllLogs([]); // Clear logs on stop
            } else {
                await axios.post('/api/agent/start');
                setAgentRunning(true);
            }
        } catch (error) {
            console.error('Failed to toggle monitoring:', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/register', registerForm);
            alert(`Registration successful! ${response.data.productsCreated} products created for ${registerForm.name}.`);
            setShowRegisterModal(false);
            setRegisterForm({ businessId: '', password: '', name: '' });
            fetchData();
        } catch (error) {
            alert('Registration failed: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-950">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading Safety AI System...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onRegister={() => setShowRegisterModal(true)} />

            <div className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white capitalize flex items-center">
                            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                                {activeTab.replace('-', ' ')}
                            </span>
                        </h2>
                        <div className="flex items-center space-x-3 mt-1">
                            <p className="text-slate-400 text-sm">🤖 Autonomous Safety Monitoring</p>
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${agentRunning ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
                                }`}>
                                <Activity className={`w-3 h-3 ${agentRunning ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
                                <span className={`text-xs font-medium ${agentRunning ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {agentRunning ? 'AI ACTIVE' : 'AI STOPPED'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Premium Store Selector */}
                        <div className="relative">
                            <div className="flex items-center space-x-2 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 shadow-lg hover:border-indigo-500/50 transition-all">
                                <Store className="w-4 h-4 text-indigo-400" />
                                <select
                                    value={selectedStore}
                                    onChange={(e) => setSelectedStore(e.target.value)}
                                    className="bg-transparent text-white text-sm font-medium outline-none cursor-pointer pr-8"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23818cf8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundSize: '1.25rem'
                                    }}
                                >
                                    <option value="all" className="bg-slate-900 text-white py-2">
                                        🌐 All Stores ({stores.length})
                                    </option>
                                    {stores.map(store => (
                                        <option key={store.businessId} value={store.businessId} className="bg-slate-900 text-white py-2">
                                            🏪 {store.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={toggleMonitoring}
                            className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-lg ${agentRunning
                                ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:from-rose-500 hover:to-rose-400'
                                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400'
                                }`}
                        >
                            {agentRunning ? (
                                <>
                                    <Pause className="w-4 h-4 mr-2" />
                                    Stop Monitoring
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Start Monitoring
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === 'overview' && (
                            <>
                                <Analytics products={products} logs={logs} customers={customers} />
                                <RiskMonitor products={products} />
                            </>
                        )}

                        {activeTab === 'risks' && <RiskMonitor products={products} />}
                        {activeTab === 'supply-chain' && <SupplyChain businessId={selectedStore} />}
                        {activeTab === 'customers' && <CustomerRegistry customers={customers} fetchCustomers={fetchData} businessId={selectedStore} />}
                    </div>

                    <div className="lg:col-span-1">
                        <ActivityLog logs={logs} />
                    </div>
                </div>
            </div>

            {showRegisterModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-8 relative">
                        <button onClick={() => setShowRegisterModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserPlus className="w-8 h-8 text-indigo-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Register Your Store</h3>
                            <p className="text-slate-400 text-sm">Join the AI Safety Network</p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Store Name</label>
                                <input
                                    type="text"
                                    value={registerForm.name}
                                    onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="SuperMart"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Business ID</label>
                                <input
                                    type="text"
                                    value={registerForm.businessId}
                                    onChange={e => setRegisterForm({ ...registerForm, businessId: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="BID-XXXXX"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={registerForm.password}
                                    onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition mt-6"
                            >
                                Join AI Safety Network
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
