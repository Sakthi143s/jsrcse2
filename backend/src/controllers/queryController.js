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

        let suggestions = [];
        if (executionTime > 500) {
            suggestions.push({ type: 'Critical', suggestion: 'Query is extremely slow. Check for missing indexes on filter columns.', potentialImprovement: 80 });
            suggestions.push({ type: 'Optimization', suggestion: 'Consider using a materialized view or caching this result.', potentialImprovement: 50 });
        } else if (executionTime > 200) {
            suggestions.push({ type: 'Warning', suggestion: 'Query performance is sub-optimal. Review join conditions.', potentialImprovement: 30 });
        }

        if (queryText.toLowerCase().includes('select *')) {
            suggestions.push({ type: 'Best Practice', suggestion: 'Avoid using SELECT *. Specify only the columns you need.', potentialImprovement: 20 });
        }

        if (queryText.toLowerCase().includes('join') && !queryText.toLowerCase().includes('on')) {
            suggestions.push({ type: 'Error', suggestion: 'Join without proper ON condition detected.', potentialImprovement: 90 });
        }

        const newQuery = new Query({
            queryText,
            database: database || 'Laptop-OS',
            executionTime,
            isOptimized: executionTime < 100 && suggestions.length === 0,
            optimizationSuggestions: suggestions
        });
        await newQuery.save();

        if (req.io) req.io.emit('query:analyzed', newQuery);
        res.status(201).json(newQuery);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
