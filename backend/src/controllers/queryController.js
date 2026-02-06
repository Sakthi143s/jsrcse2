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

        const intelligenceService = require('../services/intelligenceService');
        const aiService = require('../services/aiService');

        const patterns = intelligenceService.detectQueryPatterns(queryText);
        const optimizationResult = await aiService.suggestQueryOptimization({ queryText, executionTime });

        const suggestions = patterns.map(p => ({
            type: 'Intelligent-Scanner',
            suggestion: p.suggestion,
            potentialImprovement: 40
        })).concat(optimizationResult.suggestions.map(s => ({
            type: 'AI-Guided',
            suggestion: s,
            potentialImprovement: 30
        })));

        const newQuery = new Query({
            queryText,
            database: database || 'Laptop-OS',
            executionTime,
            isOptimized: executionTime < 100 && patterns.length === 0,
            optimizationSuggestions: suggestions
        });
        await newQuery.save();

        if (req.io) req.io.emit('query:analyzed', newQuery);
        res.status(201).json(newQuery);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
