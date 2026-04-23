const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Aplikacjon dzialajson ts' });
});

module.exports = app;