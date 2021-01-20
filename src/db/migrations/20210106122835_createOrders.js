exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  await knex.schema.createTable('orders', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('from').nullable();
    table.string('to').nullable();
    table.string('status').defaultTo('Opened');
    table.timestamps(true, true);
  });
  await knex.schema.createTable('order_items', (table) => {
    table.uuid('order_id').references('orders.id').onDelete('CASCADE');
    table.uuid('product_id').references('products.id').onDelete('CASCADE');
    table.integer('quantity').notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('order_items');
  await knex.schema.dropTable('orders');
  await knex.raw('drop extension if exists "uuid-ossp" cascade');
};
