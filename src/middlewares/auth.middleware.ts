//Process
/*
1. Import REQUEST, response, next function from express.
2. Import validation errors from JW T Web tokens.
3. We need to write an asynchronous function which will be validating access token of a user this validations will be only in Middleware. We will extract the access token from headers where authorization will be bearer token.
*/

import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import "dotenv/config";

// We have declared a global
export interface UserPayload {
  id: string;
  email: string;
  status: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const autenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith("Bearer ")) {
      res.status(400).json({
        success: false,
        error: {
          code: "MISSING_TOKEN",
          message:
            "Authorization header missing or invalid format. Expected 'Bearer <token>'",
        },
      });
      return;
    }

    const actualToken = authToken.split(" ")[1];

    const decodeToken = jwt.verify(
      actualToken,
      process.env.JWT_SECRETKEY!,
    ) as UserPayload;

    req.user = {
      id: decodeToken.id,
      email: decodeToken.email,
      status: decodeToken.status,
    };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          code: "TOKEN_EXPIRED",
          message: "Access token has expired. Please refresh your session.",
        },
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Access token signature is invalid or corrupted.",
        },
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to authenticate request.",
      },
    });
  }
};
