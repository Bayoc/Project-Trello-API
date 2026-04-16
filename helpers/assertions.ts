import { APIResponse, expect } from "@playwright/test";

export function assertStatusCode(
  response: APIResponse,
  statusCode: number,
): void {
  expect(response.status()).toBe(statusCode);
}

export async function assertName(
  response: APIResponse,
  bodyName: string,
): Promise<void> {
  const body = await response.json();
  expect(body).toHaveProperty("name");
  expect(body.name).toBe(bodyName);
}

export async function assertErrorText(
  response: APIResponse,
  expectedText: string,
): Promise<void> {
  const errorText = await response.text();
  expect(errorText).toContain(expectedText);
}

export async function assertHasProperty(
  response: APIResponse,
  property: string,
): Promise<void> {
  const body = await response.json();
  expect(body).toHaveProperty(property);
}
