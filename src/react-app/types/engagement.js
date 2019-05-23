// @flow

export type GroupSku = string;
export type Sku = string;

export type EngagementGroupCompleteResponse = {
    resultDto: {
        categoryBasedDimensions: any,
        customExperienceTypes: any,
        customModuleTypes: Array<any>,
        group: {
            friendlyURL: string,
            group: {
                sku: GroupSku,
                selectedSku: Sku
            },
        },
        groupItemMedia: Array<any>,
        itemCategories: Array<any>,
        itemMedia: any,
        itemMediaStitchPositions: Array<any>,
        itemServices: any,
        lineListedItems: Array<any>,
        isAvailableOnline: ?boolean,
        isInBag?: boolean,
        isInWishList?: boolean,
        shoppingBagItemID?: string,
        size?: string
    }
};

export type SelectedDiamond = {
    categoryBasedDimensions: any,
        customExperienceTypes: any,
        customModuleTypes: Array<any>,
        group: {
            group: {
                sku: GroupSku,
                selectedSku: Sku
            },
        },
        groupItemMedia: Array<any>,
        itemCategories: Array<any>,
        itemMedia: any,
        itemMediaStitchPositions: Array<any>,
        itemServices: any,
        lineListedItems: Array<any>,
        isAvailableOnline: ?boolean,
        images: Array<string>,
        size?: number | string,
        isInBag?: boolean,
        isInWishList?: boolean,
        shoppingBagItemID?: string
};
