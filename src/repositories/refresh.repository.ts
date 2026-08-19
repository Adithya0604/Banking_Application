import { Pool, PoolClient } from "pg";
import { db } from "../config/database";

//Main reason for creating this object: FindRefreshToken OutPut is row means which contains few colums. Instead of keeping Promise<any | null>. Just created an object which will replicate the same structure of the results
export interface RefreshToken {
  id: string;
  customer_id: String;
  token_hash: string;
  family_id: string;
  is_revoked: boolean;
  expires_at: Date;
  updated_at: Date;
}

// Find refresh token
export class RefreshTokenRepository {
  //FindRefreshToken. INPUT => Token_hash(RefreshToken + Sha256) => OUTPUT => Entire Row or null.
  async FindRefreshToken(Token_Hash: String): Promise<RefreshToken | null> {
    const SearchQuery = `SELECT * FROM refresh_token WHERE token_hash = $1`;
    const Results = await db.query(SearchQuery, [Token_Hash]);
    return Results.rows[0] || null;
  }

  //RotateRefreshToken. INPUT => Old_Token_Hash(Old_RefreshToken + sha256), Customer_id, Token_hash(NewRefreshToken + Sha256), family_id, is_revoked, expired_at) => OUTPUT(Insert Into refresh_token(Customer_id,....), But Customer_id, Family_id Should be old values.)
  //Instead of keeping things seprated just make an object. {Cust.., token.., family...}
  async RotateRefreshToken(
    Old_Token_Hash: String,
    Customer_id: String,
    Token_Hash: String,
    Family_id: String,
    expires_at: Date,
  ): Promise<void> {
    //Using client instead of pool because many set of operations to be one in one go.
    const client: PoolClient = await db.connect();

    try {
      await client.query(`BEGIN`);

      await client.query(
        `Update refresh_token set is_revoked = true, updated_at = now() where token_hash = $1`,
        [Old_Token_Hash],
      );

      await client.query(
        `Insert into refresh_token(Customer_id, token_hash, family_id, is_revoked, expires_at)values($1, $2, $3, $4, $5)`,
        [Customer_id, Token_Hash, Family_id, false, expires_at],
      );

      await client.query(`COMMIT`);
    } catch (err) {
      await client.query(`ROLLBACK`);
      throw err;
    } finally {
      client.release();
    }
  }

  //Breach protection INPUT => Family_id => OUTPUT => ALL TOKEN MAPPED TO FAMILY_ID SHOULD BE REVOKED
  async revokeFamilyTokens(family_id: string): Promise<void> {
    await db.query(
      `Update refresh_token set is_revoked = true, updated_at = Now() where family_id = $1`,
      [family_id],
    );
  }
}
