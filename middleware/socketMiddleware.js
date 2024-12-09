const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const chatController = require("../controllers/chatController");
const auctionController = require('../controllers/auctionController');

const connectSocket = (io) => {
    io.on("connection", (socket) => {
        // const cookies = cookie.parse(socket.handshake.extraHeaders.cookie || '');
        const source = socket.handshake.headers.source;
        // console.log(`Connection source from cookie: ${ source }`);

        if (source === 'community') {
            chatController(socket);
        } else if (source === 'auction') {
            auctionController(socket);
        }
    });
};

module.exports = connectSocket;