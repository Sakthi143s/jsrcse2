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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Paste SQL Query for Analysis</h3>
                <textarea
                    placeholder="SELECT * FROM users WHERE active = 1..."
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    id="queryInput"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => {
                            const val = document.getElementById('queryInput').value;
                            if (val) simulateQuery(val.length > 50, val);
                        }}
                        disabled={analyzing}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 shadow-md transition-all disabled:opacity-50"
                    >
                        {analyzing ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
                        Analyze Query
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Search className="text-purple-500" />
                        Query History
                    </h1>
                    <p className="text-slate-500">Analyze database query performance and execution plans.</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchQueries}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            <QueryList queries={queries} />
        </div>
    );
};

export default Queries;
