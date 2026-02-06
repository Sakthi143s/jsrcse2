const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  service: { type: String, required: true, index: true },
  endpoint: { type: String, required: true },
  metrics: {
    responseTime: { type: Number, required: true },
    cpuUsage: { type: Number },
    memoryUsage: { type: Number },
    requestCount: { type: Number },
    errorRate: { type: Number }
  },
  tags: [{ type: String }],
  metadata: { type: Map, of: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('Metric', MetricSchema);
