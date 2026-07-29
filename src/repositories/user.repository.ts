import { db } from "../config/database";
import { RegisterUserInput } from "../schemas/auth.schema";

export interface CreatedCustomer {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  status: string;
  createdAt: Date;
}

export class UserRepository {
  /*User Already Exist Or Not */
  async existsByEmailOrPhone(email: string, phone: string): Promise<boolean> {
    const query = `SELECT 1 FROM CUSTOMERS WHERE EMAIL = $1 OR PHONE = $2 LIMIT 1`;
    const result = await db.query(query, [email, phone]);
    return (result.rowCount ?? 0) > 0;
  }

  /*Create User In One Step */
  async createCustomer(
    input: RegisterUserInput,
    passwordHash: string,
  ): Promise<CreatedCustomer> {
    const client = await db.connect();

    try {
      //Insert Into Customers
      const InsertQuery = `Insert into Customers(email, phone, first_name, last_name, status)
    Values($1, $2, $3, $4, 'PENDING_KYC')`;
      const InsertRes = await client.query(InsertQuery, [
        input.email,
        input.phone,
        input.firstName,
        input.lastName,
      ]);

      const Customer = InsertRes.rows[0];

      //Insert Customer Credentinals
      const PassCodeQuery = `Insert into customer_credentials(customer_id, password_hash) Values($1, $2)`;
      await client.query(PassCodeQuery, [Customer.id, passwordHash]);

      //Insert into customer address
      const CustomerAddressQuery = `Insert into customer_addresses(customer_id, street_line1, street_line2, city, state, postal_code, country)
                                        Values($1, $2, $3, $4, $5, $6, $7)`;
      await client.query(CustomerAddressQuery, [
        Customer.id,
        input.address.streetLine1,
        input.address.streetLine2 || null,
        input.address.city,
        input.address.state,
        input.address.postalCode,
        input.address.country || "INDIA",
      ]);

      await client.query("COMMIT");

      return {
        id: Customer.id,
        email: Customer.email,
        firstname: Customer.first_name,
        lastname: Customer.last_name,
        status: Customer.status,
        createdAt: Customer.Created_at,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
