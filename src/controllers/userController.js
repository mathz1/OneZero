const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { read } = require('fs');
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

      ctx.body = { id: id, name: name, email: email };
    }
    catch (err) {
      ctx.status = 400;
      ctx.body = { error: `Error in user register (${err.message})` }
    }
  },

  async update(ctx) {
    try {
      const id = ctx.request.header.authorization;

      const { name } = ctx.request.body;

      const user = await db('user').where('id', id).select('name').first();

      if (!id || !user) {
        ctx.status = 400;
        return ctx.body = { error: 'User not exists!' }
      }

      await db('user').where('id', id).update({ name: name });

      ctx.body = { id: id, name: name }
    }
    catch (err) {
      ctx.status = 400;
      ctx.body = { error: `Error in user update (${err.message})` }
    }
  },

  async readAll(ctx) {
    try {
      const { page = 1 } = ctx.request.query;

      const users = await db('user').limit(5).offset((page - 1) * 5).select('id', 'name', 'email');

      ctx.body = { users }
    }
    catch (err) {
      ctx.status = 400;
      ctx.body = { error: `Error in user read (${err.message})` }
    }
  }
}