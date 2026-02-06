import React, { useEffect, useState } from 'react';
import api from '../services/api';
import socket from '../services/websocket';
import PerformanceMetrics from '../components/dashboard/PerformanceMetrics';
import MetricsChart from '../components/dashboard/MetricsChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';

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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">System Performance Core</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time AI-powered monitoring and optimization suite.</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
                        Instance: Host-Laptop-01
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
