import {
  assertHasProperty,
  assertPositionIsGreaterThan,
  assertPositionIsLessThan,
  assertStatusCode,
} from "../../helpers/assertions";
import { test } from "../../fixtures/fixtures";
import { createList, updateList } from "../../helpers/api/list-api";
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

    test("PUT Update List Position - should update list position using 'top' and maintain correct ordering", async ({
      apiClient,
      boardManagement,
      listManagement,
    }) => {
      const boardId = await boardManagement.createBoard(buildBoard().name);

      const list1 = await listManagement.createList(boardId);
      const list2 = await listManagement.createList(boardId);

      const positionResponse = await updateList(apiClient, list2.listId, {
        data: { pos: "top" },
      });

      assertStatusCode(positionResponse, 200);
      const changedPositionBody = await positionResponse.json();
      assertPositionIsLessThan(changedPositionBody, list1.listPos);
    });

    test("PUT Update List Position to 'bottom' - should update list position to the end of the list and return 200", async ({
      apiClient,
      boardManagement,
      listManagement,
    }) => {
      const boardId = await boardManagement.createBoard(buildBoard().name);

      const list1 = await listManagement.createList(boardId);
      const list2 = await listManagement.createList(boardId);

      const positionResponse = await updateList(apiClient, list1.listId, {
        data: { pos: "bottom" },
      });

      assertStatusCode(positionResponse, 200);
      const updatedPositionBody = await positionResponse.json();
      assertPositionIsGreaterThan(updatedPositionBody, list2.listPos);
    });
  });
});
