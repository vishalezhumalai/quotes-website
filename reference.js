const { MongoClient } = require('mongodb');

 const uri = 'mongodb://localhost:27017'; 
/*const uri = 'mongodb+srv://vishale:Vishal%402024@hyp-aws-website.sqdd8.mongodb.net/';*/ //uri to connect to ATLAS DB IN REMOTE
const dbName = 'hyperpage';
let db;
let mgclient;

const connectDB = async () => {
    if (!db) {
        try {
            mgclient = new MongoClient(uri); // Removed deprecated options
            await mgclient.connect();
            db = mgclient.db(dbName);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw new Error('Database connection failed');
        }
    }
    return db;
};

// Insert data
const insertTransformation = async (data) => {
    try {
        const database = await connectDB();
        const collection = database.collection('transformation');
        const result = await collection.insertOne(data);
        return result;
    } catch (error) {
        console.error('Error inserting transformation:', error);
        throw new Error('Insert operation failed');
    }
};

// Update one data
const updateOneTransformation = async (filename, updateData) => {
    try {
        const database = await connectDB();
        const collection = database.collection('transformation');
        const result = await collection.updateOne(
            { hypFileName: filename }, 
            { $set: updateData }
        );
        return result;
    } catch (error) {
        console.error('Error updating transformation:', error);
        throw new Error('Update operation failed');
    }
};

// Update many data
const updateManyTransformation = async (filename, updateData) => {
    try {
        const database = await connectDB();
        const collection = database.collection('transformation');
        const result = await collection.updateMany(
            { hypFileName: filename }, 
            { $set: updateData }
        );
        return result;
    } catch (error) {
        console.error('Error updating transformations:', error);
        throw new Error('Update operation failed');
    }
};

// Close the MongoDB connection when the application is shutting down
const closeDB = async () => {
    if (mgclient) {
        await mgclient.close();
        console.log('MongoDB connection closed');
    }
};

//Graceful Shutdown
process.on('SIGINT', closeDB);
process.on('SIGTERM', closeDB);

module.exports = {
    insertTransformation,
    updateOneTransformation,
    updateManyTransformation,
};
