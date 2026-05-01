import { createBoard } from "../../helpers/api/board-api";
import {
  assertStatusCode,
  assertName,
  assertHasProperty,
  assertErrorText,
} from "../../helpers/assertions";
import { ERROR_MESSAGES } from "../../data/error_messages";
import { test } from "../../fixtures/board-fixtures";
import { buildBoard } from "../../helpers/factories/board-factory";

test.describe("CREATE Board", () => {
  test.describe("Positive Scenarios", () => {
    test("POST - should create a new board with valid data", async ({
      apiClient,
      boardManagement,
    }) => {
      const newBoard = buildBoard();

      const response = await createBoard(apiClient, {
        data: { name: newBoard.name },
      });
      const body = await response.json();

      assertStatusCode(response, 200);
      assertName(body, newBoard.name);
      assertHasProperty(body, "id");

      boardManagement.addBoardForCleanup(body.id);
    });

    test("should create a board with maximum allowed name length", async ({
      apiClient,
      boardManagement,
    }) => {
      const payload = buildBoard({ name: "a".repeat(16384) });

      const response = await createBoard(apiClient, {
        data: { name: payload.name },
      });
      const body = await response.json();

      assertStatusCode(response, 200);
      assertName(body, payload.name);
      assertHasProperty(body, "id");

      boardManagement.addBoardForCleanup(body.id);
    });
  });

  test.describe("Negative Scenarios", () => {
    test("should return error when creating a board without a name", async ({
      apiClient,
    }) => {
      const response = await createBoard(apiClient);

      assertStatusCode(response, 400);
      await assertErrorText(response, ERROR_MESSAGES.badNameRequest);
    });

    test("should return error when board name exceeds character limit", async ({
      apiClient,
    }) => {
      const payload = buildBoard({ name: "a".repeat(16385) });

      const response = await createBoard(apiClient, {
        data: payload,
      });

      assertStatusCode(response, 400);
      await assertErrorText(response, ERROR_MESSAGES.badNameRequest);
    });
  });
});
