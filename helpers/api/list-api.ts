import { APIRequestContext } from "@playwright/test";
import { authParams } from "../setup/auth-setup";
import { ENDPOINTS } from "../../data/endpoints";

export const createList = (
  request: APIRequestContext,
  payload?: Record<string, unknown>,
) =>
  request.post(ENDPOINTS.LIST.BASE, {
    params: authParams,
    data: payload,
  });
