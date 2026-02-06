import React, { useState } from 'react';
import { Copy, Check, Terminal, Globe, ShieldCheck } from 'lucide-react';

const MonitoringSetup = () => {
    const [copied, setCopied] = useState(false);
    const backendUrl = window.location.origin.includes('localhost') ? 'http://localhost:5006' : window.location.origin;

    const snippet = `<!-- AI Performance Monitoring Agent -->
<script src="${backendUrl}/agent.js" async></script>
<!-- End Monitoring Agent -->`;

    const handleCopy = () => {
        navigator.clipboard.writeText(snippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Setup Universal Monitoring</h1>
                <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <ShieldCheck size={16} />
                    <span>Active & Ready</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Globe className="text-blue-500" size={24} />
                        How it Works
                    </h2>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        To monitor *any* web application, whether it's built with React, Vue, or just plain HTML,
                        simply add this lightweight script to your page. It automatically captures:
                    </p>
                    <ul className="space-y-3">
                        {[
                            'Page Load & DOM Ready timing',
                            'Core Web Vitals (LCP, CLS, FID)',
                            'JavaScript Errors & Crashes',
                            'Network & Resource Latency'
                        ].map((detail, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-600">
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                                {detail}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Terminal className="text-purple-500" size={24} />
                        Installation Snippet
                    </h2>
                    <p className="text-slate-600 mb-4">
                        Copy and paste this script before the closing <code>&lt;/head&gt;</code> tag of your website.
                    </p>
                    <div className="relative group">
                        <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed">
                            {snippet}
                        </pre>
                        <button
                            onClick={handleCopy}
                            className="absolute right-3 top-3 p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-blue-900 rounded-2xl p-8 text-white">
                <h2 className="text-xl font-bold mb-4">Quick Verification</h2>
                <p className="text-blue-100 mb-6">
                    Once added, open your web application in a browser. Metrics will begin appearing
                    instantly in the <span className="font-semibold text-white">Live Monitoring</span> tab.
                </p>
                <div className="flex gap-4">
                    <div className="bg-blue-800/50 p-4 rounded-xl border border-blue-700/50 flex-1">
                        <div className="text-blue-300 text-sm mb-1 uppercase tracking-wider font-semibold">Step 1</div>
                        <div className="font-medium">Deploy script to your site</div>
                    </div>
                    <div className="bg-blue-800/50 p-4 rounded-xl border border-blue-700/50 flex-1">
                        <div className="text-blue-300 text-sm mb-1 uppercase tracking-wider font-semibold">Step 2</div>
                        <div className="font-medium">Refresh your site browser tab</div>
                    </div>
                    <div className="bg-blue-800/50 p-4 rounded-xl border border-blue-700/50 flex-1">
                        <div className="text-blue-300 text-sm mb-1 uppercase tracking-wider font-semibold">Step 3</div>
                        <div className="font-medium">Check logs in this dashboard</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonitoringSetup;
