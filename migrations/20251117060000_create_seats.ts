import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("seats", (table) => {
    table.uuid("id").primary().notNullable();
    table.uuid("event_id").notNullable().index();
    table.string("name", 255).notNullable();
    table.integer("price").notNullable();
    table.bigInteger("created_at");
    table.bigInteger("updated_at");

    table
      .foreign("event_id")
      .references("id")
      .inTable("events")
      .onDelete("CASCADE");

    table.unique(["event_id", "name"], "seats_event_name_unique");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("seats");
}
