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
    // Stub for AI Analysis
    try {
        // In a real app, this would trigger the AI Analysis Service
        // For now, we'll create a dummy bottleneck
        const newBottleneck = new Bottleneck({
            service: 'user-service',
            type: 'database',
            severity: 'high',
            location: { file: 'userController.js', function: 'getUser', line: 42 },
            impact: { affectedUsers: 100, performanceDegradation: 30 },
            aiSuggestions: [{ recommendation: 'Add index on email field', confidence: 0.95 }]
        });
        await newBottleneck.save();

        if (req.io) {
            req.io.emit('bottleneck:detected', newBottleneck);
        }

        res.status(201).json(newBottleneck);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
