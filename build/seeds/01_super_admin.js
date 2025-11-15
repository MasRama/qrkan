"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const crypto_1 = require("crypto");
const Authenticate_1 = __importDefault(require("../app/services/Authenticate"));
async function seed(knex) {
    const email = "ram@gmail.com";
    const existing = await knex("users").where({ email }).first();
    if (existing) {
        return;
    }
    const password = await Authenticate_1.default.hash("ram");
    const now = Date.now();
    await knex("users").insert({
        id: (0, crypto_1.randomUUID)(),
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
//# sourceMappingURL=01_super_admin.js.map