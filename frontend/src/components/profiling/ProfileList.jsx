import React from 'react';
import { FileCode, Clock, Server, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';

const ProfileCard = ({ profile }) => {
    return (
        <div className="p-5 mb-4 rounded-sm glass-card border-l-2 border-nvidia-green hover:shadow-[0_0_15px_rgba(118,185,0,0.2)] transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-sm text-nvidia-green">
                        <FileCode size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-white italic tracking-tighter uppercase text-sm leading-tight">{profile.service}</h3>
                        <span className="text-[9px] font-black text-slate-500 flex items-center gap-1 uppercase tracking-widest">
                            <Clock size={12} /> {format(new Date(profile.createdAt), 'MMM d, HH:mm:ss')}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-black text-nvidia-green italic tracking-tighter tabular-nums drop-shadow-[0_0_5px_rgba(118,185,0,0.3)]">{profile.duration}ms</div>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Execution Pulse</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-nvidia-black/50 p-3 rounded-sm border border-white/5">
                    <span className="text-[8px] font-black text-slate-500 block mb-1 uppercase tracking-widest">HOT FUNCTION</span>
                    <span className="font-mono text-xs font-black text-nvidia-green truncate block italic" title={profile.summary?.hottestFunction}>
                        {profile.summary?.hottestFunction || 'N/A'}
                    </span>
                </div>
                <div className="bg-nvidia-black/50 p-3 rounded-sm border border-white/5">
                    <span className="text-[8px] font-black text-slate-500 block mb-1 uppercase tracking-widest">TRACE DEPTH</span>
                    <span className="font-mono text-xs font-black text-white italic">
                        {profile.summary?.totalFunctions || 0} Nodes
                    </span>
                </div>
            </div>

            <div className="border-t border-white/5 pt-3">
                <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Critical Path Breakdown</h4>
                <div className="space-y-2">
                    {profile.profileData?.functions?.slice(0, 3).map((fn, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px] bg-white/[0.02] p-2 rounded-sm border border-white/5">
                            <span className="font-mono text-slate-400 truncate w-2/3 italic" title={fn.name}>{fn.name}</span>
                            <span className="font-black text-nvidia-green tabular-nums">{fn.totalTime}ms</span>
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
            <div className="text-center py-12 glass-card border-dashed">
                <div className="bg-nvidia-green/10 p-4 rounded-full inline-block mb-4">
                    <BarChart2 className="text-nvidia-green" size={32} />
                </div>
                <h3 className="text-sm font-black text-white italic uppercase tracking-tighter">No Active Traces</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Ready for decompilation</p>
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
