import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
      {
        message:
          "Password must contain at least 12 characters, one uppercase, one lowercase, one number and one special character",
      }
    ),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 characters" })
    .regex(/^[0-9A-Z]+$/, { message: "OTP must be alphanumeric" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
