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
        // Stub for logical detection
        // Assuming we received current metrics and comparing against baseline
        const dummyRegression = new Regression({
            service: 'payment-service',
            metric: 'responseTime',
            baseline: { value: 200, timestamp: new Date(Date.now() - 86400000) },
            current: { value: 350, timestamp: new Date() },
            degradation: { percentage: 75, absolute: 150 },
            possibleCauses: [{ type: 'Deploy', description: 'Recent deployment v1.2.0', confidence: 0.8 }]
        });
        await dummyRegression.save();

        if (req.io) {
            req.io.emit('regression:detected', dummyRegression);
        }

        res.status(201).json(dummyRegression);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
