import { z } from "zod";

export const registerEmailSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  terms: z.boolean().refine((val) => val === true, {
    message: "Please accept the Terms & Conditions",
  }),
});

export const registerOtpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 characters" })
    .regex(/^[0-9A-Z]+$/, { message: "OTP must be alphanumeric" }),
});

export const registerPasswordSchema = z
  .object({
    password: z
      .string()
      .min(12, { message: "Password must be at least 12 characters long" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" })
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
        message: "Must contain at least one symbol",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerDetailsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  designation: z.string().min(1, { message: "Designation is required" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }), // Basic validation, can be improved
  countryCode: z.string(),
});

export type RegisterEmailFormData = z.infer<typeof registerEmailSchema>;
export type RegisterOtpFormData = z.infer<typeof registerOtpSchema>;
export type RegisterPasswordFormData = z.infer<typeof registerPasswordSchema>;
export type RegisterDetailsFormData = z.infer<typeof registerDetailsSchema>;
