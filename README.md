# Real-Time Intelligent Application Monitoring Platform 🚀

A full-stack, real-time performance monitoring and AI-driven optimization platform. This suite allows you to monitor backend health, detect bottlenecks, analyze database queries, profile code execution, and track performance regressions.

## 🌟 Key Features

### 📊 Real-time Dashboard
- **Live Metrics**: Visualize Request per Second (RPS), Average Latency, CPU Usage, Memory Consumption, and Error Rates.
- **Dynamic Charts**: Interactive area charts showing performance trends over time using Recharts.

### 🛡️ Performance Analysis
- **Live Monitoring**: A scrolling real-time log of every incoming request, showing status, latency, and endpoint.
- **Bottleneck Detection**: Automatic identification of CPU, Memory, and Database bottlenecks with AI-suggested resolutions.
- **Query Optimization**: Analysis of slow database queries with specific indexing tips and execution time breakdowns.

### 🔍 Deep Profiling
- **Code Profiling**: Inspect function-level performance to find "Hottest Functions" and execution time call stacks.
- **Regression Tracking**: Automatically compare current performance against historical baselines to detect degradations.

### 📦 Portability & DevOps
- **Docker Support**: Zero-configuration setup for MongoDB, Backend, and Frontend.
- **Local Orchestration**: Manage the full stack with single commands like `npm run start:local`.
- **High-Performance Load Testing**: Included scripts to simulate thousands of requests per second.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Recharts, Lucide Icons, Socket.IO Client.
- **Backend**: Node.js, Express, Mongoose (MongoDB), Socket.IO.
- **Infrastructure**: Docker, Docker Compose.

---

## 🚀 Getting Started

### Quick Start (Local)
From the project root (`jsrcse2`):

1. **Install root dependencies**:
   ```bash
   npm install
   ```
2. **Install all project dependencies**:
   ```bash
   npm run install:all
   ```
3. **Start the suite**:
   ```bash
   npm run start:local
   ```
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend**: [http://localhost:5006](http://localhost:5006)

### Docker Setup
If you prefer containerization:
```bash
npm run start:docker
```

### Real-time Analysis
The suite now automatically captures:
- **System Metrics**: Your laptop's actual CPU and Memory usage.
- **API Performance**: Real latency of every request sent to the backend.

---

## 🧪 Simulation & Testing

To see the dashboard light up with real data, run the load simulator:

```bash
cd backend
node scripts/load_test.js
```
This script simulates 50 concurrent users sending high-frequency metrics to the API.

---

## 🔧 Troubleshooting

### Port Already in Use (`EADDRINUSE`)
If you see an error about port `5006` or `3000` being in use, run the cleanup script from the project root:
```bash
npm run stop:local
```

### MongoDB Connection
Ensure MongoDB is running locally on the default port (`27017`) if you are running manually. If using Docker, this is handled automatically.

---

## 📂 Project Structure

```text
├── backend/            # Express API, MongoDB Schemas, WebSocket logic
│   ├── src/            # Controllers, Routes, Models
│   └── scripts/        # Load testing & simulation
├── frontend/           # React App, Dashboard Components
│   └── src/            # Pages, Components, WebSocket services
├── package.json        # Root orchestration scripts
└── README.md           # Project documentation
```

---

*Built with ❤️ for High-Performance Engineering.*
