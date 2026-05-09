import {
  assertPositionIsGreaterThan,
  assertPositionIsLessThan,
  assertStatusCode,
} from "../../helpers/assertions";
import { test } from "../../fixtures/fixtures";
import { updateList } from "../../helpers/api/list-api";
import { buildBoard } from "../../helpers/factories/board-factory";

import { expect } from "@playwright/test";

test.describe("List Ordering", () => {
  test.describe("Positive Scenarios", () => {
    test("POST Create List - should calculate position and dynamic assign position when creating multiple lists", async ({
      boardManagement,
      listManagement,
    }) => {
      const boardId = await boardManagement.createBoard(buildBoard().name);
      const list1 = await listManagement.createList(boardId);
      const list2 = await listManagement.createList(boardId, { pos: "bottom" });

      assertPositionIsGreaterThan(list2.listPos, list1.listPos);

      const middlePosition = (list1.listPos + list2.listPos) / 2;
      const list3 = await listManagement.createList(boardId, {
        pos: middlePosition,
      });

      expect(list3.listPos).toBeDefined();
      assertPositionIsGreaterThan(list3.listPos, list1.listPos);
      assertPositionIsLessThan(list3.listPos, list2.listPos);
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
      assertPositionIsLessThan(list2.listPos, list1.listPos);
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
      assertPositionIsGreaterThan(list1.listPos, list2.listPos);
    });
  });
});
