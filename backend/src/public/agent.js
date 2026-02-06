(function () {

  const IS_LOCAL =
    window.location.origin.includes('localhost') ||
    window.location.origin.includes('127.0.0.1');

  const BACKEND_URL = IS_LOCAL
    ? 'http://127.0.0.1:5006'
    : 'https://jsrcse2.onrender.com';   // your LIVE backend

  const API_ENDPOINT = BACKEND_URL + '/api/metrics';
  const APP_NAME = window.location.hostname;

  console.log('🚀 AI Performance Monitoring Agent Initialized for:', APP_NAME);


    function sendMetric(data) {
        const body = JSON.stringify({
            service: APP_NAME,
            endpoint: window.location.pathname,
            metrics: data,
            tags: ['external-web', 'agent-v1']
        });

        if (navigator.sendBeacon) {
            navigator.sendBeacon(API_ENDPOINT, body);
        } else {
            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
                keepalive: true
            }).catch(() => { });
        }
    }

    // Capture Navigation Timing
    window.addEventListener('load', () => {
        setTimeout(() => {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

            sendMetric({
                responseTime: loadTime,
                domReady: domReady,
                cpuUsage: 0,
                memoryUsage: window.performance.memory ? (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) : 0,
                errorRate: 0
            });
        }, 0);
    });

    // Capture Errors
    window.addEventListener('error', (event) => {
        sendMetric({
            responseTime: 0,
            cpuUsage: 0,
            memoryUsage: 0,
            errorRate: 100,
            errorMessage: event.message
        });
    });

    // Core Web Vitals (Simple implementation)
    let lcp = 0;
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        lcp = entries[entries.length - 1].startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            if (lcp > 0) {
                sendMetric({
                    lcp: lcp,
                    responseTime: 0,
                    cpuUsage: 0,
                    memoryUsage: 0,
                    errorRate: 0
                });
            }
        }
    });

})();
