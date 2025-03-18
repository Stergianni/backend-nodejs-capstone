const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });

// Get all secondChanceItems
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        // Task 1: Retrieve the database connection
        const db = await connectToDatabase();

        // Task 2: Retrieve the secondChanceItems collection
        const collection = db.collection("secondChanceItems");

        // Task 3: Fetch all secondChanceItems
        const secondChanceItems = await collection.find({}).toArray();

        // Task 4: Return the secondChanceItems
        res.json(secondChanceItems);
    } catch (e) {
        logger.error('Oops, something went wrong', e);
        next(e);
    }
});

module.exports = router;
