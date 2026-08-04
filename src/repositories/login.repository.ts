import { db } from "../config/database";
import { LoginUserInput } from "../schemas/login.schema";

export interface UserDetails {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  status: string;
}

export class LoginRepository {
  /*User Exists or not*/
  async userExistorNot(email: string, phone: string): Promise<boolean> {
    const query = `SELECT 1 FROM CUSTOMERS C WHERE EMAIL = $1 OR PHONE = $2 LIMIT 1`;
    const result = await db.query(query, [email, phone]);
    return (result.rowCount ?? 0) > 0;
  }

  /*If No: /1. Return User Not Exist/. /2. User Exists Check Email/Phone ==> Return One Column contains id & password */
  async getUserDetails(input: LoginUserInput): Promise<UserDetails | null> {
    const query = `SELECT C.ID, C.EMAIL, C.FIRST_NAME, C.LAST_NAME, CC.PASSWORD_HASH, C.STATUS FROM CUSTOMERS C LEFT JOIN CUSTOMER_CREDENTIALS CC ON C.ID = CC.CUSTOMER_ID WHERE EMAIL = $1 OR PHONE = $2 LIMIT 1`;
    const results = await db.query(query, [
      input.email || null,
      input.phone || null,
    ]);

    if (results.rows.length === 0) return null;
    return results.rows[0] as UserDetails;

    //const row = results.rows[0];
    // return {
    //   id: row.ID,
    //   email: row.Email,
    //   firstname: row.Firstname,
    //   lastname: row.lastname,
    //   password_hash: row.password_hash,
    //   Status: row.status,
    // };
  }
}
