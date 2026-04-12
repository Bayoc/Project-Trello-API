import { test, expect } from '@playwright/test';
import { authParams } from '../../helpers/auth-helpers';
import { ENDPOINTS } from '../../data/endpoints';
import { createBoard, deleteBoard } from '../../helpers/board-helpers';


test.describe('PUT Board', () => {

    let boardID: string = '';

    test.beforeAll(async ({ request }) => {
        // create BOARD
        boardID = await createBoard(request);
    });
    test.afterAll(async ({ request }) => {
        // cleanup - delete board
        await deleteBoard(request, boardID);

    });

    test.describe('Positive Scenarios', () => {
        test('PUT Update Board Name - board name should be updated', async ({ request }) => {
            const response = await request.put(ENDPOINTS.BOARD.BY_ID(boardID), {
                params: { ...authParams, name: 'Updated Name' },
            })

            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(body.name).toBe('Updated Name');

        });
    });

    test.describe('Negative Scenarios', () => {
        test('PUT Update Board with invalid ID - should return 404 not found', async ({ request }) => {
            const response = await request.put(ENDPOINTS.BOARD.BY_ID('aaaaaaaaaaaaaaaaaaaaaaaa'), {
                params: authParams,
            })
            expect(response.status()).toBe(404);
        });
    });
});
