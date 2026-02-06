const Metric = require('../models/Metric');

exports.ingestMetric = async (req, res) => {
    try {
        const { service, endpoint, metrics, tags } = req.body;

        // Basic validation
        if (!service || !endpoint || !metrics) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const metric = new Metric({
            service,
            endpoint,
            metrics,
            tags
        });

        await metric.save();

        if (req.io) {
            req.io.emit('metric:update', metric);
        }

        res.status(201).json({ message: 'Metric ingested successfully', id: metric._id });
    } catch (error) {
        console.error('Error ingesting metric:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getStats = async (req, res) => {
    try {
        const stats = await Metric.aggregate([
            {
                $group: {
                    _id: '$service',
                    avgResponseTime: { $avg: '$metrics.responseTime' },
                    avgCpu: { $avg: '$metrics.cpuUsage' },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getLatestMetrics = async (req, res) => {
    try {
        const metrics = await Metric.find().sort({ timestamp: -1 }).limit(100);
        res.json(metrics);
    } catch (error) {
        console.error('Error getting latest metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
