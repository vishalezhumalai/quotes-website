// db.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'testdb';
const collectionName = 'messages';

async function connect() {
    if (!client.isConnected) {
        await client.connect();
    }
    const db = client.db(dbName);
    return db.collection(collectionName);
}

async function insertMessage(data) {
    const collection = await connect();
    const defaultData = {
        readstatus: 'unread',
        readtime: null,
        reply: null,
    };
    return await collection.insertOne({ ...defaultData, ...data });
}

async function getMessages(filter = {}) {
    const collection = await connect();
    return await collection.find(filter).toArray();
}

async function updateMessage(id, updateFields) {
    const collection = await connect();
    return await collection.updateOne({ id }, { $set: updateFields });
}

async function deleteMessage(id) {
    const collection = await connect();
    return await collection.deleteOne({ id });
}

async function getMessagesByDate(ddmmyyyy) {
    // Convert ddmmyyyy to Date range
    const day = parseInt(ddmmyyyy.slice(0, 2));
    const month = parseInt(ddmmyyyy.slice(2, 4)) - 1; // JS months are 0-based
    const year = parseInt(ddmmyyyy.slice(4, 8));

    const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, day + 1, 0, 0, 0));

    const collection = await connect();
    return await collection.find({
        date: { $gte: startDate, $lt: endDate }
    }).toArray();
}

module.exports = {
    insertMessage,
    getMessages,
    updateMessage,
    deleteMessage,
    getMessagesByDate,
};
