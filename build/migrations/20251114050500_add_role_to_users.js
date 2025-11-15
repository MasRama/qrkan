"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable("users", (table) => {
        table.string("role", 50).notNullable().defaultTo("organizer").index();
    });
}
async function down(knex) {
    await knex.schema.alterTable("users", (table) => {
        table.dropColumn("role");
    });
}
//# sourceMappingURL=20251114050500_add_role_to_users.js.map