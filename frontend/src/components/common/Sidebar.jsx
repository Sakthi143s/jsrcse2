import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, AlertTriangle, Database, FileCode, TrendingDown, Settings } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/monitoring', label: 'Live Monitoring', icon: Activity },
        { path: '/bottlenecks', label: 'Bottlenecks', icon: AlertTriangle },
        { path: '/queries', label: 'Query Logic', icon: Database },
        { path: '/profiling', label: 'Tracing', icon: FileCode },
        { path: '/regressions', label: 'Regressions', icon: TrendingDown },
    ];

    return (
        <div className="w-64 h-screen bg-nvidia-black text-white flex flex-col fixed left-0 top-0 border-r border-nvidia-gray/30">
            <div className="p-6 border-b border-nvidia-gray/30 bg-white/5">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-nvidia-green rounded-sm animate-pulse shadow-[0_0_10px_#76B900]"></div>
                    <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">
                        AI PERF <span className="text-nvidia-green">Monitoring</span>
                    </h1>
                </div>
                <p className="text-[9px] text-nvidia-green/60 uppercase tracking-[0.2em] font-black">Performance Platform</p>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-sm transition-all duration-200 font-bold tracking-tight uppercase text-[11px] ${isActive
                                ? 'bg-nvidia-gray text-nvidia-green border-l-2 border-nvidia-green shadow-[inset_4px_0_10px_rgba(118,185,0,0.1)]'
                                : 'text-slate-500 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={16} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-nvidia-gray/30 bg-white/5">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">v1.2.0 - Stable</div>
            </div>
        </div>
    );
};

export default Sidebar;
