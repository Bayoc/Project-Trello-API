import { test, expect } from "@playwright/test";
import { authParams } from "../../helpers/auth-helpers";
import { ENDPOINTS } from "../../data/endpoints";
import { createBoard, deleteBoard } from "../../helpers/board-helpers";

test.describe("GET Board", () => {
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
    test("GET Board with valid ID - should return 200 and board ID", async ({
      request,
    }) => {
      const response = await request.get(ENDPOINTS.BOARD.BY_ID(boardID), {
        params: authParams,
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("id");
      expect(body.id).toBe(boardID);

      boardID = body.id;
    });
  });

  test.describe("Negative Scenarios", () => {
    test("GET Board with invalid ID - should return 404 not found", async ({
      request,
    }) => {
      const response = await request.get(
        ENDPOINTS.BOARD.BY_ID("aaaaaaaaaaaaaaaaaaaaaaaa"),
        {
          params: authParams,
        },
      );
      expect(response.status()).toBe(404);
    });
  });
});
