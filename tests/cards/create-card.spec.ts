import { expect } from "@playwright/test";
import { test } from "../../fixtures/fixtures";
import { createCard } from "../../helpers/api/card-api";
import { assertStatusCode } from "../../helpers/assertions";
import { validCardSchema } from "../../types/schemas/card-scehams";
import { buildCard } from "../../helpers/factories/card-factory";
import { faker } from "@faker-js/faker";

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
  });
});
