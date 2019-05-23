// @flow

export type Fixture = {
    itemTypeID: string, // For save call
    mountTypes: Array<number>, // For browsegrid data
    defaultSku: string, // for save call
    friendlyUrl: string,
    imageURL: string, // for canvas
    isGroup: true,
    name: string,
    price: string,
    sku: string,
    title: string,
    formattedPrice: string,
    image: string,
    imageLarge: string,
    altText: string,
    url: string,
    selectedSku: string,
    itemMediaStitchPosition: boolean,
    size: string,
    fixturePositions: ?Array<Array<number>>,
    maxCharmsAllowed: number,
    isSilhouette: ?boolean,
    groupItems: Array<any>
}

export type Charm = {
    mountTypes: Array<string | number>,
    imageURL: string,
    transparentURL: string,
    claspURL: string,
    itemMedia: {
        itemMedia: Array<any>
    },
    name: string,
    price: string,
    sku: string,
    selectedSku: string,
    title: string,
    itemTypeID: string,
    groupName: string,
    groupItems: Array<any>,
    hasVariation: boolean,
    hasEngraving: boolean
}

export type ByoCanvasAction = {
    icon: string,
    alt: string
}

export type ByoCanvasActions = {
    startOver: ByoCanvasAction,
    wishList: ByoCanvasAction,
    dropaHint: ByoCanvasAction
}
