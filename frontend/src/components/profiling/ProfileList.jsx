import React from 'react';
import { FileCode, Clock, Server, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';

const ProfileCard = ({ profile }) => {
    return (
        <div className="p-5 mb-4 rounded-lg shadow-sm bg-white border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <FileCode size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-700">{profile.service}</h3>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock size={12} /> {format(new Date(profile.createdAt), 'MMM d, HH:mm:ss')}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold text-slate-800">{profile.duration}ms</div>
                    <span className="text-xs text-slate-400">Total Duration</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded">
                    <span className="text-xs text-slate-500 block mb-1">Hottest Function</span>
                    <span className="font-mono text-sm font-medium text-red-600 truncate block" title={profile.summary?.hottestFunction}>
                        {profile.summary?.hottestFunction || 'N/A'}
                    </span>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                    <span className="text-xs text-slate-500 block mb-1">Total Functions</span>
                    <span className="font-mono text-sm font-medium text-slate-700">
                        {profile.summary?.totalFunctions || 0}
                    </span>
                </div>
            </div>

            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Top Functions</h4>
                <div className="space-y-2">
                    {profile.profileData?.functions?.slice(0, 3).map((fn, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="font-mono text-slate-600 truncate w-2/3" title={fn.name}>{fn.name}</span>
                            <span className="font-medium text-slate-700">{fn.totalTime}ms</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProfileList = ({ profiles }) => {
    if (profiles.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
                    <BarChart2 className="text-purple-600" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-700">No Profiles Found</h3>
                <p className="text-slate-500">Generate a profile to see code performance breakdowns.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((p) => (
                <ProfileCard key={p._id} profile={p} />
            ))}
        </div>
    );
};

export default ProfileList;
