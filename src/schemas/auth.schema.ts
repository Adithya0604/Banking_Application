import { z } from "zod";

// *** Created UserSchema from backend view point. The Form which we create in UI will be contaning this input parameters which we are validating from here ***//
//*** We are using Zod which is very clear and then exporting the Object.***/
export const RegisterUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(3, "First name is required"),
    lastName: z.string().min(3, "Last name is required"),
    email: z.email("email is required"),
    phone: z.string().min(10, "phone number is required"),
    password: z
      .string()
      .min(8, "password is required")
      .max(16, "LIMIT Exceded"),
    address: z.object({
      streetLine1: z
        .string()
        .min(8, "Address is required")
        .max(250, "Limit Exceded"),
      streetLine2: z.string().optional(),
      city: z.string().min(3, "city name is required"),
      state: z.string().min(3, "state name is required"),
      postalCode: z.string().min(6, "postalCode name is required"),
      country: z.string().default("India"),
    }),
  }),
});

/* Exporting UserSchema with Type */
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>["body"];

//*** Explicitly showing
// RegisterUserSchema
//         |
//         └── body
//              |
//              ├── name: string
//              ├── email: string
//              └── password: string
//"What is the type of this Zod schema variable?"
//z.infer converts a Zod schema into a TypeScript type.
//export type RegisterUserInput = z.infer<typeof RegisterUserSchema>["body"];
//is equivalent to writing:
// export type RegisterUserInput = {
//   name: string;
//   email: string;
//   password: string;
// };
// ***/
