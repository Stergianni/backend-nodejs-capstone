require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB connection URL
let url = process.env.MONGO_URL;
let dbInstance = null;
const dbName = process.env.MONGO_DB;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance; // Return existing connection if already connected
    }

    try {
        // Task 1: Connect to MongoDB
        const client = new MongoClient(url);
        await client.connect();  // Establish connection

        // Task 2: Connect to the secondChance database
        dbInstance = client.db(dbName);

        console.log("Connected to MongoDB successfully");

        // Task 3: Return the database instance
        return dbInstance;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

module.exports = connectToDatabase;
