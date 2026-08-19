import { z } from "zod";

export const refreshTokenScheme = z.object({
  refreshToken: z.string("Refresh Token is required.").length(20),
});

export type refreshtoken = z.infer<typeof refreshTokenScheme>;
