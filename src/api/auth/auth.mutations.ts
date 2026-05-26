import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./auth.services";
import {
  type SignUpRequest,
  type SignInRequest,
  type VerifyOtpRequest,
} from "./auth.schemas";
import { useNavigate } from "@tanstack/react-router";
import { toastManager } from "#/components/addons/toast";

export function useSignUpMutation() {
  const toastId = React.useRef<string>("");

  return useMutation({
    mutationFn: (payload: SignUpRequest) => authService.signUp(payload),

    onMutate: () => {
      toastId.current = toastManager.add({
        title: "Sending OTP…",
        description: "Please wait while we send your registration code.",
        type: "loading",
        timeout: 0,
      });
    },

    onSuccess: (response) => {
      toastManager.update(toastId.current, {
        title: "OTP sent",
        description: response.message,
        type: "success",
        timeout: 4000,
      });
    },

    onError: (error: any) => {
      toastManager.update(toastId.current, {
        title: "Registration failed",
        description:
          error?.message || "Something went wrong. Please try again.",
        type: "error",
        timeout: 0,
        data: { showClose: true },
      });
    },
  });
}

export function useSignInMutation() {
  const toastId = React.useRef<string>("");

  return useMutation({
    mutationFn: (payload: SignInRequest) => authService.signIn(payload),

    onMutate: () => {
      toastId.current = toastManager.add({
        title: "Sending OTP…",
        description: "Please wait while we send your login code.",
        type: "loading",
        timeout: 0,
      });
    },

    onSuccess: (response) => {
      toastManager.update(toastId.current, {
        title: "OTP sent",
        description: response.message,
        type: "success",
        timeout: 4000,
      });
    },

    onError: (error: any) => {
      toastManager.update(toastId.current, {
        title: "Login failed",
        description:
          error?.message || "Something went wrong. Please try again.",
        type: "error",
        timeout: 0,
        data: { showClose: true },
      });
    },
  });
}

export function useVerifyOtpMutation() {
  const queryClient = useQueryClient();
  const toastId = React.useRef<string>("");

  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authService.verifyOtp(payload),

    onMutate: () => {
      toastId.current = toastManager.add({
        title: "Verifying OTP…",
        description: "Please wait while we verify your code.",
        type: "loading",
        timeout: 0,
      });
    },

    onSuccess: async (response) => {
      queryClient.setQueryData(["auth", "session"], response.data.user);
      await queryClient.invalidateQueries({ queryKey: ["auth"] });

      toastManager.update(toastId.current, {
        title: "Verified",
        description: response.message,
        type: "success",
        timeout: 4000,
      });
    },

    onError: (error: any) => {
      toastManager.update(toastId.current, {
        title: "Verification failed",
        description: error?.message || "OTP verification failed.",
        type: "error",
        timeout: 0,
        data: { showClose: true },
      });
    },
  });
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toastId = React.useRef<string>("");

  return useMutation({
    mutationFn: authService.logout,

    onMutate: () => {
      toastId.current = toastManager.add({
        title: "Logging out…",
        description: "Please wait while we clear your session.",
        type: "loading",
        timeout: 0,
      });
    },

    onSuccess: async (response) => {
      queryClient.clear();

      toastManager.update(toastId.current, {
        title: "Logged out",
        description: response.message,
        type: "success",
        timeout: 2500,
      });

      await navigate({ to: "/", replace: true });
    },

    onError: (error: any) => {
      toastManager.update(toastId.current, {
        title: "Logout failed",
        description:
          error?.message || "Something went wrong. Please try again.",
        type: "error",
        timeout: 0,
        data: { showClose: true },
      });

      console.error("Logout error:", error);
    },
  });
};
