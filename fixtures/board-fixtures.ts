import { test as base } from "@playwright/test";
import { createBoard, deleteBoard } from "../helpers/api/board-api";
import { createList } from "../helpers/api/list-api";
import { BaseApiClient } from "../helpers/api/base-api";
import { buildBoard } from "../helpers/factories/board-factory";
import { buildList } from "../helpers/factories/list-factory";

export type BoardManagement = {
  createBoard: (name?: string) => Promise<string>;
  deleteBoard: (boardId: string) => Promise<unknown>;
  addBoardForCleanup: (boardId: string) => void;
};

export type ListManagement = {
  createList: (
    boardId: string,
    name?: string,
  ) => Promise<{ listId: string; listName: string }>;
  createListWithBoard: (
    listName?: string,
    boardName?: string,
  ) => Promise<{ boardId: string; listId: string; listName: string }>;
};

export const test = base.extend<{
  apiClient: BaseApiClient;
  boardManagement: BoardManagement;
  listManagement: ListManagement;
}>({
  apiClient: async ({ request }, use) => {
    const client = new BaseApiClient(request);
    await use(client);
  },

  boardManagement: async ({ apiClient }, use) => {
    const boardsToCleanup: string[] = [];

    await use({
      createBoard: async (name?: string) => {
        const response = await createBoard(apiClient, {
          data: { name: name ?? buildBoard().name },
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
      try {
        const response = await deleteBoard(apiClient, boardId);
        if (!response.ok()) {
          const errorBody = await response.text();
          // eslint-disable-next-line no-console
          console.error(
            `[TEARDOWN ERROR] Failed to delete board ID: ${boardId}. HTTP Status: ${response.status()}. Details: ${errorBody}`,
          );
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          `[TEARDOWN CRASH] Execution failed for board ID: ${boardId}. Reason:`,
          error,
        );
      }
    }
  },

  listManagement: async ({ apiClient, boardManagement }, use) => {
    const createListLogic = async (boardId: string, name?: string) => {
      const generatedName = name ?? buildList().name;
      const response = await createList(apiClient, {
        data: { name: generatedName, idBoard: boardId },
      });

      const body = await response.json();

      return { listId: body.id, listName: generatedName };
    };

    await use({
      createList: createListLogic,

      createListWithBoard: async (listName?: string, boardName?: string) => {
        const boardId = await boardManagement.createBoard(boardName);

        const listData = await createListLogic(boardId, listName);

        return {
          boardId,
          listId: listData.listId,
          listName: listData.listName,
        };
      },
    });
  },
});
