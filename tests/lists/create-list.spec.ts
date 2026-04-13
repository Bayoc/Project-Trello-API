import { test, expect } from '@playwright/test';
import { ENDPOINTS } from '../../data/endpoints';
import { authParams } from '../../helpers/auth-helpers';
import { deleteBoard, createBoard } from '../../helpers/board-helpers';
import { createListData } from '../../data/lists.data';

test.describe('POST - Create List', () => {

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
        test('POST - should create a new list', async ({ request }) => {
            const response = await request.post(ENDPOINTS.LIST.BASE, {
                params: authParams,
                data: {
                    name: createListData.name,
                    idBoard: boardID
                }
            })

            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(body).toHaveProperty('id');
            expect(body.name).toBe(createListData.name);

        });
    });

    test.describe('Negative Scenarios', () => {

    });
});