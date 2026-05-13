import { test as base, expect } from "@playwright/test";
import { createBoard, deleteBoard } from "../helpers/api/board-api";
import { createList } from "../helpers/api/list-api";
import { BaseApiClient } from "../helpers/api/base-api";
import { buildBoard } from "../helpers/factories/board-factory";
import { buildList } from "../helpers/factories/list-factory";
import { alternativeAuthParams } from "../helpers/setup/auth-setup";
import { createCard } from "../helpers/api/card-api";
import { buildCard } from "../helpers/factories/card-factory";

export type BoardManagement = {
  createBoard: (name?: string) => Promise<string>;
  deleteBoard: (boardId: string) => Promise<unknown>;
  addBoardForCleanup: (boardId: string) => void;
};

type ListOverrides = {
  id?: string;
  name?: string;
  pos?: number | string;
  closed?: boolean;
};

export type CardOverrides = {
  name?: string;
  pos?: number | string;
  desc?: string;
};

export type ListManagement = {
  createList: (
    boardId: string,
    listOverrides?: ListOverrides,
  ) => Promise<{
    listId: string;
    listName: string;
    listPos: number;
    listClosed?: boolean;
  }>;
  createListWithBoard: (
    listOverrides?: ListOverrides,
    boardName?: string,
  ) => Promise<{
    boardId: string;
    listId: string;
    listName: string;
    listPos: number;
    listClosed?: boolean;
  }>;
};

export type CardManagement = {
  createCard: (
    listId: string,
    cardOverrides?: CardOverrides,
  ) => Promise<{
    cardId: string;
    cardName: string;
  }>;
  createCardWithListAndBoard: (
    cardOverrides?: CardOverrides,
    listOverrides?: ListOverrides,
    boardName?: string,
  ) => Promise<{
    boardId: string;
    listId: string;
    cardId: string;
    cardName: string;
  }>;
};

export const test = base.extend<{
  apiClient: BaseApiClient;
  alternativeApiClient: BaseApiClient;
  boardManagement: BoardManagement;
  listManagement: ListManagement;
  cardManagement: CardManagement;
}>({
  apiClient: async ({ request }, use) => {
    const client = new BaseApiClient(request);
    await use(client);
  },

  alternativeApiClient: async ({ request }, use) => {
    const altClient = new BaseApiClient(request, alternativeAuthParams);
    await use(altClient);
  },

  boardManagement: async ({ apiClient }, use, testInfo) => {
    const boardsToCleanup: string[] = [];

    await use({
      createBoard: async (name?: string) => {
        let finalBoardName = name;
        if (!finalBoardName) {
          // generate a unique board name based on the test title to avoid collisions and improve traceability
          const testName = testInfo.title.substring(0, 25);
          const safeTestName = testName.replace(/[^a-zA-Z0-9 ]/g, "");
          finalBoardName = `[${safeTestName}] Board_${buildBoard().name.substring(0, 5)}`;
        }

        const response = await createBoard(apiClient, {
          data: { name: finalBoardName },
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
    const createListLogic = async (
      boardId: string,
      overrides?: ListOverrides,
    ) => {
      const generatedName = overrides?.name ?? buildList().name;

      const requestData = {
        idBoard: boardId,
        name: generatedName,
        ...overrides,
      };

      const response = await createList(apiClient, {
        data: requestData,
      });
      expect(response.status()).toBe(200);

      const body = await response.json();

      return { listId: body.id, listName: generatedName, listPos: body.pos };
    };

    await use({
      createList: createListLogic,

      createListWithBoard: async (
        listOverrides?: ListOverrides,
        boardName?: string,
      ) => {
        const boardId = await boardManagement.createBoard(boardName);

        const listData = await createListLogic(boardId, listOverrides);

        return {
          boardId,
          listId: listData.listId,
          listName: listData.listName,
          listPos: listData.listPos,
        };
      },
    });
  },

  cardManagement: async ({ apiClient, listManagement }, use) => {
    const createCardLogic = async (
      listId: string,
      overrides?: CardOverrides,
    ) => {
      const generatedName = overrides?.name ?? buildCard().name;

      const requestData = {
        idList: listId,
        name: generatedName,
        ...overrides,
      };

      const response = await createCard(apiClient, {
        data: requestData,
      });
      expect(response.status()).toBe(200);

      const body = await response.json();

      return { cardId: body.id, cardName: generatedName };
    };

    await use({
      createCard: createCardLogic,

      createCardWithListAndBoard: async (
        cardOverrides?: CardOverrides,
        listOverrides?: ListOverrides,
        boardName?: string,
      ) => {
        const { boardId, listId } = await listManagement.createListWithBoard(
          listOverrides,
          boardName,
        );

        const cardData = await createCardLogic(listId, cardOverrides);

        return {
          boardId,
          listId,
          cardId: cardData.cardId,
          cardName: cardData.cardName,
        };
      },
    });
  },
});
