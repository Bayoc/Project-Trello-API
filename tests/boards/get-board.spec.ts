import { test } from "../../fixtures/board-fixtures";
import { ERROR_MESSAGES } from "../../data/error_messages";
import { getBoard } from "../../helpers/api/board-api";
import {
  assertStatusCode,
  assertHasProperty,
  assertID,
  assertErrorText,
} from "../../helpers/assertions";
import { boardData } from "../../data/board.data";

test.describe("GET Board", () => {
  test.describe("Positive Scenarios", () => {
    test("GET Board with valid ID - should return 200 and board ID", async ({
      apiClient,
      boardManagement,
    }) => {
      const boardId = await boardManagement.createBoard(
        boardData.validBoardData.name,
      );

      const response = await getBoard(apiClient, boardId);
      const body = await response.json();

      assertStatusCode(response, 200);
      assertHasProperty(body, "id");
      assertID(body, boardId);
    });
  });

  test.describe("Negative Scenarios", () => {
    test("GET Board with invalid ID - should return 404 not found", async ({
      apiClient,
    }) => {
      const response = await getBoard(
        apiClient,
        boardData.invalidBoardIdData.id,
      );
      assertStatusCode(response, 404);
      await assertErrorText(response, ERROR_MESSAGES.notFound);
    });
  });
});
