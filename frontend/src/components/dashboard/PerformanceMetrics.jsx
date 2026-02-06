import React from 'react';
import { Clock, Cpu, Server, AlertCircle } from 'lucide-react';

const MetricCard = ({ title, value, unit, icon: Icon, color, change }) => (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100 card-hover transition-all group">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
            </div>
            {change !== undefined && (
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${change >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
                </div>
            )}
        </div>
        <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
        <div className="flex items-baseline mt-2 space-x-1">
            <span className="text-3xl font-extrabold text-slate-800 tabular-nums">{value}</span>
            <span className="text-slate-400 text-sm font-medium">{unit}</span>
        </div>
        <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${color} opacity-20`} style={{ width: '100%' }}></div>
        </div>
    </div>
);

const PerformanceMetrics = ({ metrics }) => {
    // Calculate averages or use latest
    const latest = metrics[0] || {};
    const data = latest.metrics || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
                title="Avg Response Time"
                value={data.responseTime || 0}
                unit="ms"
                icon={Clock}
                color="bg-blue-500"
            />
            <MetricCard
                title="CPU Usage"
                value={data.cpuUsage || 0}
                unit="%"
                icon={Cpu}
                color="bg-purple-500"
            />
            <MetricCard
                title="Memory Usage"
                value={Math.round((data.memoryUsage || 0) / 1024 * 10) / 10}
                unit="GB"
                icon={Server}
                color="bg-indigo-500"
            />
            <MetricCard
                title="Error Rate"
                value={(data.errorRate || 0).toFixed(2)}
                unit="%"
                icon={AlertCircle}
                color="bg-red-500"
            />
        </div>
    );
};

export default PerformanceMetrics;
