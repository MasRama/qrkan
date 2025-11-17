"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable("events", (table) => {
        table.uuid("id").primary().notNullable();
        table.uuid("organizer_id").notNullable().index();
        table.string("name", 255).notNullable();
        table.text("description");
        table.string("location", 255);
        table.bigInteger("start_at").notNullable();
        table.bigInteger("end_at").notNullable();
        table.integer("capacity").nullable();
        table.string("status", 50).notNullable().defaultTo("draft");
        table.bigInteger("created_at");
        table.bigInteger("updated_at");
        table
            .foreign("organizer_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
    });
}
async function down(knex) {
    await knex.schema.dropTable("events");
}
//# sourceMappingURL=20251114050100_create_events.js.map