// Monitoring Configuration
module.exports = {
    // Monitoring interval in milliseconds
    interval: 10000, // 10 seconds

    // Metric retention period in days
    retentionPeriod: 7,

    // Alert thresholds
    thresholds: {
        cpu: {
            warning: 70,
            critical: 80
        },
        memory: {
            warning: 80,
            critical: 90
        },
        disk: {
            warning: 80,
            critical: 90
        },
        responseTime: {
            warning: 200,
            critical: 500
        }
    },

    // Enabled monitoring features
    features: {
        systemMetrics: true,
        processMonitoring: true,
        networkStats: true,
        diskStats: true,
        apiMetrics: true,
        bottleneckDetection: true,
        regressionDetection: true
    },

    // WebSocket event configuration
    websocket: {
        emitSystemMetrics: true,
        emitProcessData: true,
        emitNetworkStats: true,
        emitHealthStatus: true
    }
};
