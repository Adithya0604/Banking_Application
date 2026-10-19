import { Request, Response, NextFunction } from "express";
import { moneytransfer } from "../schemas/moneyTransfer.schema";

//make an async function

class moneyTransferController {
  moneyTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const customer_id = req.user?.sub;
      const {
        sender_id,
        reciver_id,
        amount,
        description,
      }: {
        sender_id: string;
        reciver_id: string;
        amount: number;
        description: string;
      } = req.body;

      //calling moneytransfer service
    } catch (error) {
      next(error);
    }
  };
}

/*The Cheat Sheet: When to use what?
To have super clarity, just ask yourself: "Am I calling this function right now, or am I handing it to someone else to call later?"

Rule 1: Handing it to someone else (Express Routers, setTimeout, DOM Events)?
👉 Use Arrow Functions =>
class Controller {
  moneyTransfer = async () => { }
}
Example: Controllers. You hand them to the Express Router.

Rule 2: Calling it yourself directly?
👉 Use Standard Methods ()
class Controller {
  async moneyTransfer() { } 
}
Example: Services and Repositories. You call them directly using this.service.method() or this.repo.method().
(Note: Standard methods are also slightly better for memory and performance, which is why we prefer them whenever possible!)
*/
