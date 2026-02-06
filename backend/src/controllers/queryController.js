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
        const newQuery = new Query({
            queryText,
            database,
            executionTime,
            isOptimized: executionTime < 100, // Dummy logic
            optimizationSuggestions: executionTime > 100 ? [{ type: 'Index', suggestion: 'Create composite index' }] : []
        });
        await newQuery.save();

        if (req.io) {
            req.io.emit('query:analyzed', newQuery);
        }

        res.status(201).json(newQuery);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
