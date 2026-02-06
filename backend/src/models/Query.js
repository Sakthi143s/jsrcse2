const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    database: { type: String, required: true },
    queryText: { type: String, required: true },
    executionTime: { type: Number, required: true },
    rowsAffected: { type: Number },
    indexesUsed: [{ type: String }],
    optimizationSuggestions: [{
        type: { type: String },
        suggestion: { type: String },
        potentialImprovement: { type: Number }
    }],
    explainPlan: { type: mongoose.Schema.Types.Mixed },
    isOptimized: { type: Boolean, default: false }
});

module.exports = mongoose.model('Query', QuerySchema);
