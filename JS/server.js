const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// PostgreSQL connection configuration
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Serbia1999',
  password: '196306',
  port: 5434,
});

client.connect();

// Middleware to parse JSON in POST requests
app.use(bodyParser.json());

// CORS configuration
app.use(
  cors({
    origin: 'http://127.0.0.1:5501', // replace with your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

// Endpoint to handle database queries
app.post('/query', async (req, res) => {
  const { query } = req.body;

  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve your HTML and other static files
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
