"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable("participants", (table) => {
        table.uuid("seat_id").nullable().index();
        table
            .foreign("seat_id")
            .references("id")
            .inTable("seats")
            .onDelete("SET NULL");
    });
}
async function down(knex) {
    await knex.schema.alterTable("participants", (table) => {
        table.dropColumn("seat_id");
    });
}
//# sourceMappingURL=20251117060100_add_seat_id_to_participants.js.map