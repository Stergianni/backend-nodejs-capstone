/* jshint esversion: 8 */
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
const fs = require('fs')

// MongoDB connection URL with authentication options
const url = process.env.MONGO_URL
const filename = `${__dirname}/secondChanceItems.json`
const dbName = 'secondChance'
const collectionName = 'secondChanceItems'

// Load data asynchronously from the file
async function loadData() {
  try {
    const data = JSON.parse(await fs.promises.readFile(filename, 'utf8')).docs

    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    // Connect to MongoDB
    await client.connect()
    console.log('Connected successfully to server')

    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    // Create a unique index on 'id' to avoid duplicates
    await collection.createIndex({ id: 1 }, { unique: true })

    // Check if there are any existing documents in the collection
    const documents = await collection.find({}).toArray()
    if (documents.length === 0) {
      // Insert data if the collection is empty
      const insertResult = await collection.insertMany(data)
      console.log('Inserted documents:', insertResult.insertedCount)
    } else {
      console.log('Items already exist in the DB')
    }
  } catch (err) {
    console.error('Error during data loading:', err)
  } finally {
    // Close the MongoDB client connection
    await client.close()
  }
}

// Execute the loadData function
loadData()

module.exports = {
  loadData
}
