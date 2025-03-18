/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const { loadData } = require("./util/import-mongo/index");

const app = express();
app.use("*", cors());
const port = 3060;

// Connect to MongoDB
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
}).catch((e) => console.error('Failed to connect to DB', e));

app.use(express.json());

// Items API Task 1: import the secondChanceItemsRoutes and store in a constant called secondChanceItemsRoutes
const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes');

// Task 1: Import searchRoutes and store in a constant called searchRoutes
const searchRoutes = require('./routes/searchRoutes');

// Logger
const pinoHttp = require('pino-http');
const logger = require('./logger');
app.use(pinoHttp({ logger }));

// Use Routes
app.use('/api/secondchance/items', secondChanceItemsRoutes);

// Task 2: Add the searchRoutes to the server using the app.use() method
app.use('/api/secondchance/search', searchRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/", (req, res) => {
    res.send("Inside the server");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
