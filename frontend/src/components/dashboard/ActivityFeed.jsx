import React from 'react';
import { AlertCircle, Database, FileCode, TrendingDown, Clock } from 'lucide-react';

const ActivityItem = ({ item }) => {
    const getIcon = () => {
        switch (item.type) {
            case 'bottleneck': return <AlertCircle className="text-orange-500" size={18} />;
            case 'query': return <Database className="text-purple-500" size={18} />;
            case 'profile': return <FileCode className="text-blue-500" size={18} />;
            case 'regression': return <TrendingDown className="text-red-500" size={18} />;
            default: return <Clock className="text-slate-400" size={18} />;
        }
    };

    const getTitle = () => {
        switch (item.type) {
            case 'bottleneck': return 'Bottleneck Detected';
            case 'query': return 'Slow Query Analyzed';
            case 'profile': return 'Performance Profile Created';
            case 'regression': return 'Performance Regression Found';
            default: return 'System Event';
        }
    };

    const getTime = () => {
        return new Date(item.timestamp || item.createdAt || item.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
            <div className="mt-1 p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight">{getTitle()}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{getTime()}</span>
                </div>
                <p className="text-xs text-slate-500 truncate font-medium">
                    {item.description || item.queryText || `Service: ${item.service}`}
                </p>
                {item.severity && (
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${item.severity === 'critical' ? 'bg-red-100 text-red-600' :
                            item.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                                'bg-blue-100 text-blue-600'
                        }`}>
                        {item.severity}
                    </span>
                )}
            </div>
        </div>
    );
};

const ActivityFeed = ({ activities }) => {
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    Live Activity Feed
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-Detection Active</span>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[500px] scrollbar-hide">
                {activities.length === 0 ? (
                    <div className="p-12 text-center">
                        <Clock className="mx-auto text-slate-200 mb-4" size={48} />
                        <p className="text-slate-400 text-sm font-medium">Waiting for system events...</p>
                    </div>
                ) : (
                    activities.map((item, idx) => (
                        <ActivityItem key={item._id || idx} item={item} />
                    ))
                )}
            </div>
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
                <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                    View Comprehensive History
                </button>
            </div>
        </div>
    );
};

export default ActivityFeed;
