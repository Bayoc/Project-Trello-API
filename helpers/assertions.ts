import { APIResponse, expect } from "@playwright/test";

export function assertStatusCode(
  response: APIResponse,
  statusCode: number,
): void {
  expect(response.status()).toBe(statusCode);
}

export function assertBoardName(
  body: Record<string, unknown>,
  bodyName: string,
): void {
  expect(body).toHaveProperty("name");
  expect(body["name"]).toBe(bodyName);
}

export async function assertErrorText(
  response: APIResponse,
  expectedText: string,
): Promise<void> {
  const errorText = await response.text();
  expect(errorText).toContain(expectedText);
}
