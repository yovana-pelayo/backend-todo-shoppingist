const bcrypt = require('bcrypt');
const { User } = require('../models/User');
// const jwt = require('jsonwebtoken');

module.exports = class UserService {
  static async create({ email, password }) {
    if (email.length <= 6) {
      throw new Error('Invalid Email');
    }
    if (password.length < 6) {
      throw new Error('Password must be 6 characters long');
    }
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insert({ email, passwordHash });
    return user;
  }
};
