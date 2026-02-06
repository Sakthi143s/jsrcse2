const Regression = require('../models/Regression');

exports.getRegressions = async (req, res) => {
    try {
        const regressions = await Regression.find().sort({ detectedAt: -1 });
        res.json(regressions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.detectRegressions = async (req, res) => {
    try {
        const Metric = require('../models/Metric');
        const aiService = require('../services/aiService');
        const recentMetrics = await Metric.find({ service: 'api-gateway' })
            .sort({ createdAt: -1 })
            .limit(20);

        if (recentMetrics.length >= 10) {
            const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.metrics.responseTime, 0) / recentMetrics.length;
            const latestMetrics = recentMetrics.slice(0, 3);
            const latestAvg = latestMetrics.reduce((sum, m) => sum + m.metrics.responseTime, 0) / latestMetrics.length;

            if (latestAvg > avgResponseTime * 1.5) {
                const regressionData = {
                    service: 'api-gateway',
                    metric: 'responseTime',
                    baseline: { value: Math.round(avgResponseTime), timestamp: recentMetrics[19].createdAt },
                    current: { value: Math.round(latestAvg), timestamp: new Date() },
                    degradation: { percentage: Math.round(((latestAvg - avgResponseTime) / avgResponseTime) * 100) }
                };

                const analysis = await aiService.analyzeRegression(regressionData);

                const regression = new Regression({
                    ...regressionData,
                    possibleCauses: analysis.suggestions.map(s => ({ type: 'AI-Suggestion', description: s, confidence: 0.8 }))
                });

                await regression.save();
                if (req.io) req.io.emit('regression:detected', regression);
                return res.status(201).json(regression);
            }
        }
        res.json({ message: 'No regressions detected in current real data.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
