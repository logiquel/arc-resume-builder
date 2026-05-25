import { z } from "zod";

const phoneRegex = /^\+?[0-9]{10,14}$/;

export const profileFieldsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().refine((val) => phoneRegex.test(val.replace(/\s/g, "")), {
    message: "Provide a valid phone number configuration",
  }),
});

// Decoupled Payload Expectations
export const signUpRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const signInRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const verifyOtpRequestSchema = z.object({
  email: z.string().email(),
  token: z.string().length(8, "OTP must be exactly 8 digits"),
  profile: profileFieldsSchema.optional(), // Safe verification property across registration chains
});

export const verifyOtpResponseSchema = z.object({
  success: z.boolean(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
  }),
});

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
export type SignInRequest = z.infer<typeof signInRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type VerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;
export type VerifyOtpResponse = z.infer<typeof verifyOtpResponseSchema>;
export type ProfileFields = z.infer<typeof profileFieldsSchema>;
