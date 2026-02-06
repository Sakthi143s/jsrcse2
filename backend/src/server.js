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
  cors: { origin: '*' }
});

// Connect to Database
connectDB();

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

        // Automated "Slow Query" detection for API
        if (duration > 200) {
          const Query = require('./models/Query');
          try {
            const q = new Query({
              query: `API Request: ${req.method} ${req.path}`,
              executionTime: duration,
              rowsAffected: 0,
              optimizationSuggestions: ['Check endpoint logic', 'Optimize database calls for this route']
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
        for (const b of bottlenecks) {
          const bottleneck = new Bottleneck({
            ...b,
            service: 'host-system',
            status: 'new'
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
          const regression = new Regression({
            service: 'api-gateway',
            metric: 'responseTime',
            baseline: { value: Math.round(avgResponseTime), timestamp: recentMetrics[19].createdAt },
            current: { value: Math.round(latestAvg), timestamp: new Date() },
            degradation: { percentage: Math.round(((latestAvg - avgResponseTime) / avgResponseTime) * 100) },
            possibleCauses: [{ type: 'Traffic', description: 'Real-time traffic spike detected', confidence: 0.7 }]
          });
          await regression.save();
          io.emit('regression:detected', regression);
        }
      }
    } catch (err) {
      console.error('Failed to process real-time analysis:', err);
    }
  }
}, 3000); // Every 3 seconds

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5006;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
