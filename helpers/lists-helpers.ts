import { APIRequestContext } from "@playwright/test";
import { authParams } from "../helpers/auth-helpers";
import { ENDPOINTS } from "../data/endpoints";
import { createListData } from "../data/lists.data";

export async function createList(request: APIRequestContext, idBoard: string) {
  const response = await request.post(ENDPOINTS.LIST.BASE, {
    params: authParams,
    data: {
      name: createListData.name,
      idBoard: idBoard,
    },
  });
  const body = await response.json();
  return body.id;
}
