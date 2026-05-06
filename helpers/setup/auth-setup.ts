import { ENV } from "../../playwright.config";

export const authParams = { key: ENV.api_key, token: ENV.token };

export const alternativeAuthParams = {
  key: ENV.alt_api_key,
  token: ENV.alt_token,
};
