const si = require('systeminformation');

exports.getRealMetrics = async () => {
    try {
        const [cpu, mem, load, fsSize, networkStats, time] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.processes(),
            si.fsSize().catch(() => []),
            si.networkStats().catch(() => []),
            si.time()
        ]);
        const processes = load; // si.processes() returns the processes object

        // Calculate disk usage (primary disk)
        let diskUsage = 0;
        let diskTotal = 0;
        let diskUsed = 0;
        if (fsSize && fsSize.length > 0) {
            const primaryDisk = fsSize[0];
            diskTotal = primaryDisk.size;
            diskUsed = primaryDisk.used;
            diskUsage = Math.round((primaryDisk.used / primaryDisk.size) * 100);
        }

        // Calculate network stats
        let networkRx = 0;
        let networkTx = 0;
        if (networkStats && networkStats.length > 0) {
            networkRx = networkStats.reduce((sum, iface) => sum + (iface.rx_sec || 0), 0);
            networkTx = networkStats.reduce((sum, iface) => sum + (iface.tx_sec || 0), 0);
        }

        // Get top processes
        const topProcesses = (processes.list || []).slice(0, 10).map(proc => ({
            pid: proc.pid,
            name: proc.name,
            cpu: Math.round(proc.cpu * 10) / 10,
            mem: Math.round(proc.mem * 10) / 10,
            command: proc.command
        }));

        const metrics = {
            timestamp: new Date(),
            cpuUsage: Math.round(cpu.currentLoad),
            memoryUsage: Math.round((mem.active / mem.total) * 100),
            memoryTotal: mem.total,
            memoryUsed: mem.active,
            totalProcesses: load.all,
            activeHandles: load.running,
            loadAverage: Math.round(cpu.avgLoad * 100) / 100,
            diskUsage,
            diskTotal,
            diskUsed,
            networkRx: Math.round(networkRx),
            networkTx: Math.round(networkTx),
            uptime: time.uptime,
            topProcesses
        };

        // Automatic Bottleneck Detection
        const bottlenecks = [];
        if (metrics.cpuUsage > 80) {
            bottlenecks.push({
                type: 'cpu',
                severity: 'high',
                location: 'Host Machine',
                description: `CPU usage critical at ${metrics.cpuUsage}%`,
                suggestions: ['Check for rogue processes', 'Consider horizontal scaling']
            });
        }
        if (metrics.memoryUsage > 90) {
            bottlenecks.push({
                type: 'memory',
                severity: 'critical',
                location: 'Host Machine',
                description: `Memory exhaustion imminent at ${metrics.memoryUsage}%`,
                suggestions: ['Identify memory leaks', 'Increase swap space']
            });
        }
        if (metrics.diskUsage > 90) {
            bottlenecks.push({
                type: 'io',
                severity: 'high',
                location: 'Host Machine',
                description: `Disk space critical at ${metrics.diskUsage}%`,
                suggestions: ['Clean up temporary files', 'Archive old data', 'Expand storage']
            });
        }

        return { metrics, bottlenecks };
    } catch (err) {
        console.error('Error fetching system metrics:', err);
        // Return minimal fallback data instead of null
        return {
            metrics: {
                timestamp: new Date(),
                cpuUsage: 0,
                memoryUsage: 0,
                totalProcesses: 0,
                activeHandles: 0,
                loadAverage: 0,
                diskUsage: 0,
                networkRx: 0,
                networkTx: 0,
                uptime: 0,
                topProcesses: []
            },
            bottlenecks: []
        };
    }
};
