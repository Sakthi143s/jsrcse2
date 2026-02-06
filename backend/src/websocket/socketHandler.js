module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected: ' + socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected: ' + socket.id);
        });

        // Example: Listen for custom events from client (if needed)
        socket.on('ping', (data) => {
            socket.emit('pong', { message: 'received' });
        });
    });

    // Make io accessible globally or export a helper to emit events
    // For simplicity, we might attach it to the app or use a global event emitter
    // but in this architecture, services might import 'io' if passed around, 
    // or we can attach it to the request object in middleware.
};
