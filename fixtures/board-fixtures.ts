import { APIResponse } from "@playwright/test";
import { test as base } from "@playwright/test";
import { createBoard, deleteBoard } from "../helpers/api/board-api";
import { boardData } from "../data/board.data";

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
        const response = await createBoard(request, {
          name: name ?? boardData.validBoardData.name,
        });
        const body = await response.json();
        const boardId = body.id;
        boardsToCleanup.push(boardId);
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
