import { test, expect } from "@playwright/test";
import { ENDPOINTS } from "../../data/endpoints";
import { authParams } from "../../helpers/auth-helpers";
import { deleteBoard, createBoard } from "../../helpers/board-helpers";
import { createListData } from "../../data/lists.data";

test.describe("POST - List Ordering", () => {
  let boardID: string = "";

  test.beforeAll(async ({ request }) => {
    // create BOARD
    boardID = await createBoard(request);
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

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("pos");
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

      expect(responsePos2.status()).toBe(200);
      const body2 = await responsePos2.json();
      expect(body2).toHaveProperty("pos");
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

      expect(responsePos3.status()).toBe(200);
      const body3 = await responsePos3.json();
      expect(body3).toHaveProperty("pos");
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
      expect(response.status()).toBe(400);
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
      expect(response.status()).toBe(400);
    });
  });
});
