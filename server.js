import express from 'express';
import { dirname } from "path";
import path from 'path';
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, ()=> {
    console.log(`Server is listening on port ${port}`);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/pages/index.html");
})

