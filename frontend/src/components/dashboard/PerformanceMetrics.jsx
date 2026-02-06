import React from 'react';
import { Clock, Cpu, Server, AlertCircle } from 'lucide-react';

const MetricCard = ({ title, value, unit, icon: Icon, color, change }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 card-hover">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            {change && (
                <span className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change > 0 ? '+' : ''}{change}%
                </span>
            )}
        </div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <div className="flex items-baseline mt-1 space-x-1">
            <span className="text-2xl font-bold text-slate-800">{value}</span>
            <span className="text-slate-400 text-sm">{unit}</span>
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
