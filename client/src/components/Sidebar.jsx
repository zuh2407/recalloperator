import React from 'react';
import { LayoutDashboard, AlertTriangle, Users, UserPlus, ShieldCheck, Factory } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onRegister }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'risks', label: 'Risk Monitor', icon: AlertTriangle },
        { id: 'supply-chain', label: 'Supply Chain', icon: Factory },
        { id: 'customers', label: 'Customer Registry', icon: Users },
    ];

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-tight">Safety AI</h1>
                    <p className="text-xs text-slate-400">Autonomous Protection</p>
                </div>
            </div>

            {/* Info Box */}
            <div className="px-6 py-4">
                <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-xl p-4 border border-indigo-500/30">
                    <p className="text-xs text-indigo-300 uppercase tracking-wider mb-1">Demo Instance</p>
                    <p className="text-sm font-medium text-white">ZuhairStore</p>
                    <p className="text-xs text-indigo-400">BID-12345</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Register Button */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={onRegister}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                    <UserPlus className="w-5 h-5" />
                    <span>Register Business</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
