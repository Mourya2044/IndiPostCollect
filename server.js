const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const chatController = require("./controllers/chatController");
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const stampRoutes = require('./routes/stampRoutes'); // Import stamp routesconfiguration

const app = express();
// Create the HTTP server and integrate Socket.io with it
const server = http.createServer(app);
const io = socketIo(server);  // Initialize Socket.io

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://mourya:mourya2044@cluster0.8tikn.mongodb.net/node-auth';
mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

// Initialize controllers (make sure they use `io`)
chatController(io);  // Pass `io` to your controller

let PORT = 3000;
// Use `server.listen` instead of `app.listen`
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${ PORT }`);
});

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/learn', (req, res) => res.render('learn'));
app.get('/community', requireAuth, (req, res) => res.render('community'));
app.get('/museum', (req, res) => res.render('museum'));
app.get('/marketplace', requireAuth, (req, res) => res.render('marketplace'));
app.get('/events', requireAuth, (req, res) => res.render('events'));
app.get('/user', requireAuth, (req, res) => res.render('user'));
app.use(authRoutes);
app.use('/api/stamps', stampRoutes);