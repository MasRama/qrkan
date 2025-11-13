import type { Knex } from "knex";
import { randomUUID } from "crypto";
import Authenticate from "../app/services/Authenticate";

export async function seed(knex: Knex): Promise<void> {
  const email = "ram@gmail.com";

  const existing = await knex("users").where({ email }).first();
  if (existing) {
    return;
  }

  const password = await Authenticate.hash("ram");
  const now = Date.now();

  await knex("users").insert({
    id: randomUUID(),
    name: "Super Admin",
    email,
    phone: null,
    is_verified: true,
    membership_date: new Date(),
    is_admin: true,
    password,
    remember_me_token: null,
    created_at: now,
    updated_at: now,
    role: "super_admin",
  });
}
