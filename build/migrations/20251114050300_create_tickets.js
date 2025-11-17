"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
async function down(knex) {
    await knex.schema.dropTable("tickets");
}
//# sourceMappingURL=20251114050300_create_tickets.js.map