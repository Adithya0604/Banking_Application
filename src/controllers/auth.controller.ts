import { Request, Response, NextFunction } from "express";
import { AuthServices, DuplicateUserError } from "../services/auth.services";

export class AuthController {
  private authService: AuthServices;

  constructor() {
    this.authService = new AuthServices();
  }

  /*Handle User Registeration */
  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const Customer = await this.authService.registerUser(req.body);

      res.status(200).json({
        success: true,
        message:
          "User registered successfully. Please provide to KYC verification",
        data: {
          customorid: Customer.id,
          email: Customer.email,
          firstname: Customer.firstname,
          lastname: Customer.lastname,
          status: Customer.status,
          CreatedAt: Customer.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof DuplicateUserError) {
        res.status(409).json({
          success: false,
          error: {
            code: "DUPLICATE_ERROR",
            message: error.message,
          },
        });
        return;
      }
      next(error);
    }
  };
}
