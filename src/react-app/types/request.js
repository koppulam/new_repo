// @flow

export type ByoSaveDesignRquestPayload = {
    Items: Object,
    siteId: number,
    designID: string,
    webCustomerId: string
};

export type ByoSaveDesignRequest = {
    url: string,
    method: string,
    payload: ByoSaveDesignRquestPayload
};

export type ByoSaveDesignUrlPayload = {
    designID: string,
    designName: string,
    siteId: number
}

export type ByoSaveDesignUrlRequest = {
    url: string,
    method: string,
    payload: ByoSaveDesignUrlPayload
}

export type AddToBagRequest = {
    url: string,
    method: string,
    payload: {
        assortmentID: number,
        quantity: number,
        designID: string,
        webCustomerId: string,
        siteId: number
    }
}
