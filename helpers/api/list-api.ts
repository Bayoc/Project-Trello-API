import { ENDPOINTS } from "../../data/endpoints";
import { BaseApiClient, RequestOptions } from "./base-api";

export const createList = (
  apiClient: BaseApiClient,
  options?: RequestOptions, // Używamy naszego precyzyjnego interfejsu
) =>
  apiClient.post(ENDPOINTS.LIST.BASE, {
    ...options, // Przekazujemy opcje prosto do wrappera
  });
