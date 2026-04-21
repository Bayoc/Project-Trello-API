import { APIResponse } from "@playwright/test";
import { test as base } from "@playwright/test";
import { setupBoard } from "../helpers/setup/board-setup";
import { deleteBoard } from "../helpers/api/board-api";

export type BoardManagement = {
  createBoard: (name?: string) => Promise<string>;
  deleteBoard: (boardId: string) => Promise<APIResponse>;
};

export const test = base.extend<{ boardManagement: BoardManagement }>({
  boardManagement: async ({ request }, use) => {
    await use({
      createBoard: (name?: string) => setupBoard(request, name),
      deleteBoard: (boardId: string) => deleteBoard(request, boardId),
    });
  },
});
