import { test, expect } from '@playwright/test';
import { ENDPOINTS } from '../data/endpoints';
import { ENV } from '../playwright.config';


test.describe('Authentication', () => {

    test.describe('Negative Scenarios', () => {
        test('GET Members without TOKEN - should return 400 Bad Request', async ({ request }) => {
            const response = await request.get(ENDPOINTS.MEMBER.ME, {
                params: { key: ENV.api_key }
            });
            expect(response.status()).toBe(400);
        });

        test('GET Members without KEY - should return 401 Unauthorized', async ({ request }) => {
            const response = await request.get(ENDPOINTS.MEMBER.ME, {
                params: { token: ENV.token }
            });
            expect(response.status()).toBe(401);
        });

        test('GET Members with invalid KEY - should return 401 Unauthorized', async ({ request }) => {
            const response = await request.get(ENDPOINTS.MEMBER.ME, {
                params: { key: 'invalidKey', token: ENV.token }
            });
            expect(response.status()).toBe(401);
        });

        test('GET Members with invalid TOKEN - should return 401 Unauthorized', async ({ request }) => {
            const response = await request.get(ENDPOINTS.MEMBER.ME, {
                params: { key: ENV.api_key, token: 'invalidToken' }
            });
            expect(response.status()).toBe(401);
        });


    });
});
