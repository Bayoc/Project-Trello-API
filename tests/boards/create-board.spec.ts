import { boardData } from "../../data/board.data";
import { createBoard } from "../../helpers/api/board-api";
import {
  assertStatusCode,
  assertName,
  assertHasProperty,
  assertErrorText,
} from "../../helpers/assertions";
import { ERROR_MESSAGES } from "../../data/error_messages";
import { test } from "../../fixtures/board-fixtures";

test.describe("CREATE Board", () => {
  test.describe("Positive Scenarios", () => {
    test("POST - should create a new board with valid data", async ({
      request,
      boardManagement,
    }) => {
      const response = await createBoard(request, {
        name: boardData.validBoardData.name,
      });
      const body = await response.json();

      assertStatusCode(response, 200);
      assertName(body, boardData.validBoardData.name);
      assertHasProperty(body, "id");

      boardManagement.addBoardForCleanup(body.id);
    });

    test("should create a board with maximum allowed name length", async ({
      request,
      boardManagement,
    }) => {
      const response = await createBoard(request, {
        name: boardData.longNameValidData.name,
      });
      const body = await response.json();

      assertStatusCode(response, 200);
      assertName(body, boardData.longNameValidData.name);
      assertHasProperty(body, "id");

      boardManagement.addBoardForCleanup(body.id);
    });
  });

  test.describe("Negative Scenarios", () => {
    test("should return error when creating a board without a name", async ({
      request,
    }) => {
      const response = await createBoard(request);

      assertStatusCode(response, 400);
      await assertErrorText(response, ERROR_MESSAGES.badNameRequest);
    });

    test("should return error when board name exceeds character limit", async ({
      request,
    }) => {
      const response = await createBoard(request, {
        name: boardData.longNameInvalidData.name,
      });

      assertStatusCode(response, 400);
      await assertErrorText(response, ERROR_MESSAGES.badNameRequest);
    });
  });
});
