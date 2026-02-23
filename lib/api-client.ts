import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { env } from "./env";
import { API_CONFIG, HTTP_STATUS } from "./constants";
import {
  APIError,
  NetworkError,
  TimeoutError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  logError,
} from "./errors";

type APIErrorPayload = {
  message?: string;
  [key: string]: unknown;
};

const getAPIErrorPayload = (data: unknown): APIErrorPayload =>
  typeof data === "object" && data !== null ? (data as APIErrorPayload) : {};

const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const apiKey = env.NEXT_PUBLIC_KIOSK_API_KEY;
    if (apiKey && config.headers) {
      config.headers["X-API-Key"] = apiKey;
    }

    return config;
  },
  (error) => {
    logError(error, "Request Interceptor");
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.code === "ECONNABORTED" || error.message?.toLowerCase().includes("timeout")) {
      const timeoutMs = error.config?.timeout ?? API_CONFIG.TIMEOUT;
      logError(error, "API Timeout");
      throw new TimeoutError(`Request timed out after ${timeoutMs}ms`);
    }

    if (error.response) {
      const { status, data } = error.response;
      const payload = getAPIErrorPayload(data);

      logError(error, `API Error ${status}`);

      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
          }
          throw new UnauthorizedError(payload.message || "Unauthorized access");

        case HTTP_STATUS.FORBIDDEN:
          throw new ForbiddenError(payload.message || "Access forbidden");

        case HTTP_STATUS.NOT_FOUND:
          throw new NotFoundError(payload.message || "Resource not found");

        case HTTP_STATUS.TOO_MANY_REQUESTS:
          const retryAfter = error.response.headers["retry-after"];
          throw new RateLimitError(
            payload.message || "Too many requests",
            retryAfter ? parseInt(retryAfter) : undefined
          );

        case HTTP_STATUS.TIMEOUT:
          throw new TimeoutError("Request timed out");

        default:
          throw new APIError(payload.message || "API request failed", status, data);
      }
    } else if (error.request) {
      logError(error, "Network Error");
      throw new NetworkError("Network error. Please check your connection.");
    } else {
      logError(error, "Unknown Error");
      throw new APIError(error.message);
    }
  }
);

async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;

      if (error instanceof APIError) {
        if (
          error.statusCode &&
          error.statusCode >= 400 &&
          error.statusCode < 500 &&
          error.statusCode !== 429
        ) {
          throw error;
        }
      }

      if (attempt === maxRetries) {
        throw error;
      }

      const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    retryRequest(() => apiClient.get<T>(url, config)),

  post: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) => retryRequest(() => apiClient.post<T>(url, data, config)),

  put: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) => retryRequest(() => apiClient.put<T>(url, data, config)),

  patch: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) => retryRequest(() => apiClient.patch<T>(url, data, config)),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    retryRequest(() => apiClient.delete<T>(url, config)),
};

export default apiClient;
