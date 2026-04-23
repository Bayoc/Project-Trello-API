export type BoardData = {
  name: string;
};

const validBoardData: BoardData = { name: "Test Board" };

const updateBoardData: BoardData = { name: "Updated Board" };

const longNameValidData: BoardData = { name: "a".repeat(16384) };

const longNameInvalidData: BoardData = { name: "a".repeat(16385) };

const invalidBoardIdData = { id: "aaaaaaaaaaaaaaaaaaaaaaaa" };

export const boardData = {
  validBoardData,
  updateBoardData,
  longNameValidData,
  longNameInvalidData,
  invalidBoardIdData,
};
