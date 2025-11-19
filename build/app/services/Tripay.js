"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = createTransaction;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
require("dotenv").config();
const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY || "";
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY || "";
const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE || "";
const TRIPAY_MODE = (process.env.TRIPAY_MODE || "production").toLowerCase();
const TRIPAY_DEFAULT_METHOD = process.env.TRIPAY_DEFAULT_METHOD || "";
const BASE_URL = TRIPAY_MODE === "sandbox"
    ? "https://tripay.co.id/api-sandbox"
    : "https://tripay.co.id/api";
if (!TRIPAY_API_KEY || !TRIPAY_PRIVATE_KEY || !TRIPAY_MERCHANT_CODE) {
    console.warn("[Tripay] Environment variables TRIPAY_API_KEY, TRIPAY_PRIVATE_KEY, TRIPAY_MERCHANT_CODE are not fully set. Tripay integration will be disabled until they are configured.");
}
const http = axios_1.default.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(TRIPAY_API_KEY
            ? {
                Authorization: `Bearer ${TRIPAY_API_KEY}`,
            }
            : {}),
    },
    timeout: 15000,
});
function createSignature(amount, merchantRef) {
    if (!TRIPAY_PRIVATE_KEY || !TRIPAY_MERCHANT_CODE) {
        throw new Error("Tripay private key or merchant code is not configured. Please set TRIPAY_PRIVATE_KEY and TRIPAY_MERCHANT_CODE.");
    }
    const payload = `${TRIPAY_MERCHANT_CODE}${merchantRef}${amount}`;
    return crypto_1.default.createHmac("sha256", TRIPAY_PRIVATE_KEY).update(payload).digest("hex");
}
async function createTransaction(options) {
    if (!TRIPAY_API_KEY || !TRIPAY_PRIVATE_KEY || !TRIPAY_MERCHANT_CODE) {
        throw new Error("Tripay environment variables are not fully configured. Please set TRIPAY_API_KEY, TRIPAY_PRIVATE_KEY, TRIPAY_MERCHANT_CODE.");
    }
    const method = (options.method || TRIPAY_DEFAULT_METHOD || "").trim();
    if (!method) {
        throw new Error("Tripay payment method is not specified. Provide options.method or configure TRIPAY_DEFAULT_METHOD.");
    }
    const signature = createSignature(options.amount, options.merchantRef);
    const expiredMinutes = options.expiredMinutes && options.expiredMinutes > 0 ? options.expiredMinutes : 60;
    const expiredTime = Math.floor(Date.now() / 1000) + expiredMinutes * 60;
    const payload = {
        method,
        merchant_ref: options.merchantRef,
        amount: options.amount,
        customer_name: options.customerName,
        customer_email: options.customerEmail || undefined,
        customer_phone: options.customerPhone || undefined,
        order_items: options.items,
        expired_time: expiredTime,
        signature,
    };
    if (options.callbackUrl) {
        payload.callback_url = options.callbackUrl;
    }
    if (options.returnUrl) {
        payload.return_url = options.returnUrl;
    }
    const response = await http.post("/transaction/create", payload);
    return response.data;
}
const TripayService = {
    createTransaction,
};
exports.default = TripayService;
//# sourceMappingURL=Tripay.js.map