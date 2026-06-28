const { Pool } = require('pg');
require('dotenv').config(); // Yeh line pakka add karein takki env load ho sake

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST === 'postgres' ? '127.0.0.1' : process.env.DB_HOST, // Agar 'postgres' likha hai toh localhost par redirect karega
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD || ''), // Isse password hamesha string format mein hi jayega
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
