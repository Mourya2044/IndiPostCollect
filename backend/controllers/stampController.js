// Mock stamp data
const stampCollections = require('../data/stampCollections.json');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { Product, Cart } = require('../models/Cart');
const myCart = new Cart();

const getStamps = (req, res) => {
    const category = req.params.category;
    // console.log(category);

    if (category != 'all') {
        const stamps = stampCollections[category];
        if (stamps) {
            res.status(200).json(stamps); // Send stamps for the specific category
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } else {
        // Combine all stamps from all categories into a single array
        const allStamps = Object.values(stampCollections).flat();
        res.status(200).json(allStamps); // Send all stamps
    }
};

const getStampDetails = (req, res) => {
    const stampId = req.params.id;

    // Search for the stamp in all categories
    let stamp = null;
    for (const category in stampCollections) {
        stamp = stampCollections[category].find(item => item.id === stampId);
        if (stamp) break; // Exit loop if stamp is found
    }

    if (stamp) {
        res.render('stampDetails', { stamp }); // Render the details view with the found stamp
    } else {
        res.status(404).send('Stamp not found');
    }
};

const addToCart = async (req, res) => {
    const { id } = req.body;
    try {
        // const cookies = cookie.parse(socket.handshake.headers.cookie || '');
        const token = req.cookies.jwt;
        // console.log(token.jwt);
        

        if (!token) {
            throw new Error('Authentication token not found');
        }

        const decoded = jwt.verify(token, 'net ninja secret');
        // console.log(decoded);

        const user = decoded.email;

        // Validate user and product ID
        if (!user || !id) {
            return res.status(400).json({ error: 'Invalid user or product ID' });
        }

        // Check product existence (if applicable)
        // const product = await getProductById(id); // Replace with your product retrieval logic
        // if (!product) {
        //     return res.status(404).json({ error: 'Product not found' });
        // }

        // Add product to cart
        await myCart.addItem(user, id);

        res.status(201).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getStamps, getStampDetails, addToCart };


