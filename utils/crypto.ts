import * as crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = "K9eJEHJjQqExqVHVuw77R7ZObrV8HdAy";

export function encryptId(message: string): string {
  const IV = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  const encryptedData =
    cipher.update(message, "utf-8", "hex") + cipher.final("hex");

  const base64IV = IV.toString("base64");

  return `${encryptedData}:${base64IV}`;
}

export function decryptId(message: string): string {
  const [encryptedData, base64IV] = message.split(":");
  const IV = Buffer.from(base64IV, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  const decryptedData =
    decipher.update(encryptedData, "hex", "utf-8") + decipher.final("utf8");

  return decryptedData;
}
