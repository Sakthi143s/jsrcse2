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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Manual Profiling Input</h3>
                <p className="text-slate-500 text-sm mb-4">Paste function timings (e.g., "functionA - 200ms") or raw JSON.</p>
                <textarea
                    placeholder="functionA - 200ms&#10;functionB - 900ms"
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    id="profileInput"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => {
                            const val = document.getElementById('profileInput').value;
                            if (val) triggerProfiling(val);
                        }}
                        disabled={profiling}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 shadow-md transition-all disabled:opacity-50"
                    >
                        {profiling ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
                        Profile Code
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FileCode className="text-purple-500" />
                        Analysis History
                    </h1>
                    <p className="text-slate-500">Analyze function-level performance and call stacks.</p>
                </div>

                <button
                    onClick={fetchProfiles}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
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
