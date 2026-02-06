import React, { useEffect, useState } from 'react';
import api from '../services/api';
import socket from '../services/websocket';
import BottleneckList from '../components/bottleneck/BottleneckList';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const Bottlenecks = () => {
    const [bottlenecks, setBottlenecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        fetchBottlenecks();

        // Listen for real-time detected bottlenecks
        socket.on('bottleneck:detected', (newBottleneck) => {
            setBottlenecks((prev) => [newBottleneck, ...prev]);
        });

        return () => {
            socket.off('bottleneck:detected');
        };
    }, []);

    const fetchBottlenecks = async () => {
        try {
            const response = await api.get('/bottlenecks');
            setBottlenecks(response.data);
        } catch (error) {
            console.error('Failed to fetch bottlenecks:', error);
        } finally {
            setLoading(false);
        }
    };

    const triggerAnalysis = async () => {
        setAnalyzing(true);
        try {
            // Trigger the AI analysis (stubbed in backend)
            await api.post('/bottlenecks/analyze');
            // The socket event will update the list automatically
        } catch (error) {
            console.error('Analysis failed:', error);
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
                        <AlertTriangle className="text-orange-500" />
                        Bottleneck Detection
                    </h1>
                    <p className="text-slate-500">AI-powered tracking of performance bottlenecks.</p>
                </div>

                <button
                    onClick={triggerAnalysis}
                    disabled={analyzing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${analyzing
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    <RefreshCw size={18} className={analyzing ? 'animate-spin' : ''} />
                    {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
                </button>
            </div>

            <BottleneckList bottlenecks={bottlenecks} />
        </div>
    );
};

export default Bottlenecks;
