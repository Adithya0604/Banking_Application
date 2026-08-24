import crypto from "crypto";

export async function GeneratingHash(key: string): Promise<string> {
  return crypto.createHash("sha256").update(key).digest("hex");
}
