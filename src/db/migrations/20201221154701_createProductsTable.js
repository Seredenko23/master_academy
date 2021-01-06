exports.up = async (knex) => {
  const tableName = 'products';

  await knex.raw('create extension if not exists "uuid-ossp"');

  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$;
  `);

  await knex.schema.createTable(tableName, (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('type').notNullable().references('types.id');
    table.uuid('color').notNullable().references('colors.id');
    table.decimal('price').notNullable();
    table.integer('quantity').notNullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
  });

  await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
};

exports.down = async (knex) => {
  await knex.schema.dropTable('products');
  await knex.raw(`DROP FUNCTION IF EXISTS update_timestamp() CASCADE;`);
  await knex.raw('drop extension if exists "uuid-ossp" cascade');
};
