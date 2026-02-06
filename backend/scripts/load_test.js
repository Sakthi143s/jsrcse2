const http = require('http');

// Configuration
const CONCURRENCY = 50; // Number of concurrent requests
const DURATION_MS = 10000; // Duration of test in ms
const API_URL = 'https://jsrcse2.onrender.com/api/metrics';



const metrics = {
    success: 0,
    failed: 0,
    totalTime: 0,
};

const startTime = Date.now();
let activeRequests = 0;
let shouldStop = false;

function sendRequest() {
    if (shouldStop) return;

    const payload = JSON.stringify({
        service: `service-${Math.floor(Math.random() * 5)}`,
        endpoint: `/api/v1/resource/${Math.floor(Math.random() * 10)}`,
        metrics: {
            responseTime: Math.floor(Math.random() * 500),
            cpuUsage: Math.floor(Math.random() * 100),
            memoryUsage: Math.floor(Math.random() * 4096),
            requestCount: 1,
            errorRate: Math.random() < 0.05 ? 1 : 0
        },
        tags: ['production', 'us-east-1']
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length
        }
    };

    const reqStart = Date.now();
    activeRequests++;

    const req = http.request(API_URL, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            activeRequests--;
            metrics.totalTime += (Date.now() - reqStart);

            if (res.statusCode >= 200 && res.statusCode < 300) {
                metrics.success++;
            } else {
                metrics.failed++;
                console.error(`Failed with status: ${res.statusCode}`);
            }

            // Keep pipeline full
            if (!shouldStop) sendRequest();
        });
    });

    req.on('error', (err) => {
        activeRequests--;
        metrics.failed++;
        console.error(`Request error: ${err.code || err.message}`);
        if (!shouldStop) sendRequest();
    });

    req.write(payload);
    req.end();
}

console.log(`Starting load test with ${CONCURRENCY} concurrent users for ${DURATION_MS}ms...`);

// Fill the pipeline
for (let i = 0; i < CONCURRENCY; i++) {
    sendRequest();
}

// Stop timer
setTimeout(() => {
    shouldStop = true;
    console.log('Stopping load test... waiting for pending requests to finish.');

    // Poll until all requests are done (or just exit after a short buffer)
    const finishInterval = setInterval(() => {
        if (activeRequests === 0) {
            clearInterval(finishInterval);
            printResults();
        }
    }, 100);
}, DURATION_MS);

function printResults() {
    const totalRequests = metrics.success + metrics.failed;
    const durationSec = (Date.now() - startTime) / 1000;
    const rps = totalRequests / durationSec;
    const avgLatency = metrics.totalTime / totalRequests;

    console.log('\n--- Load Test Results ---');
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Successful: ${metrics.success}`);
    console.log(`Failed: ${metrics.failed}`);
    console.log(`Duration: ${durationSec.toFixed(2)}s`);
    console.log(`RPS: ${rps.toFixed(2)}`);
    console.log(`Avg Latency: ${avgLatency.toFixed(2)}ms`);
}
