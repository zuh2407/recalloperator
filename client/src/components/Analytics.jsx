import React from 'react';
import { TrendingUp, Users, AlertOctagon, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon className="w-16 h-16" />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color} bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            {trend && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> {trend}
                </p>
            )}
        </div>
    </div>
);

const Analytics = ({ products, logs, customers }) => {
    const highRiskCount = products.filter(p => p.riskScore >= 8).length;
    const safeCount = products.filter(p => p.riskScore < 4).length;
    const totalActions = logs.filter(l => l.type === 'ACTION_TAKEN').length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Customers"
                    value={customers.length}
                    icon={Users}
                    color="text-blue-500 bg-blue-500"
                    trend="+12% this week"
                />
                <StatCard
                    title="Active Products"
                    value={products.length}
                    icon={CheckCircle}
                    color="text-emerald-500 bg-emerald-500"
                />
                <StatCard
                    title="Critical Risks"
                    value={highRiskCount}
                    icon={AlertOctagon}
                    color="text-rose-500 bg-rose-500"
                />
                <StatCard
                    title="Auto-Actions"
                    value={totalActions}
                    icon={TrendingUp}
                    color="text-indigo-500 bg-indigo-500"
                    trend="AI Active"
                />
            </div>

            {/* Risk Analysis Trend Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Risk Analysis Trend</h3>
                    <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                        Live Product Scores
                    </span>
                </div>
                <div className="h-64 flex items-end space-x-2">
                    {products.slice(0, 12).map((product, i) => {
                        const heightPercent = (product.riskScore / 10) * 100;
                        const isHigh = product.riskScore >= 8;
                        const isMedium = product.riskScore >= 5 && product.riskScore < 8;

                        return (
                            <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                <div
                                    className={`w-full rounded-t-lg transition-all duration-500 ${isHigh
                                            ? 'bg-rose-500 animate-pulse'
                                            : isMedium
                                                ? 'bg-amber-500/70 group-hover:bg-amber-500'
                                                : 'bg-emerald-500/50 group-hover:bg-emerald-500'
                                        }`}
                                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                        {product.name.substring(0, 15)}...<br />
                                        Score: {product.riskScore}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-4 text-xs text-slate-500">
                    <span>Product 1</span>
                    <span>Product 6</span>
                    <span>Product 12</span>
                </div>
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded mr-1"></div>
                        <span className="text-slate-400">Safe (0-4)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-amber-500 rounded mr-1"></div>
                        <span className="text-slate-400">Moderate (5-7)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-rose-500 rounded mr-1"></div>
                        <span className="text-slate-400">Critical (8-10)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
