import { ENDPOINTS } from "../../data/endpoints";
import { BaseApiClient, RequestOptions } from "./base-api";

export const createList = (
  apiClient: BaseApiClient,
  options?: RequestOptions,
) => apiClient.post(ENDPOINTS.LIST.BASE, options);
