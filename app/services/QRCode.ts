import QRCode from "qrcode";
import fs from "fs";
import path from "path";

class QRCodeService {
  async generateForToken(token: string) {
    const dir = path.join(process.cwd(), "public", "tickets");
    await fs.promises.mkdir(dir, { recursive: true });

    const fileName = `${token}.png`;
    const filePath = path.join(dir, fileName);

    await QRCode.toFile(filePath, token, {
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

export default new QRCodeService();
