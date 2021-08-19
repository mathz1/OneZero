
exports.up = function(knex) {
  return knex.schema.createTable('user', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.integer('age').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user');
};
