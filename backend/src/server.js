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
      } catch (err) {
        // silent fail for metrics
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
  const metrics = await getRealMetrics();
  if (metrics) {
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
    } catch (err) {
      console.error('Failed to save system metric:', err);
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
