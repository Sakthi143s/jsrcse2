const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const socketHandler = require('./websocket/socketHandler');

const metricsRoutes = require('./routes/metrics');
const bottleneckRoutes = require('./routes/bottlenecks');
const queryRoutes = require('./routes/queries');
const profilingRoutes = require('./routes/profiling');
const regressionRoutes = require('./routes/regressions');

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

// Attach IO to request & Track Performance
app.use((req, res, next) => {
  const start = Date.now();
  req.io = io;

  res.on('finish', async () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      const Metric = require('./models/Metric');
      try {
        const m = new Metric({
          service: 'api-gateway',
          endpoint: req.path,
          metrics: {
            responseTime: duration,
            cpuUsage: 0,
            memoryUsage: 0,
            errorRate: res.statusCode >= 400 ? 100 : 0
          },
          tags: ['auto-captured', req.method]
        });
        await m.save();
        io.emit('metric:update', m);

        // Rule-based Bottleneck Detection (Goal: responseTime > 500ms -> bottleneck)
        if (duration > 500) {
          const Bottleneck = require('./models/Bottleneck');
          const aiService = require('./services/aiService');
          const bData = {
            type: 'code',
            severity: 'high',
            location: req.path,
            description: `API endpoint ${req.path} responding slowly (${duration}ms)`,
          };
          const explanation = await aiService.explainBottleneck(bData);
          const bottleneck = new Bottleneck({
            ...bData,
            service: 'api-gateway',
            status: 'new',
            aiSuggestions: explanation.suggestions
          });
          await bottleneck.save();
          io.emit('bottleneck:detected', bottleneck);
        }

        // Capture Query (Stub)
        if (req.path.includes('/api/')) {
          const Query = require('./models/Query');
          const queryCapture = new Query({
            queryText: `Captured from ${req.path}`,
            database: 'host-system',
            executionTime: duration,
            isOptimized: duration < 100
          });
          await queryCapture.save();
          if (req.io) req.io.emit('query:analyzed', queryCapture);
        }
        // Automated "Slow Query" detection for API
        if (duration > 200) {
          const Query = require('./models/Query');
          try {
            const q = new Query({
              queryText: `API Request: ${req.method} ${req.path}`,
              database: 'api-gateway-logs',
              executionTime: duration,
              rowsAffected: 0,
              optimizationSuggestions: [{ type: 'Performance', suggestion: 'Check endpoint logic', potentialImprovement: 20 }]
            });
            await q.save();
            io.emit('query:analyzed', q);
          } catch (err) {
            // silent fail
          }
        }

        // Automated Code Profiling Logic
        if (duration > 100) {
          const Profile = require('./models/Profile');
          try {
            const p = new Profile({
              service: 'api-gateway',
              duration: duration,
              profileData: {
                functions: [
                  { name: `Handler: ${req.path}`, file: 'api_gateway.js', selfTime: duration - 10, totalTime: duration, calls: 1 }
                ]
              },
              summary: {
                totalFunctions: 1,
                hottestFunction: `Handler: ${req.path}`,
                totalSamples: duration * 10
              },
              tags: ['real-time', 'perf-capture']
            });
            await p.save();
            io.emit('profile:created', p);
          } catch (err) {
            // silent fail
          }
        }
      } catch (err) {
        console.error('Metrics middleware error:', err);
      }
    }
  });

  next();
});

// Health Check for Render/Cloud
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbConnected: require('mongoose').connection.readyState === 1
  });
});

app.get('/', (req, res) => {
  res.send('AI Performance Optimization Suite API is running. Visit /health for status.');
});

// Routes
app.use('/api/metrics', metricsRoutes);
app.use('/api/bottlenecks', bottleneckRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/profiles', profilingRoutes);
app.use('/api/regressions', regressionRoutes);

// WebSocket
socketHandler(io);

const { getRealMetrics } = require('./utils/systemMetrics');
const Metric = require('./models/Metric');

// Start Real-time System Monitoring Loop
setInterval(async () => {
  const data = await getRealMetrics();
  if (data) {
    const { metrics, bottlenecks } = data;
    io.emit('system:metrics', metrics);

    try {
      const systemMetric = new Metric({
        service: 'local-laptop',
        endpoint: 'system-monitor',
        metrics: {
          cpuUsage: metrics.cpuUsage,
          memoryUsage: metrics.memoryUsage,
          responseTime: metrics.loadAverage || 0,
          errorRate: 0
        },
        tags: ['real-time', 'host-metrics']
      });
      await systemMetric.save();
      io.emit('metric:update', systemMetric);

      // Automated Bottleneck Detection
      if (bottlenecks && bottlenecks.length > 0) {
        const Bottleneck = require('./models/Bottleneck');
        const aiService = require('./services/aiService');
        for (const b of bottlenecks) {
          const explanation = await aiService.explainBottleneck(b);
          const bottleneck = new Bottleneck({
            ...b,
            service: 'host-system',
            status: 'new',
            aiSuggestions: explanation.suggestions
          });
          await bottleneck.save();
          io.emit('bottleneck:detected', bottleneck);
        }
      }

      // Automated Regression Detection
      const recentMetrics = await Metric.find({ service: 'api-gateway' })
        .sort({ createdAt: -1 })
        .limit(20);

      if (recentMetrics.length >= 10) {
        const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.metrics.responseTime, 0) / recentMetrics.length;
        const latestMetrics = recentMetrics.slice(0, 3);
        const latestAvg = latestMetrics.reduce((sum, m) => sum + m.metrics.responseTime, 0) / latestMetrics.length;

        if (latestAvg > avgResponseTime * 1.5) { // 50% degradation
          const Regression = require('./models/Regression');
          const aiService = require('./services/aiService');

          const regressionData = {
            service: 'api-gateway',
            metric: 'responseTime',
            baseline: { value: Math.round(avgResponseTime), timestamp: recentMetrics[19].createdAt },
            current: { value: Math.round(latestAvg), timestamp: new Date() },
            degradation: { percentage: Math.round(((latestAvg - avgResponseTime) / avgResponseTime) * 100) }
          };

          const analysis = await aiService.analyzeRegression(regressionData);

          const regression = new Regression({
            ...regressionData,
            possibleCauses: analysis.suggestions.map(s => ({ type: 'AI-Suggestion', description: s, confidence: 0.8 }))
          });

          await regression.save();
          io.emit('regression:detected', regression);
        }
      }
    } catch (err) {
      console.error('Failed to process real-time analysis:', err);
    }
  }
}, 10000); // Every 10 seconds (reduced from 3s to avoid overwhelming free-tier DB)

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5006;
const startServer = async () => {
  try {
    await connectDB();   // wait for Mongo

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Server startup failed ❌", err);
  }
};

startServer();

// Render/Cloud Stability: Increase timeouts to prevent intermittent 502s
server.keepAliveTimeout = 120000;
server.headersTimeout = 125000;
