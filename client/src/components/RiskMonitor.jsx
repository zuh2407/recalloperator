import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, AlertOctagon } from 'lucide-react';

const RiskMonitor = ({ products }) => {
    // Sort by risk score descending
    const sortedProducts = [...products].sort((a, b) => b.riskScore - a.riskScore);

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-indigo-500" />
                Supply Chain Risk Monitor
            </h3>

            <div className="space-y-3">
                {sortedProducts.map((product) => {
                    const isCritical = product.riskScore >= 8;
                    const isHigh = product.riskScore >= 5 && product.riskScore < 8;

                    let scoreColor = 'bg-emerald-500';
                    if (isCritical) scoreColor = 'bg-rose-600 animate-pulse';
                    else if (isHigh) scoreColor = 'bg-amber-500';

                    return (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition">
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${scoreColor}`}>
                                    {product.riskScore}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-200">{product.name}</p>
                                    <p className="text-xs text-slate-500">Batch: {product.batchId} • {product.category}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Risk Score</p>
                                    <div className="w-24 h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${scoreColor}`}
                                            style={{ width: `${product.riskScore * 10}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="text-right min-w-[80px]">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'Recalled'
                                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        }`}>
                                        {product.status === 'Recalled' ? (
                                            <><XCircle className="w-3 h-3 mr-1" /> Recalled</>
                                        ) : (
                                            <><CheckCircle className="w-3 h-3 mr-1" /> Safe</>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {products.length === 0 && (
                    <p className="text-slate-500 text-center py-8">No products monitoring.</p>
                )}
            </div>
        </div>
    );
};

export default RiskMonitor;
