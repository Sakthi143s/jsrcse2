const mongoose = require('mongoose');

const RegressionSchema = new mongoose.Schema({
    detectedAt: { type: Date, default: Date.now },
    service: { type: String, required: true },
    metric: { type: String, required: true },
    baseline: {
        value: { type: Number, required: true },
        timestamp: { type: Date, required: true }
    },
    current: {
        value: { type: Number, required: true },
        timestamp: { type: Date, required: true }
    },
    degradation: {
        percentage: { type: Number, required: true },
        absolute: { type: Number }
    },
    possibleCauses: [{
        type: { type: String },
        description: { type: String },
        confidence: { type: Number }
    }],
    status: {
        type: String,
        enum: ['new', 'acknowledged', 'investigating', 'resolved', 'false_positive'],
        default: 'new'
    },
    acknowledgedAt: { type: Date },
    resolvedAt: { type: Date }
});

module.exports = mongoose.model('Regression', RegressionSchema);
