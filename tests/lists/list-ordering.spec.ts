import {
  assertHasProperty,
  assertPositionIsGreaterThan,
  assertPositionIsLessThan,
  assertStatusCode,
} from "../../helpers/assertions";
import { test } from "../../fixtures/board-fixtures";
import { createList } from "../../helpers/api/list-api";
import { buildBoard } from "../../helpers/factories/board-factory";
import { buildList } from "../../helpers/factories/list-factory";

test.describe("POST - List Ordering", () => {
  test.describe("Positive Scenarios", () => {
    test("POST Create List - should calculate and assign dynamic positions (bottom and middle)", async ({
      apiClient,
      boardManagement,
    }) => {
      const boardId = await boardManagement.createBoard(buildBoard().name);

      // 1. First List (base position)
      const response = await createList(apiClient, {
        data: {
          name: buildList().name,
          idBoard: boardId,
        },
      });
      const body1 = await response.json();
      const pos1 = body1.pos;

      assertStatusCode(response, 200);
      assertHasProperty(body1, "pos");

      // 2. Second List (right side / at the end)
      const responsePos2 = await createList(apiClient, {
        data: {
          name: buildList().name,
          idBoard: boardId,
          pos: pos1 + 1000, // Intentionally large to ensure it's at the end
        },
      });
      const body2 = await responsePos2.json();
      const pos2 = body2.pos;

      assertStatusCode(responsePos2, 200);
      assertHasProperty(body2, "pos");
      assertPositionIsGreaterThan(body2, pos1);

      // 3. Third List (Between first and second list)
      const responsePos3 = await createList(apiClient, {
        data: {
          name: buildList().name,
          idBoard: boardId,
          pos: (pos1 + pos2) / 2,
        },
      });
      const body3 = await responsePos3.json();

      assertStatusCode(responsePos3, 200);
      assertHasProperty(body3, "pos");
      assertPositionIsGreaterThan(body3, pos1);
      assertPositionIsLessThan(body3, pos2);
    });
  });

  test.describe("Negative Scenarios", () => {
    test('POST Create List - invalid enum string ("middle") should return 400', async ({
      apiClient,
      boardManagement,
    }) => {
      const boardId = await boardManagement.createBoard("List Ordering Board");
      const response = await createList(apiClient, {
        data: {
          name: buildList().name,
          idBoard: boardId,
          pos: "middle", // Invalid enum value
        },
      });
      assertStatusCode(response, 400);
    });

    test("POST Create List - missing parent idBoard should return 400", async ({
      apiClient,
    }) => {
      const response = await createList(apiClient, {
        data: {
          name: buildList().name,
          // idBoard is intentionally missing
          pos: "top",
        },
      });
      assertStatusCode(response, 400);
    });
  });
});
