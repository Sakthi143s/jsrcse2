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

    const simulateQuery = async (slow) => {
        setAnalyzing(true);
        try {
            await api.post('/queries/analyze', {
                queryText: slow
                    ? 'SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE orders.total > 1000'
                    : 'SELECT id, email FROM users WHERE id = 1',
                database: 'PostgreSQL',
                executionTime: slow ? 250 : 15 // ms
            });
        } catch (error) {
            console.error('Simulation failed:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Search className="text-purple-500" />
                        Query Optimization
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
