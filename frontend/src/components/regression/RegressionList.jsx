import React from 'react';
import { TrendingDown, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const RegressionCard = ({ regression }) => {
    return (
        <div className="p-6 mb-6 rounded-sm glass-card border-l-2 border-l-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-sm">
                        <TrendingDown className="text-red-500" size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-white italic tracking-tighter uppercase text-lg leading-tight">{regression.service}</h3>
                        <span className="text-[9px] font-black text-red-500/80 uppercase tracking-widest">Performance Regression Stream</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-slate-500 flex items-center gap-1 justify-end uppercase tracking-widest">
                        <Clock size={12} /> {format(new Date(regression.timestamp || regression.createdAt || regression.detectedAt), 'MMM d, HH:mm')}
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-sm text-[9px] font-black bg-red-500 text-white uppercase tracking-tighter">
                        {regression.metric} Degradation
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 bg-nvidia-black/50 p-5 rounded-md border border-white/5 relative overflow-hidden">
                <div className="text-center">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Baseline</div>
                    <div className="font-mono text-lg font-black text-slate-400 italic">{regression.baseline.value}ms</div>
                </div>
                <div className="flex items-center justify-center">
                    <ArrowRight className="text-nvidia-green/40" size={24} />
                </div>
                <div className="text-center">
                    <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Critical</div>
                    <div className="font-mono text-xl font-black text-red-500 shadow-red-500/20 drop-shadow-sm">{regression.current.value}ms</div>
                </div>
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-4 py-1 shadow-lg skewed-label">
                    +{regression.degradation.percentage}% DELTA
                </div>
            </div>

            {regression.possibleCauses?.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-nvidia-green uppercase tracking-[0.2em] flex items-center gap-2">
                        <AlertCircle size={12} /> AI ROOT CAUSE DIAGNOSTICS
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                        {regression.possibleCauses.map((cause, idx) => (
                            <div key={idx} className="flex items-start gap-4 bg-white/5 border border-white/5 p-4 rounded-sm transition-hover hover:bg-white/10">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_#EF4444] shrink-0" />
                                <div className="flex-1">
                                    <p className="text-[11px] text-white font-bold leading-tight mb-2 italic">"{cause.description}"</p>
                                    <div className="w-full bg-nvidia-gray h-1 rounded-full overflow-hidden">
                                        <div
                                            className="bg-nvidia-green h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_#76B900]"
                                            style={{ width: `${(cause.confidence || 0.8) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-[8px] font-black text-slate-500 uppercase">AI Confidence Probe</span>
                                        <span className="text-[8px] font-black text-nvidia-green uppercase tracking-widest">{Math.round((cause.confidence || 0.8) * 100)}% Match</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const RegressionList = ({ regressions }) => {
    if (regressions.length === 0) {
        return (
            <div className="text-center py-12 glass-card border-dashed">
                <div className="bg-nvidia-green/10 p-4 rounded-full inline-block mb-4">
                    <TrendingDown className="text-nvidia-green" size={32} />
                </div>
                <h3 className="text-sm font-black text-white italic uppercase tracking-tighter">Flow Stable</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">No trajectory deviations</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {regressions.map((r) => (
                <RegressionCard key={r._id} regression={r} />
            ))}
        </div>
    );
};

export default RegressionList;
