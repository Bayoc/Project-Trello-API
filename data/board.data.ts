export type CreateBoard = {
  name: string;
};

const createBoardData: CreateBoard = { name: "Test Board" };

const updateBoardData: CreateBoard = { name: "Updated Board" };

const longNameData: CreateBoard = { name: "a".repeat(16384) };

const invalidBoardIdData = { id: "aaaaaaaaaaaaaaaaaaaaaaaa" };

export const boardData = {
  createBoardData,
  updateBoardData,
  longNameData,
  invalidBoardIdData,
};
