const Bottleneck = require('../models/Bottleneck');

exports.getBottlenecks = async (req, res) => {
    try {
        const bottlenecks = await Bottleneck.find().sort({ detectedAt: -1 });
        res.json(bottlenecks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBottleneckById = async (req, res) => {
    try {
        const bottleneck = await Bottleneck.findById(req.params.id);
        if (!bottleneck) return res.status(404).json({ error: 'Bottleneck not found' });
        res.json(bottleneck);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.analyzeBottlenecks = async (req, res) => {
    const { getRealMetrics } = require('../utils/systemMetrics');
    const aiService = require('../services/aiService');
    try {
        const data = await getRealMetrics();
        if (data && data.bottlenecks.length > 0) {
            const detectedBottlenecks = [];
            for (const b of data.bottlenecks) {
                const explanation = await aiService.explainBottleneck(b);
                const bottleneck = new Bottleneck({
                    ...b,
                    service: 'host-system',
                    status: 'new',
                    aiSuggestions: explanation.suggestions
                });
                await bottleneck.save();
                detectedBottlenecks.push(bottleneck);
                if (req.io) req.io.emit('bottleneck:detected', bottleneck);
            }
            res.status(201).json({ message: `${data.bottlenecks.length} bottlenecks detected.`, bottlenecks: detectedBottlenecks });
        } else {
            res.json({ message: 'No bottlenecks detected in real-time scan.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBottleneckStats = async (req, res) => {
    try {
        const slowEndpoints = await Bottleneck.find({ type: 'code' })
            .sort({ 'impact.performanceDegradation': -1 })
            .limit(5);

        const highCpu = await Bottleneck.find({ type: 'cpu' })
            .sort({ 'impact.performanceDegradation': -1 })
            .limit(5);

        res.json({
            slowEndpoints,
            highCpu
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
