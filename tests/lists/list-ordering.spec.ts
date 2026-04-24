import { validListData } from "../../data/lists.data";
import {
  assertHasProperty,
  assertPositionIsGreaterThan,
  assertPositionIsLessThan,
  assertStatusCode,
} from "../../helpers/assertions";
import { test } from "../../fixtures/board-fixtures";
import { createList } from "../../helpers/api/list-api";

test.describe("POST - List Ordering", () => {
  test.describe("Positive Scenarios", () => {
    test("POST Create List - should calculate and assign dynamic positions (bottom and middle)", async ({
      request,
      boardManagement,
    }) => {
      let pos1: number = 0;
      let pos2: number = 0;
      const boardId = await boardManagement.createBoard("List Ordering Board");

      // 1. First List (base position)
      const response = await createList(request, {
        name: validListData.name,
        idBoard: boardId,
      });
      const body1 = await response.json();

      assertStatusCode(response, 200);
      assertHasProperty(body1, "pos");
      pos1 = body1.pos;

      // 2. Second List (right side / at the end)
      const responsePos2 = await createList(request, {
        name: validListData.name,
        idBoard: boardId,
        pos: pos1 + 1000, // Intentionally large to ensure it's at the end
      });
      const body2 = await responsePos2.json();

      assertStatusCode(responsePos2, 200);
      assertHasProperty(body2, "pos");
      assertPositionIsGreaterThan(body2, pos1);
      pos2 = body2.pos;

      // 2. Third List (Between first and second list)
      const responsePos3 = await createList(request, {
        name: validListData.name,
        idBoard: boardId,
        pos: (pos1 + pos2) / 2,
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
      request,
      boardManagement,
    }) => {
      const boardId = await boardManagement.createBoard("List Ordering Board");
      const response = await createList(request, {
        name: validListData.name,
        idBoard: boardId,
        pos: "middle", // Invalid enum value
      });
      assertStatusCode(response, 400);
    });

    test("POST Create List - missing parent idBoard should return 400", async ({
      request,
    }) => {
      const response = await createList(request, {
        name: validListData.name,
        // idBoard is intentionally missing
        pos: "top",
      });
      assertStatusCode(response, 400);
    });
  });
});
