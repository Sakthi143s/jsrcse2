import React from 'react';
import { AlertTriangle, Zap, Database, Server, Clock } from 'lucide-react';
import { format } from 'date-fns';

const BottleneckCard = ({ bottleneck }) => {
    const severityColors = {
        low: 'border-l-4 border-blue-500 bg-blue-50',
        medium: 'border-l-4 border-yellow-500 bg-yellow-50',
        high: 'border-l-4 border-orange-500 bg-orange-50',
        critical: 'border-l-4 border-red-500 bg-red-50',
    };

    const typeIcons = {
        cpu: <Zap className="text-orange-500" size={20} />,
        memory: <Server className="text-blue-500" size={20} />,
        database: <Database className="text-purple-500" size={20} />,
        code: <AlertTriangle className="text-red-500" size={20} />,
    };

    return (
        <div className={`p-5 mb-4 rounded-lg shadow-sm bg-white border border-slate-100 ${severityColors[bottleneck.severity] || ''}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    {typeIcons[bottleneck.type] || <AlertTriangle />}
                    <span className="font-bold text-slate-700 capitalize">{bottleneck.type} Bottleneck</span>
                </div>
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> {format(new Date(bottleneck.detectedAt), 'HH:mm:ss')}
                </span>
            </div>

            <div className="mb-3">
                <div className="text-sm text-slate-600 mb-1">
                    <span className="font-semibold">Service:</span> {bottleneck.service}
                </div>
                <div className="text-sm text-slate-600 mb-1">
                    <span className="font-semibold">Location:</span> {bottleneck.location?.file}:{bottleneck.location?.line}
                </div>
                <div className="text-sm text-slate-600">
                    <span className="font-semibold">Impact:</span> {bottleneck.impact?.affectedUsers} users affected
                </div>
            </div>

            {bottleneck.aiSuggestions?.length > 0 && (
                <div className="bg-white/50 p-3 rounded border border-slate-200 text-sm">
                    <span className="font-semibold text-purple-600 block mb-1">✨ AI Suggestion ({bottleneck.aiSuggestions[0].confidence * 100}% confident):</span>
                    {bottleneck.aiSuggestions[0].recommendation}
                </div>
            )}
        </div>
    );
};

const BottleneckList = ({ bottlenecks }) => {
    if (bottlenecks.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                    <Zap className="text-green-600" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-700">System Healthy</h3>
                <p className="text-slate-500">No performance bottlenecks detected.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {bottlenecks.map((b) => (
                <BottleneckCard key={b._id} bottleneck={b} />
            ))}
        </div>
    );
};

export default BottleneckList;
