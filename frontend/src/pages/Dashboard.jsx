import React, { useEffect, useState } from 'react';
import api from '../services/api';
import socket from '../services/websocket';
import PerformanceMetrics from '../components/dashboard/PerformanceMetrics';
import MetricsChart from '../components/dashboard/MetricsChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { Shield } from 'lucide-react';

const Dashboard = () => {
    const [metrics, setMetrics] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();

        // WebSocket Listeners
        socket.on('metric:update', (newMetric) => {
            setMetrics(prev => [newMetric, ...prev].slice(0, 50));
        });

        socket.on('bottleneck:detected', (data) => {
            setActivities(prev => [{ ...data, type: 'bottleneck' }, ...prev].slice(0, 20));
        });

        socket.on('query:analyzed', (data) => {
            setActivities(prev => [{ ...data, type: 'query' }, ...prev].slice(0, 20));
        });

        socket.on('profile:created', (data) => {
            setActivities(prev => [{ ...data, type: 'profile' }, ...prev].slice(0, 20));
        });

        socket.on('regression:detected', (data) => {
            setActivities(prev => [{ ...data, type: 'regression' }, ...prev].slice(0, 20));
        });

        return () => {
            socket.off('metric:update');
            socket.off('bottleneck:detected');
            socket.off('query:analyzed');
            socket.off('profile:created');
            socket.off('regression:detected');
        };
    }, []);

    const fetchInitialData = async () => {
        try {
            const [metricsRes, bottlenecksRes, queriesRes] = await Promise.all([
                api.get('/metrics'),
                api.get('/bottlenecks'),
                api.get('/queries')
            ]);

            setMetrics(metricsRes.data);

            const initialActivities = [
                ...bottlenecksRes.data.map(b => ({ ...b, type: 'bottleneck' })),
                ...queriesRes.data.map(q => ({ ...q, type: 'query' }))
            ].sort((a, b) => new Date(b.timestamp || b.createdAt || b.detectedAt) - new Date(a.timestamp || a.createdAt || a.detectedAt));

            setActivities(initialActivities.slice(0, 20));
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="w-12 h-12 border-2 border-nvidia-green border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_#76B900]"></div>
                <p className="text-nvidia-green font-black uppercase tracking-widest text-[10px]">Initializing Engine...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end mb-8 border-b border-nvidia-gray/50 pb-6">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">AI Performance <span className="text-nvidia-green font-black">Monitoring</span></h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">AI-Powered Performance Engine</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-nvidia-green uppercase tracking-widest px-4 py-2 bg-nvidia-gray rounded-sm border border-nvidia-green/30 shadow-[0_0_10px_rgba(118,185,0,0.1)]">
                        NODE: HOST-LPTP-01 // ACTIVE
                    </span>
                </div>
            </div>

            <PerformanceMetrics metrics={metrics} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <MetricsChart data={metrics} />
                </div>
                <div className="lg:col-span-1">
                    <ActivityFeed activities={activities} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
