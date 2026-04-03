require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/nozzle.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'nozzle.html'));
});

app.get('/blueprint.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'blueprint.html'));
});

// Basic Health Check / DB Test
app.get('/status', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ status: 'online', db: 'connected', time: result.rows[0].now });
  } catch (err) {
    res.json({ status: 'online', db: 'disconnected', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`ICARUS Server running on port ${port}`);
});
