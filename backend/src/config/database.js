const { Pool } = require("pg");

const pool = new Pool({
  user: "your_user",
  host: "localhost",
  database: "fipe_app",
  password: "your_password",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
