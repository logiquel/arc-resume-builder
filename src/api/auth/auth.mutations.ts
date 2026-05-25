import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./auth.services";
import {
  type SignUpRequest,
  type SignInRequest,
  type VerifyOtpRequest,
} from "./auth.schemas";

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (payload: SignUpRequest) => authService.signUp(payload),
  });
}

export function useSignInMutation() {
  return useMutation({
    mutationFn: (payload: SignInRequest) => authService.signIn(payload),
  });
}

export function useVerifyOtpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authService.verifyOtp(payload),
    onSuccess: (data) => {
      // Establish initial local data memory values instantly
      queryClient.setQueryData(["auth", "session"], data.user);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
