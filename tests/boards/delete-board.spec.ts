import { assertStatusCode, assertErrorText } from "../../helpers/assertions";
import { ERROR_MESSAGES } from "../../data/error_messages";
import { getBoard, deleteBoard } from "../../helpers/api/board-api";
import { test } from "../../fixtures/fixtures";
import {
  buildBoard,
  buildInvalidBoardId,
} from "../../helpers/factories/board-factory";

test.describe("DELETE Board", () => {
  test.describe("Positive Scenarios", () => {
    test("DELETE Board - board should be deleted", async ({
      apiClient,
      boardManagement,
    }) => {
      const boardId = await boardManagement.createBoard(buildBoard.name);

      const deleteResponse = await deleteBoard(apiClient, boardId);
      assertStatusCode(deleteResponse, 200);

      const getResponse = await getBoard(apiClient, boardId);
      assertStatusCode(getResponse, 404);
    });
  });

  test.describe("Negative Scenarios", () => {
    test("DELETE Board with invalid ID - should return 404 not found", async ({
      apiClient,
      boardManagement,
    }) => {
      const boardId = await boardManagement.createBoard(buildBoard.name);

      const deleteResponse = await deleteBoard(
        apiClient,
        buildInvalidBoardId().id,
      );

      assertStatusCode(deleteResponse, 404);
      assertErrorText(deleteResponse, ERROR_MESSAGES.notFound);

      const getResponse = await getBoard(apiClient, boardId);
      assertStatusCode(getResponse, 200);
    });
  });
});
