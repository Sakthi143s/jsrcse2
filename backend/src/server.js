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

// Attach IO to request
app.use((req, res, next) => {
  req.io = io;
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

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
