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

    const triggerProfiling = async () => {
        setProfiling(true);
        try {
            // Stimulate a profiling session with dummy data
            await api.post('/profiles', {
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
                tags: ['manual-trigger', 'v1.2.0']
            });
        } catch (error) {
            console.error('Profiling simulation failed:', error);
        } finally {
            setProfiling(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FileCode className="text-purple-500" />
                        Code Profiling
                    </h1>
                    <p className="text-slate-500">Analyze function-level performance and call stacks.</p>
                </div>

                <button
                    onClick={fetchProfiles}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 shadow-md hover:shadow-lg transition-colors"
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
