import React, { useEffect, useState } from 'react';
import api from '../services/api';
import socket from '../services/websocket';
import QueryList from '../components/query/QueryList';
import { Database, Play, Search, RefreshCw } from 'lucide-react';

const Queries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        fetchQueries();

        socket.on('query:analyzed', (newQuery) => {
            setQueries((prev) => [newQuery, ...prev]);
        });

        return () => {
            socket.off('query:analyzed');
        };
    }, []);

    const fetchQueries = async () => {
        try {
            const response = await api.get('/queries');
            setQueries(response.data);
        } catch (error) {
            console.error('Failed to fetch queries:', error);
        } finally {
            setLoading(false);
        }
    };

    const simulateQuery = async (slow, customQuery = null) => {
        setAnalyzing(true);
        try {
            await api.post('/queries/analyze', {
                queryText: customQuery || (slow
                    ? 'SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE orders.total > 1000'
                    : 'SELECT id, email FROM users WHERE id = 1'),
                database: 'PostgreSQL',
                executionTime: slow ? Math.floor(Math.random() * 500) + 200 : Math.floor(Math.random() * 50) + 5 // ms
            });
            if (customQuery) document.getElementById('queryInput').value = '';
        } catch (error) {
            console.error('Simulation failed:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="w-12 h-12 border-2 border-nvidia-green border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_#76B900]"></div>
                <p className="text-nvidia-green font-black uppercase tracking-widest text-[10px]">Optimizing Core...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="glass-card p-6 border border-nvidia-green/20">
                <h3 className="text-xs font-black text-white italic uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Database size={16} className="text-nvidia-green" />
                    Query Optimization Engine
                </h3>
                <textarea
                    placeholder="PASTE SQL STREAM HERE..."
                    className="w-full h-32 p-4 bg-nvidia-black/50 border border-white/10 rounded-sm font-mono text-xs text-nvidia-green focus:outline-none focus:ring-1 focus:ring-nvidia-green transition-all"
                    id="queryInput"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => {
                            const val = document.getElementById('queryInput').value;
                            if (val) simulateQuery(val.length > 50, val);
                        }}
                        disabled={analyzing}
                        className="flex items-center gap-2 px-6 py-2 bg-nvidia-green text-nvidia-black rounded-sm font-black uppercase tracking-tighter italic hover:bg-white transition-all disabled:opacity-30 shadow-[0_0_15px_rgba(118,185,0,0.2)]"
                    >
                        {analyzing ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
                        Execute Analysis
                    </button>
                </div>
            </div>

            <div className="flex items-end justify-between border-b border-nvidia-gray/50 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                        <Search className="text-nvidia-green" size={28} />
                        Query <span className="text-nvidia-green">Intelligence</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Execution Plan Analysis</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchQueries}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 text-slate-400 rounded-sm font-black uppercase tracking-tighter border border-white/5 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <RefreshCw size={16} />
                        Sync History
                    </button>
                </div>
            </div>

            <QueryList queries={queries} />
        </div>
    );
};

export default Queries;
