const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const auctionController = (io) => {
    // Create a socket.io server instance
    // const io = new Server(server);

    // Track current items for each stamp
    let currentItems = {
        1: { value: 0, bidder: "None" },
        2: { value: 0, bidder: "None" },
        3: { value: 0, bidder: "None" },
        4: { value: 0, bidder: "None" },
    };

    io.on('connection', (socket) => {
        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');
            const token = cookies.jwt;

            if (!token) {
                throw new Error('Authentication token not found');
            }

            const decoded = jwt.verify(token, 'net ninja secret');
            // console.log(decoded);

            const username = decoded.email;

            console.log(`User connected: ${ username }`);
            socket.emit("auction-authenticated", { username });
        } catch (err) {
            console.error("Invalid token:", err.message);
            socket.disconnect(); // Disconnect the client if the token is invalid
        }

        // Send the current highest bids to the newly connected client
        Object.entries(currentItems).forEach(([stampId, item]) => {
            socket.emit('current', {
                stampId: parseInt(stampId),
                data: item,
            });
        });

        // Handle messages from the client
        socket.on('bid', (message) => {
            try {
                const { stampId, data } = message;

                // Validate the bid data
                const { value, bidder } = data;
                if (typeof value !== 'number' || typeof bidder !== 'string') {
                    throw new Error('Invalid bid data.');
                }

                // Check if the new bid is higher than the current value
                if (value > currentItems[stampId].value) {
                    currentItems[stampId] = { value, bidder };

                    // Broadcast the new highest bid to all connected clients
                    io.emit('update', {
                        stampId,
                        data: currentItems[stampId],
                    });
                } else {
                    // Inform the bidder that their bid was too low
                    socket.emit('error', {
                        message: 'Your bid must be higher than the current bid.',
                    });
                }
            } catch (error) {
                console.error('Invalid message format or error:', error.message);
                socket.emit('error', {
                    message: error.message,
                });
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('Client disconnected.');
        });

        // Handle socket error
        socket.on('error', (err) => {
            console.error('Socket error:', err.message);
        });
    });

    console.log('Auction Socket.io server initialized.');
};

module.exports = auctionController;
