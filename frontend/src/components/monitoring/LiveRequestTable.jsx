import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const LiveRequestTable = ({ requests }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Live Request Log</h3>
                <span className="text-sm text-slate-400 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Live
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Endpoint</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Latency</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                    Waiting for incoming traffic...
                                </td>
                            </tr>
                        ) : (
                            requests.map((req, index) => (
                                <tr key={req._id || index} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-600">
                                        {req.timestamp ? format(new Date(req.timestamp), 'HH:mm:ss.SSS') : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                            {req.service}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-600 text-xs">
                                        {req.endpoint}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(req.metrics?.errorRate || 0) > 0 ? (
                                            <span className="flex items-center text-red-500 gap-1.5">
                                                <XCircle size={14} /> Error
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-green-500 gap-1.5">
                                                <CheckCircle size={14} /> 200 OK
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600 font-mono">
                                        {req.metrics?.responseTime}ms
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LiveRequestTable;
