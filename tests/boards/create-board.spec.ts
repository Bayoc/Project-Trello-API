import { ENDPOINTS } from "../../data/endpoints";
import { boardData } from "../../data/board.data";
import { authParams } from "../../helpers/setup/auth-setup";
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
    let boardID: string = "";

    test.afterEach(async ({ boardManagement }) => {
      // cleanup - delete board
      if (boardID) await boardManagement.deleteBoard(boardID);
    });

    test("POST - should create a new board with valid data", async ({
      request,
    }) => {
      const response = await createBoard(
        request,
        boardData.validBoardData.name,
      );
      const body = await response.json();

      assertStatusCode(response, 200);
      assertName(body, boardData.validBoardData.name);
      assertHasProperty(body, "id");

      boardID = body.id;
    });

    test("POST Create Board with characters limit in name - should return 200 and create board", async ({
      request,
    }) => {
      const response = await createBoard(request, boardData.longNameData.name);

      assertStatusCode(response, 200);

      const body = await response.json();
      assertHasProperty(body, "id");
      assertName(body, boardData.longNameData.name);

      boardID = body.id;
    });
  });

  test.describe("Negative Scenarios", () => {
    test("POST Create Board without data - should return 400 error when creating a board without a name", async ({
      request,
    }) => {
      const response = await request.post(ENDPOINTS.BOARD.BASE, {
        params: authParams,
      });

      assertStatusCode(response, 400);
      await assertErrorText(response, ERROR_MESSAGES.badNameRequest);
    });

    test("POST Create Board with characters limit +1 in name - should return 400 error", async ({
      request,
    }) => {
      const response = await request.post(ENDPOINTS.BOARD.BASE, {
        params: authParams,
        data: { name: "a".repeat(16385) },
      });

      assertStatusCode(response, 400);
      await assertErrorText(response, ERROR_MESSAGES.badNameRequest);
    });
  });
});
