const pool = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async findByUsername(username) {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return rows[0];
  }

  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = User;
