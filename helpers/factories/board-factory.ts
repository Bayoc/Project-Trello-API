import { faker } from "@faker-js/faker";

export interface BoardPayload {
  name: string;
}

export function buildBoard(overrides?: Partial<BoardPayload>): BoardPayload {
  return {
    name: `Board_${faker.string.alphanumeric(8)}`,
    ...overrides,
  };
}

export function buildInvalidBoardId(): { name: string; id: string } {
  return {
    name: "",
    id: faker.database.mongodbObjectId(), // Generates a random 24-character hexadecimal string
  };
}
