import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Add a unique index to ensure only one participant per (event_id, phone).
  // SQLite allows multiple NULLs in a UNIQUE index, so participants without
  // phone numbers are still allowed.
  await knex.schema.alterTable("participants", (table) => {
    table.unique(["event_id", "phone"], "participants_event_phone_unique");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("participants", (table) => {
    table.dropUnique(["event_id", "phone"], "participants_event_phone_unique");
  });
}
