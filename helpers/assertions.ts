import { APIResponse, expect } from "@playwright/test";

export function assertStatusCode(
  response: APIResponse,
  statusCode: number,
): void {
  expect(response.status()).toBe(statusCode);
}

export function assertName(
  body: Record<string, unknown>,
  bodyName: string,
): void {
  expect(body).toHaveProperty("name");
  expect(body["name"]).toBe(bodyName);
}

export function assertID(
  body: Record<string, unknown>,
  expectedID: string,
): void {
  expect(body["id"]).toBe(expectedID);
}

export async function assertErrorText(
  response: APIResponse,
  expectedText: string,
): Promise<void> {
  const errorText = await response.text();
  expect(errorText).toContain(expectedText);
}

export function assertHasProperty(
  body: Record<string, unknown>,
  property: string,
): void {
  expect(body).toHaveProperty(property);
}

export function assertPositionIsGreaterThan(
  body: Record<string, unknown>,
  position: number,
): void {
  expect(body["pos"]).toBeGreaterThan(position);
}

export function assertPositionIsLessThan(
  body: Record<string, unknown>,
  position: number,
): void {
  expect(body["pos"]).toBeLessThan(position);
}
