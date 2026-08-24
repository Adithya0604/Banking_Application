import { Request, Response, NextFunction } from "express";
import {
  LogoutSessionService,
  InvalidVerifiedToken,
} from "../services/logout.services";

export class LogOutController {
  private logout = new LogoutSessionService();

  Logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        refreshToken,
        allDevices,
      }: { refreshToken: string; allDevices: boolean } = req.body;

      await this.logout.LogoutSession(refreshToken, allDevices);

      res.status(200).json({
        success: true,
        message: allDevices
          ? `LogOut Successfully from all devices`
          : `LogOut Succesfully from one`,
      });
    } catch (error) {
      if (error instanceof InvalidVerifiedToken) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_TOKEN_PROVIDED...",
            message: error.message,
          },
        });
        return;
      }

      next(error);
    }
  };
}
