import { test, expect, APIResponse } from '@playwright/test';
import { ENDPOINTS } from '../data/endpoints';
import { authParams } from '../helpers/auth-helpers';

test.describe('Security Headers', () => {

    let response: APIResponse;

    test.beforeAll(async ({ request }) => {
        response = await request.get(ENDPOINTS.MEMBER.ME, {
            params: authParams
        });
        expect(response.status()).toBe(200);
    });

    test('GET Members - Check header x-frame-options', async () => {

        expect(response.headers()['x-frame-options']).toBe('DENY');
    });

    test('GET Members - Check header access-control-allow-methods', async () => {
        expect(response.headers()['access-control-allow-methods']).toBe('GET, PUT, POST, DELETE');

    });

    test('GET Members - Check header access-control-allow-headers', async () => {
        expect(response.headers()['access-control-allow-headers']).toBe('Authorization, Accept, Content-Type');

    });

    test('GET Members - Check header x-content-type-options', async () => {
        expect(response.headers()['x-content-type-options']).toBe('nosniff');

    });

    test('GET Members - Check header strict-transport-security', async () => {
        expect(response.headers()['strict-transport-security']).toBe('max-age=63072000; preload');

    });
});

