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

    test("PUT Update List name on archived (closed) list - name should be updated and return 200", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId, boardId } = await listManagement.createListWithBoard();
      const archivedName = buildList().name;

      // First, archive the list
      const archiveResponse = await updateList(apiClient, listId, {
        data: { closed: true },
      });
      assertStatusCode(archiveResponse, 200);

      // Then, attempt to update the name of the archived list
      const response = await updateList(apiClient, listId, {
        data: { name: archivedName },
      });
      assertStatusCode(response, 200);

      const body = await response.json();
      expect(body).toMatchObject({
        ...validListSchema,
        name: archivedName,
        id: listId,
        idBoard: boardId,
        closed: true, // Verify that the list remains archived
      });
    });

    test("PUT Update List unarchived (closed: false) - list should be unarchived and return 200", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();

      const archiveResponse = await updateList(apiClient, listId, {
        data: { closed: true },
      });
      assertStatusCode(archiveResponse, 200);

      const response = await updateList(apiClient, listId, {
        data: { closed: false },
      });
      assertStatusCode(response, 200);

      const body = await response.json();
      expect(body).toMatchObject({
        ...validListSchema,
        id: listId,
        closed: false,
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

    test("PUT Update List with empty name - should return 400 bad request", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();
      const response = await updateList(apiClient, listId, {
        data: { name: "" },
      });
      assertStatusCode(response, 400);
    });

    test("PUT Update List with excessively long name - should return 400 bad request", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();
      const longName = buildList({ name: "A".repeat(16385) }).name;
      const response = await updateList(apiClient, listId, {
        data: { name: longName },
      });
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
