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
    console.log("2.4");
    const payload = {
      NewAccountNumber,
      customer_id: input,
    };

    console.log("2.5");
    await this.accountcreationrepository.newAccountNumbermapping(payload);

    return {
      NewAccountNumber,
      customer_id: input,
      status: "Approved",
    };
  }
}
