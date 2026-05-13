import { expect } from "@playwright/test";
import { test } from "../../fixtures/fixtures";
import { createCard } from "../../helpers/api/card-api";
import { assertStatusCode } from "../../helpers/assertions";
import { validCardSchema } from "../../types/schemas/card-scehams";
import { buildCard } from "../../helpers/factories/card-factory";
import { faker } from "@faker-js/faker";
import { buildInvalidListId } from "../../helpers/factories/list-factory";

test.describe("POST - Create Card", () => {
  test.describe("Positive Scenarios", () => {
    test("POST Create Card - should create a new card and return 200", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();
      const response = await createCard(apiClient, {
        data: {
          idList: listId,
        },
      });
      assertStatusCode(response, 200);

      const body = await response.json();
      expect(body).toMatchObject({
        ...validCardSchema,
        idList: listId,
      });
    });

    test("POST Crate Card with optional fields - should create a new card with provided fields and return 200", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();

      const cardPayload = buildCard({
        desc: faker.lorem.paragraph(),
        pos: "top",
      });

      const response = await createCard(apiClient, {
        data: {
          idList: listId,
          ...cardPayload,
        },
      });
      assertStatusCode(response, 200);

      const body = await response.json();

      expect(body).toMatchObject({
        ...validCardSchema,
        idList: listId,
        name: cardPayload.name,
        desc: cardPayload.desc,
      });
    });

    test.describe("Negative Scenarios", () => {});

    test("POST Create Card with invalid listID - should return error 404 Not Found", async ({
      apiClient,
    }) => {
      const response = await createCard(apiClient, {
        data: {
          idList: buildInvalidListId().id,
          name: buildCard().name,
        },
      });
      assertStatusCode(response, 404);
    });

    test("POST Create Card without list Id - should return error 400 Bad Request", async ({
      apiClient,
    }) => {
      const response = await createCard(apiClient, {
        data: {
          // intentional missing idList to test API validation
          name: buildCard().name,
        },
      });
      assertStatusCode(response, 400);
    });

    test("POST Create Card with invalid list ID format - should return error 400 Bad Request", async ({
      apiClient,
    }) => {
      const response = await createCard(apiClient, {
        data: {
          idList: faker.string.alphanumeric(8), // 8-character random string, not a valid 24-character hex ID
          name: buildCard().name,
        },
      });
      assertStatusCode(response, 400);
    });

    test("POST Create Card with invalid 'pos' format - should return error 400 Bad Request", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();

      const response = await createCard(apiClient, {
        data: {
          idList: listId,
          name: buildCard().name,
          pos: "middle", // Invalid value for 'pos'
        },
      });
      assertStatusCode(response, 400);
    });

    test("POST Create Card without data - should return error 400 Bad Request", async ({
      apiClient,
    }) => {
      const response = await createCard(apiClient, {
        // No data provided to test API validation
      });
      assertStatusCode(response, 400);
    });
  });

  test.describe("Edge Cases", () => {
    test("POST Create Card with maximum long name - should create card and return 200", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();
      const longName = "a".repeat(16384); // 16,384 characters long
      const response = await createCard(apiClient, {
        data: {
          idList: listId,
          name: longName,
        },
      });
      assertStatusCode(response, 200);

      const body = await response.json();
      expect(body).toMatchObject({
        ...validCardSchema,
        idList: listId,
        name: longName,
      });
    });

    test("POST Create Card with name exceeding maximum length - should return error 400 Bad Request", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();
      const longName = "a".repeat(16385); // 16,385 characters long, exceeding the limit by 1 character
      const response = await createCard(apiClient, {
        data: {
          idList: listId,
          name: longName,
        },
      });
      assertStatusCode(response, 400);
    });
  });

  test.describe("Security Scenarios", () => {
    test("POST Create Card without authentication - should return error 401 Unauthorized", async ({
      apiClient,
      listManagement,
    }) => {
      const { listId } = await listManagement.createListWithBoard();
      const response = await createCard(apiClient, {
        omitAuth: true, // Omit authentication to test security
        data: {
          idList: listId,
        },
      });
      assertStatusCode(response, 401);
    });

    test("POST/BOLA Create Card - should reaturn 401 Unauthorized when trying to create card in a private board without access", async ({
      alternativeApiClient,
      listManagement,
    }) => {
      // Create a private board with list using the main API Client
      const { listId } = await listManagement.createListWithBoard();

      const attackResponse = await createCard(alternativeApiClient, {
        data: {
          idList: listId,
          name: buildCard().name,
        },
      });
      assertStatusCode(attackResponse, 401);
    });
  });

  test.describe("Buisness Logic Scenarios", () => {
    test("POST Create Card by copyin an existing card - should create a new card with same details and return 200", async ({
      apiClient,
      cardManagement,
    }) => {
      const uniqueDescription = faker.lorem.sentence();

      const { listId, cardId: sourceCardId } =
        await cardManagement.createCardWithListAndBoard({
          desc: uniqueDescription,
        });

      const nameOfNewCard = `Copy of ${sourceCardId}`;
      const response = await createCard(apiClient, {
        data: {
          idList: listId,
          name: nameOfNewCard,
          idCardSource: sourceCardId, // Use the id of the existing card to create a copy
        },
      });
      assertStatusCode(response, 200);

      const body = await response.json();
      expect(body).toMatchObject({
        ...validCardSchema,
        idList: listId,
        name: nameOfNewCard,
        desc: uniqueDescription, // Ensure the description is copied from the source card
      });
      expect(body.id).not.toBe(sourceCardId); // Ensure a new card is created, not just a reference to the existing card
    });
  });
});
