import "dotenv/config";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RefreshTokenRepository } from "../repositories/refresh.repository";

export class FailedRefreshTokenSignature extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FailedRefreshTokenSignature";
  }
}

export class RefreshTokenSecurityBreach extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RefreshTokenSecurityBreach";
  }
}

export class RefreshTokenSessionExpired extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RefreshTokenSessionExpired";
  }
}

export class UnauthroziedLogin extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthroziedLogin";
  }
}
export class RefreshTokenService {
  private refreshokenRepository: RefreshTokenRepository;

  constructor() {
    this.refreshokenRepository = new RefreshTokenRepository();
  }
  //Controller will give me refreshtoken which will be passing to services where the main validation will take place.
  async rotateTokens(rawRefreshToken: string) {
    console.log("rawRefreshToken:", rawRefreshToken);
    //1. Verify token signture in-rawRefreshToken
    let decode: any;
    console.log(`1. try block decode ${decode}`);
    try {
      decode = jwt.verify(rawRefreshToken, process.env.JWT_SECRET!);
      console.log("2. try block decode:", JSON.stringify(decode));
    } catch (error) {
      throw new FailedRefreshTokenSignature(
        "Refresh token signature is invalid or corrupted.",
      );
    }
    //2. Hash input refreshtoken
    const OldRefreshTokenHash = crypto
      .createHash("sha256")
      .update(rawRefreshToken)
      .digest("hex");

    console.log("OldRefreshTokenHash: ", OldRefreshTokenHash);
    const CheckingExistingRefreshToken =
      await this.refreshokenRepository.FindRefreshToken(OldRefreshTokenHash);

    console.log("CheckingExistingRefreshToken: ", CheckingExistingRefreshToken);
    if (!CheckingExistingRefreshToken) {
      throw new UnauthroziedLogin("Refresh Token Not found. Please login");
    }

    //3. Token Reuse detection
    if (CheckingExistingRefreshToken.is_revoked) {
      await this.refreshokenRepository.revokeFamilyTokens(
        CheckingExistingRefreshToken.family_id,
      );
      throw new RefreshTokenSecurityBreach(
        "Revoked session token presented. Security breach is detected all session for this devices is revoked.",
      );
    }

    //4. check is input refreshtoken expired
    if (new Date() > new Date(CheckingExistingRefreshToken.expires_at)) {
      throw new RefreshTokenSessionExpired(
        "Session is expired. Please login again",
      );
    }

    //5. Create new AT + RT + token_hash
    const newAccessToken = jwt.sign(
      {
        sub: CheckingExistingRefreshToken.customer_id,
        email: CheckingExistingRefreshToken.family_id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15min" },
    );

    const newRefreshToken = jwt.sign(
      {
        sub: CheckingExistingRefreshToken.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15days" },
    );

    console.log("newRefreshToken:", newRefreshToken);

    const newToken_Hash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    console.log("newToken_Hash:", newToken_Hash);
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 15);

    //6. results
    await this.refreshokenRepository.RotateRefreshToken(
      OldRefreshTokenHash,
      CheckingExistingRefreshToken.customer_id,
      newToken_Hash,
      CheckingExistingRefreshToken.family_id,
      newExpiresAt,
    );
    return {
      token: {
        TokenType: "Bearer",
        AccessToken: newAccessToken,
        AccessTokenExpiresAt: 900, //15mintes
        RefreshToken: newRefreshToken,
      },
    };
  }
}
