import { APIRequestContext } from "@playwright/test";
import { authParams } from "../setup/auth-setup";

export interface RequestOptions {
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export class BaseApiClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async get(endpoint: string, options?: RequestOptions) {
    return this.request.get(endpoint, {
      ...options,
      params: { ...authParams, ...options?.params },
    });
  }

  async post(endpoint: string, options?: RequestOptions) {
    return this.request.post(endpoint, {
      ...options,
      params: { ...authParams, ...options?.params },
    });
  }

  async put(endpoint: string, options?: RequestOptions) {
    return this.request.put(endpoint, {
      ...options,
      params: { ...authParams, ...options?.params },
    });
  }

  async delete(endpoint: string, options?: RequestOptions) {
    return this.request.delete(endpoint, {
      ...options,
      params: { ...authParams, ...options?.params },
    });
  }
}
