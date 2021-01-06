exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  await knex.schema.createTable('types', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('type').notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('types');
  await knex.raw('drop extension if exists "uuid-ossp"');
};
