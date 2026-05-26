// src/lib/api-response.ts
export type ApiError = {
  code: string;
  details: string[];
};

export type ApiSuccessResponse<T> = {
  success: true;
  status: number;
  message: string;
  data: T;
  error: null;
};

export type ApiFailureResponse = {
  success: false;
  status: number;
  message: string;
  data: null;
  error: ApiError;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

export function successResponse<T>(
  status: number,
  message: string,
  data: T,
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      status,
      message,
      data,
      error: null,
    } satisfies ApiSuccessResponse<T>),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
}

export function errorResponse(
  status: number,
  message: string,
  code: string,
  details: string[] = [],
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      status,
      message,
      data: null,
      error: {
        code,
        details,
      },
    } satisfies ApiFailureResponse),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
}
