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
                    font: { family: 'Inter', size: 12, weight: '500' },
                    color: '#64748b'
                }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                borderRadius: 8,
                titleFont: { family: 'Inter', size: 13, weight: '600' },
                bodyFont: { family: 'Inter', size: 12 },
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                            if (context.dataset.yAxisID === 'y') {
                                label += ' ms';
                            } else if (context.dataset.yAxisID === 'y1') {
                                label += ' %';
                            }
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8', padding: 10 }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { borderDash: [5, 5], color: '#e2e8f0', drawBorder: false },
                ticks: {
                    font: { family: 'Inter', size: 11 },
                    color: '#3b82f6',
                    padding: 10,
                    callback: (value) => `${value} ms`
                },
                title: { display: true, text: 'Response Time', font: { family: 'Inter', size: 12, weight: '600' }, color: '#3b82f6' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { display: false },
                ticks: {
                    font: { family: 'Inter', size: 11 },
                    color: '#8b5cf6',
                    padding: 10,
                    callback: (value) => `${value}%`
                },
                title: { display: true, text: 'CPU Usage', font: { family: 'Inter', size: 12, weight: '600' }, color: '#8b5cf6' },
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
                label: 'Response Time (ms)',
                data: reversedData.map(m => m.metrics?.responseTime || 0),
                borderColor: '#3b82f6',
                yAxisID: 'y',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                    return gradient;
                },
                borderWidth: 3,
            },
            {
                fill: true,
                label: 'CPU Usage (%)',
                data: reversedData.map(m => m.metrics?.cpuUsage || 0),
                borderColor: '#8b5cf6',
                yAxisID: 'y1',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
                    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
                    return gradient;
                },
                borderWidth: 3,
            }
        ],
    };

    return (
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-slate-100 mb-8 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Real-time Performance Metrics</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">Live streaming system health and response data</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold ring-1 ring-blue-100">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                        Live Feed
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
