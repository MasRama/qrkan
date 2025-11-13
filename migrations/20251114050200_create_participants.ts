import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("participants", (table) => {
    table.uuid("id").primary().notNullable();
    table.uuid("event_id").notNullable().index();
    table.string("name", 255).notNullable();
    table.string("email", 255);
    table.string("phone", 50);
    table.bigInteger("created_at");
    table.bigInteger("updated_at");

    table
      .foreign("event_id")
      .references("id")
      .inTable("events")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("participants");
}
