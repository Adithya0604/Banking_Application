import { db } from "../config/database";

export class accountCreationRepository {
  async accountVerify(customer_id: string): Promise<any> {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      console.log("typeof customerid", typeof customer_id);
      const accountVerificationDetails = await client.query(
        `SELECT * FROM public."AccountCreationVerification"($1::UUID)`,
        [customer_id],
      );
      console.log("accountVerificationDetails", accountVerificationDetails);
      const output =
        accountVerificationDetails.rows.length !== 0
          ? accountVerificationDetails.rows
          : null;
      await client.query("COMMIT");
      console.log("output", output);
      return output;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async AccountNumberCheckExists(input: any): Promise<any> {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `SELECT 1 FROM ACCOUNTS WHERE ACCOUNT_NUMBER = $1 LIMIT 1`,
        [input],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  async newAccountNumbermapping(input: any): Promise<any> {
    const { NewAccountNumber, customer_id } = input;
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO ACCOUNTS(account_number, customer_id, account_type, status, currency, cached_balance) VALUES($1, $2, $3, $4, $5, $6)`,
        [NewAccountNumber, customer_id, "Savings", "APPROVED", "INR", 0.0],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
