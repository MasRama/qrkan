"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable("checkin_logs", (table) => {
        table.uuid("id").primary().notNullable();
        table.uuid("ticket_id").notNullable().index();
        table.string("gate_name", 255).notNullable();
        table.string("gate_id", 255);
        table.uuid("operator_id").notNullable().index();
        table.bigInteger("checkin_at").notNullable();
        table
            .foreign("ticket_id")
            .references("id")
            .inTable("tickets")
            .onDelete("CASCADE");
        table
            .foreign("operator_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
    });
}
async function down(knex) {
    await knex.schema.dropTable("checkin_logs");
}
//# sourceMappingURL=20251114050400_create_checkin_logs.js.map