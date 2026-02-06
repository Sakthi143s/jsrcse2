const si = require('systeminformation');

exports.getRealMetrics = async () => {
    try {
        const [cpu, mem, load] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.processes()
        ]);

        return {
            timestamp: new Date(),
            cpuUsage: Math.round(cpu.currentLoad),
            memoryUsage: Math.round((mem.active / mem.total) * 100),
            totalProcesses: load.all,
            activeHandles: load.running,
            loadAverage: Math.round(cpu.avgLoad * 100) / 100
        };
    } catch (err) {
        console.error('Error fetching system metrics:', err);
        return null;
    }
};
