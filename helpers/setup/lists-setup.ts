import { APIRequestContext } from "@playwright/test";
import { authParams } from "./auth-setup";
import { ENDPOINTS } from "../../data/endpoints";
import { buildList } from "../factories/list-factory";

export async function createList(request: APIRequestContext, idBoard: string) {
  const response = await request.post(ENDPOINTS.LIST.BASE, {
    params: authParams,
    data: {
      name: buildList().name,
      idBoard: idBoard,
    },
  });
  const body = await response.json();
  return body.id;
}
