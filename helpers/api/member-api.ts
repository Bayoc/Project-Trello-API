import { BaseApiClient, RequestOptions } from "./base-api";
import { ENDPOINTS } from "../../data/endpoints";

export const getMemberMe = (
  apiClient: BaseApiClient,
  options?: RequestOptions,
) => apiClient.get(ENDPOINTS.MEMBER.ME, options);
