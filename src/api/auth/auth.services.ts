import type { ApiResponse, ApiSuccessResponse } from "#/lib/api-response";
import {
  type SignUpRequest,
  type SignInRequest,
  type AuthResponse,
  type VerifyOtpRequest,
  type VerifyOtpResponse,
} from "./auth.schemas";

export const authService = {
  signUp: async (
    payload: SignUpRequest,
  ): Promise<ApiSuccessResponse<AuthResponse>> => {
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result: ApiResponse<AuthResponse> = await res.json();

    if (!result.success) {
      throw new Error(result.error.details[0] || result.message);
    }

    return result;
  },

  signIn: async (
    payload: SignInRequest,
  ): Promise<ApiSuccessResponse<AuthResponse>> => {
    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result: ApiResponse<AuthResponse> = await res.json();

    if (!result.success) {
      throw new Error(result.error.details[0] || result.message);
    }

    return result;
  },

  verifyOtp: async (
    payload: VerifyOtpRequest,
  ): Promise<ApiSuccessResponse<VerifyOtpResponse>> => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result: ApiResponse<VerifyOtpResponse> = await res.json();

    if (!result.success) {
      throw new Error(result.error.details[0] || result.message);
    }

    return result;
  },

  logout: async (): Promise<ApiSuccessResponse<AuthResponse>> => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const result: ApiResponse<AuthResponse> = await res.json();

    if (!result.success) {
      throw new Error(result.error.details[0] || result.message);
    }

    return result;
  },
};
