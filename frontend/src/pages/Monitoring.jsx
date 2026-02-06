import React, { useEffect, useState } from 'react';
import socket from '../services/websocket';
import LiveRequestTable from '../components/monitoring/LiveRequestTable';
import SystemHealthWidget from '../components/monitoring/SystemHealthWidget';
import ProcessMonitor from '../components/monitoring/ProcessMonitor';
import MetricsChart from '../components/dashboard/MetricsChart';
import { Activity } from 'lucide-react';

const Monitoring = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Listen for real-time updates
        socket.on('metric:update', (newMetric) => {
            setRequests((prev) => [newMetric, ...prev].slice(0, 50)); // Keep last 50
        });

        return () => {
            socket.off('metric:update');
        };
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between border-b border-nvidia-gray/50 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                        <Activity className="text-nvidia-green" size={28} />
                        Live <span className="text-nvidia-green">Monitoring</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Real-Time Telemetry Stream</p>
                </div>
                <div className="text-[10px] px-4 py-2 bg-nvidia-gray text-nvidia-green rounded-sm font-black uppercase tracking-tighter border border-nvidia-green/30 shadow-[0_0_10px_rgba(118,185,0,0.1)] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-nvidia-green animate-pulse shadow-[0_0_5px_#76B900]"></div>
                    Link: Active
                </div>
            </div>

            {/* System Health Overview */}
            <SystemHealthWidget />

            {/* Metrics Chart */}
            <MetricsChart data={requests} />

            {/* Process Monitor */}
            <ProcessMonitor />

            {/* Detailed Log Table */}
            <LiveRequestTable requests={requests} />
        </div>
    );
};

export default Monitoring;
