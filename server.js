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
    const { name, email, currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let updated = false;

        if (name && name !== user.name) {
            user.name = name;
            updated = true;
        }

        if (email && email !== user.email) {
            user.email = email;
            updated = true;
        }

        if (currentPassword && newPassword && confirmPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect current password' });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'New passwords do not match' });
            }

            user.password = await bcrypt.hash(newPassword, saltRounds);
            updated = true;
        }

        if (updated) {
            await user.save();
            return res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            return res.status(400).json({ message: 'No changes made to the profile' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
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
    res.sendFile(__dirname + "/public/pages/product.html");
})