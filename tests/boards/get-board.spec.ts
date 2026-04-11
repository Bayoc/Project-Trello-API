import { test, expect } from '@playwright/test';
import { ENV } from '../../playwright.config';
import { ENDPOINTS } from '../../data/endpoints';
import { createBoardData } from '../../data/board.data';


test.describe('GET Board', () => {

    let boardID: string = '';

    test.beforeAll(async ({ request }) => {
        // create BOARD
        const response = await request.post(ENDPOINTS.BOARD.BASE, {
            params: { key: ENV.api_key, token: ENV.token },
            data: createBoardData
        })
        const body = await response.json();
        boardID = body.id;
    });
    test.afterAll(async ({ request }) => {
        // cleanup - delete board
        const response = await request.delete(ENDPOINTS.BOARD.BY_ID(boardID), {
            params: { key: ENV.api_key, token: ENV.token },
        });
    });

    test.describe('Positive Scenarios', () => {
        test('GET Board with valid ID - should return 200 and board ID', async ({ request }) => {
            const response = await request.get(ENDPOINTS.BOARD.BY_ID(boardID), {
                params: { key: ENV.api_key, token: ENV.token },
            })

            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(body).toHaveProperty('id');
            expect(body.id).toBe(boardID);

            boardID = body.id;
        });
    });

    test.describe('Negative Scenarios', () => {
        test('GET Board with invalid ID - should return 404 not found', async ({ request }) => {
            const response = await request.get(ENDPOINTS.BOARD.BY_ID('aaaaaaaaaaaaaaaaaaaaaaaa'), {
                params: { key: ENV.api_key, token: ENV.token },
            })
            expect(response.status()).toBe(404);
        });
    });
});