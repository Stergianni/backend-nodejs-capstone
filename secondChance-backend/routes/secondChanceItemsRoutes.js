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

// Add a new secondChanceItem
router.post('/', upload.single('file'), async (req, res, next) => {
    try {
        // Task 1: Retrieve the database connection
        const db = await connectToDatabase();

        // Task 2: Retrieve the secondChanceItems collection
        const collection = db.collection("secondChanceItems");

        // Task 3: Create a new secondChanceItem from the request body
        let secondChanceItem = req.body;

        // Task 4: Get the last id, increment it by 1, and set it to the new secondChanceItem
        const lastItemQuery = await collection.find().sort({ 'id': -1 }).limit(1).toArray();
        if (lastItemQuery.length > 0) {
            secondChanceItem.id = (parseInt(lastItemQuery[0].id) + 1).toString();
        } else {
            secondChanceItem.id = "1"; // Default ID if no items exist
        }

        // Task 5: Set the current date in the new item
        secondChanceItem.date_added = Math.floor(new Date().getTime() / 1000);

        // Task 6: Add the secondChanceItem to the database
        const result = await collection.insertOne(secondChanceItem);
        secondChanceItem._id = result.insertedId;

        // Task 7: Upload its image to the images directory
        if (req.file) {
            secondChanceItem.image = `/images/${req.file.filename}`;
        }

        res.status(201).json(secondChanceItem);
    } catch (e) {
        logger.error('Error adding item:', e);
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        // Task 1: Retrieve the database connection
        const db = await connectToDatabase();

        // Task 2: Retrieve the secondChanceItems collection
        const collection = db.collection("secondChanceItems");

        // Task 3: Find a specific secondChanceItem by its ID
        const id = req.params.id;
        const secondChanceItem = await collection.findOne({ id: id });

        // Task 4: Return the secondChanceItem or an error message if not found
        if (!secondChanceItem) {
            return res.status(404).send("SecondChanceItem not found");
        }

        res.json(secondChanceItem);
    } catch (e) {
        logger.error('Error retrieving item:', e);
        next(e);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        // Task 1: Retrieve the database connection
        const db = await connectToDatabase();

        // Task 2: Retrieve the secondChanceItems collection
        const collection = db.collection("secondChanceItems");

        // Task 3: Check if the secondChanceItem exists
        const id = req.params.id;
        const secondChanceItem = await collection.findOne({ id });

        if (!secondChanceItem) {
            logger.error('SecondChanceItem not found');
            return res.status(404).json({ error: "SecondChanceItem not found" });
        }

        // Task 4: Update the item's attributes
        secondChanceItem.category = req.body.category;
        secondChanceItem.condition = req.body.condition;
        secondChanceItem.age_days = req.body.age_days;
        secondChanceItem.description = req.body.description;
        secondChanceItem.age_years = Number((secondChanceItem.age_days / 365).toFixed(1));
        secondChanceItem.updatedAt = new Date();

        const updatedItem = await collection.findOneAndUpdate(
            { id },
            { $set: secondChanceItem },
            { returnDocument: 'after' }
        );

        // Task 5: Send confirmation
        if (updatedItem) {
            res.json({ message: "Update successful", updatedItem });
        } else {
            res.status(500).json({ error: "Update failed" });
        }
    } catch (e) {
        logger.error('Error updating item:', e);
        next(e);
    }
});


module.exports = router;
