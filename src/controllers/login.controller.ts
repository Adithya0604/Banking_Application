import { Request, Response, NextFunction } from "express";
import { LoginServices } from "../services/login.services";
import { success } from "zod";

export class LoginController {
  private loginservices: LoginServices;

  constructor() {
    this.loginservices = new LoginServices();
  }

  Login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const results = await this.loginservices.LoginUser(req.body);

      res.status(200).json({
        success: true,
        message: `Login successful`,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  };
}
