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
import multer from 'multer';

// Database models
import User from './models/Users.js';
import Product from './models/Products.js';
import Order from './models/Orders.js';
import Admin from './models/Admin.js';
import Cart from './models/Cart.js';
import CartItem from './models/CartItem.js'

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

app.use('/admin', session({
    name: 'adminSessionId', 
    secret: 'admin-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/profile', requireAuth, async (req, res) => {
    const userId = req.session.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const orders = await Order.find({ user: userId }).populate('products.product');
        console.log(userId);
        console.log(orders);

        res.render('profile', {
            name: user.name,
            email: user.email,
            orders: orders,
            message: "",
        });
    } catch (error) {
        console.error('Error fetching profile and orders:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

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
app.post('/cart/add', async (req, res) => {
    const { productId } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const existingCartItem = cart.items.find(item => item.product.toString() === productId);

        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            const newCartItem = new CartItem({ product: productId, quantity: 1 });
            cart.items.push(newCartItem);
        }

        cart.totalPrice = await cart.items.reduce(async (totalPromise, item) => {
            const total = await totalPromise;
            const product = await Product.findById(item.product);
            return total + (item.quantity * product.price);
        }, Promise.resolve(0));

        // Saving the updated cart
        await cart.save();
        res.redirect('/products');
    } catch (error) {
        console.error('Error adding product to cart:', error);
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


app.get('/', async (req, res) => {
    try {
        // Fetch the latest 5 products
        const products = await Product.find().sort({ createdAt: -1 }).limit(5).exec();
        if (req.session.userId){
            res.render('index', { products, header: 'user-header' });
        }
        else {
            res.render('index', { products, header: 'new-user-header' });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render("index", { header: 'user-header' });        res.status(500).send('Server error. Please try again later.');
    }
});

app.get('/home', async (req, res) => {
    try {
        // Fetch the latest 5 products
        const products = await Product.find().sort({ createdAt: -1 }).limit(5).exec();
        if (req.session.userId){
            res.render('index', { products, header: 'user-header' });
        }
        else {
            res.render('index', { products, header: 'new-user-header' });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
         res.status(500).send('Server error. Please try again later.');
    }
});

// Products

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        if (req.session.userId) {
            res.render('product', { header: 'user-header', products });
        } else {
            res.render('product', { header: 'new-user-header', products });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Cart

app.get('/cart', requireAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.userId })
            .populate('items.product') 
            .exec();

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const totalAmount = cart.items.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        res.render('cart', {
            cartItems: cart.items,
            totalAmount, 
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
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            console.log(`Cart not found for userId: ${userId}`);
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex === -1) {
            console.log(`Item with productId ${productId} not found in cart.`);
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);

        cart.totalPrice = await cart.items.reduce(async (totalPromise, item) => {
            const total = await totalPromise;
            const product = await Product.findById(item.product);

            if (product) {
                return total + (item.quantity * product.price);
            } else {
                console.log(`Product with ID ${item.product} not found.`);
                return total;
            }
        }, Promise.resolve(0));

        // Saving the cart
        await cart.save();

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
        const cart = await Cart.findOne({ user: userId }).populate('items.product').exec();

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        if (cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        const totalAmount = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

        // Creating a new order
        const newOrder = new Order({
            user: userId,
            products: cart.items,
            totalAmount,
            shippingAddress,
            paymentMethod: 'Pending',  // Payment method will be updated later
            status: 'Pending',
        });

        await newOrder.save();

        req.session.orderId = newOrder._id;

        cart.items = [];
        await cart.save();

        res.redirect('/payment');
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.get('/order/confirmation/:orderId', requireAuth, async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('products.product').exec();

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.render('order-confirmation', { order });
    } catch (error) {
        console.error('Error fetching order confirmation:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.get('/user/orders', requireAuth, async (req, res) => {
    const userId = req.session.userId;

    try {
        console.log("User ID:", userId); 

        const orders = await Order.find({ user: userId }).populate('products.product');
        console.log("Orders:", orders);

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.render('orders', {
            orders,
            header: 'user-header'
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.get('/payment', requireAuth, (req, res) => {
    if (!req.session.orderId) {
        return res.redirect('/cart');
    }

    res.render('payment', {
        orderId: req.session.orderId
    });
});

app.post('/payment', async (req, res) => {
    const paymentMethod = req.body['payment-method'];

    const orderId = req.session.orderId;

    if (!orderId) {
        return res.status(400).send('No order found.');
    }

    try {
        const order = await Order.findById(orderId);
        order.paymentMethod = paymentMethod;
        await order.save();

        res.redirect(`/order/confirmation/${orderId}`);
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).send('Error processing payment. Please try again later.');
    }
});

app.get('/api/products/latest', async (req, res) => {
    try {
        const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5).exec();
        res.json(latestProducts);
    } catch (error) {
        console.error('Error fetching latest products:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Admin

function requireAdminAuth(req, res, next) {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }
    next();
}

// Admin Login Route
app.get('/admin/login', (req, res) => {
    res.render('admin-login', { message: '' });
});

// Admin Login Route
app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.render('admin-login', { message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('admin-login', { message: 'Invalid password' });
        }

        req.session.adminId = admin._id;
        req.session.adminName = admin.name;

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).render('admin-login', { message: 'Server error. Please try again later.' });
    }
});

app.get('/admin/dashboard', requireAdminAuth, async (req, res) => {
    try {
        const products = await Product.find();

        res.render('admin-dashboard', {
            name: req.session.adminName,
            products: products 
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Orders list

app.get('/admin/view-orders', requireAdminAuth, async (req, res) => {
    try {
        const orders = await Order.find().populate('user products.product');
        res.render('view-orders', { orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Add products

app.get('/admin/add-product', (req, res) => {
    res.render('add-product');
});

app.post('/admin/add-product', requireAdminAuth, upload.single('image'), async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`; 

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            category,
            imageUrl,
        });

        await newProduct.save();
        res.redirect('/admin/dashboard'); 
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Delete Product

app.delete('/admin/products/delete/:id', requireAdminAuth, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send('Product deleted');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product');
    }
});

// Edit Products

app.get('/admin/products/edit/:id', requireAdminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('edit-product', { product: product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Error fetching product');
    }
});

app.put('/admin/products/edit/:id', requireAdminAuth, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    const updateData = { name, description, price, category, stock };

    if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    console.log('Updating product with ID:', id);
    console.log('Update data:', updateData);

    try {
        const result = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (result) {
            res.status(200).send('Product updated successfully');
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
});

// View customers

app.get('/admin/view-customers', requireAdminAuth, async (req, res) => {
    try {
        const users = await User.find();
        res.render('view-customers', { users });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.get('/admin/view-products', requireAdminAuth, async (req, res) => {
    try {
        const products = await Product.find();
        res.render('view-products', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// User logout
app.get('/logout', (req, res) => {
    console.log('Logging out user...');
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Logout failed. Please try again later.' });
        }
        console.log('Logout successful');
        res.redirect('/login');
    });
});

// Admin logout
app.get('/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed. Please try again later.' });
        }
        res.redirect('/admin/login');
    });
});

app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + "/public/pages/page-not-found.html");
});