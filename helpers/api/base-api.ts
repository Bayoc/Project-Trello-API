import { APIRequestContext } from "@playwright/test";
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
    const finalParams = options?.omitAuth
      ? options?.params
      : { ...this.getAuthParams(), ...options?.params };

    return this.request.get(endpoint, {
      ...options,
      params: finalParams,
    });
  }

  async post(endpoint: string, options?: RequestOptions) {
    const finalParams = options?.omitAuth
      ? options?.params
      : { ...this.getAuthParams(), ...options?.params };

    return this.request.post(endpoint, {
      ...options,
      params: finalParams,
    });
  }

  async put(endpoint: string, options?: RequestOptions) {
    const finalParams = options?.omitAuth
      ? options?.params
      : { ...this.getAuthParams(), ...options?.params };

    return this.request.put(endpoint, {
      ...options,
      params: finalParams,
    });
  }

  async delete(endpoint: string, options?: RequestOptions) {
    const finalParams = options?.omitAuth
      ? options?.params
      : { ...this.getAuthParams(), ...options?.params };
    return this.request.delete(endpoint, {
      ...options,
      params: finalParams,
    });
  }
}
