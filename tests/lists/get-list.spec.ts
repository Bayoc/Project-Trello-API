import { test } from "../../fixtures/board-fixtures";
import { createList } from "../../helpers/api/list-api";
import { assertStatusCode } from "../../helpers/assertions";
import { buildBoard } from "../../helpers/factories/board-factory";
import { buildList } from "../../helpers/factories/list-factory";
import { expect } from "@playwright/test";
import { validListSchema } from "../../types/schemas/list-schema";

test.describe("GET - Get List", () => {
  test.describe("Positive Scenarios", () => {
    test("GET List - should return 200 and list details", async ({
      apiClient,
      boardManagement,
    }) => {
      const boardId = await boardManagement.createBoard(buildBoard().name);

      const listName = buildList();
      const createResponse = await createList(apiClient, {
        data: {
          name: listName.name,
          idBoard: boardId,
        },
      });

      assertStatusCode(createResponse, 200);

      const body = await createResponse.json();
      expect(body).toMatchObject({
        ...validListSchema,
        name: listName.name,
        idBoard: boardId,
      });
    });
  });
});
