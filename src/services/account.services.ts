//1. Validating user... user active or not kyc is done or not and coupe of things to be considered.
//2. Checking that he alreaady has the account number or not ?? If yes then just return that account number
//3. If not having then just call the creation account number.
//4 will go into mulptle steps of checks and validation & then account number will be generated.
//5. Will just update the things aganist user.
//6. This will be not called externally by any button. It will auto. called when the kyc verification is completed.
import "dotenv/config";
import { accountCreationRepository } from "../repositories/account.repository";
import { AccountNumberCreation } from "../utils/AccountNumberCreation.utils";

export class AccountVerificationPending extends Error {
  constructor(message = "Your account status in pending") {
    super(message);
    this.name = "Account_Verification_Pending";
  }
}

export class AccountNumberAlreadyExist extends Error {
  constructor(message = "Account Already Exists") {
    super(message);
    this.name = "Account_Already_Exist";
  }
}

export class AccountInActive extends Error {
  constructor(message = "Account is InActive") {
    super(message);
    this.name = "Account_InActive";
  }
}

export class AccountCreationVerification {
  private accountcreationrepository: accountCreationRepository;
  constructor() {
    this.accountcreationrepository = new accountCreationRepository();
  }
  async accountCreation(input: any): Promise<any> {
    /**We have commected all of the  below validations until account creation because need to test this validaton logic but by bypassing all validations. Which can create a issue while we keep that validations and do load testing*/

    const accVerify = await this.accountcreationrepository.accountVerify(input);
    console.log("typeof customerid", typeof input.customer_id);
    console.log("Service Result", accVerify);
    //Account InActive
    if (accVerify[0].customerstatus !== "APPROVED") {
      throw new AccountInActive();
    }

    console.log("2.00");
    //Customer KYC Documents are pending
    if (
      accVerify[0].pannumberstatus !== "VERIFIED" ||
      accVerify[0].aadharnumberstatus !== "VERIFIED"
    ) {
      console.log("2.01");
      throw new AccountVerificationPending();
    }
    console.log("2.1");

    //Account number already exist
    if (
      accVerify[0].accountnumber !== "" &&
      accVerify[0].accountnumber !== null
    ) {
      console.log("2.22");
      throw new AccountNumberAlreadyExist();
    }

    console.log("2.3");
    let NewAccountNumber: string;

    /* 
    +++++++++++++++++++++++++++++++++++++++++
    Existing Logic of account number creation
    you want to eliminate the SELECT entirely to prevent race conditions and halve your database queries. Instead of checking if the number exists and then inserting, you just try to insert it. If the database rejects it because the number already exists, you catch that specific error and retry.

    The Issue and the Race Condition
    Previously, your Node.js backend asked PostgreSQL if a number existed (SELECT), waited for the answer, and then saved the number (INSERT). In a highly concurrent system, if two requests happen to generate the same random number at the exact same millisecond, both SELECT queries run simultaneously. Both get a "0 rows found" response. Both then execute the INSERT blindly. One succeeds, and the other crashes the app, completely defeating the purpose of the SELECT check.

    The Bottleneck and the Math
    The old pattern forced two separate network round-trips to the database for every single user. The math is linear but heavy: onboarding 10,000 customers requires 20,000 queries. You would notice this bottleneck during traffic spikes when your connection pool saturates, CPU usage jumps, and your API response times slow down simply from waiting on redundant network transit.

    The "Outsmart" Move
    We stopped trying to manage concurrency in the Node.js application layer and delegated it entirely to the database engine. By attempting the insert directly and catching the failure, we solved both the timing flaw (because the database processes the insert atomically) and the network load.

    Production Reliability of Error 23505
    Relying on the 23505 (unique_violation) error code is not a logical hack; it is the definitive, production-grade standard for high-performance systems. Because PostgreSQL strictly enforces ACID compliance, its unique constraints operate at the lowest storage layer using internal locking mechanisms. It is impossible for two identical account numbers to slip past this constraint, making this error-handling route 100% reliable across any number of concurrent transactions.

    Are the Bottlenecks Solved?
    Yes. You successfully halved the network traffic for account creation, eliminated the race condition entirely, and simplified your codebase by deleting an unnecessary repository function.
    +++++++++++++++++++++++++++++++++++++++++
    while (true) {
      //Account Creation
      console.log("2.31");
      NewAccountNumber = await AccountNumberCreation(15);

      const AccountAlreadyExist =
        await this.accountcreationrepository.AccountNumberCheckExists(
          NewAccountNumber,
        );
      console.log("2.32");
      if (AccountAlreadyExist === 1) {
        continue;
      }
      break;
    }
    */

    while (true) {
      NewAccountNumber = await AccountNumberCreation(15);

      console.log("2.4");
      const payload = {
        NewAccountNumber,
        customer_id: input,
      };

      try {
        // Attempt the INSERT directly.
        // Ensure ACCOUNT_NUMBER has a UNIQUE constraint in your PostgreSQL schema.
        console.log("2.5");
        await this.accountcreationrepository.newAccountNumbermapping(payload);

        // If the insert succeeds, break the loop
        break;
      } catch (error: any) {
        // '23505' is the PostgreSQL error code for unique_violation
        if (error.code === "23505") {
          // console.warn("Account number collision. Retrying...");
          continue;
        }

        // If it's a different database error (e.g., connection lost), throw it
        throw error;
      }
    }

    return {
      NewAccountNumber,
      customer_id: input,
      status: "Approved",
    };
  }
}
