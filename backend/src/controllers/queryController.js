const Query = require('../models/Query');

exports.getQueries = async (req, res) => {
    try {
        const queries = await Query.find().sort({ timestamp: -1 });
        res.json(queries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.analyzeQuery = async (req, res) => {
    try {
        const { queryText, database, executionTime } = req.body;
        if (!queryText || !executionTime) {
            return res.status(400).json({ error: 'Real execution data required' });
        }
        const newQuery = new Query({
            queryText,
            database: database || 'Laptop-OS',
            executionTime,
            isOptimized: executionTime < 100,
            optimizationSuggestions: executionTime > 100 ? [{ type: 'Performance', suggestion: 'Optimize operation complexity' }] : []
        });
        await newQuery.save();

        if (req.io) req.io.emit('query:analyzed', newQuery);
        res.status(201).json(newQuery);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
