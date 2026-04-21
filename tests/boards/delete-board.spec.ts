import { test } from "@playwright/test";
import { authParams } from "../../helpers/setup/auth-setup";
import { ENDPOINTS } from "../../data/endpoints";
import { setupBoard } from "../../helpers/setup/board-setup";
import { assertStatusCode, assertErrorText } from "../../helpers/assertions";
import { ERROR_MESSAGES } from "../../data/error_messages";
import { deleteBoard } from "../../helpers/api/board-api";

test.describe("DELETE Board", () => {
  let boardID: string = "";

  test.beforeEach(async ({ request }) => {
    // create BOARD
    boardID = await setupBoard(request);
  });

  test.describe("Positive Scenarios", () => {
    test("DELETE Board - board should be deleted", async ({ request }) => {
      const response = await request.delete(ENDPOINTS.BOARD.BY_ID(boardID), {
        params: authParams,
      });
      assertStatusCode(response, 200);

      const deleteResponse = await request.get(ENDPOINTS.BOARD.BY_ID(boardID), {
        params: authParams,
      });
      assertStatusCode(deleteResponse, 404);
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
      assertStatusCode(response, 404);
      assertErrorText(response, ERROR_MESSAGES.notFound);

      const deleteResponse = await request.get(ENDPOINTS.BOARD.BY_ID(boardID), {
        params: authParams,
      });
      assertStatusCode(deleteResponse, 200);
    });
  });
});
