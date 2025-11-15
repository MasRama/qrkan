"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable("participants", (table) => {
        table.unique(["event_id", "phone"], "participants_event_phone_unique");
    });
}
async function down(knex) {
    await knex.schema.alterTable("participants", (table) => {
        table.dropUnique(["event_id", "phone"], "participants_event_phone_unique");
    });
}
//# sourceMappingURL=20251115000100_add_unique_participant_phone_per_event.js.map