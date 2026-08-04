import { z } from "zod";

export const LoginUserSchema = z
  .object({
    email: z.email("Invalid email address").or(z.literal("")).optional(),
    phone: z
      .string()
      .length(10, "phone number is required")
      .or(z.literal(""))
      .optional(),
    password: z
      .string("password is required ")
      .trim()
      .min(8, "password must be at least 8 characters"),
  })
  .refine(
    (data) =>
      Boolean(data.email && data.email.trim().length > 0) ||
      Boolean(data.phone && data.phone.trim().length > 0),
    {
      message: "Either Email Or Phone is required",
      path: ["email"],
    },
  );

export type LoginUserInput = z.infer<typeof LoginUserSchema>;
