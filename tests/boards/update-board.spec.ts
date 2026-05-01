import { test } from "../../fixtures/fixtures";
import { updateBoard } from "../../helpers/api/board-api";
import {
  assertStatusCode,
  assertName,
  assertErrorText,
} from "../../helpers/assertions";
import { ERROR_MESSAGES } from "../../data/error_messages";
import {
  buildBoard,
  buildInvalidBoardId,
} from "../../helpers/factories/board-factory";

test.describe("PUT Board", () => {
  test.describe("Positive Scenarios", () => {
    test("PUT Update Board Name - board name should be updated", async ({
      apiClient,
      boardManagement,
    }) => {
      const newBoard = buildBoard();

      const boardId = await boardManagement.createBoard(newBoard.name);
      const response = await updateBoard(apiClient, boardId, {
        data: newBoard.name,
      });

      const body = await response.json();

      assertStatusCode(response, 200);
      assertName(body, newBoard.name);
    });
  });

  test.describe("Negative Scenarios", () => {
    test("PUT Update Board with invalid ID - should return 404 not found", async ({
      apiClient,
    }) => {
      const response = await updateBoard(apiClient, buildInvalidBoardId().id, {
        data: buildInvalidBoardId().id,
      });
      assertStatusCode(response, 404);
      await assertErrorText(response, ERROR_MESSAGES.notFound);
    });
  });
});
