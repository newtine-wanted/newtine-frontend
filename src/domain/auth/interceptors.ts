import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { apiClient } from "@/lib/api-client";

interface AuthSessionRecoveryHandlers {
  getAccessToken: () => string | null;
  recoverSession: () => Promise<void>;
  handleRecoveryFailure: () => void;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _authRetry?: boolean;
}

const NON_RECOVERABLE_AUTH_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/refresh",
]);

export function installAuthSessionInterceptors(
  handlers: AuthSessionRecoveryHandlers,
) {
  apiClient.interceptors.request.use((config) => {
    const accessToken = handlers.getAccessToken();

    if (accessToken && !config.headers.has("Authorization")) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(error);
      }

      const request = error.config as RetryableRequestConfig | undefined;
      const requestPath = request?.url?.split("?", 1)[0];
      const canRecover =
        error.response?.status === 401 &&
        request &&
        !request._authRetry &&
        requestPath &&
        !NON_RECOVERABLE_AUTH_PATHS.has(requestPath);

      if (!canRecover) {
        return Promise.reject(error);
      }

      request._authRetry = true;

      try {
        await handlers.recoverSession();
      } catch {
        handlers.handleRecoveryFailure();
        return Promise.reject(error);
      }

      const accessToken = handlers.getAccessToken();

      if (accessToken) {
        request.headers.set("Authorization", `Bearer ${accessToken}`);
      }

      try {
        return await apiClient.request(request);
      } catch (retryError) {
        if (
          axios.isAxiosError(retryError) &&
          retryError.response?.status === 401
        ) {
          handlers.handleRecoveryFailure();
        }

        return Promise.reject(retryError);
      }
    },
  );
}
