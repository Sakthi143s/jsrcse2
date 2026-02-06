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

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="w-12 h-12 border-2 border-nvidia-green border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_#76B900]"></div>
                <p className="text-nvidia-green font-black uppercase tracking-widest text-[10px]">Scanning Flows...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between border-b border-nvidia-gray/50 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                        <AlertTriangle className="text-nvidia-green" size={28} />
                        Bottleneck <span className="text-nvidia-green">Analysis</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">AI-Powered Anomaly Detection</p>
                </div>

                <button
                    onClick={triggerAnalysis}
                    disabled={analyzing}
                    className={`flex items-center gap-2 px-6 py-2 rounded-sm font-black uppercase tracking-tighter transition-all italic ${analyzing
                        ? 'bg-nvidia-gray text-slate-500 cursor-not-allowed border border-white/5'
                        : 'bg-nvidia-green text-nvidia-black hover:bg-white hover:text-nvidia-black shadow-[0_0_15px_rgba(118,185,0,0.3)]'
                        }`}
                >
                    <RefreshCw size={18} className={analyzing ? 'animate-spin' : ''} />
                    {analyzing ? 'EXECUTING SCAN...' : 'TRIGGER AI PROBE'}
                </button>
            </div>

            <BottleneckList bottlenecks={bottlenecks} />
        </div>
    );
};

export default Bottlenecks;
