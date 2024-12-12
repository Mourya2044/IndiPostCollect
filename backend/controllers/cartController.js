const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');

// Paths to the data files
const cartFilePath = path.join(__dirname, '../data/cart.json');
const stampCollectionFilePath = path.join(__dirname, '../data/stampCollections.json');

// Function to get the cart items for a specific user
const getCartItems = async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            throw new Error('Authentication token not found');
        }

        const decoded = jwt.verify(token, 'net ninja secret');
        const username = decoded.email;

        const cartData = JSON.parse(await fs.readFile(cartFilePath, 'utf-8'));
        const stampCollection = JSON.parse(await fs.readFile(stampCollectionFilePath, 'utf-8'));

        const userCart = cartData.users.find(user => user.username === username);

        if (!userCart || !userCart.products || userCart.products.length === 0) {
            return res.status(200).json([]); // Empty cart
        }

        const stampsMap = stampCollection.reduce((map, stamp) => {
            map[stamp.id] = stamp;
            return map;
        }, {});

        const cartItems = userCart.products.reduce((items, productId) => {
            if (stampsMap[productId]) {
                const existingItem = items.find(item => item.id === productId);
                if (existingItem) {
                    existingItem.count += 1;
                } else {
                    items.push({ ...stampsMap[productId], count: 1 });
                }
            }
            return items;
        }, []);

        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to add an item to the cart
const addToCart = async (req, res) => {
    const { id } = req.body;
    try {
        const token = req.cookies.jwt;

        if (!token) {
            throw new Error('Authentication token not found');
        }

        const decoded = jwt.verify(token, 'your_secret_key');
        const username = decoded.email;

        const cartData = JSON.parse(await fs.readFile(cartFilePath, 'utf-8'));

        const userCart = cartData.users.find(user => user.username === username);

        if (!userCart) {
            cartData.users.push({ username, products: [id] });
        } else {
            userCart.products.push(id);
        }

        await fs.writeFile(cartFilePath, JSON.stringify(cartData, null, 2));
        res.status(201).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to clear the cart for a specific user
const clearCart = async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            throw new Error('Authentication token not found');
        }

        const decoded = jwt.verify(token, 'your_secret_key');
        const username = decoded.email;

        const cartData = JSON.parse(await fs.readFile(cartFilePath, 'utf-8'));

        const userCart = cartData.users.find(user => user.username === username);
        if (userCart) {
            userCart.products = [];
        }

        await fs.writeFile(cartFilePath, JSON.stringify(cartData, null, 2));
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getCartItems,
    addToCart,
    clearCart,
};