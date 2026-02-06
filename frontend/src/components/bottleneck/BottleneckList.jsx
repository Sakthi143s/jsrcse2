import React from 'react';
import { AlertTriangle, Zap, Database, Server, Clock } from 'lucide-react';
import { format } from 'date-fns';

const BottleneckCard = ({ bottleneck }) => {
    const [expanded, setExpanded] = React.useState(false);

    const severityColors = {
        low: 'border-l-2 border-slate-600',
        medium: 'border-l-2 border-yellow-500',
        high: 'border-l-2 border-nvidia-green shadow-[0_0_10px_rgba(118,185,0,0.2)]',
        critical: 'border-l-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
    };

    const typeIcons = {
        cpu: <Zap className="text-nvidia-green" size={20} />,
        memory: <Server className="text-nvidia-green" size={20} />,
        database: <Database className="text-nvidia-green" size={20} />,
        code: <AlertTriangle className="text-nvidia-green" size={20} />,
    };

    return (
        <div
            className={`p-5 mb-4 rounded-sm glass-card transition-all cursor-pointer ${severityColors[bottleneck.severity] || ''} ${expanded ? 'bg-white/5 ring-1 ring-nvidia-green/30' : ''}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    {typeIcons[bottleneck.type.toLowerCase()] || <AlertTriangle size={20} className="text-nvidia-green" />}
                    <span className="font-black text-white italic capitalize tracking-tighter uppercase text-sm">{bottleneck.type} Bottleneck</span>
                </div>
                <span className="text-[9px] font-black text-nvidia-green uppercase tracking-widest flex items-center gap-1">
                    <Clock size={12} /> {format(new Date(bottleneck.timestamp || bottleneck.createdAt || bottleneck.detectedAt), 'HH:mm:ss')}
                </span>
            </div>

            <div className="mb-4">
                <p className="text-xs text-slate-400 font-medium italic">"{bottleneck.description}"</p>
                <div className="flex gap-4 mt-2 text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
                    <span>SERVICE: <span className="text-white">{bottleneck.service}</span></span>
                    {bottleneck.location && <span>SRC: <span className="text-white">{bottleneck.location.function || bottleneck.location.file}</span></span>}
                </div>
            </div>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-1">
                    <div className="bg-nvidia-black/50 p-4 rounded-md border border-nvidia-green/20">
                        <h4 className="text-[9px] font-black text-nvidia-green uppercase tracking-[0.2em] mb-2 flex items-center gap-1">
                            <Zap size={10} /> AI ANALYSIS ENGINE
                        </h4>
                        <p className="text-[12px] text-slate-300 leading-relaxed italic font-medium">
                            {bottleneck.aiSuggestions?.[0]?.why || "Analyzing telemetry streams with adaptive baselines..."}
                        </p>
                    </div>

                    {bottleneck.aiSuggestions && bottleneck.aiSuggestions.length > 0 && (
                        <div>
                            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Recommended Actions</h4>
                            <ul className="space-y-1.5">
                                {bottleneck.aiSuggestions.map((s, idx) => (
                                    <li key={idx} className="flex gap-3 items-center bg-white/5 p-3 rounded-sm border border-white/5 hover:bg-white/10 transition-all">
                                        <div className="w-5 h-5 rounded-full bg-nvidia-gray flex items-center justify-center text-[10px] font-black text-nvidia-green shrink-0 shadow-[0_0_5px_rgba(118,185,0,0.3)]">
                                            {idx + 1}
                                        </div>
                                        <p className="text-[11px] text-white leading-tight font-bold">
                                            {typeof s === 'string' ? s : s.recommendation || s.suggestion}
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

const BottleneckList = ({ bottlenecks }) => {
    if (bottlenecks.length === 0) {
        return (
            <div className="text-center py-12 glass-card border-dashed">
                <div className="bg-nvidia-green/10 p-4 rounded-full inline-block mb-4">
                    <Zap className="text-nvidia-green" size={32} />
                </div>
                <h3 className="text-sm font-black text-white italic uppercase tracking-tighter">System Nominal</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Ready for compute loads</p>
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
