import { APIRequestContext } from "@playwright/test";
import { authParams } from "./auth-setup";
import { ENDPOINTS } from "../../data/endpoints";
import { createBoardData } from "../../data/board.data";

export async function setupBoard(request: APIRequestContext) {
  const response = await request.post(ENDPOINTS.BOARD.BASE, {
    params: authParams,
    data: createBoardData,
  });
  const body = await response.json();
  return body.id;
}

/*export async function deleteBoard(request: APIRequestContext, id: string) {
  const response = await request.delete(ENDPOINTS.BOARD.BY_ID(id), {
    params: authParams,
  });
  return response;
}*/

export async function updateBoard(
  request: APIRequestContext,
  id: string,
  updateData: { name: string },
) {
  const response = await request.put(ENDPOINTS.BOARD.BY_ID(id), {
    params: authParams,
    data: updateData,
  });
  return response;
}
