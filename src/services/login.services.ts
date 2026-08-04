import "dotenv/config";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { LoginRepository } from "../repositories/login.repository";
import { LoginUserInput } from "../schemas/login.schema";

//If User Status is SUSPENDED OR PENDING_VERIFICATION
export class AccountRestricted extends Error {
  constructor(message = "Your account is currently suspended or restricted. ") {
    super(message);
    this.name = "ACCOUNT_RESTRICTED";
  }
}
//Wrong Email/Phone & password Combination
export class InvalidCredentials extends Error {
  constructor(message = "Invalid email or password combination.") {
    super(message);
    this.name = "INVALID_CREDENTIALS";
  }
}

export class LoginServices {
  private loginRepository: LoginRepository;
  constructor() {
    this.loginRepository = new LoginRepository();
  }

  async LoginUser(input: LoginUserInput) {
    //fetch user by email or phone (single Db query)
    const email = input.email ?? "";
    const phone = input.phone ?? "";

    const user = await this.loginRepository.getUserDetails(input);

    if (!user || !user.password_hash) {
      throw new InvalidCredentials();
    }

    if (user.status === "SUSPENDED" || user.status === "BLOCKED") {
      throw new AccountRestricted();
    }

    const isPasswordValid = await argon2.verify(
      user.password_hash,
      input.password,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentials();
    }

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        status: user.status,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      {
        sub: user.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "4d" },
    );

    return {
      tokens: {
        tokenType: "Bearer",
        accessToken,
        accessTokenExpiresIn: 900,
        refreshToken,
      },
      user: {
        id: user.id,
        email: user.email,
        firstname: user.first_name,
        lastname: user.last_name,
        status: user.status,
      },
    };
  }
}
