import { test, expect } from "@playwright/test";
import { authParams } from "../../helpers/auth-helpers";
import { ENDPOINTS } from "../../data/endpoints";
import { createBoard, deleteBoard } from "../../helpers/board-helpers";

test.describe("DELETE Board", () => {
  let boardID: string = "";

  test.beforeEach(async ({ request }) => {
    // create BOARD
    boardID = await createBoard(request);
  });

  test.describe("Positive Scenarios", () => {
    test("DELETE Board - board should be deleted", async ({ request }) => {
      const response = await request.delete(ENDPOINTS.BOARD.BY_ID(boardID), {
        params: authParams,
      });
      expect(response.status()).toBe(200);

      const deleteResponse = await request.get(ENDPOINTS.BOARD.BY_ID(boardID), {
        params: authParams,
      });
      expect(deleteResponse.status()).toBe(404);
    });
  });

  test.describe("Negative Scenarios", () => {
    test.afterAll(async ({ request }) => {
      // cleanup - delete board
      await deleteBoard(request, boardID);
    });

    test("DELETE Board with invalid ID - should return 404 not found", async ({
      request,
    }) => {
      const response = await request.delete(
        ENDPOINTS.BOARD.BY_ID("aaaaaaaaaaaaaaaaaaaaaaaa"),
        {
          params: authParams,
        },
      );
      expect(response.status()).toBe(404);

      const deleteResponse = await request.get(ENDPOINTS.BOARD.BY_ID(boardID), {
        params: authParams,
      });
      expect(deleteResponse.status()).toBe(200);
    });
  });
});
