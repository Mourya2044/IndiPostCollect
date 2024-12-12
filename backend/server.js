require('dotenv').config(); // Load environment variables
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const initSocket = require('./middleware/socketMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const stampRoutes = require('./routes/stampRoutes');
const viewsRoutes = require('./routes/viewsRoutes'); // New views route file
const cartController = require('./controllers/cartController'); // Cart API routes
const chatController = require('./controllers/chatController'); // Chat functionality

const app = express();
const server = http.createServer(app);


app.set('view engine', 'ejs'); // Set EJS as the default template engine
app.set('views', './views'); // Optional: Define the directory for your views

// Initialize Socket.io
const io = initSocket(server); // Initialize socket middleware
chatController(io); // Pass `io` to chat controller

// Middleware
app.use(express.static('public'));
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Adjust the origin to your frontend URL
app.use(express.json());
app.use(cookieParser());

// Database connection
const dbURI = process.env.DB_URI; // MongoDB URI from .env file
mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/', viewsRoutes); // EJS views routes
app.use( authRoutes); // Auth routes
app.use('/api/stamps', stampRoutes); // Stamp routes

// Cart API endpoints
app.get('/api/cart', cartController.getCartItems); // Fetch cart items
app.delete('/api/cart', cartController.clearCart); // Clear the cart

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${ PORT }`);
});
