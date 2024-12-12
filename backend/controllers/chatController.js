const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const chatController = (io) => {
    // const io = new Server(server);

    // Keep track of users in each room
    const rooms = {
        global: new Set(),
        state: new Set(),
    };

    io.on("connection", (socket) => {
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
            socket.emit("community-authenticated", { username });
        } catch (err) {
            console.error("Invalid token:", err.message);
            socket.disconnect(); // Disconnect the client if the token is invalid
        }

        let currentRoom = null;
        let username = null;

        // Handling user joining a room
        socket.on("join room", ({ room, user }) => {
            // Handle user leaving previous room if necessary
            if (currentRoom) {
                socket.leave(currentRoom);
                rooms[currentRoom]?.delete(username);
                io.to(currentRoom).emit("user left", {
                    user: username,
                    room: currentRoom,
                    count: {
                        global: rooms["global"].size,
                        state: rooms["state"].size,
                    },
                });
            }

            // Set current room and username
            currentRoom = room;
            username = user;

            // Join new room
            socket.join(room);

            // Ensure the room exists in the `rooms` object
            if (!rooms[room]) {
                rooms[room] = new Set();
            }

            rooms[room].add(username);

            // Broadcast that the user has joined the room
            io.to(room).emit("user joined", {
                user: username,
                room,
                count: {
                    global: rooms["global"].size,
                    state: rooms["state"].size,
                },
            });
            socket.emit('room joined', { room: currentRoom, user: username });

        });

        // Handling chat messages
        socket.on("chat message", ({ msg, room }) => {
            io.to(room).emit("chat message", {
                text: msg,
                user: username,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                room,
            });
        });

        // Handle user disconnection
        socket.on("disconnect", () => {
            if (currentRoom && username) {
                rooms[currentRoom]?.delete(username);
                io.to(currentRoom).emit("user left", {
                    user: username,
                    room: currentRoom,
                });
            }
        });
    });
};

module.exports = chatController;
