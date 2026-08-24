import { db } from "../config/database";

export async function LogOutSessionRepo(
  HashRefreshToken: string,
  CustomerId: string,
  allDevices: boolean,
): Promise<void> {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    //AllDevices: true

    const decide = allDevices
      ? client.query(
          `UPDATE refresh_tokens set is_revoked = true, updated_at = NOW() where customer_id = $1`,
          [CustomerId],
        )
      : client.query(
          `UPDATE refresh_tokens set is_revoked = true, updated_at = NOW() where token_hash = $1 AND customer_id = $2`,
          [HashRefreshToken, CustomerId],
        );

    await decide;

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
}
