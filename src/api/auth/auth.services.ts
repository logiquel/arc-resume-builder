import {
  type SignUpRequest,
  type SignInRequest,
  type AuthResponse,
  type VerifyOtpRequest,
  type VerifyOtpResponse,
  authResponseSchema,
  verifyOtpResponseSchema,
} from "./auth.schemas";

export const authService = {
  signUp: async (payload: SignUpRequest): Promise<AuthResponse> => {
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sign-up request rejected.");
    return authResponseSchema.parse(data);
  },

  signIn: async (payload: SignInRequest): Promise<AuthResponse> => {
    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sign-in request rejected.");
    return authResponseSchema.parse(data);
  },

  verifyOtp: async (payload: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "OTP verification failed.");
    return verifyOtpResponseSchema.parse(data);
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Logout request failed.");
    }

    return data;
  },
};
