export type BoardData = {
  name: string;
};

const validBoardData: BoardData = { name: "Test Board" };

const updateBoardData: BoardData = { name: "Updated Board" };

const longNameData: BoardData = { name: "a".repeat(16384) };

const invalidBoardIdData = { id: "aaaaaaaaaaaaaaaaaaaaaaaa" };

export const boardData = {
  validBoardData,
  updateBoardData,
  longNameData,
  invalidBoardIdData,
};
