const mongoose = require('mongoose');

const BottleneckSchema = new mongoose.Schema({
    detectedAt: { type: Date, default: Date.now },
    service: { type: String, required: true },
    type: {
        type: String,
        enum: ['cpu', 'memory', 'io', 'network', 'database', 'code'],
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    location: {
        file: { type: String },
        function: { type: String },
        line: { type: Number }
    },
    impact: {
        affectedUsers: { type: Number },
        performanceDegradation: { type: Number },
        estimatedCost: { type: Number }
    },
    aiSuggestions: [{
        recommendation: { type: String },
        confidence: { type: Number },
        estimatedImprovement: { type: Number }
    }],
    status: {
        type: String,
        enum: ['open', 'investigating', 'resolved', 'ignored'],
        default: 'open'
    },
    resolvedAt: { type: Date }
});

module.exports = mongoose.model('Bottleneck', BottleneckSchema);
