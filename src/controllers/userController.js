const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../database/index');

function generateUniqueId() {
  return crypto.randomBytes(4).toString('HEX');
}

module.exports = {
  async create(ctx) {
    try {
      const { name, email, password } = ctx.request.body;

      const user = await db('user').where('email', email).select('email').first();
    
      if (user) {
        ctx.status = 409;
        return ctx.body = { error: 'User already exists!' };
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const id = generateUniqueId();

      await db('user').insert({
        id,
        name,
        email,
        password: encryptedPassword
      });

      ctx.body = { name: name, email: email };
    }
    catch (err) {
      ctx.status = 400;
      ctx.body = { error: `Error in user register (${err.message})` }
    }
  }
}