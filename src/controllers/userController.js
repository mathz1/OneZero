const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../database/index');

//funcao para gerar id unico para o banco de dados
function generateUniqueId() {
  return crypto.randomBytes(4).toString('HEX');
}

module.exports = {
  async create(ctx) {
    try {
      const { name, email, password, age } = ctx.request.body;

      if (age < 18) {
        ctx.status = 400;
        return ctx.body = { error: 'Under age!' }
      }

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
        password: encryptedPassword,
        age
      });

      ctx.status = 201;
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
      ctx.body = { error: `Error in user readAll (${err.message})` }
    }
  },

  async read(ctx) {
    try {
      const id = ctx.request.header.authorization;

      const user = await db('user').where('id', id).select('*').first();

      if (!user) {
        ctx.status = 404;
        return ctx.body = { error: 'User not exists!' };
      }

      ctx.body = { user }
    }
    catch (err) {
      ctx.status = 400;
      ctx.body = { error: `Error in user read (${err.message})` }
    }
  },

  async delete(ctx) {
    try {
      const id = ctx.request.header.authorization;

      const user = await db('user').where('id', id).select('name').first();

      if (!id || !user) {
        ctx.status = 400;
        return ctx.body = { error: 'User not exists!' }
      }

      await db('user').where('id', id).delete();

      ctx.body = { message: 'User deleted!', name: user.name }
    }
    catch (err) {
      ctx.status = 400;
      ctx.body = { error: `Error in user delete (${err.message})` }
    }
  }
}