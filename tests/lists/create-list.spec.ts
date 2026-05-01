import { assertName, assertStatusCode } from "../../helpers/assertions";
import { assertHasProperty } from "../../helpers/assertions";
import { createList } from "../../helpers/api/list-api";
import { test } from "../../fixtures/board-fixtures";
import { buildList } from "../../helpers/factories/list-factory";
import {
  buildBoard,
  buildInvalidBoardId,
} from "../../helpers/factories/board-factory";

test.describe("POST - Create List", () => {
  test.describe("Positive Scenarios", () => {
    test("POST Create List - should create a new list", async ({
      apiClient,
      boardManagement,
    }) => {
      const boardId = await boardManagement.createBoard(buildBoard().name);
      const validListData = buildList();
      const response = await createList(apiClient, {
        data: {
          name: validListData.name,
          idBoard: boardId,
        },
      });
      const body = await response.json();

      assertStatusCode(response, 200);
      assertName(body, validListData.name);
      assertHasProperty(body, "id");
    });
  });

  test.describe("Negative Scenarios", () => {
    test("POST Create List with invalid boardID - should return error 401 Unauthorized", async ({
      apiClient,
    }) => {
      const response = await createList(apiClient, {
        data: {
          name: buildList().name,
          idBoard: buildInvalidBoardId().id, // Invalid board ID
        },
      });
      assertStatusCode(response, 401);
      // Trello returns 401 for invalid idBoard for security reasons - 404 would reveal resource existence
    });

    test("POST Create List with empty name - should return error 400 bad request", async ({
      apiClient,
    }) => {
      const response = await createList(apiClient, {
        data: {
          name: "", // Empty name
          idBoard: buildInvalidBoardId().id,
        },
      });
      assertStatusCode(response, 400);
    });
  });
});
