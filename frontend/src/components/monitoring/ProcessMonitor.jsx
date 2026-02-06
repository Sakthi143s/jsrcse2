import React, { useEffect, useState } from 'react';
import { Cpu, MemoryStick, Search } from 'lucide-react';
import socket from '../../services/websocket';

const ProcessMonitor = () => {
    const [processes, setProcesses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('cpu'); // 'cpu' or 'mem'

    useEffect(() => {
        socket.on('system:metrics', (data) => {
            if (data.topProcesses) {
                setProcesses(data.topProcesses);
            }
        });

        return () => {
            socket.off('system:metrics');
        };
    }, []);

    const filteredProcesses = processes
        .filter(proc =>
            proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proc.command.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'cpu') return b.cpu - a.cpu;
            return b.mem - a.mem;
        });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Cpu className="text-purple-500" size={20} />
                        Top Processes
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('cpu')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${sortBy === 'cpu'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            By CPU
                        </button>
                        <button
                            onClick={() => setSortBy('mem')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${sortBy === 'mem'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            By Memory
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search processes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">PID</th>
                            <th className="px-6 py-3">Process Name</th>
                            <th className="px-6 py-3 text-right">CPU %</th>
                            <th className="px-6 py-3 text-right">Memory %</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProcesses.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                                    {searchTerm ? 'No processes found' : 'Waiting for process data...'}
                                </td>
                            </tr>
                        ) : (
                            filteredProcesses.map((proc, index) => (
                                <tr key={proc.pid || index} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-600">{proc.pid}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-700">{proc.name}</span>
                                            <span className="text-xs text-slate-400 font-mono truncate max-w-md">
                                                {proc.command}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-500 rounded-full"
                                                    style={{ width: `${Math.min(proc.cpu, 100)}%` }}
                                                />
                                            </div>
                                            <span className="font-mono text-slate-700 w-12 text-right">
                                                {proc.cpu.toFixed(1)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${Math.min(proc.mem, 100)}%` }}
                                                />
                                            </div>
                                            <span className="font-mono text-slate-700 w-12 text-right">
                                                {proc.mem.toFixed(1)}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProcessMonitor;
