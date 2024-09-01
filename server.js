import express from 'express';
import { dirname } from "path";
import path from 'path';
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import ejs from 'ejs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import session from 'express-session';

// Database models
import User from './models/Users.js';
import Product from './models/Products.js';
import Order from './models/Orders.js';
import Admin from './models/Admin.js';

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

app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    console.log("Password:", password);
    console.log("Salt Rounds:", saltRounds);

    try {
        // Checking if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.render('signup', { message: 'User already exists' });
        }

        if (password !== confirmPassword) {
            return res.render('signup', { message: 'Passwords do not match' });
        }        

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            orders: [],
            cart: []     
        });

        // Save new user to the database
        await newUser.save();

        // Log the user in by setting session data
        req.session.userId = newUser._id;
        req.session.email = newUser.email;

        // Redirect to home page
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { message: 'Invalid email' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { message: 'Invalid password' });
        }

        // Set session variables
        req.session.userId = user._id;
        req.session.userName = user.name;
        req.session.userEmail = user.email;

        // Redirect to the home page after successful login
        res.redirect('/home');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('login', { message: 'Server error. Please try again later.' });
    }
});


app.get("/signup", (req, res) => {
    res.render("signup",{ message: '' });
})

app.get("/login", (req, res) => {
    res.render("register", { message: '' });
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/pages/index.html");
})

app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/public/pages/index.html");
})

app.get("/products", (req, res) => {
    res.sendFile(__dirname + "/public/pages/product.html");
})

app.get("/user/orders", (req, res) => {
    res.render("orders")
})