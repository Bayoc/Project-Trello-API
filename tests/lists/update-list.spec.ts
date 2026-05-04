import { expect } from "@playwright/test";
import { test } from "../../fixtures/fixtures";
import { updateList } from "../../helpers/api/list-api";
import { assertStatusCode } from "../../helpers/assertions";
import {
  buildInvalidListId,
  buildList,
} from "../../helpers/factories/list-factory";
import { validListSchema } from "../../types/schemas/list-schema";

test.describe("PUT List", () => {
  test.describe("Positive Scenarios", () => {
    test("PUT Update List Name - list name should be updated", async ({
      apiClient,
      listManagement,
    }) => {
      const newListName = buildList();
      const { listId } = await listManagement.createListWithBoard();
      const response = await updateList(apiClient, listId, {
        data: { name: newListName.name },
      });
      const body = await response.json();
      assertStatusCode(response, 200);
      expect(body).toMatchObject({
        ...validListSchema,
        name: newListName.name,
        id: listId,
      });
    });

    test("PUT Update List Closed Status - list should be archived (closed)", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();
      const response = await updateList(apiClient, listId, {
        data: { closed: true },
      });
      const body = await response.json();
      assertStatusCode(response, 200);
      expect(body).toMatchObject({
        ...validListSchema,
        id: listId,
        closed: true,
      });
    });
  });

  test.describe("Negative Scenarios", () => {
    test("PUT Update List with invalid ID - should return 404 not found", async ({
      apiClient,
    }) => {
      const response = await updateList(apiClient, buildInvalidListId().id);

      assertStatusCode(response, 404);
    });

    test("PUT Update List with invalidID format - should return 400 bad request", async ({
      apiClient,
    }) => {
      const response = await updateList(
        apiClient,
        buildList({ name: "invalid-id-format" }).name,
      );
      assertStatusCode(response, 400);
    });
  });

  test.describe("Security Checks", () => {
    test("PUT Update List without authentication - should return 401 unauthorized", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();
      const response = await updateList(apiClient, listId, {
        omitAuth: true,
      });
      assertStatusCode(response, 401);
    });
  });
});
