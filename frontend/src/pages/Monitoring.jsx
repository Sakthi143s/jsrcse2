import React, { useEffect, useState } from 'react';
import socket from '../services/websocket';
import LiveRequestTable from '../components/monitoring/LiveRequestTable';
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="text-blue-500" />
                        Live Monitoring
                    </h1>
                    <p className="text-slate-500">Real-time stream of incoming system requests and performance.</p>
                </div>
                <div className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                    System Online
                </div>
            </div>

            {/* Reusing the Chart for a visual overview */}
            <MetricsChart data={requests} />

            {/* Detailed Log Table */}
            <LiveRequestTable requests={requests} />
        </div>
    );
};

export default Monitoring;
