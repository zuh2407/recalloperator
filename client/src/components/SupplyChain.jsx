import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Factory, AlertTriangle, CheckCircle, Package, Thermometer } from 'lucide-react';

const SupplyChain = ({ businessId }) => {
    const [supplyChainData, setSupplyChainData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSupplyChain();
        const interval = setInterval(fetchSupplyChain, 5000);
        return () => clearInterval(interval);
    }, [businessId]);

    const fetchSupplyChain = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/supply-chain?businessId=${businessId}`);
            setSupplyChainData(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching supply chain:', error);
        }
    };

    const getContaminationColor = (risk) => {
        if (risk === 'Low') return 'text-emerald-400 bg-emerald-400/10';
        if (risk === 'Medium') return 'text-amber-400 bg-amber-400/10';
        return 'text-rose-400 bg-rose-400/10';
    };

    if (loading) return <div className="text-slate-400">Loading supply chain data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <Factory className="w-5 h-5 mr-2 text-indigo-500" />
                    Supply Chain & Manufacturing
                </h2>
                <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                    {supplyChainData.length} Products Tracked
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {supplyChainData.map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-white font-semibold">{item.productName}</h3>
                                <p className="text-xs text-slate-500">Batch: {item.batchNumber}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getContaminationColor(item.contaminationRisk)}`}>
                                    {item.contaminationRisk} Risk
                                </span>
                                {item.currentRiskScore >= 8 && (
                                    <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                                )}
                            </div>
                        </div>

                        {/* Manufacturing Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm">
                                <Factory className="w-4 h-4 mr-2 text-slate-500" />
                                <span className="text-slate-400">{item.manufacturer}</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Package className="w-4 h-4 mr-2 text-slate-500" />
                                <span className="text-slate-400">{item.warehouse}</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Thermometer className="w-4 h-4 mr-2 text-slate-500" />
                                <span className="text-slate-400">Storage: {item.temperature}</span>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-slate-800/50 rounded-lg p-2">
                                <p className="text-xs text-slate-500">Production</p>
                                <p className="text-sm text-slate-300">{new Date(item.productionDate).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-2">
                                <p className="text-xs text-slate-500">Expiry</p>
                                <p className="text-sm text-slate-300">{new Date(item.expiryDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="flex flex-wrap gap-2">
                            {item.certifications.map((cert, idx) => (
                                <span key={idx} className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-full border border-indigo-500/20 flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SupplyChain;
