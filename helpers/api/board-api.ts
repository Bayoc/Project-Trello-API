import { APIRequestContext } from "@playwright/test";
import { authParams } from "../setup/auth-setup";
import { ENDPOINTS } from "../../data/endpoints";

export const createBoard = (request: APIRequestContext, name: string) =>
  request.post(ENDPOINTS.BOARD.BASE, {
    params: authParams,
    data: { name },
  });

export const deleteBoard = (request: APIRequestContext, boardId: string) =>
  request.delete(ENDPOINTS.BOARD.BY_ID(boardId), {
    params: authParams,
  });

export const getBoard = (request: APIRequestContext, boardId: string) =>
  request.get(ENDPOINTS.BOARD.BY_ID(boardId), {
    params: authParams,
  });
