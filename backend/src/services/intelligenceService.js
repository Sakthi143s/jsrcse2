/**
 * Intelligence Service - Adaptive Baselines & Pattern Recognition
 */

class IntelligenceService {
    constructor() {
        this.baselines = new Map(); // Store MA and SD per service/metric
        this.windowSize = 20; // Reduced for faster demo adaptation
    }

    /**
     * Calculate/Update Adaptive Baseline
     */
    updateBaseline(key, value) {
        if (!this.baselines.has(key)) {
            this.baselines.set(key, { values: [], ma: value, sd: 0 });
        }

        const data = this.baselines.get(key);
        data.values.push(value);
        if (data.values.length > this.windowSize) data.values.shift();

        // Calculate Moving Average
        const sum = data.values.reduce((a, b) => a + b, 0);
        data.ma = sum / data.values.length;

        // Calculate Standard Deviation
        const variance = data.values.reduce((a, b) => a + Math.pow(b - data.ma, 2), 0) / data.values.length;
        data.sd = Math.sqrt(variance);

        return data;
    }

    /**
     * Detect Anomaly using Adaptive Threshold (Z-Score > 2)
     */
    isAnomaly(key, value) {
        const data = this.baselines.get(key);
        if (!data || data.values.length < 3) return false; // Reduced warm-up for demo

        const zScore = data.sd === 0 ? 0 : (value - data.ma) / data.sd;
        return zScore > 2.0; // Statistical anomaly if value is 2 SD above mean
    }

    /**
     * Intelligent Query Anti-Pattern Detection
     */
    detectQueryPatterns(queryText) {
        const patterns = [
            { id: 'SELECT_STAR', regex: /SELECT\s+\*/i, suggestion: "Avoid SELECT *. Explicitly list required columns to reduce I/O and memory overhead." },
            { id: 'MISSING_WHERE', regex: /^SELECT\b(?!.*\bWHERE\b).*$/i, suggestion: "Missing WHERE clause detected. Large tables will cause full collection scans." },
            { id: 'FUZZY_REGEX', regex: /\$regex\b/i, suggestion: "Regex-based matching detected. Use indexed text search or exact equality for performance." },
            { id: 'MULTIPLE_JOINS', regex: /(\bJOIN\b.*){3,}/i, suggestion: "Multiple joins detected. Verify query plan for nested loop inefficiencies." }
        ];

        return patterns.filter(p => p.regex.test(queryText));
    }

    /**
     * Correlate System and App metrics
     */
    correlate(appLatency, systemCpu) {
        const latencyAnomaly = this.isAnomaly('api_latency', appLatency);
        const cpuAnomaly = systemCpu > 80; // High host load

        if (latencyAnomaly && cpuAnomaly) {
            return { type: 'HOST_SATURATION', description: 'Host CPU saturation is impacting API response times.' };
        } else if (latencyAnomaly && !cpuAnomaly) {
            return { type: 'CODE_INEFFICIENCY', description: 'High API latency detected without host pressure. Potentially a code-level bottleneck.' };
        }
        return null;
    }
}

module.exports = new IntelligenceService();
