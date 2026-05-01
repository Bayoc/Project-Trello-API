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
