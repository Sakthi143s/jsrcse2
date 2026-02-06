import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, AlertTriangle, Database, FileCode, TrendingDown } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/monitoring', label: 'Live Monitoring', icon: Activity },
        { path: '/bottlenecks', label: 'Bottlenecks', icon: AlertTriangle },
        { path: '/queries', label: 'Query Optimization', icon: Database },
        { path: '/profiling', label: 'Code Profiling', icon: FileCode },
        { path: '/regressions', label: 'Regressions', icon: TrendingDown },
    ];

    return (
        <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    AI Performance
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600 shadow-lg shadow-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
