const fs = require('fs');
const path = require('path');

class Product {
    constructor(id, price) {
        this.id = id;
        this.price = price;
    }
}

class Cart {
    async addItem(user, product) {
        const cartPath = path.join(__dirname, '../public/cart.json');

        try {
            // Read the existing cart data
            const cartData = JSON.parse(fs.readFileSync(cartPath));

            // Find the user's cart or create a new one
            let userCart = cartData.users.find(u => u.username === user);
            if (!userCart) {
                userCart = { username: user, products: [] };
                cartData.users.push(userCart);
            }

            // Add the product to the user's cart
            userCart.products.push(product);

            // Write the updated cart data back to the JSON file
            fs.writeFileSync(cartPath, JSON.stringify(cartData, null, 2));

            console.log('Product added to cart successfully.');
        } catch (err) {
            console.error('Error adding product to cart:', err);
        }
    }

    removeItem(user, productId) {
        const cartPath = '../public/cart.json';

        try {
            const cartData = JSON.parse(fs.readFileSync(cartPath));

            const userCart = cartData.users.find(u => u.username === user);
            if (userCart) {
                userCart.products = userCart.products.filter(p => p.id !== productId);

                fs.writeFileSync(cartPath, JSON.stringify(cartData, null, 2));
                console.log('Product removed from cart successfully.');
            } else {
                console.log('User not found or product not in cart.');
            }
        } catch (err) {
            console.error('Error removing product from cart:', err);
        }
    }

    getTotalCost() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }
}

module.exports = { Product, Cart };