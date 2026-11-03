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

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /*
  {
  command: 'SELECT',
  rowCount: 1,
  oid: null,
  rows: [ { '?column?': 1 } ],
  fields: [
    {
      name: '?column?',
      tableID: 0,
      columnID: 0,
      dataTypeID: 23,
      dataTypeSize: 4,
      dataTypeModifier: -1,
      format: 'text'
    }
  ]
} */

  /*Existing Repo */
  /*
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
  */

  /*New Repo */
  // async AccountNumberCheckExists(input: string): Promise<number> {
  //   // No BEGIN/COMMIT needed for a single SELECT
  //   const result = await db.query(
  //     `SELECT 1 FROM ACCOUNTS WHERE ACCOUNT_NUMBER = $1 LIMIT 1`,
  //     [input],
  //   );

  //   // Return 1 if the row exists, 0 if it doesn't
  //   return (result.rowCount ?? 0) > 0 ? 1 : 0;
  // }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  async newAccountNumbermapping(input: any): Promise<any> {
    const { NewAccountNumber, customer_id } = input;
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO ACCOUNTS(account_number, customer_id, account_type, status, currency, cached_balance) VALUES($1, $2, $3, $4, $5, $6)`,
        // `INSERT INTO accounts_test(account_number, customer_id, account_type, status, currency, cached_balance) VALUES($1, $2, $3, $4, $5, $6)`, //<-- this is used for load testing purpose only because of FY constriat on the orignal table we needed to create the table which dont have any contraints or rulz.
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
