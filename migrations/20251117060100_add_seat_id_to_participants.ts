import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("participants", (table) => {
    table.uuid("seat_id").nullable().index();

    table
      .foreign("seat_id")
      .references("id")
      .inTable("seats")
      .onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("participants", (table) => {
    table.dropColumn("seat_id");
  });
}
