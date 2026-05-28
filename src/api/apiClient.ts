// src/api/apiClient.ts
import axios from "axios";

declare module "axios" {
  export interface AxiosError {
    friendlyMessage?: string;
  }
}

export const apiClient = axios.create({
  withCredentials: true,
});

async function isClientOffline(): Promise<boolean> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return true;
  }

  try {
    const url = `${window.location.origin}/?network-check=${Date.now()}`;

    await fetch(url, {
      method: "HEAD",
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });

    return false;
  } catch {
    return true;
  }
}

async function resolveErrorMessage(error: unknown): Promise<string> {
  if (!axios.isAxiosError(error)) {
    return "An unexpected error occurred.";
  }

  if (!error.response) {
    if (error.code === "ERR_NETWORK") {
      const offline = await isClientOffline();

      if (offline) {
        return "You appear to be offline. Please check your internet connection.";
      }

      return "Unable to reach the server. Please try again shortly.";
    }

    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }

    return "A network error occurred. Please try again.";
  }

  const status = error.response.status;
  const serverMessage = error.response.data?.message;

  switch (status) {
    case 400:
      return serverMessage || "Bad request. Please check your input.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 408:
      return "Request timed out. Please try again.";
    case 422:
      return serverMessage || "Validation failed. Please check your input.";
    case 429:
      return "Too many requests. Please slow down and try again.";
    case 500:
      return "Something went wrong on the server. Please try again later.";
    case 502:
    case 503:
      return "The server is temporarily unavailable. Please try again later.";
    case 504:
      return "The server took too long to respond. Please try again.";
    default:
      return serverMessage || `Unexpected error (${status}). Please try again.`;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      error.friendlyMessage = await resolveErrorMessage(error);
    }

    return Promise.reject(error);
  },
);
