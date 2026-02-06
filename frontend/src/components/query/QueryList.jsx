import React from 'react';
import { Database, Clock, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const QueryCard = ({ query }) => {
    const isSlow = query.executionTime > 100;

    return (
        <div className={`p-5 mb-4 rounded-lg shadow-sm bg-white border ${isSlow ? 'border-orange-200 bg-orange-50' : 'border-slate-100'}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <Database className="text-slate-500" size={18} />
                    <span className="font-bold text-slate-700">{query.database}</span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                    {format(new Date(query.timestamp), 'HH:mm:ss')}
                </span>
            </div>

            <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-sm mb-3 overflow-x-auto">
                <code>{query.queryText}</code>
            </div>

            <div className="flex items-center gap-4 text-sm mb-3">
                <div className={`flex items-center gap-1 font-medium ${isSlow ? 'text-orange-600' : 'text-green-600'}`}>
                    <Clock size={16} />
                    {query.executionTime}ms
                </div>
                {query.rowsAffected && (
                    <div className="text-slate-600">
                        {query.rowsAffected} rows
                    </div>
                )}
            </div>

            {query.optimizationSuggestions?.length > 0 && (
                <div className="mt-3 bg-white p-3 rounded border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-1">
                        <Zap size={12} /> Optimization Tip
                    </h4>
                    {query.optimizationSuggestions.map((suggestion, idx) => (
                        <div key={idx} className="text-sm text-slate-700">
                            <span className="font-semibold">{suggestion.type}:</span> {suggestion.suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const QueryList = ({ queries }) => {
    if (queries.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                    <Database className="text-blue-600" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-700">No Queries Logged</h3>
                <p className="text-slate-500">Run queries to see performance analysis here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {queries.map((q) => (
                <QueryCard key={q._id} query={q} />
            ))}
        </div>
    );
};

export default QueryList;
