import React, { useEffect, useState } from 'react';
import api from '../services/api';
import socket from '../services/websocket';
import RegressionList from '../components/regression/RegressionList';
import { TrendingDown, RefreshCw } from 'lucide-react';

const Regressions = () => {
    const [regressions, setRegressions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        fetchRegressions();

        socket.on('regression:detected', (newRegression) => {
            setRegressions((prev) => [newRegression, ...prev]);
        });

        return () => {
            socket.off('regression:detected');
        };
    }, []);

    const fetchRegressions = async () => {
        try {
            const response = await api.get('/regressions');
            setRegressions(response.data);
        } catch (error) {
            console.error('Failed to fetch regressions:', error);
        } finally {
            setLoading(false);
        }
    };

    const triggerDetection = async () => {
        setAnalyzing(true);
        try {
            await api.post('/regressions/detect');
        } catch (error) {
            console.error('Detection failed:', error);
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
                        <TrendingDown className="text-red-500" />
                        Regression Analysis
                    </h1>
                    <p className="text-slate-500">Detect performance degradations compared to historical baselines.</p>
                </div>

                <button
                    onClick={triggerDetection}
                    disabled={analyzing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${analyzing
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    <RefreshCw size={16} className={analyzing ? 'animate-spin' : ''} />
                    {analyzing ? 'Checking...' : 'Check for Regressions'}
                </button>
            </div>

            <RegressionList regressions={regressions} />
        </div>
    );
};

export default Regressions;
