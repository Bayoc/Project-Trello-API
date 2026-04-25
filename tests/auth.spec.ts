import { ENV } from "../playwright.config";
import { assertStatusCode } from "../helpers/assertions";
import { getMemberMe } from "../helpers/api/member-api";
import { test } from "../fixtures/board-fixtures";

test.describe("Authentication", () => {
  test.describe("Negative Scenarios", () => {
    test("GET Members without TOKEN - should return 400 Bad Request", async ({
      apiClient,
    }) => {
      const response = await getMemberMe(apiClient, {
        omitAuth: true,
        params: { key: ENV.api_key },
      });
      assertStatusCode(response, 400);
    });

    test("GET Members without KEY - should return 401 Unauthorized", async ({
      apiClient,
    }) => {
      const response = await getMemberMe(apiClient, {
        omitAuth: true,
        params: { token: ENV.token },
      });
      assertStatusCode(response, 401);
    });

    test("GET Members with invalid KEY - should return 401 Unauthorized", async ({
      apiClient,
    }) => {
      const response = await getMemberMe(apiClient, {
        omitAuth: true,
        params: { key: "invalidKey", token: ENV.token },
      });
      assertStatusCode(response, 401);
    });

    test("GET Members with invalid TOKEN - should return 401 Unauthorized", async ({
      apiClient,
    }) => {
      const response = await getMemberMe(apiClient, {
        omitAuth: true,
        params: { key: ENV.api_key, token: "invalidToken" },
      });
      assertStatusCode(response, 401);
    });
  });
});
