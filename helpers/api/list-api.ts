import { ENDPOINTS } from "../../data/endpoints";
import { BaseApiClient, RequestOptions } from "./base-api";

export const createList = (
  apiClient: BaseApiClient,
  options?: RequestOptions,
) => apiClient.post(ENDPOINTS.LIST.BASE, options);

export const deleteList = (apiClient: BaseApiClient, listId: string) =>
  apiClient.delete(ENDPOINTS.LIST.BY_ID(listId));

export const getList = (
  apiClient: BaseApiClient,
  listId: string,
  options?: { omitAuth?: boolean },
) => apiClient.get(ENDPOINTS.LIST.BY_ID(listId), options);

export const updateList = (
  apiClient: BaseApiClient,
  listId: string,
  options?: RequestOptions,
) => apiClient.put(ENDPOINTS.LIST.BY_ID(listId), options);
