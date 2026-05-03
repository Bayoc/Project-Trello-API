import { test } from "../../fixtures/fixtures";
import { getList, updateList } from "../../helpers/api/list-api";
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

    test("should return 200 and list details for an archived (closed) list", async ({
      apiClient,
      listManagement,
    }) => {
      const { boardId, listId, listName } =
        await listManagement.createListWithBoard();

      // Archive the list
      const archiveResponse = await updateList(apiClient, listId, {
        data: { closed: true },
      });

      assertStatusCode(archiveResponse, 200);

      const getListResponse = await getList(apiClient, listId);

      assertStatusCode(getListResponse, 200);
      const getListBody = await getListResponse.json();

      expect(getListBody).toMatchObject({
        ...validListSchema,
        name: listName,
        idBoard: boardId,
        closed: true, // Verify that the list is marked as closed
      });
    });
  });

  test.describe("Negative Scenarios", () => {
    test("GET List with valid ID format for non-existing resource - should return 404 Not Found", async ({
      apiClient,
    }) => {
      const response = await getList(apiClient, buildInvalidListId().id);

      assertStatusCode(response, 404);
    });

    test("GET List with invalid ID - should return 400 Bad Request", async ({
      apiClient,
    }) => {
      const response = await getList(
        apiClient,
        buildInvalidListId().id + "invalid",
      );

      assertStatusCode(response, 400);
    });
  });

  test.describe("Security Check", () => {
    test("GET List without authentication - should return 401 Unauthorized", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();

      const response = await getList(apiClient, listId, {
        omitAuth: true,
      });

      assertStatusCode(response, 401);
    });
  });
});
