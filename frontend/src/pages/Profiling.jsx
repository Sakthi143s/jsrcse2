import React, { useEffect, useState } from 'react';
import api from '../services/api';
import socket from '../services/websocket';
import ProfileList from '../components/profiling/ProfileList';
import { FileCode, Play, RefreshCw } from 'lucide-react';

const Profiling = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profiling, setProfiling] = useState(false);

    useEffect(() => {
        fetchProfiles();

        socket.on('profile:created', (newProfile) => {
            setProfiles((prev) => [newProfile, ...prev]);
        });

        return () => {
            socket.off('profile:created');
        };
    }, []);

    const fetchProfiles = async () => {
        try {
            const response = await api.get('/profiles');
            setProfiles(response.data);
        } catch (error) {
            console.error('Failed to fetch profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const triggerProfiling = async (input = null) => {
        setProfiling(true);
        try {
            let profileBody;

            if (input) {
                // Parse text input like "funcA - 200ms"
                const lines = input.split('\n').filter(l => l.trim());
                const functions = lines.map(line => {
                    const [name, timeStr] = line.split('-').map(s => s.trim());
                    const time = parseInt(timeStr) || 0;
                    return { name, file: 'manual-input', selfTime: time, totalTime: time, calls: 1 };
                });

                const maxFunc = functions.reduce((prev, current) => (prev.selfTime > current.selfTime) ? prev : current, functions[0]);

                profileBody = {
                    service: 'manual-analysis',
                    duration: functions.reduce((sum, f) => sum + f.selfTime, 0),
                    profileData: { functions },
                    summary: {
                        totalFunctions: functions.length,
                        hottestFunction: maxFunc?.name || 'unknown',
                        totalSamples: functions.length * 10
                    },
                    tags: ['manual-input']
                };
            } else {
                profileBody = {
                    service: 'order-service',
                    duration: 500,
                    profileData: {
                        functions: [
                            { name: 'processOrder', file: 'orderController.js', selfTime: 200, totalTime: 450, calls: 1 },
                            { name: 'validateUser', file: 'userUtils.js', selfTime: 50, totalTime: 100, calls: 5 },
                            { name: 'calculateTax', file: 'taxService.js', selfTime: 150, totalTime: 150, calls: 1 }
                        ]
                    },
                    summary: {
                        totalFunctions: 15,
                        hottestFunction: 'processOrder',
                        totalSamples: 5000
                    },
                    tags: ['manual-trigger']
                };
            }

            await api.post('/profiles', profileBody);
            if (input) document.getElementById('profileInput').value = '';
        } catch (error) {
            console.error('Profiling failed:', error);
        } finally {
            setProfiling(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="w-12 h-12 border-2 border-nvidia-green border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_#76B900]"></div>
                <p className="text-nvidia-green font-black uppercase tracking-widest text-[10px]">Decompiling Stream...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="glass-card p-6 border border-nvidia-green/20">
                <h3 className="text-xs font-black text-white italic uppercase tracking-widest mb-2 flex items-center gap-2">
                    <FileCode size={16} className="text-nvidia-green" />
                    Neural Profiling Input
                </h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Input function timings or raw trace data</p>
                <textarea
                    placeholder="functionA - 200ms&#10;functionB - 900ms"
                    className="w-full h-32 p-4 bg-nvidia-black/50 border border-white/10 rounded-sm font-mono text-xs text-nvidia-green focus:outline-none focus:ring-1 focus:ring-nvidia-green transition-all"
                    id="profileInput"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => {
                            const val = document.getElementById('profileInput').value;
                            if (val) triggerProfiling(val);
                        }}
                        disabled={profiling}
                        className="flex items-center gap-2 px-6 py-2 bg-nvidia-green text-nvidia-black rounded-sm font-black uppercase tracking-tighter italic hover:bg-white transition-all disabled:opacity-30 shadow-[0_0_15px_rgba(118,185,0,0.2)]"
                    >
                        {profiling ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
                        Execute Trace
                    </button>
                </div>
            </div>

            <div className="flex items-end justify-between border-b border-nvidia-gray/50 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                        <FileCode className="text-nvidia-green" size={28} />
                        Trace <span className="text-nvidia-green">Intelligence</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">CPU & Execution Stack Analysis</p>
                </div>

                <button
                    onClick={fetchProfiles}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 text-slate-400 rounded-sm font-black uppercase tracking-tighter border border-white/5 hover:text-white hover:bg-white/10 transition-all"
                >
                    <RefreshCw size={16} />
                    Refresh Results
                </button>
            </div>

            <ProfileList profiles={profiles} />
        </div>
    );
};

export default Profiling;
