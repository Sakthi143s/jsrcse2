const si = require('systeminformation');

exports.getRealMetrics = async () => {
    try {
        const [cpu, mem, load] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.processes()
        ]);

        const metrics = {
            timestamp: new Date(),
            cpuUsage: Math.round(cpu.currentLoad),
            memoryUsage: Math.round((mem.active / mem.total) * 100),
            totalProcesses: load.all,
            activeHandles: load.running,
            loadAverage: Math.round(cpu.avgLoad * 100) / 100
        };

        // Automatic Bottleneck Detection
        const bottlenecks = [];
        if (metrics.cpuUsage > 80) {
            bottlenecks.push({
                type: 'CPU',
                severity: 'high',
                location: 'Host Machine',
                description: `CPU usage critical at ${metrics.cpuUsage}%`,
                suggestions: ['Check for rogue processes', 'Consider horizontal scaling']
            });
        }
        if (metrics.memoryUsage > 90) {
            bottlenecks.push({
                type: 'Memory',
                severity: 'critical',
                location: 'Host Machine',
                description: `Memory exhaustion imminent at ${metrics.memoryUsage}%`,
                suggestions: ['Identify memory leaks', 'Increase swap space']
            });
        }

        return { metrics, bottlenecks };
    } catch (err) {
        console.error('Error fetching system metrics:', err);
        return null;
    }
};
