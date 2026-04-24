import { test } from "../../fixtures/board-fixtures";
import { updateBoard } from "../../helpers/api/board-api";
import {
  assertStatusCode,
  assertName,
  assertErrorText,
} from "../../helpers/assertions";
import { ERROR_MESSAGES } from "../../data/error_messages";
import { boardData } from "../../data/board.data";

test.describe("PUT Board", () => {
  test.describe("Positive Scenarios", () => {
    test("PUT Update Board Name - board name should be updated", async ({
      apiClient,
      boardManagement,
    }) => {
      const boardId = await boardManagement.createBoard(
        boardData.validBoardData.name,
      );
      const response = await updateBoard(apiClient, boardId, {
        data: { name: boardData.updateBoardData.name },
      });

      const body = await response.json();

      assertStatusCode(response, 200);
      assertName(body, boardData.updateBoardData.name);
    });
  });

  test.describe("Negative Scenarios", () => {
    test("PUT Update Board with invalid ID - should return 404 not found", async ({
      apiClient,
    }) => {
      const response = await updateBoard(
        apiClient,
        boardData.invalidBoardIdData.id,
        {
          data: { name: boardData.updateBoardData.name },
        },
      );
      assertStatusCode(response, 404);
      await assertErrorText(response, ERROR_MESSAGES.notFound);
    });
  });
});
