import React from 'react';
import { Activity, Mail, CreditCard, AlertOctagon } from 'lucide-react';

const ActivityLog = ({ logs }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'RISK_DETECTED': return <AlertOctagon className="w-4 h-4 text-rose-500" />;
            case 'ACTION_TAKEN': return <Mail className="w-4 h-4 text-indigo-400" />;
            case 'SIMULATION': return <Activity className="w-4 h-4 text-purple-400" />;
            default: return <Activity className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-indigo-500" />
                Live Activity Feed
            </h3>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {logs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 hover:bg-slate-800/50 rounded-lg transition border border-transparent hover:border-slate-700/50">
                        <div className="mt-1 bg-slate-800 p-1.5 rounded-full border border-slate-700">
                            {getIcon(log.type)}
                        </div>
                        <div>
                            <p className="text-sm text-slate-300">{log.message}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                {new Date(log.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}

                {logs.length === 0 && (
                    <p className="text-slate-500 text-center py-4 text-sm">No activity recorded yet.</p>
                )}
            </div>
        </div>
    );
};

export default ActivityLog;
