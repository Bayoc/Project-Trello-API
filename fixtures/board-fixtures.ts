import { APIResponse } from "@playwright/test";
import { test as base } from "@playwright/test";
import { setupBoard } from "../helpers/setup/board-setup";
import { deleteBoard } from "../helpers/api/board-api";

export type BoardManagement = {
  createBoard: (name?: string) => Promise<string>;
  deleteBoard: (boardId: string) => Promise<APIResponse>;
  addBoardForCleanup: (boardId: string) => void;
};

export const test = base.extend<{ boardManagement: BoardManagement }>({
  boardManagement: async ({ request }, use) => {
    const boardsToCleanup: string[] = [];

    await use({
      createBoard: async (name?: string) => {
        const boardId = await setupBoard(request, name);
        boardsToCleanup.push(boardId); //
        return boardId;
      },
      deleteBoard: (boardId: string) => deleteBoard(request, boardId),
      addBoardForCleanup: (boardId: string) => {
        boardsToCleanup.push(boardId);
      },
    });

    for (const boardId of boardsToCleanup) {
      const response = await deleteBoard(request, boardId);
      if (!response.ok()) {
        // eslint-disable-next-line no-console
        console.error(`Cleanup failed for board ID: ${boardId}`);
      }
    }
  },
});
