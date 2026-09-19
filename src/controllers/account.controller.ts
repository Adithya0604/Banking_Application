import { Request, Response, NextFunction } from "express";
import {
  AccountCreationVerification,
  AccountVerificationPending,
  AccountNumberAlreadyExist,
  AccountInActive,
} from "../services/account.services";

export class AccountCreation {
  private accountcreationverification: AccountCreationVerification;
  constructor() {
    this.accountcreationverification = new AccountCreationVerification();
  }
  account = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    //We will just make a call for account services & pass the parameters like customer_id & few other parameters like for security purpose.
    const customer_id = req.user?.sub;
    console.log(customer_id);
    try {
      //Calling Services with customer_id
      const results =
        await this.accountcreationverification.accountCreation(customer_id);

      return res
        .status(200)
        .json({ status: "success", message: JSON.stringify(results) });
    } catch (error) {
      if (error instanceof AccountVerificationPending) {
        return res.status(400).json({
          status: "success",
          error: {
            code: "Account_Verification_Pending",
            message: "Your Account Verification is pending",
          },
        });
        return;
      }
      if (error instanceof AccountNumberAlreadyExist) {
        return res.status(400).json({
          status: "success",
          error: {
            code: "Account_Number_Already_Exist",
            message: "Your Account Already Exists",
          },
        });
        return;
      }
      if (error instanceof AccountInActive) {
        return res.status(400).json({
          status: "success",
          error: {
            code: "Account_Inactive",
            message: "Your Account Inactive",
          },
        });
        return;
      }
      next(error);
    }
  };
}
