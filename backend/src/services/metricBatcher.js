const Metric = require('../models/Metric');

class MetricBatcher {
    constructor() {
        this.queue = [];
        this.batchInterval = 5000; // 5 seconds
        this.maxBatchSize = 100;
        this.timer = null;
    }

    add(metricData) {
        this.queue.push(metricData);
        if (this.queue.length >= this.maxBatchSize) {
            this.flush();
        } else if (!this.timer) {
            this.timer = setTimeout(() => this.flush(), this.batchInterval);
        }
    }

    async flush() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        if (this.queue.length === 0) return;

        const currentBatch = [...this.queue];
        this.queue = [];

        try {
            await Metric.insertMany(currentBatch, { ordered: false });
            // console.log(`[MetricBatcher] Successfully saved ${currentBatch.length} metrics.`);
        } catch (err) {
            console.error(`[MetricBatcher] Failed to save batch:`, err.message);
            // In a real production app, you might want to retry or log to a dead-letter queue
        }
    }
}

module.exports = new MetricBatcher();
