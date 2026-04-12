import { ENV } from '../playwright.config';

export const authParams = { key: ENV.api_key, token: ENV.token }