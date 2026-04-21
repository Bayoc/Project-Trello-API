import { test } from "@playwright/test";
import { ENDPOINTS } from "../../data/endpoints";
import { createBoardData } from "../../data/board.data";
import { authParams } from "../../helpers/setup/auth-setup";
import { deleteBoard, createBoard } from "../../helpers/api/board-api";
import {
  assertStatusCode,
  assertName,
  assertHasProperty,
  assertErrorText,
} from "../../helpers/assertions";
import { ERROR_MESSAGES } from "../../data/error_messages";

test.describe("CREATE Board", () => {
  test.describe("Positive Scenarios", () => {
    let boardID: string = "";

    test.afterEach(async ({ request }) => {
      // cleanup - delete board
      await deleteBoard(request, boardID);
    });

    test("POST - should create a new board with valid data", async ({
      request,
    }) => {
      const response = await createBoard(request, createBoardData.name);
      const body = await response.json();

      assertStatusCode(response, 200);
      assertName(body, createBoardData.name);
      assertHasProperty(body, "id");

      boardID = body.id;
    });

    test("POST Create Board with characters limit in name - should return 200 and create board", async ({
      request,
    }) => {
      const longName = "a".repeat(16384);
      const response = await createBoard(request, longName);
      const body = await response.json();

      assertStatusCode(response, 200);
      assertHasProperty(body, "id");
      assertName(body, longName);

      boardID = body.id;
    });
  });

  test.describe("Negative Scenarios", () => {
    test("POST Create Board without data - should return 400 error when creating a board without a name", async ({
      request,
    }) => {
      const response = await request.post(ENDPOINTS.BOARD.BASE, {
        params: authParams,
      });

      assertStatusCode(response, 400);
      await assertErrorText(response, ERROR_MESSAGES.badNameRequest);
    });

    test("POST Create Board with characters limit +1 in name - should return 400 error", async ({
      request,
    }) => {
      const response = await request.post(ENDPOINTS.BOARD.BASE, {
        params: authParams,
        data: { name: "a".repeat(16385) },
      });

      assertStatusCode(response, 400);
      await assertErrorText(response, ERROR_MESSAGES.badNameRequest);
    });
  });
});
