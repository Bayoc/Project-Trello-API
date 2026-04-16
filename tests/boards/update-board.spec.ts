import { test } from "@playwright/test";
import {
  createBoard,
  deleteBoard,
  updateBoard,
} from "../../helpers/board-helpers";
import {
  assertStatusCode,
  assertBoardName,
  assertErrorText,
} from "../../helpers/assertions";
import { ERROR_MESSAGES } from "../../data/error_messages";

test.describe("PUT Board", () => {
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
    test("PUT Update Board Name - board name should be updated", async ({
      request,
    }) => {
      const newName = "Updated Name";
      const response = await updateBoard(request, boardID, { name: newName });

      assertStatusCode(response, 200);
      const body = await response.json();
      assertBoardName(body, newName);
    });
  });

  test.describe("Negative Scenarios", () => {
    test("PUT Update Board with invalid ID - should return 404 not found", async ({
      request,
    }) => {
      const response = await updateBoard(request, "aaaaaaaaaaaaaaaaaaaaaaaa", {
        name: "Name",
      });
      assertStatusCode(response, 404);

      await assertErrorText(response, ERROR_MESSAGES.notFound);
    });
  });
});
