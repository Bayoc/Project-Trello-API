import { expect } from "@playwright/test";

export const validCardSchema = {
  id: expect.any(String),
  name: expect.any(String),
  idList: expect.any(String),
  pos: expect.any(Number),
  dueComplete: expect.any(Boolean),
};
