import { faker } from "@faker-js/faker";

export interface CardPayload {
  name: string;
  desc?: string;
  pos?: "top" | "botoom" | string;
}

export function buildCard(overrides?: Partial<CardPayload>): CardPayload {
  return {
    name: `Card_${faker.string.alphanumeric(8)}`,
    ...overrides,
  };
}

export function buildInvalidCardId(): { name: string; id: string } {
  return {
    name: "",
    id: faker.database.mongodbObjectId(), // Generates a random 24-character hexadecimal string
  };
}
