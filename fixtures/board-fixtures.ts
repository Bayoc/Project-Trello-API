import { APIResponse } from "@playwright/test";
import { test as base } from "@playwright/test";
import { createBoard, deleteBoard } from "../helpers/api/board-api";
import { boardData } from "../data/board.data";
import { BaseApiClient } from "../helpers/api/base-api";

export type BoardManagement = {
  createBoard: (name?: string) => Promise<string>;
  deleteBoard: (boardId: string) => Promise<APIResponse>;
  addBoardForCleanup: (boardId: string) => void;
};

export const test = base.extend<{
  apiClient: BaseApiClient;
  boardManagement: BoardManagement;
}>({
  // 2. Definiujemy instancję apiClient
  apiClient: async ({ request }, use) => {
    const client = new BaseApiClient(request);
    await use(client);
  },

  boardManagement: async ({ apiClient }, use) => {
    const boardsToCleanup: string[] = [];

    await use({
      createBoard: async (name?: string) => {
        const response = await createBoard(apiClient, {
          data: { name: name ?? boardData.validBoardData.name },
        });
        const body = await response.json();
        const boardId = body.id;
        boardsToCleanup.push(boardId);
        return boardId;
      },
      deleteBoard: (boardId: string) => deleteBoard(apiClient, boardId),
      addBoardForCleanup: (boardId: string) => {
        boardsToCleanup.push(boardId);
      },
    });

    for (const boardId of boardsToCleanup) {
      const response = await deleteBoard(apiClient, boardId);
      if (!response.ok()) {
        // eslint-disable-next-line no-console
        console.error(`Cleanup failed for board ID: ${boardId}`);
      }
    }
  },
});
