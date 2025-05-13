// app.js
const express = require('express');
const bodyParser = require('body-parser');
const messagesRouter = require('./routes/message');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/messages', messagesRouter);

app.get('/', (req, res) => {
    res.send('React Quotes MongoDB Message API is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
