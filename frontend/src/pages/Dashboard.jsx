import React, { useEffect, useState } from 'react';
import api from '../services/api';
import socket from '../services/websocket';
import PerformanceMetrics from '../components/dashboard/PerformanceMetrics';
import MetricsChart from '../components/dashboard/MetricsChart';

const Dashboard = () => {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();

        // WebSocket Listeners
        socket.on('metric:update', (newMetric) => {
            setMetrics(prev => [newMetric, ...prev].slice(0, 50));
        });

        socket.on('system:metrics', (sysMetrics) => {
            console.log('Real System Metrics:', sysMetrics);
        });

        return () => {
            socket.off('metric:update');
            socket.off('system:metrics');
        };
    }, []);

    const fetchInitialData = async () => {
        try {
            const response = await api.get('/metrics');
            setMetrics(response.data);
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">System Dashboard</h1>
                <p className="text-slate-500">Real-time overview of system performance and health.</p>
            </div>

            <PerformanceMetrics metrics={metrics} />
            <MetricsChart data={metrics} />

            {/* Pending: Bottlenecks List */}
        </div>
    );
};

export default Dashboard;
