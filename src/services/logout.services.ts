import "dotenv/config";
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";
import { LogOutSessionRepo } from "../repositories/logout.repository";
import { GeneratingHash } from "../utils/hash.utils";

export class InvalidVerifiedToken extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Invalid_Verified_Token";
  }
}

export class LogoutSessionService {
  async LogoutSession(
    refreshtoken: string,
    allDevices: boolean,
  ): Promise<void> {
    const hashedValue = await GeneratingHash(refreshtoken);

    let customer_id: string;
    try {
      const decoded = jwt.verify(
        refreshtoken,
        process.env.JWT_SECRET!,
      ) as JwtPayload;

      customer_id = decoded?.sub as string;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        const decoded = jwt.decode(refreshtoken) as JwtPayload;
        customer_id = decoded?.id;
      } else {
        throw new InvalidVerifiedToken("Invalid refresh token provided");
      }
    }
    if (!customer_id) {
      throw new InvalidVerifiedToken("Token payload missing user identifier");
    }

    await LogOutSessionRepo(hashedValue, customer_id, allDevices);
  }
}
