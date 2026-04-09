export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

const API_VERSION = `/1`;

export const ENDPOINTS = {
    BOARD: {
        BASE: `${API_VERSION}/boards`,
        BY_ID: (id: string) => `${API_VERSION}/boards/${id}`,
    },

    LIST: {
        BASE: `${API_VERSION}/lists`,
        BY_ID: (id: string) => `${API_VERSION}/lists/${id}`,
        ARCHIVE: (id: string) => `${API_VERSION}/lists/${id}/closed`,
    },

    CARD: {
        BASE: `${API_VERSION}/cards`,
        BY_ID: (id: string) => `${API_VERSION}/cards/${id}`,
    },


    MEMBER: {
        BY_ID: (id: string) => `${API_VERSION}/members/${id}`,
    },

    LABEL: {
        BASE: `${API_VERSION}/labels`,
        BY_ID: (id: string) => `${API_VERSION}/labels/${id}`,
    },

    CHECKLIST: {
        BASE: `${API_VERSION}/checklists`,
        BY_ID: (id: string) => `${API_VERSION}/checklists/${id}`,
    }
}

