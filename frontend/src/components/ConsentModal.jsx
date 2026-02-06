import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';

const ConsentModal = ({ onConsent }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already given consent
        const consent = localStorage.getItem('performanceMonitoringConsent');
        if (!consent) {
            setIsVisible(true);
        } else if (consent === 'granted') {
            onConsent(true);
        }
    }, [onConsent]);

    const handleAccept = () => {
        localStorage.setItem('performanceMonitoringConsent', 'granted');
        setIsVisible(false);
        onConsent(true);
    };

    const handleDecline = () => {
        localStorage.setItem('performanceMonitoringConsent', 'denied');
        setIsVisible(false);
        onConsent(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700/50 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Performance Monitoring</h2>
                            <p className="text-blue-100 text-sm">Your privacy matters to us</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        This application monitors system performance metrics to help optimize your experience.
                    </p>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            What we collect:
                        </h3>
                        <ul className="text-slate-400 text-sm space-y-1 ml-4">
                            <li>• CPU and Memory usage</li>
                            <li>• API response times</li>
                            <li>• Performance bottlenecks</li>
                            <li>• Query execution times</li>
                        </ul>
                    </div>

                    <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
                        <p className="text-blue-200 text-sm">
                            <strong>Note:</strong> All data is processed locally and used only for performance optimization.
                            You can revoke consent anytime in Settings.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-slate-800/30 border-t border-slate-700/50 flex gap-3">
                    <button
                        onClick={handleDecline}
                        className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all font-medium shadow-lg shadow-blue-500/20"
                    >
                        Accept & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsentModal;
