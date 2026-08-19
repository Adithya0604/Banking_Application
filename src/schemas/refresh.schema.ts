import { z } from "zod";

export const refreshTokenScheme = z.object({
  refreshToken: z.string("Refresh Token is required."),
});

export type refreshtoken = z.infer<typeof refreshTokenScheme>;
