import { test } from "../../fixtures/fixtures";
import { getList } from "../../helpers/api/list-api";
import { assertStatusCode } from "../../helpers/assertions";
import { buildInvalidListId } from "../../helpers/factories/list-factory";
import { expect } from "@playwright/test";
import { validListSchema } from "../../types/schemas/list-schema";

test.describe("GET - Get List", () => {
  test.describe("Positive Scenarios", () => {
    test("GET List - should return 200 and list details", async ({
      apiClient,
      listManagement,
    }) => {
      const { boardId, listId, listName } =
        await listManagement.createListWithBoard();

      const getListResponse = await getList(apiClient, listId);

      assertStatusCode(getListResponse, 200);

      const getListBody = await getListResponse.json();

      expect(getListBody).toMatchObject({
        ...validListSchema,
        name: listName,
        idBoard: boardId,
      });
    });
  });

  test.describe("Negative Scenarios", () => {
    test("GET List with invalid ID - should return 404 Not Found", async ({
      apiClient,
    }) => {
      const response = await getList(apiClient, buildInvalidListId().id);

      assertStatusCode(response, 404);
    });
  });
});
