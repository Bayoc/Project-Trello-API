import { test } from "@playwright/test";
import { setupBoard, updateBoard } from "../../helpers/setup/board-setup";
import {
  assertStatusCode,
  assertName,
  assertErrorText,
} from "../../helpers/assertions";
import { ERROR_MESSAGES } from "../../data/error_messages";
import { deleteBoard } from "../../helpers/api/board-api";
import { boardData } from "../../data/board.data";

test.describe("PUT Board", () => {
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
    test("PUT Update Board Name - board name should be updated", async ({
      request,
    }) => {
      const response = await updateBoard(request, boardID, {
        name: boardData.updateBoardData.name,
      });

      assertStatusCode(response, 200);
      const body = await response.json();
      assertName(body, boardData.updateBoardData.name);
    });
  });

  test.describe("Negative Scenarios", () => {
    test("PUT Update Board with invalid ID - should return 404 not found", async ({
      request,
    }) => {
      const response = await updateBoard(
        request,
        boardData.invalidBoardIdData.id,
        {
          name: boardData.updateBoardData.name,
        },
      );
      assertStatusCode(response, 404);

      await assertErrorText(response, ERROR_MESSAGES.notFound);
    });
  });
});
