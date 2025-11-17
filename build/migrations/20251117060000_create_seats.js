"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
async function down(knex) {
    await knex.schema.dropTable("seats");
}
//# sourceMappingURL=20251117060000_create_seats.js.map