import { test, expect } from "@playwright/test";
import { ENDPOINTS } from "../../data/endpoints";
import { authParams } from "../../helpers/auth-helpers";
import { deleteBoard, createBoard } from "../../helpers/board-helpers";
import { createListData } from "../../data/lists.data";
import { assertName, assertStatusCode } from "../../helpers/assertions";
import { assertHasProperty } from "../../helpers/assertions";

test.describe("POST - Create List", () => {
  let boardID: string = "";

  test.beforeAll(async ({ request }) => {
    // create BOARD
    boardID = await createBoard(request);
  });

  test.afterAll(async ({ request }) => {
    // cleanup - delete board
    await deleteBoard(request, boardID);
  });

  test.describe("Positive Scenarios", () => {
    test("POST Create List - should create a new list", async ({ request }) => {
      const response = await request.post(ENDPOINTS.LIST.BASE, {
        params: authParams,
        data: {
          name: createListData.name,
          idBoard: boardID,
        },
      });

      assertStatusCode(response, 200);
      await assertName(response, createListData.name);
      await assertHasProperty(response, "id");
    });
  });

  test.describe("Negative Scenarios", () => {
    test("POST Create List with invalid boardID - should return error 401 Unauthorized", async ({
      request,
    }) => {
      const response = await request.post(ENDPOINTS.LIST.BASE, {
        params: authParams,
        data: {
          name: createListData.name,
          idBoard: "aaaaaaaaaaaaaaaaaaaaaaaa",
        },
      });
      expect(response.status()).toBe(401);
      // Trello returns 401 for invalid idBoard for security reasons - 404 would reveal resource existence
    });

    test("POST Create List with empty name - should return error 400 bad request", async ({
      request,
    }) => {
      const response = await request.post(ENDPOINTS.LIST.BASE, {
        params: authParams,
        data: {
          name: "",
          idBoard: boardID,
        },
      });
      expect(response.status()).toBe(400);
    });
  });
});
