import express from 'express';
import { dirname } from "path";
import path from 'path';
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import ejs, { name } from 'ejs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import session from 'express-session';

// Database models
import User from './models/Users.js';
import Product from './models/Products.js';
import Order from './models/Orders.js';
import Admin from './models/Admin.js';
import Cart from './models/Cart.js';

dotenv.config({ path: './process.env' })
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
}).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch((error) => {
  console.error("Error connecting to MongoDB Atlas", error);
});

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const saltRounds = 10;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, ()=> {
    console.log(`Server is listening on port ${port}`);
})

function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.get("/profile", requireAuth, (req, res) => {
    res.render("profile", {
        name: req.session.userName,
        email: req.session.userEmail,
        message: "",
    });
})

// User Profile Update Route
app.put('/user/profile', requireAuth, async (req, res) => {
    const { name, email } = req.body;
    const userId = req.session.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name && name !== user.name) {
            user.name = name;
        }

        if (email && email !== user.email) {
            user.email = email;
        }

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.put('/user/profile/password', requireAuth, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        user.password = await bcrypt.hash(newPassword, saltRounds);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Signup Route
app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.render('signup', { message: 'User already exists' });
        }

        if (password !== confirmPassword) {
            return res.render('signup', { message: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            orders: [],
            cart: []
        });

        await newUser.save();

        req.session.userId = newUser._id;
        req.session.userName = newUser.name;
        req.session.userEmail = newUser.email;

        res.redirect('/home');
    } catch (error) {
        console.error(error);
        res.status(500).render('signup', { message: 'Server error. Please try again later.' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { message: 'Invalid password' });
        }

        req.session.userId = user._id;
        req.session.userName = user.name;
        req.session.userEmail = user.email;

        res.redirect('/home');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('login', { message: 'Server error. Please try again later.' });
    }
});

// Add to cart route
app.post('/cart/add', requireAuth, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product is already in the cart
        const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex > -1) {
            // Update quantity if product already in the cart
            user.cart[cartItemIndex].quantity += quantity;
        } else {
            // Add new item to the cart
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.get("/signup", (req, res) => {
    if (req.session.userId) {
        return res.redirect('/');
    }
    else {
        res.render("signup", { message: '' });
    }
});

app.get("/login", (req, res) => {
    if (req.session.userId) {
        return res.redirect('/');
    }
    else {
        res.render("login", { message: '' });
    }
});


app.get("/", (req, res) => {
    if (req.session.userId) {
        res.render("index", { header: 'user-header' });

    }
    else{
        res.render("index", { header: 'new-user-header' });
    }
})

app.get("/home", (req, res) => {
    if (req.session.userId) {
        res.render("index", { header: 'user-header' });

    }
    else{
        res.render("index", { header: 'new-user-header' });
    }
})

app.get("/products", (req, res) => {
    if (req.session.userId) {
        res.render("product", { header: 'user-header' });

    }
    else{
        res.render("product", { header: 'new-user-header' });
    }
})

app.get('/cart', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('cart.product');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate the total amount
        const totalAmount = user.cart.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        res.render('cart', {
            cartItems: user.cart,
            totalAmount, // Passing the total amount to the view
            header: 'user-header'
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.post('/cart/remove/:productId', requireAuth, async (req, res) => {
    const { productId } = req.params;
    const userId = req.session.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = user.cart.filter(item => item.product.toString() !== productId);

        await user.save();
        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.post('/order/place', requireAuth, async (req, res) => {
    const { shippingAddress } = req.body;
    const userId = req.session.userId;

    try {
        const user = await User.findById(userId).populate('cart.product');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.cart.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        const totalAmount = user.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

        const newOrder = new Order({
            user: userId,
            products: user.cart,
            totalAmount,
            shippingAddress,
            paymentMethod: 'Cash on Delivery', // payment option
            status: 'Pending',
        });

        await newOrder.save();

        user.cart = [];
        await user.save();

        res.status(200).json({ message: 'Order placed successfully', orderId: newOrder._id });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.get('/user/orders', requireAuth, async (req, res) => {
    const userId = req.session.userId;

    try {
        // Find the user and populate their orders with product details
        const user = await User.findById(userId).populate({
            path: 'orders', // assuming orders is an array of order IDs
            populate: {
                path: 'products.product', // populate product details within orders
                model: 'Product' // replace with your actual model name for products
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.render('orders', {
            orders: user.orders,
            header: 'user-header'
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + "/public/pages/page-not-found.html");
});