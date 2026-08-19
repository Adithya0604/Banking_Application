import { Request, Response, NextFunction } from "express";
import {
  RefreshTokenService,
  RefreshTokenSecurityBreach,
  UnauthroziedLogin,
} from "../services/refresh.services";

export class RefreshTokenController {
  private refreshTokenServices: RefreshTokenService;

  constructor() {
    this.refreshTokenServices = new RefreshTokenService();
  }

  RotateRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      //1. RefreshToken from req.body
      const { RefreshToken } = req.body;

      const Result = await this.refreshTokenServices.rotateTokens(RefreshToken);

      res.status(200).json({
        success: true,
        message: `Tokens Refresh Successfully.`,
        data: Result,
      });
    } catch (error) {
      if (error instanceof UnauthroziedLogin) {
        res.status(401).json({
          success: false,
          error: {
            code: "INVALID_REFRESH_TOKEN",
            message: error.message || null,
          },
        });
        return;
      }
      if (error instanceof RefreshTokenSecurityBreach) {
        res.status(403).json({
          success: false,
          error: {
            code: "SECURITY_BREACH_DETECTED",
            message: error.message || null,
          },
        });
      }
      next(error);
    }
  };
}
