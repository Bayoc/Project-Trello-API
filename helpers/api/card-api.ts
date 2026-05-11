import { ENDPOINTS } from "../../data/endpoints";
import { BaseApiClient, RequestOptions } from "./base-api";

export const createCard = (
  apiClient: BaseApiClient,
  options?: RequestOptions,
) => apiClient.post(ENDPOINTS.CARD.BASE, options);

export const deleteCard = (apiClient: BaseApiClient, cardId: string) =>
  apiClient.delete(ENDPOINTS.CARD.BY_ID(cardId));

export const getCard = (
  apiClient: BaseApiClient,
  cardId: string,
  options?: { omitAuth?: boolean },
) => apiClient.get(ENDPOINTS.CARD.BY_ID(cardId), options);

export const updateCard = (
  apiClient: BaseApiClient,
  cardId: string,
  options?: RequestOptions,
) => apiClient.put(ENDPOINTS.CARD.BY_ID(cardId), options);
