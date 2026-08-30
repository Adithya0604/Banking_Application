import { db } from "../config/database";

export type Payload = {
  customerId: string;
  PanCardNumber: string;
  AadharCardNumber: string;
  Pankey: string;
  AadharFrontkey: string;
  AadharBackkey: string;
};
export class kycDocumentsRepo {
  async submitKycDocuments(input: Payload) {
    //1. I have to update the values inside one table only but there will be 5 entries at one time.
    //2. And all of them to be done in one go.
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const insertCommand = `Insert into kyc_verifications(customer_id, document_type, document_hash, status)
      Values($1, $2, $3, $4),($5, $6 ,$7, $8),($9, $10 ,$11, $12),($13, $14 ,$15, $16),($17, $18 ,$19, $20)`;

      await client.query(insertCommand, [
        input.customerId,
        "PAN_IMAGE",
        input.Pankey,
        "Uploaded",

        input.customerId,
        "AADHAAR_FRONT_IMAGE",
        input.AadharFrontkey,
        "Uploaded",

        input.customerId,
        "AADHAAR_BACK_IMAGE",
        input.AadharBackkey,
        "Uploaded",

        input.customerId,
        "PAN_NUMBER",
        input.PanCardNumber,
        "Pending",

        input.customerId,
        "AADHAAR_NUMBER",
        input.AadharCardNumber,
        "Pending",
      ]);

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
