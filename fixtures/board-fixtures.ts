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
    // 1. SETUP: Lokalny stan dla konkretnego testu (izolacja)
    const boardsToCleanup: string[] = [];

    // 2. PRZEKAZANIE KONTROLI: Udostępnienie metod do testu
    await use({
      createBoard: (name?: string) => setupBoard(request, name),
      deleteBoard: (boardId: string) => deleteBoard(request, boardId),
      addBoardForCleanup: (boardId: string) => {
        boardsToCleanup.push(boardId);
      },
    });

    // 3. TEARDOWN: Automatyczne sprzątanie po zakończeniu testu
    for (const boardId of boardsToCleanup) {
      const response = await deleteBoard(request, boardId);
      if (!response.ok()) {
        // eslint-disable-next-line no-console
        console.error(`Cleanup failed for board ID: ${boardId}`);
      }
    }
  },
});
