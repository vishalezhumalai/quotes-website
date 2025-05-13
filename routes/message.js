// routes/messages.js
const express = require('express');
const router = express.Router();
const {
    insertMessage,
    getMessages,
    updateMessage,
    deleteMessage,
    getMessagesByDate
} = require('../db');

// POST /messages
router.post('/', async (req, res) => {
    const { id, date, message } = req.body;
    if (!id || !date || !message) {
        return res.status(400).json({ error: 'id, date, and message are required' });
    }

    try {
        const result = await insertMessage({ id, date: new Date(date), message });
        res.status(201).json({ insertedId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /messages
router.get('/', async (req, res) => {
    try {
        const messages = await getMessages();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /messages/date/:ddmmyyyy
router.get('/date/:ddmmyyyy', async (req, res) => {
    const { ddmmyyyy } = req.params;

    if (!/^\d{8}$/.test(ddmmyyyy)) {
        return res.status(400).json({ error: 'Invalid date format. Use ddmmyyyy.' });
    }

    try {
        const messages = await getMessagesByDate(ddmmyyyy);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /messages/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const result = await updateMessage(id, updateFields);
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({ modifiedCount: result.modifiedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /messages/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteMessage(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({ deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
