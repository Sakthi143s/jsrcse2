import React from 'react';
import { Clock, Cpu, Server, AlertCircle } from 'lucide-react';

const MetricCard = ({ title, value, unit, icon: Icon, color, change }) => (
    <div className="glass-card p-6 card-hover group">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-nvidia-gray shadow-inner group-hover:shadow-[0_0_10px_rgba(118,185,0,0.5)] transition-all`}>
                <Icon size={22} className="text-nvidia-green" />
            </div>
            {change !== undefined && (
                <div className={`px-2 py-1 rounded-full text-xs font-black tracking-tighter ${change >= 0 ? 'text-nvidia-green' : 'text-red-500'}`}>
                    {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
                </div>
            )}
        </div>
        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{title}</h3>
        <div className="flex items-baseline mt-2 space-x-1">
            <span className="text-3xl font-black text-white tabular-nums tracking-tighter">{value}</span>
            <span className="text-nvidia-green/60 text-xs font-bold uppercase">{unit}</span>
        </div>
        <div className="mt-4 h-1 w-full bg-nvidia-gray rounded-full overflow-hidden">
            <div className={`h-full bg-nvidia-green shadow-[0_0_8px_#76B900]`} style={{ width: '100%' }}></div>
        </div>
    </div>
);

const PerformanceMetrics = ({ metrics }) => {
    const latest = metrics[0] || {};
    const data = latest.metrics || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
                title="Response Time"
                value={data.responseTime || 0}
                unit="ms"
                icon={Clock}
                color="bg-nvidia-green"
            />
            <MetricCard
                title="CPU Load"
                value={data.cpuUsage || 0}
                unit="%"
                icon={Cpu}
                color="bg-nvidia-green"
            />
            <MetricCard
                title="Memory Usage"
                value={Math.round((data.memoryUsage || 0) / 1024 * 10) / 10}
                unit="GB"
                icon={Server}
                color="bg-nvidia-green"
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
