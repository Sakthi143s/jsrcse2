import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const MetricsChart = ({ data }) => {
    const reversedData = [...data].reverse();
    const labels = reversedData.map(m => new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    font: { family: 'Inter', size: 10, weight: '700' },
                    color: '#94a3b8',
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: '#000000',
                borderColor: '#76B900',
                borderWidth: 1,
                padding: 12,
                borderRadius: 4,
                titleFont: { family: 'Inter', size: 12, weight: '700' },
                bodyFont: { family: 'Inter', size: 11 },
                displayColors: true,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', size: 10 }, color: '#475569', padding: 10 }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                ticks: {
                    font: { family: 'Inter', size: 10 },
                    color: '#76B900',
                    padding: 10,
                },
                title: { display: true, text: 'LATENCY (MS)', font: { family: 'Inter', size: 10, weight: '800' }, color: '#76B900' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { display: false },
                ticks: {
                    font: { family: 'Inter', size: 10 },
                    color: '#94a3b8',
                    padding: 10,
                },
                title: { display: true, text: 'LOAD %', font: { family: 'Inter', size: 10, weight: '800' }, color: '#94a3b8' },
                min: 0,
                max: 100
            }
        },
        interaction: { mode: 'index', intersect: false },
        elements: {
            line: { tension: 0.4 },
            point: { radius: 0, hoverRadius: 6 }
        }
    };

    const chartData = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'LATENCY (MS)',
                data: reversedData.map(m => m.metrics?.responseTime || 0),
                borderColor: '#76B900',
                yAxisID: 'y',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(118, 185, 0, 0.2)');
                    gradient.addColorStop(1, 'rgba(118, 185, 0, 0)');
                    return gradient;
                },
                borderWidth: 2,
            },
            {
                fill: true,
                label: 'CPU LOAD (%)',
                data: reversedData.map(m => m.metrics?.cpuUsage || 0),
                borderColor: '#FFFFFF',
                yAxisID: 'y1',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    return gradient;
                },
                borderWidth: 2,
                borderDash: [5, 5]
            }
        ],
    };

    return (
        <div className="glass-card p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Performance Streams</h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Live Telemetry Data</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-nvidia-gray text-nvidia-green rounded-sm text-[10px] font-bold uppercase tracking-tighter border border-nvidia-green/30">
                        <div className="w-1.5 h-1.5 bg-nvidia-green rounded-full animate-pulse shadow-[0_0_5px_#76B900]"></div>
                        Telemetry: Sync
                    </span>
                </div>
            </div>
            <div className="h-[400px]">
                <Line options={chartOptions} data={chartData} />
            </div>
        </div>
    );
};

export default MetricsChart;
