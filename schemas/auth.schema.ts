import { z } from "zod";

const authSchema = z.object({
  email: z
    .string({
      errorMap: (issue, ctx) => {
        console.log(issue);
        if (issue.code === "invalid_string" && ctx.data.includes(" ")) {
          return { message: "Email should not contain whitespaces" };
        }
        return { message: "Invalid email!" };
      },
    })
    .min(6)
    .max(30)
    .email()
    .optional(),
  username: z.string().trim().min(3, "is too short!").max(20, "is too long!"),
  password: z.string().trim().min(6, "is too short!").max(20, "is too long!"),
  confirmPassword: z.string().trim().optional(),
});

export const loginSchema = authSchema.pick({ username: true, password: true });
export const registerSchema = authSchema.pick({
  email: true,
  username: true,
  password: true,
});
export const resetPasswordEmailSchema = authSchema.pick({ email: true });
export const resetPasswordSchema = authSchema
  .pick({
    password: true,
    confirmPassword: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  });

export type LoginType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;
export type ResetPasswordEmailType = z.infer<typeof resetPasswordEmailSchema>;
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
