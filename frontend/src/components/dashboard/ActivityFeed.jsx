import React from 'react';
import { AlertCircle, Database, FileCode, TrendingDown, Clock, Shield } from 'lucide-react';

const ActivityItem = ({ item }) => {
    const [expanded, setExpanded] = React.useState(false);

    const getIcon = () => {
        switch (item.type) {
            case 'bottleneck': return <AlertCircle className="text-nvidia-green" size={18} />;
            case 'query': return <Database className="text-nvidia-green" size={18} />;
            case 'profile': return <FileCode className="text-nvidia-green" size={18} />;
            case 'regression': return <TrendingDown className="text-red-500" size={18} />;
            default: return <Clock className="text-slate-400" size={18} />;
        }
    };

    const getTitle = () => {
        switch (item.type) {
            case 'bottleneck': return 'Bottleneck Detected';
            case 'query': return 'Slow Query Analyzed';
            case 'profile': return 'Trace Profile Created';
            case 'regression': return 'Regression Found';
            default: return 'Telemetry Event';
        }
    };

    const getTime = () => {
        return new Date(item.timestamp || item.createdAt || item.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div
            className={`p-4 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 group cursor-pointer ${expanded ? 'bg-white/5' : ''}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-nvidia-gray rounded-sm shadow-inner group-hover:shadow-[0_0_8px_#76B900] transition-all">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-black text-white italic uppercase tracking-tighter">{getTitle()}</h4>
                        <span className="text-[10px] font-black text-nvidia-green uppercase tracking-widest">{getTime()}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate font-medium">
                        {item.description || item.queryText || `Service: ${item.service}`}
                    </p>
                    {item.severity && (
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-tighter ${item.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                            item.severity === 'high' ? 'bg-nvidia-green/20 text-nvidia-green' :
                                'bg-white/10 text-white'
                            }`}>
                            {item.severity}
                        </span>
                    )}
                </div>
            </div>

            {expanded && (
                <div className="mt-4 ml-12 space-y-3 animate-in fade-in slide-in-from-top-1">
                    {item.aiSuggestions && item.aiSuggestions.length > 0 && (
                        <div className="bg-nvidia-black/50 p-3 rounded-lg border border-nvidia-green/30">
                            <h5 className="text-[9px] font-black text-nvidia-green uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Shield size={10} /> AI ANALYSIS
                            </h5>
                            <ul className="space-y-1.5">
                                {item.aiSuggestions.map((s, idx) => (
                                    <li key={idx} className="flex gap-2 items-start">
                                        <div className="w-1 h-1 rounded-full bg-nvidia-green mt-1.5 shrink-0" />
                                        <p className="text-[10px] text-slate-300 leading-normal font-medium italic">
                                            {typeof s === 'string' ? s : s.recommendation || s.suggestion || s.description}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ActivityFeed = ({ activities }) => {
    return (
        <div className="glass-card flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <h3 className="text-sm font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                    Event Stream
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nvidia-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-nvidia-green"></span>
                    </span>
                </h3>
                <span className="text-[9px] font-black text-nvidia-green/60 uppercase tracking-widest">Live Detection</span>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[500px] scrollbar-hide">
                {activities.length === 0 ? (
                    <div className="p-12 text-center">
                        <Clock className="mx-auto text-nvidia-gray mb-4" size={48} />
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Waiting for streams...</p>
                    </div>
                ) : (
                    activities.map((item, idx) => (
                        <ActivityItem key={item._id || idx} item={item} />
                    ))
                )}
            </div>
            <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                <button className="text-[9px] font-black text-nvidia-green uppercase tracking-widest hover:text-white transition-all underline underline-offset-4">
                    Full Archive
                </button>
            </div>
        </div>
    );
};

export default ActivityFeed;
