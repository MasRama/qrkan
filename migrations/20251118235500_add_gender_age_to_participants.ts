import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("participants", (table) => {
        table.string("gender").nullable();
        table.integer("age").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("participants", (table) => {
        table.dropColumn("gender");
        table.dropColumn("age");
    });
}
