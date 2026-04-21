import { test } from "@playwright/test";
import { authParams } from "../../helpers/auth-helpers";
import { ENDPOINTS } from "../../data/endpoints";
import { setupBoard, deleteBoard } from "../../helpers/board-helpers";
import { ERROR_MESSAGES } from "../../data/error_messages";
import {
  assertStatusCode,
  assertHasProperty,
  assertID,
  assertErrorText,
} from "../../helpers/assertions";

test.describe("GET Board", () => {
  let boardID: string = "";

  test.beforeAll(async ({ request }) => {
    // create BOARD
    boardID = await setupBoard(request);
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

      assertStatusCode(response, 200);
      const body = await response.json();
      assertHasProperty(body, "id");
      assertID(body, boardID);

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
      assertStatusCode(response, 404);
      await assertErrorText(response, ERROR_MESSAGES.notFound);
    });
  });
});
