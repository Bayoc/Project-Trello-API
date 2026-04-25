import { ENDPOINTS } from "../../data/endpoints";
import { BaseApiClient, RequestOptions } from "./base-api";

export const createBoard = (
  apiClient: BaseApiClient,
  options?: RequestOptions,
) => apiClient.post(ENDPOINTS.BOARD.BASE, options);

export const deleteBoard = (apiClient: BaseApiClient, boardId: string) =>
  apiClient.delete(ENDPOINTS.BOARD.BY_ID(boardId));

export const getBoard = (apiClient: BaseApiClient, boardId: string) =>
  apiClient.get(ENDPOINTS.BOARD.BY_ID(boardId));

export const updateBoard = (
  apiClient: BaseApiClient,
  boardId: string,
  options?: RequestOptions,
) => apiClient.put(ENDPOINTS.BOARD.BY_ID(boardId), options);
