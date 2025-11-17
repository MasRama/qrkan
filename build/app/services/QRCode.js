"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class QRCodeService {
    async generateForToken(token) {
        const dir = path_1.default.join(process.cwd(), "public", "tickets");
        await fs_1.default.promises.mkdir(dir, { recursive: true });
        const fileName = `${token}.png`;
        const filePath = path_1.default.join(dir, fileName);
        await qrcode_1.default.toFile(filePath, token, {
            width: 512,
            margin: 2,
        });
        return {
            filePath,
            relativePath: `public/tickets/${fileName}`,
            url: `/public/tickets/${fileName}`,
        };
    }
}
exports.default = new QRCodeService();
//# sourceMappingURL=QRCode.js.map