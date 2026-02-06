import React, { useEffect, useState } from 'react';
import { Cpu, HardDrive, Activity, Wifi, Clock } from 'lucide-react';
import socket from '../../services/websocket';

const GaugeChart = ({ value, label, icon: Icon, color }) => {
    const getColor = () => {
        if (value >= 90) return 'text-red-500';
        if (value >= 70) return 'text-yellow-500';
        return 'text-green-500';
    };

    const getBgColor = () => {
        if (value >= 90) return 'bg-red-100';
        if (value >= 70) return 'bg-yellow-100';
        return 'bg-green-100';
    };

    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
                <Icon className={`${getColor()}`} size={20} />
                <span className="text-sm font-medium text-slate-600">{label}</span>
            </div>
            <div className="relative w-24 h-24">
                <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-200"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - value / 100)}`}
                        className={getColor()}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${getColor()}`}>{Math.round(value)}%</span>
                </div>
            </div>
        </div>
    );
};

const SystemHealthWidget = () => {
    const [metrics, setMetrics] = useState({
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkRx: 0,
        networkTx: 0,
        uptime: 0
    });

    useEffect(() => {
        socket.on('system:metrics', (data) => {
            setMetrics({
                cpuUsage: data.cpuUsage || 0,
                memoryUsage: data.memoryUsage || 0,
                diskUsage: data.diskUsage || 0,
                networkRx: data.networkRx || 0,
                networkTx: data.networkTx || 0,
                uptime: data.uptime || 0
            });
        });

        return () => {
            socket.off('system:metrics');
        };
    }, []);

    const formatUptime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B/s';
        const k = 1024;
        const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="text-blue-500" size={20} />
                    System Health
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={16} />
                    <span>Uptime: {formatUptime(metrics.uptime)}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <GaugeChart value={metrics.cpuUsage} label="CPU" icon={Cpu} />
                <GaugeChart value={metrics.memoryUsage} label="Memory" icon={Activity} />
                <GaugeChart value={metrics.diskUsage} label="Disk" icon={HardDrive} />
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                    <Wifi className="text-blue-500" size={20} />
                    <span className="text-sm font-medium text-slate-700">Network Activity</span>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <span className="text-slate-500">↓</span>
                        <span className="font-mono text-slate-700">{formatBytes(metrics.networkRx)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-slate-500">↑</span>
                        <span className="font-mono text-slate-700">{formatBytes(metrics.networkTx)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemHealthWidget;
