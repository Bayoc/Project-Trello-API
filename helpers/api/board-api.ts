import { APIRequestContext } from "@playwright/test";
import { authParams } from "../setup/auth-setup";
import { ENDPOINTS } from "../../data/endpoints";

export const createBoard = (
  request: APIRequestContext,
  payload?: Record<string, unknown>,
) =>
  request.post(ENDPOINTS.BOARD.BASE, {
    params: authParams,
    data: payload,
  });

export const deleteBoard = (request: APIRequestContext, boardId: string) =>
  request.delete(ENDPOINTS.BOARD.BY_ID(boardId), {
    params: authParams,
  });

export const getBoard = (request: APIRequestContext, boardId: string) =>
  request.get(ENDPOINTS.BOARD.BY_ID(boardId), {
    params: authParams,
  });

export const updateBoard = (
  request: APIRequestContext,
  id: string,
  payload?: Record<string, unknown>,
) =>
  request.put(ENDPOINTS.BOARD.BY_ID(id), {
    params: authParams,
    data: payload,
  });
