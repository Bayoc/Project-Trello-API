import { validListData } from "../../data/lists.data";
import { assertName, assertStatusCode } from "../../helpers/assertions";
import { assertHasProperty } from "../../helpers/assertions";
import { createList } from "../../helpers/api/list-api";
import { boardData } from "../../data/board.data";
import { test } from "../../fixtures/board-fixtures";

test.describe("POST - Create List", () => {
  test.describe("Positive Scenarios", () => {
    test("POST Create List - should create a new list", async ({
      request,
      boardManagement,
    }) => {
      const boardId = await boardManagement.createBoard(
        boardData.validBoardData.name,
      );
      const response = await createList(request, {
        name: validListData.name,
        idBoard: boardId,
      });
      const body = await response.json();

      assertStatusCode(response, 200);
      assertName(body, validListData.name);
      assertHasProperty(body, "id");
    });
  });

  test.describe("Negative Scenarios", () => {
    test("POST Create List with invalid boardID - should return error 401 Unauthorized", async ({
      request,
    }) => {
      const response = await createList(request, {
        name: validListData.name,
        idBoard: boardData.invalidBoardIdData.id, // Invalid board ID
      });
      assertStatusCode(response, 401);
      // Trello returns 401 for invalid idBoard for security reasons - 404 would reveal resource existence
    });

    test("POST Create List with empty name - should return error 400 bad request", async ({
      request,
    }) => {
      const response = await createList(request, {
        name: "", // Empty name
        idBoard: boardData.validBoardData, // Invalid board ID
      });
      assertStatusCode(response, 400);
    });
  });
});
