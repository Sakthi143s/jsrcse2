const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const socketHandler = require('./websocket/socketHandler');

// Intelligence & AI Services
const intelligenceService = require('./services/intelligenceService');
const aiService = require('./services/aiService');
const metricBatcher = require('./services/metricBatcher');

// Models
const Metric = require('./models/Metric');
const Bottleneck = require('./models/Bottleneck');
const Query = require('./models/Query');
const Profile = require('./models/Profile');
const Regression = require('./models/Regression');

// Routes
const metricsRoutes = require('./routes/metrics');
const bottleneckRoutes = require('./routes/bottlenecks');
const queryRoutes = require('./routes/queries');
const profilingRoutes = require('./routes/profiling');
const regressionRoutes = require('./routes/regressions');

const { getRealMetrics } = require('./utils/systemMetrics');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Attach IO to request & Track Performance
app.use((req, res, next) => {
  const start = Date.now();
  req.io = io;

  res.on('finish', async () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      try {
        const mData = {
          service: 'api-gateway',
          endpoint: req.path,
          metrics: {
            responseTime: duration,
            cpuUsage: 0,
            memoryUsage: 0,
            errorRate: res.statusCode >= 400 ? 100 : 0
          },
          tags: ['auto-captured', req.method]
        };

        // Use Batcher instead of direct save to avoid MongoDB saturation during high traffic
        metricBatcher.add(mData);
        io.emit('metric:update', { ...mData, createdAt: new Date() });

        // Update Adaptive Baseline
        intelligenceService.updateBaseline('api_latency', duration);

        // Intelligent Anomaly Detection
        if (intelligenceService.isAnomaly('api_latency', duration)) {
          try {
            const lastSystemMetric = await Metric.findOne({ service: 'local-laptop' }).sort({ createdAt: -1 });
            const correlation = intelligenceService.correlate(duration, lastSystemMetric?.metrics?.cpuUsage || 0);

            const bData = {
              type: correlation?.type === 'HOST_SATURATION' ? 'cpu' : 'code',
              severity: 'high',
              location: { file: 'server.js', function: req.path },
              description: correlation?.description || `Significant API latency spike detected: ${duration}ms`,
            };

            const explanation = await aiService.explainBottleneck(bData);
            const bottleneck = new Bottleneck({
              ...bData,
              service: 'api-gateway',
              status: 'open',
              aiSuggestions: explanation.suggestions
            });
            try {
              await bottleneck.save();
            } catch (e) { console.warn("[DB] Bottleneck save skipped:", e.message); }
            io.emit('bottleneck:detected', bottleneck);
          } catch (err) {
            console.error('Intelligent capture failed:', err);
          }
        }

        // Automatic Query Optimization logic
        if (req.path.includes('/api/')) {
          try {
            const queryPatterns = intelligenceService.detectQueryPatterns(`REST API: ${req.method} ${req.path}`);
            if (queryPatterns.length > 0 || duration > 200) {
              const q = new Query({
                queryText: `REST API: ${req.method} ${req.path}`,
                database: 'app-main-db',
                executionTime: duration,
                rowsAffected: 0,
                isOptimized: queryPatterns.length === 0 && duration < 100,
                optimizationSuggestions: queryPatterns.map(p => ({
                  type: 'Intelligent-Scanner',
                  suggestion: p.suggestion,
                  potentialImprovement: 40
                }))
              });
              try {
                await q.save();
              } catch (e) { console.warn("[DB] Query save skipped:", e.message); }
              io.emit('query:analyzed', q);
            }
          } catch (err) {
            console.error('Query analysis failed:', err);
          }
        }

        // Segmented Code Profiling
        if (duration > 50) {
          try {
            const p = new Profile({
              service: 'api-gateway',
              duration: duration,
              profileData: {
                functions: [
                  { name: `Handler: ${req.path}`, file: 'server.js', selfTime: Math.round(duration * 0.8), totalTime: duration, calls: 1 },
                  { name: `Middleware: PerfTracker`, file: 'server.js', selfTime: Math.round(duration * 0.1), totalTime: duration, calls: 1 },
                  { name: `DB: DriverInternal`, file: 'mongodb.node', selfTime: Math.round(duration * 0.1), totalTime: duration, calls: 1 }
                ]
              },
              summary: { totalFunctions: 3, hottestFunction: `Handler: ${req.path}`, totalSamples: duration * 10 },
              tags: ['auto-profile', 'trace-segment']
            });
            try {
              await p.save();
            } catch (e) { console.warn("[DB] Profile save skipped:", e.message); }
            io.emit('profile:created', p);
          } catch (err) {
            console.error('Profile capture failed:', err);
          }
        }
      } catch (err) {
        console.error('Metrics middleware error:', err);
      }
    }
  });
  next();
});

