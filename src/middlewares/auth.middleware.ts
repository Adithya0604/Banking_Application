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
  sub: string;
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
// This fucntion is not having an class so this is not protected like will the varibles or delarition will be exposed to other servcies and outside ?? will this effect any other repo or services.
export const autenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authToken = req.headers.authorization;

    console.log(1);
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
    console.log(2);
    const actualToken = authToken.split(" ")[1];
    console.log("actual token:", actualToken);
    console.log(3);
    const decodeToken = jwt.verify(
      actualToken,
      process.env.JWT_SECRET!,
    ) as UserPayload;

    console.log("decode token:", decodeToken);
    console.log(4);
    req.user = {
      sub: decodeToken.sub,
      email: decodeToken.email,
      status: decodeToken.status,
    };
    console.log(5);
    next();
  } catch (error) {
    console.log(6);
    if (error instanceof TokenExpiredError) {
      console.log(7);
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
      console.log(8);
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Access token signature is invalid or corrupted.",
        },
      });
      return;
    }

    console.log(9);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to authenticate request.",
      },
    });
  }
};
