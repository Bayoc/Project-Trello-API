import { expect } from "@playwright/test";

export const validListSchema = {
  id: expect.any(String),
  name: expect.any(String),
  closed: expect.any(Boolean),
  idBoard: expect.any(String),
  pos: expect.any(Number),
};
