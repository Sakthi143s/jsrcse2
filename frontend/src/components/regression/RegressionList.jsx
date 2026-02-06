import React from 'react';
import { TrendingDown, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const RegressionCard = ({ regression }) => {
    return (
        <div className="p-5 mb-4 rounded-lg shadow-sm bg-white border border-red-100 border-l-4 border-l-red-500">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-700">{regression.service}</h3>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                        {regression.metric}
                    </span>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> {format(new Date(regression.detectedAt), 'MMM d, HH:mm')}
                </span>
            </div>

            <div className="flex items-center gap-4 mb-4 bg-red-50 p-4 rounded-lg">
                <div className="text-center">
                    <div className="text-xs text-slate-500 mb-1">Baseline</div>
                    <div className="font-mono font-medium text-slate-700">{regression.baseline.value}ms</div>
                </div>
                <ArrowRight className="text-red-400" size={20} />
                <div className="text-center">
                    <div className="text-xs text-slate-500 mb-1">Current</div>
                    <div className="font-mono font-bold text-red-600">{regression.current.value}ms</div>
                </div>
                <div className="ml-auto text-right">
                    <div className="text-2xl font-bold text-red-600">+{regression.degradation.percentage}%</div>
                    <div className="text-xs text-red-400">Degradation</div>
                </div>
            </div>

            {regression.possibleCauses?.length > 0 && (
                <div className="text-sm">
                    <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
                        <AlertCircle size={14} className="text-orange-500" /> Possible Causes
                    </h4>
                    <ul className="space-y-1">
                        {regression.possibleCauses.map((cause, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-600">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400"></span>
                                <span>
                                    <span className="font-medium">{cause.type}:</span> {cause.description}
                                    <span className="text-xs text-slate-400 ml-1">({cause.confidence * 100}%)</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const RegressionList = ({ regressions }) => {
    if (regressions.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                    <TrendingDown className="text-green-600" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-700">No Regressions Detected</h3>
                <p className="text-slate-500">System performance is stable across all services.</p>
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
