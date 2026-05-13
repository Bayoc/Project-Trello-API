import { APIRequestContext, APIResponse } from "@playwright/test";
import { authParams } from "../setup/auth-setup";

export interface RequestOptions {
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  omitAuth?: boolean;
}

export interface AuthCredentials {
  key: string;
  token: string;
}

export class BaseApiClient {
  private request: APIRequestContext;
  private customAuth?: AuthCredentials;

  constructor(request: APIRequestContext, customAuth?: AuthCredentials) {
    this.request = request;
    this.customAuth = customAuth;
  }

  private getAuthParams() {
    return this.customAuth ? this.customAuth : authParams;
  }

  async get(endpoint: string, options?: RequestOptions) {
    const { omitAuth, params, ...playwrightOptions } = options || {};

    const finalParams = omitAuth
      ? params
      : { ...this.getAuthParams(), ...params };

    return this.executeWithRetry(() =>
      this.request.get(endpoint, {
        ...playwrightOptions,
        params: finalParams,
      }),
    );
  }

  async post(endpoint: string, options?: RequestOptions) {
    const { omitAuth, params, ...playwrightOptions } = options || {};

    const finalParams = omitAuth
      ? params
      : { ...this.getAuthParams(), ...params };

    return this.executeWithRetry(() =>
      this.request.post(endpoint, {
        ...playwrightOptions,
        params: finalParams,
      }),
    );
  }

  async put(endpoint: string, options?: RequestOptions) {
    const { omitAuth, params, ...playwrightOptions } = options || {};

    const finalParams = omitAuth
      ? params
      : { ...this.getAuthParams(), ...params };

    return this.executeWithRetry(() =>
      this.request.put(endpoint, {
        ...playwrightOptions,
        params: finalParams,
      }),
    );
  }

  async delete(endpoint: string, options?: RequestOptions) {
    const { omitAuth, params, ...playwrightOptions } = options || {};

    const finalParams = omitAuth
      ? params
      : { ...this.getAuthParams(), ...params };

    return this.executeWithRetry(() =>
      this.request.delete(endpoint, {
        ...playwrightOptions,
        params: finalParams,
      }),
    );
  }

  private async executeWithRetry(
    apiCall: () => Promise<APIResponse>,
    maxRetries = 3,
    baseDelayMs = 1000,
  ): Promise<APIResponse> {
    let attempts = 0;

    while (attempts < maxRetries) {
      const response = await apiCall();

      if (response.status() !== 429) {
        return response;
      }

      // eslint-disable-next-line no-console
      console.warn(
        `[429 Too Many Requests] Retrying in ${baseDelayMs}ms... (Attempt ${attempts + 1} of ${maxRetries})`,
      );

      await new Promise((resolve) => setTimeout(resolve, baseDelayMs));
      baseDelayMs *= 2;
      attempts++;
    }

    return apiCall();
  }
}
