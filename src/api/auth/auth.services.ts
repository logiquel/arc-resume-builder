import axios from "axios";
import type { ApiResponse, ApiSuccessResponse } from "#/lib/api-response";
import {
  type SignUpRequest,
  type SignInRequest,
  type AuthResponse,
  type VerifyOtpRequest,
  type VerifyOtpResponse,
} from "./auth.schemas";
import { apiClient } from "../apiClient";

export const authService = {
  signUp: async (
    payload: SignUpRequest,
  ): Promise<ApiSuccessResponse<AuthResponse>> => {
    try {
      const { data: result } = await apiClient.post<ApiResponse<AuthResponse>>(
        "/api/auth/sign-up",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!result.success) {
        throw new Error(result.error.details[0] || result.message);
      }

      return result;
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<AuthResponse>>(error)) {
        const result = error.response?.data;

        if (result && !result.success) {
          throw new Error(result.error.details[0] || result.message);
        }
      }

      throw new Error("Failed to sign up");
    }
  },

  signIn: async (
    payload: SignInRequest,
  ): Promise<ApiSuccessResponse<AuthResponse>> => {
    try {
      const { data: result } = await apiClient.post<ApiResponse<AuthResponse>>(
        "/api/auth/sign-in",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!result.success) {
        throw new Error(result.error.details[0] || result.message);
      }

      return result;
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<AuthResponse>>(error)) {
        const result = error.response?.data;

        if (result && !result.success) {
          throw new Error(result.error.details[0] || result.message);
        }
      }

      throw new Error("Failed to sign in");
    }
  },

  verifyOtp: async (
    payload: VerifyOtpRequest,
  ): Promise<ApiSuccessResponse<VerifyOtpResponse>> => {
    try {
      const { data: result } = await apiClient.post<
        ApiResponse<VerifyOtpResponse>
      >("/api/auth/verify-otp", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (!result.success) {
        throw new Error(result.error.details[0] || result.message);
      }

      return result;
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<VerifyOtpResponse>>(error)) {
        const result = error.response?.data;

        if (result && !result.success) {
          throw new Error(result.error.details[0] || result.message);
        }
      }

      throw new Error("Failed to verify OTP");
    }
  },

  logout: async (): Promise<ApiSuccessResponse<AuthResponse>> => {
    try {
      const { data: result } = await apiClient.post<ApiResponse<AuthResponse>>(
        "/api/auth/logout",
        undefined,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!result.success) {
        throw new Error(result.error.details[0] || result.message);
      }

      return result;
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<AuthResponse>>(error)) {
        const result = error.response?.data;

        if (result && !result.success) {
          throw new Error(result.error.details[0] || result.message);
        }
      }

      throw new Error("Failed to logout");
    }
  },
};
