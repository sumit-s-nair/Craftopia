import express from 'express';
import { dirname } from "path";
import path from 'path';
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import ejs from 'ejs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
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
const port = 3001;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, ()=> {
    console.log(`Server is listening on port ${port}`);
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