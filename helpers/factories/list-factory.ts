import { faker } from "@faker-js/faker";

export interface ListPayload {
  name: string;
}

export function buildList(overrides?: Partial<ListPayload>): ListPayload {
  return {
    name: `List_${faker.string.alphanumeric(8)}`,
    ...overrides,
  };
}

export function buildInvalidListId(): { name: string; id: string } {
  return {
    name: "",
    id: faker.database.mongodbObjectId(), // Generates a random 24-character hexadecimal string
  };
}
