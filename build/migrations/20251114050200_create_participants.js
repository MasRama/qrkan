"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
async function down(knex) {
    await knex.schema.dropTable("participants");
}
//# sourceMappingURL=20251114050200_create_participants.js.map