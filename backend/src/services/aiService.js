/**
 * expert AI Service for Performance Optimization
 */

exports.explainBottleneck = async (bottleneck) => {
    const { type, severity, description, location } = bottleneck;

    let explanation = "";
    let suggestions = [];

    switch (type.toUpperCase()) {
        case 'CPU':
            explanation = `Adaptive alert: High CPU contention detected at ${location.file || location}. This deviation from the learned baseline suggests a computationally intensive hot path.`;
            suggestions = [
                { recommendation: "Correlate with system-level I/O wait to rule out hardware limits.", confidence: 0.94 },
                { recommendation: "Offload synchronized blocks to Worker Threads.", confidence: 0.92 },
                { recommendation: "Analyze thread contention in the event loop.", confidence: 0.88 }
            ];
            break;
        case 'MEMORY':
            explanation = `Dynamic baseline breach: Memory pressure detected. This indicates an anomaly compared to the system's learned memory footprint.`;
            suggestions = [
                { recommendation: "Perform a diff of heap snapshots taken during the anomaly window.", confidence: 0.96 },
                { recommendation: "Check for uncollected buffer references in stream handlers.", confidence: 0.90 }
            ];
            break;
        case 'CODE':
            explanation = `Latency anomaly: Logical execution delay detected in ${location.function}. Response time is significantly higher than the P95 adaptive baseline.`;
            suggestions = [
                { recommendation: "Audit for waterfall-style async/await calls.", confidence: 0.92 },
                { recommendation: "Review shared state locking mechanisms for potential deadlocks.", confidence: 0.85 }
            ];
            break;
        case 'HOST_SATURATION':
            explanation = `Intelligent correlation: API latency is spiking in direct correlation with host CPU/Memory saturation. The bottleneck is infrastructure-related.`;
            suggestions = [
                { recommendation: "Consider horizontal scaling to distribute the compute load.", confidence: 0.95 },
                { recommendation: "Validate that the host has sufficient file descriptors and connection pool capacity.", confidence: 0.90 }
            ];
            break;
        default:
            explanation = `Unclassified performance anomaly: ${description}.`;
            suggestions = [
                { recommendation: "Review distributed traces around the point of failure.", confidence: 0.80 },
                { recommendation: "Verify infrastructure health metrics (Network Latency, Disk I/O).", confidence: 0.75 }
            ];
    }

    return {
        why: explanation,
        suggestions: suggestions.map(s => ({ ...s, why: explanation }))
    };
};

exports.analyzeRegression = async (regression) => {
    const { metric, baseline, current, degradation } = regression;

    return {
        analysis: `Critical performance regression: ${metric} increased by ${degradation.percentage}% (from ${baseline.value}ms to ${current.value}ms). This exceeds the defined SLA threshold.`,
        suggestions: [
            "Check for recent deployments or configuration changes (Config Drift).",
            "Monitor upstream third-party APIs for latency spikes.",
            "Verify if the regression correlates with a sudden increase in concurrent sessions.",
            "Analyze DB connection pool saturation metrics."
        ]
    };
};

exports.suggestQueryOptimization = async (queryData) => {
    const { queryText, executionTime } = queryData;

    // Example rule-based AI suggestion for queries
    let suggestions = [];
    if (executionTime > 100) {
        suggestions.push("Add a compound index for the filtered fields.");
        suggestions.push("Use projection to return only required fields.");
    }
    if (queryText.includes('$regex')) {
        suggestions.push("Avoid regex-based searches; use indexed text search or exact matches.");
    }

    return {
        analysis: `Query is slow (${executionTime}ms). Execution plan suggests a table scan might be occurring.`,
        optimizedQuery: `/* Optimized Version */\n${queryText} // Consider using .hint() or specific indexes`,
        suggestions: suggestions
    };
};
