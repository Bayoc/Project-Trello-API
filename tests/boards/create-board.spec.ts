import { test, expect } from '@playwright/test';
import { ENV } from '../../playwright.config';
import { ENDPOINTS } from '../../data/endpoints';
import { createBoardData } from '../../data/board.data';


test.describe('CREATE Board', () => {

    test.describe('Positive Scenarios', () => {
        let boardID: string = '';
        test.afterEach(async ({ request }) => {
            // cleanup - delete board
            const response = await request.delete(ENDPOINTS.BOARD.BY_ID(boardID), {
                params: { key: ENV.api_key, token: ENV.token },
            });
        });

        test('POST - should create a new board with valid data', async ({ request }) => {
            const response = await request.post(ENDPOINTS.BOARD.BASE, {
                params: { key: ENV.api_key, token: ENV.token },
                data: createBoardData
            })

            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(body).toHaveProperty('id');
            expect(body.name).toBe(createBoardData.name);

            boardID = body.id;
        });

        test('POST Create Board with characters limit in name - should return 200 and create board', async ({ request }) => {
            const longName = 'a'.repeat(16384);
            const response = await request.post(ENDPOINTS.BOARD.BASE, {
                params: { key: ENV.api_key, token: ENV.token },
                data: { name: longName }
            })

            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(body).toHaveProperty('id');
            expect(body.name).toBe(longName);

            boardID = body.id;
        });
    });

    test.describe('Negative Scenarios', () => {
        test('POST Create Board without data - should return 400 error when creating a board without a name', async ({ request }) => {
            const response = await request.post(ENDPOINTS.BOARD.BASE, {
                params: { key: ENV.api_key, token: ENV.token },
            })

            expect(response.status()).toBe(400);
            const body = await response.json();
            expect(body.message).toBe('invalid value for name');
        });

        test('POST Create Board with characters limit +1 in name - should return 400 error', async ({ request }) => {
            const response = await request.post(ENDPOINTS.BOARD.BASE, {
                params: { key: ENV.api_key, token: ENV.token },
                data: { name: 'a'.repeat(16385) }
            })

            expect(response.status()).toBe(400);
            const body = await response.json();
            expect(body.message).toBe('invalid value for name');
        });

    });
});