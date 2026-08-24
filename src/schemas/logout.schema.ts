import { z } from "zod";

export const LogoutSchema = z.object({
  refreshToken: z.string(),
  allDevices: z.boolean().default(false).optional(),
});

export type logoutSchema = z.infer<typeof LogoutSchema>;