// Real-Time Scenario Simulator (for User Verification)
app.post('/api/simulate/:scenario', async (req, res) => {
  const scenario = req.params.scenario.toLowerCase();
  console.log(`[Simulator] Received request for scenario: ${scenario}`);
  let result = { message: `Simulating ${scenario}...` };

  try {
    switch (scenario) {
      case 'latency-spike':
        // 1. Manually trigger a bottleneck detection flow
        const bData = {
          type: 'code',
          severity: 'high',
          location: { file: 'SimulatedEnvironment.js', function: 'heavyComputeTask' },
          description: `Simulated Latency Spike detected: 2500ms`,
        };
        const explanation = await aiService.explainBottleneck(bData);
        const bottleneck = new Bottleneck({
          ...bData,
          service: 'api-gateway-sim',
          status: 'open',
          aiSuggestions: explanation.suggestions
        });
        try {
          await bottleneck.save();
        } catch (e) { console.warn("[Simulator] Bottleneck save skipped:", e.message); }
        io.emit('bottleneck:detected', bottleneck);
        result.details = "Bottleneck event emitted with AI suggestions.";
        break;

      case 'unoptimized-query':
        const queryPatterns = intelligenceService.detectQueryPatterns("SELECT * FROM users JOIN orders JOIN products");
        const q = new Query({
          queryText: "SELECT * FROM users JOIN orders JOIN products",
          database: "simulated-db",
          executionTime: 450,
          rowsAffected: 1000,
          isOptimized: false,
          optimizationSuggestions: queryPatterns.map(p => ({
            type: 'Intelligent-Scanner',
            suggestion: p.suggestion,
            potentialImprovement: 70
          }))
        });
        try {
          await q.save();
        } catch (e) { console.warn("[Simulator] Query save skipped:", e.message); }
        io.emit('query:analyzed', q);
        result.details = "Slow query event emitted with pattern analysis.";
        break;

      case 'regression':
        const regressionData = {
          service: 'api-gateway',
          metric: 'responseTime',
          baseline: { value: 120, timestamp: new Date(Date.now() - 86400000) },
          current: { value: 650, timestamp: new Date() },
          degradation: { percentage: 440 }
        };
        const analysis = await aiService.analyzeRegression(regressionData);
        const regression = new Regression({
          ...regressionData,
          possibleCauses: analysis.suggestions.map(s => ({ type: 'AI-Suggestion', description: s, confidence: 0.95 }))
        });
        try {
          await regression.save();
        } catch (e) { console.warn("[Simulator] Regression save skipped:", e.message); }
        io.emit('regression:detected', regression);
        result.details = "Regression event emitted with AI root cause analysis.";
        break;

      case 'profile':
        const p = new Profile({
          service: 'api-gateway-sim',
          duration: 1200,
          profileData: {
            functions: [
              { name: "HeavyCryptoOperation", file: "auth.js", selfTime: 950, totalTime: 1200, calls: 1 },
              { name: "DatabaseHandshake", file: "db.js", selfTime: 200, totalTime: 250, calls: 1 },
              { name: "MiddlewareStack", file: "server.js", selfTime: 50, totalTime: 1200, calls: 1 }
            ]
          },
          summary: {
            totalFunctions: 3,
            hottestFunction: "HeavyCryptoOperation",
            totalSamples: 12000
          },
          tags: ['simulated-trace', 'high-priority']
        });
        try {
          await p.save();
        } catch (e) { console.warn("[Simulator] Profile save skipped:", e.message); }
        io.emit('profile:created', p);
        result.details = "Detailed code profile emitted for analysis.";
        break;
      case 'host-bottleneck':
        const hData = {
          type: 'cpu',
          severity: 'critical',
          location: { file: 'Host Laptop', function: 'Background Task' },
          description: `Machine-level CPU saturation: 98% usage detected.`,
        };
        const hExplanation = await aiService.explainBottleneck(hData);
        const hBottleneck = new Bottleneck({
          ...hData,
          service: 'host-system',
          status: 'open',
          aiSuggestions: hExplanation.suggestions
        });
        try {
          await hBottleneck.save();
        } catch (e) { console.warn("[Simulator] Host bottleneck save skipped:", e.message); }
        io.emit('bottleneck:detected', hBottleneck);
        result.details = "Host-level bottleneck with critical severity emitted.";
        break;

      default:
        console.log(`[Simulator] Error: Scenario '${scenario}' not matched.`);
        return res.status(404).json({ error: 'Scenario not found' });
    }
    res.json(result);
  } catch (err) {
    console.error('Simulation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health & Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), dbConnected: require('mongoose').connection.readyState === 1 });
});
app.get('/', (req, res) => res.send('Intelligent Platform API Running.'));

app.use('/api/metrics', metricsRoutes);
app.use('/api/bottlenecks', bottleneckRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/profiles', profilingRoutes);
app.use('/api/regressions', regressionRoutes);

socketHandler(io);

// Real-time System Monitoring Loop
setInterval(async () => {
  const data = await getRealMetrics();
  if (data) {
    const { metrics, bottlenecks } = data;
    io.emit('system:metrics', metrics);
    try {
      const sData = {
        service: 'local-laptop',
        endpoint: 'system-monitor',
        metrics: { cpuUsage: metrics.cpuUsage, memoryUsage: metrics.memoryUsage, responseTime: metrics.loadAverage || 0, errorRate: 0 },
        tags: ['real-time', 'host-metrics']
      };

      // Use Batcher here too
      metricBatcher.add(sData);
      io.emit('metric:update', { ...sData, createdAt: new Date() });

      if (bottlenecks && bottlenecks.length > 0) {
        for (const b of bottlenecks) {
          const explanation = await aiService.explainBottleneck(b);
          const bottleneck = new Bottleneck({ ...b, type: b.type.toLowerCase(), service: 'host-system', status: 'open', aiSuggestions: explanation.suggestions });
          try {
            await bottleneck.save();
          } catch (e) { console.warn("[Loop] Bottleneck save skipped:", e.message); }
          io.emit('bottleneck:detected', bottleneck);
        }
      }
    } catch (err) { console.error('Real-time loop error:', err); }
  }
}, 10000);

app.use(errorHandler);
const PORT = process.env.PORT || 5006;
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  } catch (err) { console.error("Startup failed:", err); }
};
startServer();
server.keepAliveTimeout = 120000;
server.headersTimeout = 125000;
