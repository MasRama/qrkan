import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tickets", (table) => {
    table.uuid("id").primary().notNullable();
    table.uuid("event_id").notNullable().index();
    table.uuid("participant_id").notNullable().index();
    table.string("token", 255).notNullable().unique();
    table.string("status", 50).notNullable().defaultTo("pending");
    table.bigInteger("created_at");
    table.bigInteger("updated_at");

    table
      .foreign("event_id")
      .references("id")
      .inTable("events")
      .onDelete("CASCADE");

    table
      .foreign("participant_id")
      .references("id")
      .inTable("participants")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("tickets");
}
