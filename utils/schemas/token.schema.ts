import { z } from "zod";

export const verifyTokenSchema = z.object({
  token: z.string().min(60, "Expired or invalid token"),
});

export type VerifyTokenType = z.infer<typeof verifyTokenSchema>;
