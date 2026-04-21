import { test, expect } from "@playwright/test";
import { ENDPOINTS } from "../../data/endpoints";
import { authParams } from "../../helpers/auth-helpers";
import { deleteBoard, setupBoard } from "../../helpers/board-helpers";
import { createListData } from "../../data/lists.data";
import { assertHasProperty, assertStatusCode } from "../../helpers/assertions";

test.describe("POST - List Ordering", () => {
  let boardID: string = "";

  test.beforeAll(async ({ request }) => {
    // create BOARD
    boardID = await setupBoard(request);
  });

  test.afterAll(async ({ request }) => {
    // cleanup - delete board
    await deleteBoard(request, boardID);
  });

  test.describe("Positive Scenarios", () => {
    test("POST Create List - should calculate and assign dynamic positions (bottom and middle)", async ({
      request,
    }) => {
      let pos1: number = 0;
      let pos2: number = 0;

      // 1. First List (base position)
      const response = await request.post(ENDPOINTS.LIST.BASE, {
        params: authParams,
        data: {
          name: createListData.name,
          idBoard: boardID,
        },
      });

      assertStatusCode(response, 200);
      const body = await response.json();
      assertHasProperty(body, "pos");
      pos1 = body.pos;

      // 2. Second List (right side / at the end)
      const responsePos2 = await request.post(ENDPOINTS.LIST.BASE, {
        params: authParams,
        data: {
          name: createListData.name,
          idBoard: boardID,
          pos: pos1 + 1,
        },
      });

      assertStatusCode(responsePos2, 200);
      const body2 = await responsePos2.json();
      assertHasProperty(body2, "pos");
      expect(body2.pos).toBeGreaterThan(pos1);
      pos2 = body2.pos;

      // 2. Third List (Between first and second list)
      const responsePos3 = await request.post(ENDPOINTS.LIST.BASE, {
        params: authParams,
        data: {
          name: createListData.name,
          idBoard: boardID,
          pos: (pos1 + pos2) / 2,
        },
      });

      assertStatusCode(responsePos3, 200);
      const body3 = await responsePos3.json();
      assertHasProperty(body3, "pos");
      expect(body3.pos).toBeGreaterThan(pos1);
      expect(body3.pos).toBeLessThan(pos2);
    });
  });

  test.describe("Negative Scenarios", () => {
    test('POST Create List - invalid enum string ("middle") should return 400', async ({
      request,
    }) => {
      const response = await request.post(ENDPOINTS.LIST.BASE, {
        params: authParams,
        data: {
          name: createListData.name,
          idBoard: boardID,
          pos: "middle",
        },
      });
      assertStatusCode(response, 400);
    });

    test("POST Create List - missing parent idBoard should return 400", async ({
      request,
    }) => {
      const response = await request.post(ENDPOINTS.LIST.BASE, {
        params: authParams,
        data: {
          name: createListData.name,
          pos: "top",
        },
        // intentional missing idBoard
      });
      assertStatusCode(response, 400);
    });
  });
});
