const socketIo = require('socket.io');

module.exports = (server) => {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected');
        
        socket.on('message', (data) => {
            console.log('Message received:', data);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

    return io;
};
