import { z } from "zod";

export const LoginUserSchema = z
  .object({
    email: z.email("Invalid email address").optional(),
    phone: z.string().length(10, "phone number is required").optional(),
    password: z.string().min(8, "password is required"),
  })
  .refine((data) => data.email !== undefined || data.phone !== undefined, {
    message: "Either Email Or Phone",
    path: ["email"],
  });

export type LoginUserInput = z.infer<typeof LoginUserSchema>;
