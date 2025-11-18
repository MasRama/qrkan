"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.table("participants", (table) => {
        table.string("gender").nullable();
        table.integer("age").nullable();
    });
}
async function down(knex) {
    await knex.schema.table("participants", (table) => {
        table.dropColumn("gender");
        table.dropColumn("age");
    });
}
//# sourceMappingURL=20251118235500_add_gender_age_to_participants.js.map