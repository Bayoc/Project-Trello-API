import { test, expect } from '@playwright/test';
import { ENV } from '../../playwright.config';
import { ENDPOINTS } from '../../data/endpoints';
import { createBoardData } from '../../data/board.data';


test.describe('DELETE Board', () => {
    let boardID: string = '';

    test.beforeEach(async ({ request }) => {
        // create BOARD
        const response = await request.post(ENDPOINTS.BOARD.BASE, {
            params: { key: ENV.api_key, token: ENV.token },
            data: createBoardData
        })
        const body = await response.json();
        boardID = body.id;
    });

    test.describe('Positive Scenarios', () => {


        test('DELETE Board - board should be deleted', async ({ request }) => {
            const response = await request.delete(ENDPOINTS.BOARD.BY_ID(boardID), {
                params: { key: ENV.api_key, token: ENV.token },
            });
            expect(response.status()).toBe(200);

            const deleteResponse = await request.get(ENDPOINTS.BOARD.BY_ID(boardID), {
                params: { key: ENV.api_key, token: ENV.token },
            });
            expect(deleteResponse.status()).toBe(404);
        });
    });

    test.describe('Negative Scenarios', () => {

        test.afterAll(async ({ request }) => {
            // cleanup - delete board
            const response = await request.delete(ENDPOINTS.BOARD.BY_ID(boardID), {
                params: { key: ENV.api_key, token: ENV.token },
            });
        });

        test('DELETE Board with invalid ID - should return 404 not found', async ({ request }) => {
            const response = await request.delete(ENDPOINTS.BOARD.BY_ID('aaaaaaaaaaaaaaaaaaaaaaaa'), {
                params: { key: ENV.api_key, token: ENV.token },
            })
            expect(response.status()).toBe(404);

            const deleteResponse = await request.get(ENDPOINTS.BOARD.BY_ID(boardID), {
                params: { key: ENV.api_key, token: ENV.token },
            });
            expect(deleteResponse.status()).toBe(200);

        });
    });
});
