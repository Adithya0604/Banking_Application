import argon2 from "argon2";
import {
  UserRepository,
  CreatedCustomer,
} from "../repositories/user.repository";
import { RegisterUserInput } from "../schemas/auth.schema";

export class DuplicateUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateErrorMessage";
  }
}

export class AuthServices {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(input: RegisterUserInput): Promise<CreatedCustomer> {
    const istaken = await this.userRepository.existsByEmailOrPhone(
      input.email,
      input.phone,
    );

    if (istaken) {
      throw new DuplicateUserError(
        `A Customer Already exist with this email or phone`,
      );
    }

    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const newCustomer = await this.userRepository.createCustomer(
      input,
      passwordHash,
    );

    return newCustomer;
  }
}
