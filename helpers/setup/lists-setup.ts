import { APIRequestContext } from "@playwright/test";
import { authParams } from "./auth-setup";
import { ENDPOINTS } from "../../data/endpoints";
import { validListData } from "../../data/lists.data";

export async function createList(request: APIRequestContext, idBoard: string) {
  const response = await request.post(ENDPOINTS.LIST.BASE, {
    params: authParams,
    data: {
      name: validListData.name,
      idBoard: idBoard,
    },
  });
  const body = await response.json();
  return body.id;
}
