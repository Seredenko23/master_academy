exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('type').notNullable().references('types.id');
    table.uuid('color').notNullable().references('colors.id');
    table.decimal('price').notNullable();
    table.integer('quantity').notNullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('products');
  await knex.raw('drop extension if exists "uuid-ossp" cascade');
};
