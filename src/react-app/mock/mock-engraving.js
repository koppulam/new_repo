/**
 * @description Inits mock AEM data.
 * @returns {void}
 */
export default function initAemData() {
    if (IS_DEV) {
        const GLOBAL_ENGRAVING = {
            api: [
                {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev01/ProductsProcessApi/api/process/v1/products/group/complete',
                    samplePayload: {
                        selectedSku: '23984032', // Required
                        assortmentId: 101, // Required
                        priceMarketId: 1,
                        sku: 'GRP02588', // Required
                        isSalesServiceMode: true,
                        preferredStoreNumber: '2033390249312256',
                        siteId: 1 // Required
                    },
                    testRuns: [
                        {
                            payload: {},
                            response: {
                                errorGuid: '63b4687e-28be-425b-9e21-3403ab3eece1',
                                message: 'Bad Request',
                                validationErrors: {
                                    Sku: 'The Sku field is required.',
                                    AssortmentId: 'The AssortmentId field is required.',
                                    PriceMarketId: 'The PriceMarketId field is required.'
                                }
                            }
                        },
                        {
                            payload: {
                                selectedSku: '23984032',
                                assortmentId: 101,
                                priceMarketId: 1,
                                sku: 'GRP02588',
                                siteId: 1
                            },
                            response: {
                                resultDto: {
                                    group: {
                                        group: {
                                            sku: 'GRP02588',
                                            selectedSku: '23984032',
                                            siteId: 1,
                                            assortmentId: 101,
                                            additionalInfo: '',
                                            class: '61',
                                            companyId: 1,
                                            department: 115,
                                            discontinuedWithInventory: false,
                                            isGroup: true,
                                            lineListFormatTypeId: 1,
                                            longDescription: 'Inspired by the iconic key ring first introduced in 1969, the Return to Tiffany collection is a classic reinvented. An elegant bead bracelet and engraved tag combine to create a simple and timeless design.',
                                            isLowInventory: false,
                                            isPurchasable: true,
                                            isRemoveFromAssortment: false,
                                            shortDescription: 'Return to Tiffany® mini round tag in sterling silver on a bead bracelet.',
                                            isShowInEmployeeBrowse: true,
                                            isShowInEmployeeSearch: true,
                                            isShowInBrowse: true,
                                            isShowInSearch: true,
                                            showInBrowseAndSearchStartTime: '2009-01-17T14:59:58',
                                            title: 'Return to Tiffany®:Bead Bracelet',
                                            specifications: 'Sterling silver tag on a bead bracelet;Size medium, 7\' long;Beads, 4 mm',
                                            lineListLabel: 'ALSO AVAILABLE',
                                            isPartialShip: false,
                                            isSoldIr: false,
                                            taxabilityCode: ' ',
                                            style: '50306',
                                            mipsDescription: 'SS MN RTT RD 4MM BD BLTMD',
                                            posDescription: 'STERL MN RTT RD BEAD BRACELET MD',
                                            isShownonpurchasableitemprice: true,
                                            dateUpdated: '2018-02-12T17:06:49.107',
                                            urluniqueId: 'return-to-tiffany-bead-bracelet',
                                            canonicalCategoryId: 287458,
                                            canonicalCategoryUrlUniqueId: 'bracelets',
                                            canonicalCategoryName: 'Bracelets',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry',
                                            canonicalMasterCategoryName: 'Jewelry',
                                            groupCustomTypeName: 'Unknown',
                                            titleSplit: [
                                                'Return to Tiffany®',
                                                'Bead Bracelet'
                                            ],
                                            isBYOEnabled: false,
                                            isPriceAvailable: true,
                                            price: 150,
                                            hidePurchaseWithLowInventoryItem: true,
                                            showNonPurchasableItemPrice: false,
                                            groupCustomType: 0,
                                            formattedPrice: '$150.00',
                                            measuringYourWristLinkVisible: false,
                                            isRingSizeVisible: false,
                                            isRingSizeChartVisible: false,
                                            isRingSizeGuideVisible: false,
                                            styleDescription: 'SS MN RTT RD 4MM BEAD BLT',
                                            classDescription: 'SS BRACELETS',
                                            departmentDescription: 'SILVER JEWELRY',
                                            isNew: false,
                                            isServiceable: true,
                                            isFIISEnabled: true,
                                            isSpinsetAvailable: false,
                                            shippingType: 2,
                                            maxQuantityLimit: 5,
                                            isBOPS: true
                                        },
                                        groupAttributes: {
                                            sku: 'GRP02588',
                                            siteId: 1,
                                            assortmentId: 101,
                                            groupTypeID: 1,
                                            groupDropDownLabel: 'Bracelet length',
                                            useGroupDefaultItemAdditionalInfo: true,
                                            useGroupDefaultItemLongDescription: true,
                                            useGroupDefaultItemMedia: true,
                                            useGroupDefaultItemShortDescription: true,
                                            useGroupDefaultItemTitle: true,
                                            useGroupDefaultItemSpecifications: true,
                                            dateLastModified: '2018-02-21T22:32:31.627',
                                            groupDefaultItemSku: '23984032',
                                            groupCustomTypeId: 0,
                                            groupDefaultSkuInRetailMode: '23984032 ',
                                            useDefaultItemCustomMedia: false,
                                            existLowInventoryItem: false,
                                            hidePurchasewithLowInventoryItem: true,
                                            isColorSwatch: false
                                        },
                                        groupItems: [
                                            {
                                                groupSku: 'GRP02588',
                                                memberSku: '23984032',
                                                linkText: '7 IN',
                                                removeFromAssortment: false,
                                                displayOrder: 2,
                                                department: 115,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP02588/return-to-tiffany-bead-bracelet-23984032',
                                                canonicalURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP02588/return-to-tiffany-bead-bracelet-23984032',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '23984032',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '23984032_934151_ED',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2017-08-11T03:02:09.607',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        },
                                                        {
                                                            sku: '23984032',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '23984032_934749_SV_1_M',
                                                            mediaTypeID: 1098,
                                                            mediaTypeName: 'SkuSeeitOnView',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2017-08-11T03:02:09.607',
                                                            mediaType: 1098,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                groupSku: 'GRP02588',
                                                memberSku: '24712567',
                                                linkText: '7.5 IN',
                                                removeFromAssortment: false,
                                                displayOrder: 3,
                                                department: 115,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP02588/return-to-tiffany-bead-bracelet-24712567',
                                                canonicalURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP02588/return-to-tiffany-bead-bracelet-24712567',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '24712567',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '23984032_931888_ED_M',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2017-12-21T09:32:05.343',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        },
                                                        {
                                                            sku: '24712567',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '23984032_934749_SV_1_M',
                                                            mediaTypeID: 1098,
                                                            mediaTypeName: 'SkuSeeitOnView',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2017-12-21T09:32:05.343',
                                                            mediaType: 1098,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                groupSku: 'GRP02588',
                                                memberSku: '27631878',
                                                linkText: '6.5 IN',
                                                removeFromAssortment: false,
                                                displayOrder: 1,
                                                department: 115,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP02588/return-to-tiffany-bead-bracelet-27631878',
                                                canonicalURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP02588/return-to-tiffany-bead-bracelet-27631878',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '27631878',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '23984032_931888_ED_M',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2017-08-11T12:32:08.2',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        },
                                                        {
                                                            sku: '27631878',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '23984032_934749_SV_1_M',
                                                            mediaTypeID: 1098,
                                                            mediaTypeName: 'SkuSeeitOnView',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2017-08-11T12:32:08.2',
                                                            mediaType: 1098,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            }
                                        ],
                                        friendlyURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP02588',
                                        canonicalURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP02588',
                                        searchAttributes: [
                                            {
                                                searchAttributeId: 323338,
                                                searchAttributeName: 'Sterling Silver',
                                                displayOrder: 1,
                                                urluniqueId: 'sterling-silver',
                                                endecaDvalId: '101323338',
                                                endecaDimensionId: 5,
                                                endecaDimensionName: 'Materials'
                                            },
                                            {
                                                searchAttributeId: 3625968,
                                                searchAttributeName: 'No Gemstone',
                                                displayOrder: 11,
                                                urluniqueId: 'no-gemstone',
                                                endecaDvalId: '1013625968',
                                                endecaDimensionId: 6,
                                                endecaDimensionName: 'Gemstones'
                                            }
                                        ],
                                        isSpinsetAvailable: true,
                                        siteId: 1
                                    },
                                    groupPrice: {
                                        sku: 'GRP02588',
                                        priceMarketId: 1,
                                        price: 150,
                                        siteId: 1
                                    },
                                    groupItemMedia: [],
                                    lineListedItems: [],
                                    itemRuleResult: {
                                        errorMessageType: 0,
                                        showAddToShoppingBag: true,
                                        showSaveForLater: true,
                                        showPrice: true,
                                        showSupplementalLinks: true,
                                        showType1Dropdown: true,
                                        showNotPurchasableLink: false,
                                        showEmailThisItem: false,
                                        showEmailWhenAvailable: false,
                                        isEligibleForBYO: false,
                                        isBOPSEnabled: true,
                                        showFIISLink: true
                                    },
                                    itemMedia: {
                                        imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                        noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                        imagePreset: 'EcomItemL',
                                        noImagePreset: 'EcomItemL2',
                                        pkbAppSavedItemPreset: 'EcomBrowseL',
                                        imagePrefix: 'return-to-tiffanybead-bracelet',
                                        colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                        itemMedia: [
                                            {
                                                sku: '23984032',
                                                assortmentId: 101,
                                                displayOrder: 1,
                                                mediaFileName: '23984032_934151_ED',
                                                mediaTypeID: 1092,
                                                mediaTypeName: 'SkuStraightOn',
                                                removeFromAssortment: false,
                                                isIntranet: false,
                                                isVisible: true,
                                                dateLastModified: '2017-08-11T03:02:09.607',
                                                mediaType: 1092,
                                                siteId: 1
                                            },
                                            {
                                                sku: '23984032',
                                                assortmentId: 101,
                                                displayOrder: 1,
                                                mediaFileName: '23984032_934749_SV_1_M',
                                                mediaTypeID: 1098,
                                                mediaTypeName: 'SkuSeeitOnView',
                                                removeFromAssortment: false,
                                                isIntranet: false,
                                                isVisible: true,
                                                dateLastModified: '2017-08-11T03:02:09.607',
                                                mediaType: 1098,
                                                siteId: 1
                                            }
                                        ],
                                        mediaCropping: [
                                            {
                                                sku: '23984032 ',
                                                mediaTypeId: 1092,
                                                left: 0.1,
                                                top: 0.1,
                                                scale: 0.8,
                                                dateLastModified: '2018-05-15T13:45:48.043'
                                            }
                                        ],
                                        mediaPreset: [
                                            {
                                                sku: '23984032 ',
                                                mediaPresetTypeName: 'EcomBrowseM',
                                                scene7PresentName: 'EcomBrowseM',
                                                mediaPresettypeId: 1,
                                                unSharpMaskAmount: 1,
                                                unSharpMaskRadius: 1,
                                                unSharpMaskThreshold: 6,
                                                dateLastModified: '2018-05-15T13:45:48.043'
                                            }
                                        ]
                                    },
                                    customExperienceTypes: [],
                                    customModuleTypes: [],
                                    customMountType: [],
                                    itemMediaStitchPositions: [],
                                    itemServices: {
                                        itemServicingOptions: [
                                            {
                                                itemServiceTypeId: 1,
                                                unitPrice: 25,
                                                servicingQuantity: 1
                                            },
                                            {
                                                itemServiceTypeId: 11,
                                                unitPrice: 25,
                                                servicingQuantity: 1
                                            },
                                            {
                                                itemServiceTypeId: 15,
                                                unitPrice: 45,
                                                servicingQuantity: 1
                                            },
                                            {
                                                itemServiceTypeId: 150,
                                                unitPrice: 60,
                                                servicingQuantity: 1
                                            }
                                        ]
                                    },
                                    categoryBasedDimensions: [
                                        {
                                            categoryId: 287458,
                                            endecaDvalId: '101287458',
                                            categoryName: 'Bracelets',
                                            endecaDimensionId: 1,
                                            endecaDimensionName: 'Categories',
                                            superCategoryId: '1013633780',
                                            superCategoryUrlUniqueId: 'jewelry',
                                            superCategoryName: 'Jewelry',
                                            displayOrder: 297,
                                            urlUniqueId: 'bracelets'
                                        },
                                        {
                                            categoryId: 288196,
                                            endecaDvalId: '101288196',
                                            categoryName: 'Return to Tiffany®',
                                            endecaDimensionId: 2,
                                            endecaDimensionName: 'Designers & Collections',
                                            superCategoryId: '101424454',
                                            displayOrder: 276,
                                            urlUniqueId: 'rtt'
                                        },
                                        {
                                            categoryId: 554142,
                                            endecaDvalId: '101554142',
                                            categoryName: 'Tiffany Beads',
                                            endecaDimensionId: 2,
                                            endecaDimensionName: 'Designers & Collections',
                                            superCategoryId: '101424454',
                                            displayOrder: 25,
                                            urlUniqueId: 'tiffany-beads'
                                        }
                                    ],
                                    itemCategories: [
                                        {
                                            categoryId: 287458,
                                            endecaDvalId: '101287458',
                                            categoryName: 'Bracelets',
                                            urlUniqueId: 'bracelets',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 288196,
                                            endecaDvalId: '101288196',
                                            categoryName: 'Return to Tiffany®',
                                            urlUniqueId: 'rtt',
                                            canonicalMasterCategoryId: 148206,
                                            canonicalMasterCategoryUrlUniqueId: 'collections'
                                        },
                                        {
                                            categoryId: 298241,
                                            endecaDvalId: '101298241',
                                            categoryName: 'Wall Street',
                                            urlUniqueId: 'wall-street',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 479592,
                                            endecaDvalId: '101479592',
                                            categoryName: 'Fifth Avenue In-Store Pickup',
                                            urlUniqueId: 'fifth-avenue-in-store-pickup',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 479593,
                                            endecaDvalId: '101479593',
                                            categoryName: 'New York City In-Store Pickup',
                                            urlUniqueId: 'wall-street-or-fifth-avenue',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 554142,
                                            endecaDvalId: '101554142',
                                            categoryName: 'Tiffany Beads',
                                            urlUniqueId: 'tiffany-beads',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 563629,
                                            endecaDvalId: '101563629',
                                            categoryName: 'Gifts $500 & Under',
                                            urlUniqueId: 'gifts-500-under',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        },
                                        {
                                            categoryId: 563630,
                                            endecaDvalId: '101563630',
                                            categoryName: 'Gifts $250 & Under',
                                            urlUniqueId: 'gifts-250-under',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        },
                                        {
                                            categoryId: 563632,
                                            endecaDvalId: '101563632',
                                            categoryName: 'Jewelry $250 & Under',
                                            urlUniqueId: 'jewelry-250-under',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 578712,
                                            endecaDvalId: '101578712',
                                            categoryName: 'Jewelry $1,500 & Under',
                                            urlUniqueId: 'jewelry-1500-under',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 731769,
                                            endecaDvalId: '101731769',
                                            categoryName: 'Gifts $1,500 & Under',
                                            urlUniqueId: 'gifts-1500-under',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        },
                                        {
                                            categoryId: 1639183,
                                            endecaDvalId: '1011639183',
                                            categoryName: 'Soho in-store pick up',
                                            urlUniqueId: 'soho-in-store-pick-up',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 3366777,
                                            endecaDvalId: '1013366777',
                                            categoryName: 'Jewelry $500 & Under',
                                            urlUniqueId: 'jewelry-500-under',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 3679493,
                                            endecaDvalId: '1013679493',
                                            categoryName: 'EBG',
                                            urlUniqueId: 'ebg',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 3782074,
                                            endecaDvalId: '1013782074',
                                            categoryName: 'Price Is No Object',
                                            urlUniqueId: 'price-is-no-object-gifts',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            payload: {
                                selectedSku: '61941797',
                                assortmentId: 101,
                                priceMarketId: 1,
                                sku: 'GRP10189',
                                isSalesServiceMode: false,
                                siteId: 1
                            },
                            response: {
                                resultDto: {
                                    group: {
                                        group: {
                                            sku: 'GRP10189',
                                            selectedSku: '61941797',
                                            siteId: 1,
                                            assortmentId: 101,
                                            additionalInfo: '',
                                            class: '64',
                                            companyId: 1,
                                            department: 115,
                                            discontinuedWithInventory: false,
                                            isGroup: true,
                                            lineListFormatTypeId: 1,
                                            longDescription: 'Inspired by the iconic key ring first introduced in 1969, the Return to Tiffany collection is a classic reinvented. A red heart charm adds a pop of color to this timeless bead bracelet. ',
                                            isLowInventory: false,
                                            isPurchasable: true,
                                            isRemoveFromAssortment: false,
                                            shortDescription: 'Return to Tiffany® bead bracelet in silver with red enamel finish, medium.',
                                            isShowInEmployeeBrowse: true,
                                            isShowInEmployeeSearch: true,
                                            isShowInBrowse: true,
                                            isShowInSearch: true,
                                            showInBrowseAndSearchStartTime: '2017-12-15T14:03:06',
                                            title: 'Return to Tiffany®:Bead Bracelet',
                                            specifications: 'Sterling silver with red enamel finish;Beads, 4 mm;Size medium',
                                            lineListLabel: 'ALSO AVAILABLE',
                                            isPartialShip: false,
                                            isSoldIr: false,
                                            taxabilityCode: ' ',
                                            style: '28521',
                                            mipsDescription: 'SS RD RTTMNHRT 4MMBDBLTMD',
                                            posDescription: 'STERL RED RTT MNHRT 4MM BEAD BRACELET MD',
                                            isShownonpurchasableitemprice: true,
                                            dateUpdated: '2018-01-06T19:05:50.52',
                                            urluniqueId: 'return-to-tiffany-bead-bracelet',
                                            canonicalCategoryId: 287458,
                                            canonicalCategoryUrlUniqueId: 'bracelets',
                                            canonicalCategoryName: 'Bracelets',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry',
                                            canonicalMasterCategoryName: 'Jewelry',
                                            groupCustomTypeName: 'Unknown',
                                            titleSplit: [
                                                'Return to Tiffany®',
                                                'Bead Bracelet'
                                            ],
                                            isBYOEnabled: false,
                                            isPriceAvailable: true,
                                            price: 150,
                                            hidePurchaseWithLowInventoryItem: true,
                                            showNonPurchasableItemPrice: false,
                                            groupCustomType: 0,
                                            formattedPrice: '$150.00',
                                            measuringYourWristLinkVisible: false,
                                            isRingSizeVisible: false,
                                            isRingSizeChartVisible: false,
                                            isRingSizeGuideVisible: false,
                                            styleDescription: 'SS RD RTTMNHRT 4MMBDBLT',
                                            classDescription: 'SS ENAMEL BRACELETS',
                                            departmentDescription: 'SILVER JEWELRY',
                                            isNew: true,
                                            isServiceable: false,
                                            isFIISEnabled: true,
                                            isSpinsetAvailable: false,
                                            shippingType: 1,
                                            maxQuantityLimit: 5,
                                            isBOPS: true
                                        },
                                        groupAttributes: {
                                            sku: 'GRP10189',
                                            siteId: 1,
                                            assortmentId: 101,
                                            groupTypeID: 1,
                                            groupDropDownLabel: 'Size',
                                            useGroupDefaultItemAdditionalInfo: true,
                                            useGroupDefaultItemLongDescription: true,
                                            useGroupDefaultItemMedia: true,
                                            useGroupDefaultItemShortDescription: true,
                                            useGroupDefaultItemTitle: true,
                                            useGroupDefaultItemSpecifications: true,
                                            dateLastModified: '2018-02-21T23:02:33.427',
                                            groupDefaultItemSku: '61941797',
                                            groupCustomTypeId: 0,
                                            groupDefaultSkuInRetailMode: '61941797 ',
                                            useDefaultItemCustomMedia: false,
                                            existLowInventoryItem: false,
                                            hidePurchasewithLowInventoryItem: true,
                                            isColorSwatch: false
                                        },
                                        groupItems: [
                                            {
                                                groupSku: 'GRP10189',
                                                memberSku: '61941770',
                                                linkText: 'Small',
                                                removeFromAssortment: false,
                                                displayOrder: 1,
                                                department: 115,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP10189/return-to-tiffany-bead-bracelet-61941770',
                                                canonicalURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP10189/return-to-tiffany-bead-bracelet-61941770',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '61941770',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '61941770_977440_ED_M',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-01-23T18:46:01.03',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        },
                                                        {
                                                            sku: '61941770',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '61941770_977441_AV_1_M',
                                                            mediaTypeID: 1093,
                                                            mediaTypeName: 'SkuAlternateView',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-01-23T18:46:01.03',
                                                            mediaType: 1093,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                groupSku: 'GRP10189',
                                                memberSku: '61941797',
                                                linkText: 'Medium',
                                                removeFromAssortment: false,
                                                displayOrder: 2,
                                                department: 115,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP10189/return-to-tiffany-bead-bracelet-61941797',
                                                canonicalURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP10189/return-to-tiffany-bead-bracelet-61941797',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '61941797',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '61941770_977440_ED_M',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-01-17T15:51:51.39',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        },
                                                        {
                                                            sku: '61941797',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '61941770_977441_AV_1_M',
                                                            mediaTypeID: 1093,
                                                            mediaTypeName: 'SkuAlternateView',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-01-17T15:51:51.39',
                                                            mediaType: 1093,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                groupSku: 'GRP10189',
                                                memberSku: '61941819',
                                                linkText: 'Large',
                                                removeFromAssortment: false,
                                                displayOrder: 3,
                                                department: 115,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP10189/return-to-tiffany-bead-bracelet-61941819',
                                                canonicalURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP10189/return-to-tiffany-bead-bracelet-61941819',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '61941819',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '61941770_977440_ED_M',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-01-23T18:46:01.027',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        },
                                                        {
                                                            sku: '61941819',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '61941770_977441_AV_1_M',
                                                            mediaTypeID: 1093,
                                                            mediaTypeName: 'SkuAlternateView',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-01-23T18:46:01.027',
                                                            mediaType: 1093,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            }
                                        ],
                                        friendlyURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP10189',
                                        canonicalURL: '/jewelry/bracelets/return-to-tiffany-bead-bracelet-GRP10189',
                                        searchAttributes: [
                                            {
                                                searchAttributeId: 323338,
                                                searchAttributeName: 'Sterling Silver',
                                                displayOrder: 1,
                                                urluniqueId: 'sterling-silver',
                                                endecaDvalId: '101323338',
                                                endecaDimensionId: 5,
                                                endecaDimensionName: 'Materials'
                                            },
                                            {
                                                searchAttributeId: 3625968,
                                                searchAttributeName: 'No Gemstone',
                                                displayOrder: 11,
                                                urluniqueId: 'no-gemstone',
                                                endecaDvalId: '1013625968',
                                                endecaDimensionId: 6,
                                                endecaDimensionName: 'Gemstones'
                                            }
                                        ],
                                        isSpinsetAvailable: false,
                                        siteId: 1
                                    },
                                    groupPrice: {
                                        sku: 'GRP10189 ',
                                        priceMarketId: 1,
                                        price: 150,
                                        siteId: 1
                                    },
                                    groupItemMedia: [],
                                    lineListedItems: [],
                                    itemRuleResult: {
                                        errorMessageType: 0,
                                        showAddToShoppingBag: true,
                                        showSaveForLater: true,
                                        showPrice: true,
                                        showSupplementalLinks: true,
                                        showType1Dropdown: true,
                                        showNotPurchasableLink: false,
                                        showEmailThisItem: false,
                                        showEmailWhenAvailable: false,
                                        isEligibleForBYO: false,
                                        isBOPSEnabled: true,
                                        showFIISLink: true
                                    },
                                    itemMedia: {
                                        imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                        noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                        imagePreset: 'EcomItemL',
                                        noImagePreset: 'EcomItemL2',
                                        pkbAppSavedItemPreset: 'EcomBrowseL',
                                        imagePrefix: 'return-to-tiffanybead-bracelet',
                                        colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                        itemMedia: [
                                            {
                                                sku: '61941797',
                                                assortmentId: 101,
                                                displayOrder: 1,
                                                mediaFileName: '61941770_977440_ED_M',
                                                mediaTypeID: 1092,
                                                mediaTypeName: 'SkuStraightOn',
                                                removeFromAssortment: false,
                                                isIntranet: false,
                                                isVisible: true,
                                                dateLastModified: '2018-01-17T15:51:51.39',
                                                mediaType: 1092,
                                                siteId: 1
                                            },
                                            {
                                                sku: '61941797',
                                                assortmentId: 101,
                                                displayOrder: 1,
                                                mediaFileName: '61941770_977441_AV_1_M',
                                                mediaTypeID: 1093,
                                                mediaTypeName: 'SkuAlternateView',
                                                removeFromAssortment: false,
                                                isIntranet: false,
                                                isVisible: true,
                                                dateLastModified: '2018-01-17T15:51:51.39',
                                                mediaType: 1093,
                                                siteId: 1
                                            }
                                        ],
                                        mediaCropping: [
                                            {
                                                sku: '61941797 ',
                                                mediaTypeId: 1092,
                                                left: 0.1,
                                                top: 0.1,
                                                scale: 0.8,
                                                dateLastModified: '2018-02-21T23:04:43.853'
                                            }
                                        ],
                                        mediaPreset: [
                                            {
                                                sku: '61941797 ',
                                                mediaPresetTypeName: 'EcomBrowseM',
                                                scene7PresentName: 'EcomBrowseM',
                                                mediaPresettypeId: 1,
                                                unSharpMaskAmount: 1,
                                                unSharpMaskRadius: 1,
                                                unSharpMaskThreshold: 6,
                                                dateLastModified: '2018-02-21T23:04:43.853'
                                            }
                                        ]
                                    },
                                    customExperienceTypes: [],
                                    customModuleTypes: [],
                                    customMountType: [],
                                    itemMediaStitchPositions: [],
                                    itemServices: {},
                                    categoryBasedDimensions: [
                                        {
                                            categoryId: 287458,
                                            endecaDvalId: '101287458',
                                            categoryName: 'Bracelets',
                                            endecaDimensionId: 1,
                                            endecaDimensionName: 'Categories',
                                            superCategoryId: '1013633780',
                                            superCategoryUrlUniqueId: 'jewelry',
                                            superCategoryName: 'Jewelry',
                                            displayOrder: 95,
                                            urlUniqueId: 'bracelets'
                                        },
                                        {
                                            categoryId: 288196,
                                            endecaDvalId: '101288196',
                                            categoryName: 'Return to Tiffany®',
                                            endecaDimensionId: 2,
                                            endecaDimensionName: 'Designers & Collections',
                                            superCategoryId: '101424454',
                                            displayOrder: 29,
                                            urlUniqueId: 'rtt'
                                        }
                                    ],
                                    itemCategories: [
                                        {
                                            categoryId: 287458,
                                            endecaDvalId: '101287458',
                                            categoryName: 'Bracelets',
                                            urlUniqueId: 'bracelets',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 288196,
                                            endecaDvalId: '101288196',
                                            categoryName: 'Return to Tiffany®',
                                            urlUniqueId: 'rtt',
                                            canonicalMasterCategoryId: 148206,
                                            canonicalMasterCategoryUrlUniqueId: 'collections'
                                        },
                                        {
                                            categoryId: 298241,
                                            endecaDvalId: '101298241',
                                            categoryName: 'Wall Street',
                                            urlUniqueId: 'wall-street',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 479592,
                                            endecaDvalId: '101479592',
                                            categoryName: 'Fifth Avenue In-Store Pickup',
                                            urlUniqueId: 'fifth-avenue-in-store-pickup',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 479593,
                                            endecaDvalId: '101479593',
                                            categoryName: 'New York City In-Store Pickup',
                                            urlUniqueId: 'wall-street-or-fifth-avenue',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 563630,
                                            endecaDvalId: '101563630',
                                            categoryName: 'Gifts $250 & Under',
                                            urlUniqueId: 'gifts-250-under',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        },
                                        {
                                            categoryId: 563632,
                                            endecaDvalId: '101563632',
                                            categoryName: 'Jewelry $250 & Under',
                                            urlUniqueId: 'jewelry-250-under',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 622067,
                                            endecaDvalId: '101622067',
                                            categoryName: 'New Jewelry',
                                            urlUniqueId: 'new-jewelry',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 1639183,
                                            endecaDvalId: '1011639183',
                                            categoryName: 'Soho in-store pick up',
                                            urlUniqueId: 'soho-in-store-pick-up',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            payload: {
                                selectedSku: '29633444',
                                assortmentId: 101,
                                priceMarketId: 1,
                                sku: 'GRP06398',
                                SiteId: 1
                            },
                            response: {
                                resultDto: {
                                    group: {
                                        group: {
                                            sku: 'GRP06398',
                                            selectedSku: '29633444',
                                            siteId: 1,
                                            assortmentId: 101,
                                            additionalInfo: '<br>',
                                            class: '61',
                                            companyId: 1,
                                            department: 115,
                                            discontinuedWithInventory: false,
                                            isGroup: true,
                                            lineListFormatTypeId: 1,
                                            longDescription: 'Inspired by the iconic key ring first introduced in 1969, the Return to Tiffany collection is a classic reinvented. A delicate double chain is paired with an elegant engraved tag, creating a captivating and sophisticated design.',
                                            isLowInventory: false,
                                            isPurchasable: true,
                                            isRemoveFromAssortment: false,
                                            shortDescription: 'Return to Tiffany® heart tag bracelet in sterling silver, medium.',
                                            isShowInEmployeeBrowse: true,
                                            isShowInEmployeeSearch: true,
                                            isShowInBrowse: true,
                                            isShowInSearch: true,
                                            showInBrowseAndSearchStartTime: '2012-12-04T14:08:22',
                                            title: 'Return to Tiffany®:Heart Tag Bracelet',
                                            specifications: 'Sterling silver;Size medium, 6.5\' long',
                                            lineListLabel: 'ALSO AVAILABLE',
                                            isPartialShip: false,
                                            isSoldIr: false,
                                            taxabilityCode: ' ',
                                            style: '65492',
                                            mipsDescription: 'SS SM RTT HRT BLT MD',
                                            posDescription: 'STERL MD SM RTT HEART BRACELET',
                                            isShownonpurchasableitemprice: true,
                                            dateUpdated: '2018-02-15T15:06:30.997',
                                            urluniqueId: 'return-to-tiffany-heart-tag-bracelet',
                                            canonicalCategoryId: 287458,
                                            canonicalCategoryUrlUniqueId: 'bracelets',
                                            canonicalCategoryName: 'Bracelets',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry',
                                            canonicalMasterCategoryName: 'Jewelry',
                                            groupCustomTypeName: 'Unknown',
                                            titleSplit: [
                                                'Return to Tiffany®',
                                                'Heart Tag Bracelet'
                                            ],
                                            isBYOEnabled: false,
                                            isPriceAvailable: true,
                                            price: 150,
                                            hidePurchaseWithLowInventoryItem: true,
                                            showNonPurchasableItemPrice: false,
                                            groupCustomType: 0,
                                            formattedPrice: '$150.00',
                                            measuringYourWristLinkVisible: false,
                                            isRingSizeVisible: false,
                                            isRingSizeChartVisible: false,
                                            isRingSizeGuideVisible: false,
                                            styleDescription: 'SS SM RTT HRT BRACELET',
                                            classDescription: 'SS BRACELETS',
                                            departmentDescription: 'SILVER JEWELRY',
                                            isNew: false,
                                            isServiceable: true,
                                            isFIISEnabled: false,
                                            isSpinsetAvailable: false,
                                            shippingType: 2,
                                            maxQuantityLimit: 5,
                                            isBOPS: false
                                        },
                                        groupAttributes: {
                                            sku: 'GRP06398',
                                            siteId: 1,
                                            assortmentId: 101,
                                            groupTypeID: 1,
                                            groupDropDownLabel: 'Size',
                                            useGroupDefaultItemAdditionalInfo: true,
                                            useGroupDefaultItemLongDescription: true,
                                            useGroupDefaultItemMedia: true,
                                            useGroupDefaultItemShortDescription: true,
                                            useGroupDefaultItemTitle: true,
                                            useGroupDefaultItemSpecifications: true,
                                            dateLastModified: '2018-02-21T23:02:33.427',
                                            groupDefaultItemSku: '29633444',
                                            groupCustomTypeId: 0,
                                            groupDefaultSkuInRetailMode: '29633444 ',
                                            useDefaultItemCustomMedia: false,
                                            existLowInventoryItem: false,
                                            hidePurchasewithLowInventoryItem: true,
                                            isColorSwatch: false
                                        },
                                        groupItems: [
                                            {
                                                groupSku: 'GRP06398',
                                                memberSku: '29633444',
                                                linkText: 'medium',
                                                removeFromAssortment: false,
                                                displayOrder: 2,
                                                department: 115,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/return-to-tiffany-heart-tag-bracelet-GRP06398/return-to-tiffany-heart-tag-bracelet-29633444',
                                                canonicalURL: '/jewelry/bracelets/return-to-tiffany-heart-tag-bracelet-GRP06398/return-to-tiffany-heart-tag-bracelet-29633444',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '29633444',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '29633444_921706_ED_M',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-02-13T16:38:18.517',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        },
                                                        {
                                                            sku: '29633444',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '29633444_935112_SV_1_M',
                                                            mediaTypeID: 1098,
                                                            mediaTypeName: 'SkuSeeitOnView',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-02-13T16:38:18.517',
                                                            mediaType: 1098,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                groupSku: 'GRP06398',
                                                memberSku: '29668086',
                                                linkText: 'small',
                                                removeFromAssortment: false,
                                                displayOrder: 1,
                                                department: 115,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/return-to-tiffany-heart-tag-bracelet-GRP06398/return-to-tiffany-heart-tag-bracelet-29668086',
                                                canonicalURL: '/jewelry/bracelets/return-to-tiffany-heart-tag-bracelet-GRP06398/return-to-tiffany-heart-tag-bracelet-29668086',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '29668086',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '29633444_921706_ED_M',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-02-13T16:38:18.19',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        },
                                                        {
                                                            sku: '29668086',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '29633444_935112_SV_1_M',
                                                            mediaTypeID: 1098,
                                                            mediaTypeName: 'SkuSeeitOnView',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-02-13T16:38:18.19',
                                                            mediaType: 1098,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                groupSku: 'GRP06398',
                                                memberSku: '29668094',
                                                linkText: 'large',
                                                removeFromAssortment: false,
                                                displayOrder: 3,
                                                department: 115,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/return-to-tiffany-heart-tag-bracelet-GRP06398/return-to-tiffany-heart-tag-bracelet-29668094',
                                                canonicalURL: '/jewelry/bracelets/return-to-tiffany-heart-tag-bracelet-GRP06398/return-to-tiffany-heart-tag-bracelet-29668094',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '29668094',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '29633444_921706_ED_M',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-02-13T16:38:18.397',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        },
                                                        {
                                                            sku: '29668094',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '29633444_935112_SV_1_M',
                                                            mediaTypeID: 1098,
                                                            mediaTypeName: 'SkuSeeitOnView',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-02-13T16:38:18.397',
                                                            mediaType: 1098,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            }
                                        ],
                                        friendlyURL: '/jewelry/bracelets/return-to-tiffany-heart-tag-bracelet-GRP06398',
                                        canonicalURL: '/jewelry/bracelets/return-to-tiffany-heart-tag-bracelet-GRP06398',
                                        searchAttributes: [
                                            {
                                                searchAttributeId: 323338,
                                                searchAttributeName: 'Sterling Silver',
                                                displayOrder: 1,
                                                urluniqueId: 'sterling-silver',
                                                endecaDvalId: '101323338',
                                                endecaDimensionId: 5,
                                                endecaDimensionName: 'Materials'
                                            },
                                            {
                                                searchAttributeId: 3625968,
                                                searchAttributeName: 'No Gemstone',
                                                displayOrder: 11,
                                                urluniqueId: 'no-gemstone',
                                                endecaDvalId: '1013625968',
                                                endecaDimensionId: 6,
                                                endecaDimensionName: 'Gemstones'
                                            }
                                        ],
                                        isSpinsetAvailable: false,
                                        siteId: 1
                                    },
                                    groupPrice: {
                                        sku: 'GRP06398 ',
                                        priceMarketId: 1,
                                        price: 150,
                                        siteId: 1
                                    },
                                    groupItemMedia: [],
                                    lineListedItems: [],
                                    itemRuleResult: {
                                        errorMessageType: 0,
                                        showAddToShoppingBag: true,
                                        showSaveForLater: true,
                                        showPrice: true,
                                        showSupplementalLinks: true,
                                        showType1Dropdown: true,
                                        showNotPurchasableLink: false,
                                        showEmailThisItem: false,
                                        showEmailWhenAvailable: false,
                                        isEligibleForBYO: false,
                                        isBOPSEnabled: false,
                                        showFIISLink: false
                                    },
                                    itemMedia: {
                                        imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                        noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                        imagePreset: 'EcomItemL',
                                        noImagePreset: 'EcomItemL2',
                                        pkbAppSavedItemPreset: 'EcomBrowseL',
                                        imagePrefix: 'return-to-tiffanyheart-tag-bracelet',
                                        colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                        itemMedia: [
                                            {
                                                sku: '29633444',
                                                assortmentId: 101,
                                                displayOrder: 1,
                                                mediaFileName: '29633444_921706_ED_M',
                                                mediaTypeID: 1092,
                                                mediaTypeName: 'SkuStraightOn',
                                                removeFromAssortment: false,
                                                isIntranet: false,
                                                isVisible: true,
                                                dateLastModified: '2018-02-13T16:38:18.517',
                                                mediaType: 1092,
                                                siteId: 1
                                            },
                                            {
                                                sku: '29633444',
                                                assortmentId: 101,
                                                displayOrder: 1,
                                                mediaFileName: '29633444_935112_SV_1_M',
                                                mediaTypeID: 1098,
                                                mediaTypeName: 'SkuSeeitOnView',
                                                removeFromAssortment: false,
                                                isIntranet: false,
                                                isVisible: true,
                                                dateLastModified: '2018-02-13T16:38:18.517',
                                                mediaType: 1098,
                                                siteId: 1
                                            }
                                        ],
                                        mediaCropping: [
                                            {
                                                sku: '29633444 ',
                                                mediaTypeId: 1092,
                                                left: 0.1,
                                                top: 0.1,
                                                scale: 0.8,
                                                dateLastModified: '2018-05-15T13:45:48.043'
                                            }
                                        ],
                                        mediaPreset: [
                                            {
                                                sku: '29633444 ',
                                                mediaPresetTypeName: 'EcomBrowseM',
                                                scene7PresentName: 'EcomBrowseM',
                                                mediaPresettypeId: 1,
                                                unSharpMaskAmount: 1,
                                                unSharpMaskRadius: 1,
                                                unSharpMaskThreshold: 6,
                                                dateLastModified: '2018-05-15T13:45:48.043'
                                            }
                                        ]
                                    },
                                    customExperienceTypes: [],
                                    customModuleTypes: [],
                                    customMountType: [],
                                    itemMediaStitchPositions: [],
                                    itemServices: {
                                        itemServicingOptions: [
                                            {
                                                itemServiceTypeId: 1,
                                                unitPrice: 25,
                                                servicingQuantity: 1
                                            },
                                            {
                                                itemServiceTypeId: 11,
                                                unitPrice: 25,
                                                servicingQuantity: 1
                                            },
                                            {
                                                itemServiceTypeId: 15,
                                                unitPrice: 45,
                                                servicingQuantity: 1
                                            },
                                            {
                                                itemServiceTypeId: 150,
                                                unitPrice: 60,
                                                servicingQuantity: 1
                                            }
                                        ]
                                    },
                                    categoryBasedDimensions: [
                                        {
                                            categoryId: 287458,
                                            endecaDvalId: '101287458',
                                            categoryName: 'Bracelets',
                                            endecaDimensionId: 1,
                                            endecaDimensionName: 'Categories',
                                            superCategoryId: '1013633780',
                                            superCategoryUrlUniqueId: 'jewelry',
                                            superCategoryName: 'Jewelry',
                                            displayOrder: 306,
                                            urlUniqueId: 'bracelets'
                                        },
                                        {
                                            categoryId: 288196,
                                            endecaDvalId: '101288196',
                                            categoryName: 'Return to Tiffany®',
                                            endecaDimensionId: 2,
                                            endecaDimensionName: 'Designers & Collections',
                                            superCategoryId: '101424454',
                                            displayOrder: 181,
                                            urlUniqueId: 'rtt'
                                        }
                                    ],
                                    itemCategories: [
                                        {
                                            categoryId: 287458,
                                            endecaDvalId: '101287458',
                                            categoryName: 'Bracelets',
                                            urlUniqueId: 'bracelets',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 288158,
                                            endecaDvalId: '101288158',
                                            categoryName: 'Tiffany Silver Jewelry',
                                            urlUniqueId: 'tiffany-silver-jewelry',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 288178,
                                            endecaDvalId: '101288178',
                                            categoryName: 'Business Gifts',
                                            urlUniqueId: 'business-gifts',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        },
                                        {
                                            categoryId: 288196,
                                            endecaDvalId: '101288196',
                                            categoryName: 'Return to Tiffany®',
                                            urlUniqueId: 'rtt',
                                            canonicalMasterCategoryId: 148206,
                                            canonicalMasterCategoryUrlUniqueId: 'collections'
                                        },
                                        {
                                            categoryId: 288209,
                                            endecaDvalId: '101288209',
                                            categoryName: 'Engraving & Customization',
                                            urlUniqueId: 'engraving-customization',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        },
                                        {
                                            categoryId: 563629,
                                            endecaDvalId: '101563629',
                                            categoryName: 'Gifts $500 & Under',
                                            urlUniqueId: 'gifts-500-under',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        },
                                        {
                                            categoryId: 563630,
                                            endecaDvalId: '101563630',
                                            categoryName: 'Gifts $250 & Under',
                                            urlUniqueId: 'gifts-250-under',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        },
                                        {
                                            categoryId: 563632,
                                            endecaDvalId: '101563632',
                                            categoryName: 'Jewelry $250 & Under',
                                            urlUniqueId: 'jewelry-250-under',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 578712,
                                            endecaDvalId: '101578712',
                                            categoryName: 'Jewelry $1,500 & Under',
                                            urlUniqueId: 'jewelry-1500-under',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 731769,
                                            endecaDvalId: '101731769',
                                            categoryName: 'Gifts $1,500 & Under',
                                            urlUniqueId: 'gifts-1500-under',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        },
                                        {
                                            categoryId: 3366777,
                                            endecaDvalId: '1013366777',
                                            categoryName: 'Jewelry $500 & Under',
                                            urlUniqueId: 'jewelry-500-under',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 3679493,
                                            endecaDvalId: '1013679493',
                                            categoryName: 'EBG',
                                            urlUniqueId: 'ebg',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 3782074,
                                            endecaDvalId: '1013782074',
                                            categoryName: 'Price Is No Object',
                                            urlUniqueId: 'price-is-no-object-gifts',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        },
                                        {
                                            categoryId: 3782079,
                                            endecaDvalId: '1013782079',
                                            categoryName: 'Personalized Gifts',
                                            urlUniqueId: 'engravable-gifts',
                                            canonicalMasterCategoryId: 148207,
                                            canonicalMasterCategoryUrlUniqueId: 'gifts'
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            payload: {
                                selectedSku: '296asd33444', // Wrong sku ID
                                assortmentId: 101,
                                priceMarketId: 1,
                                sku: 'GRP06398',
                                isSalesServiceMode: true,
                                siteId: 1
                            },
                            response: {
                                errorGuid: '43dea998-97b4-4bac-b1fe-e1ab0d224106',
                                message: 'Bad Request',
                                validationErrors: {
                                    SelectedSku: 'The sku is invalid.'
                                }
                            }
                        },
                        {
                            payload: {
                                selectedSku: '29633444',
                                assortmentId: 101,
                                priceMarketId: 1,
                                sku: 'GRP06asd398', // Wrong group ID
                                isSalesServiceMode: true,
                                siteId: 1
                            },
                            response: {
                                errorGuid: 'e077bace-6d90-4c73-9081-98e44b0f836f',
                                message: 'Bad Request',
                                validationErrors: {
                                    Sku: 'The sku is invalid.'
                                }
                            }
                        },
                        {
                            payload: {
                                selectedSku: '61624074',
                                assortmentId: 101,
                                priceMarketId: 1,
                                sku: 'GRP10232',
                                SiteId: 1
                            },
                            response: {
                                resultDto: {
                                    group: {
                                        group: {
                                            sku: 'GRP10232',
                                            selectedSku: '61624074',
                                            siteId: 1,
                                            assortmentId: 101,
                                            additionalInfo: '',
                                            class: '61',
                                            companyId: 1,
                                            department: 191,
                                            discontinuedWithInventory: false,
                                            isGroup: true,
                                            lineListFormatTypeId: 1,
                                            longDescription: 'Featuring Paloma Picasso’s own handwriting, this expressive collection was inspired by graffiti scrawled on New York buildings. This bracelet\'s heartfelt sentiment creates a timeless design.',
                                            isLowInventory: false,
                                            isPurchasable: true,
                                            isRemoveFromAssortment: false,
                                            shortDescription: 'Paloma\'s Graffiti kiss bracelet in sterling silver, size medium.',
                                            isShowInEmployeeBrowse: true,
                                            isShowInEmployeeSearch: true,
                                            isShowInBrowse: true,
                                            isShowInSearch: true,
                                            showInBrowseAndSearchStartTime: '2018-01-22T14:27:58',
                                            title: 'Paloma\'s Graffiti:Kiss Bracelet',
                                            specifications: 'Sterling silver;Size medium;7\' long;Original designs copyrighted by Paloma Picasso',
                                            lineListLabel: 'ALSO AVAILABLE',
                                            isPartialShip: false,
                                            isSoldIr: false,
                                            taxabilityCode: ' ',
                                            style: '26431',
                                            mipsDescription: 'SS GRFT KISS MN BLT MD',
                                            posDescription: 'STERL GRAFFITI KISS MN BLT MD',
                                            isShownonpurchasableitemprice: true,
                                            dateUpdated: '2018-01-22T15:06:16.797',
                                            urluniqueId: 'palomas-graffiti-kiss-bracelet',
                                            canonicalCategoryId: 287458,
                                            canonicalCategoryUrlUniqueId: 'bracelets',
                                            canonicalCategoryName: 'Bracelets',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry',
                                            canonicalMasterCategoryName: 'Jewelry',
                                            groupCustomTypeName: 'Unknown',
                                            titleSplit: [
                                                'Paloma\'s Graffiti',
                                                'Kiss Bracelet'
                                            ],
                                            isBYOEnabled: false,
                                            isPriceAvailable: true,
                                            price: 135,
                                            hidePurchaseWithLowInventoryItem: true,
                                            showNonPurchasableItemPrice: false,
                                            groupCustomType: 0,
                                            formattedPrice: '$135.00',
                                            measuringYourWristLinkVisible: false,
                                            isRingSizeVisible: false,
                                            isRingSizeChartVisible: false,
                                            isRingSizeGuideVisible: false,
                                            styleDescription: 'SS GRFT KISS MN BLT',
                                            classDescription: 'SS BRACELETS',
                                            departmentDescription: 'PICASSO SILVER JEWELRY',
                                            isNew: true,
                                            isServiceable: false,
                                            isFIISEnabled: true,
                                            isSpinsetAvailable: false,
                                            shippingType: 2,
                                            maxQuantityLimit: 5,
                                            isBOPS: true
                                        },
                                        groupAttributes: {
                                            sku: 'GRP10232',
                                            siteId: 1,
                                            assortmentId: 101,
                                            groupTypeID: 1,
                                            groupDropDownLabel: 'Size',
                                            useGroupDefaultItemAdditionalInfo: true,
                                            useGroupDefaultItemLongDescription: true,
                                            useGroupDefaultItemMedia: true,
                                            useGroupDefaultItemShortDescription: true,
                                            useGroupDefaultItemTitle: true,
                                            useGroupDefaultItemSpecifications: true,
                                            dateLastModified: '2018-02-21T22:32:31.627',
                                            groupDefaultItemSku: '61624074',
                                            groupCustomTypeId: 0,
                                            groupDefaultSkuInRetailMode: '61624074 ',
                                            useDefaultItemCustomMedia: false,
                                            existLowInventoryItem: false,
                                            hidePurchasewithLowInventoryItem: true,
                                            isColorSwatch: false
                                        },
                                        groupItems: [
                                            {
                                                groupSku: 'GRP10232',
                                                memberSku: '61624058',
                                                linkText: 'Small',
                                                removeFromAssortment: false,
                                                displayOrder: 1,
                                                department: 191,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/palomas-graffiti-kiss-bracelet-GRP10232/palomas-graffiti-kiss-bracelet-61624058',
                                                canonicalURL: '/jewelry/bracelets/palomas-graffiti-kiss-bracelet-GRP10232/palomas-graffiti-kiss-bracelet-61624058',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '61624058',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '61624058_981572_ED_M',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-01-17T15:03:25.06',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                groupSku: 'GRP10232',
                                                memberSku: '61624074',
                                                linkText: 'Medium',
                                                removeFromAssortment: false,
                                                displayOrder: 2,
                                                department: 191,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/palomas-graffiti-kiss-bracelet-GRP10232/palomas-graffiti-kiss-bracelet-61624074',
                                                canonicalURL: '/jewelry/bracelets/palomas-graffiti-kiss-bracelet-GRP10232/palomas-graffiti-kiss-bracelet-61624074',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '61624074',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '61624058_981572_ED_M',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-01-17T15:03:25.083',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                groupSku: 'GRP10232',
                                                memberSku: '61624090',
                                                linkText: 'Large',
                                                removeFromAssortment: false,
                                                displayOrder: 3,
                                                department: 191,
                                                maxQuantityLimit: 5,
                                                friendlyURL: '/jewelry/bracelets/palomas-graffiti-kiss-bracelet-GRP10232/palomas-graffiti-kiss-bracelet-61624090',
                                                canonicalURL: '/jewelry/bracelets/palomas-graffiti-kiss-bracelet-GRP10232/palomas-graffiti-kiss-bracelet-61624090',
                                                isGroup: false,
                                                itemMedia: {
                                                    imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                                    noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                                    imagePreset: 'EcomItemL',
                                                    noImagePreset: 'EcomItemL2',
                                                    pkbAppSavedItemPreset: 'EcomBrowseL',
                                                    colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                                    itemMedia: [
                                                        {
                                                            sku: '61624090',
                                                            assortmentId: 101,
                                                            displayOrder: 1,
                                                            mediaFileName: '61624058_981572_ED_M',
                                                            mediaTypeID: 1092,
                                                            mediaTypeName: 'SkuStraightOn',
                                                            removeFromAssortment: false,
                                                            isIntranet: false,
                                                            isVisible: true,
                                                            dateLastModified: '2018-01-17T15:03:24.953',
                                                            mediaType: 1092,
                                                            siteId: 1
                                                        }
                                                    ]
                                                }
                                            }
                                        ],
                                        friendlyURL: '/jewelry/bracelets/palomas-graffiti-kiss-bracelet-GRP10232',
                                        canonicalURL: '/jewelry/bracelets/palomas-graffiti-kiss-bracelet-GRP10232',
                                        searchAttributes: [
                                            {
                                                searchAttributeId: 323338,
                                                searchAttributeName: 'Sterling Silver',
                                                displayOrder: 1,
                                                urluniqueId: 'sterling-silver',
                                                endecaDvalId: '101323338',
                                                endecaDimensionId: 5,
                                                endecaDimensionName: 'Materials'
                                            },
                                            {
                                                searchAttributeId: 3625968,
                                                searchAttributeName: 'No Gemstone',
                                                displayOrder: 11,
                                                urluniqueId: 'no-gemstone',
                                                endecaDvalId: '1013625968',
                                                endecaDimensionId: 6,
                                                endecaDimensionName: 'Gemstones'
                                            }
                                        ],
                                        isSpinsetAvailable: false,
                                        siteId: 1
                                    },
                                    groupPrice: {
                                        sku: 'GRP10232 ',
                                        priceMarketId: 1,
                                        price: 135,
                                        siteId: 1
                                    },
                                    groupItemMedia: [],
                                    lineListedItems: [
                                        {
                                            parentSku: 'GRP10232',
                                            lineListedSku: 'GRP10216',
                                            assortmentId: 101,
                                            linkText: 'In 18k rose gold',
                                            listEntryDisplayOrder: 1,
                                            dateLastModified: '2018-02-13T15:56:07.36'
                                        }
                                    ],
                                    itemRuleResult: {
                                        errorMessageType: 0,
                                        showAddToShoppingBag: true,
                                        showSaveForLater: true,
                                        showPrice: true,
                                        showSupplementalLinks: true,
                                        showType1Dropdown: true,
                                        showNotPurchasableLink: false,
                                        showEmailThisItem: false,
                                        showEmailWhenAvailable: false,
                                        isEligibleForBYO: false,
                                        isBOPSEnabled: true,
                                        showFIISLink: true
                                    },
                                    itemMedia: {
                                        imageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                                        noImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/noimage.jpg?defaultImage=NoImageAvailableInternal&& ',
                                        imagePreset: 'EcomItemL',
                                        noImagePreset: 'EcomItemL2',
                                        pkbAppSavedItemPreset: 'EcomBrowseL',
                                        imagePrefix: 'palomas-graffitikiss-bracelet',
                                        colorSwatchImageUrlFormat: 'http://media.tiffany.com/is/image/Tiffany/<Preset>/PMAIMG/<mediaFileName>',
                                        itemMedia: [
                                            {
                                                sku: '61624074',
                                                assortmentId: 101,
                                                displayOrder: 1,
                                                mediaFileName: '61624058_981572_ED_M',
                                                mediaTypeID: 1092,
                                                mediaTypeName: 'SkuStraightOn',
                                                removeFromAssortment: false,
                                                isIntranet: false,
                                                isVisible: true,
                                                dateLastModified: '2018-01-17T15:03:25.083',
                                                mediaType: 1092,
                                                siteId: 1
                                            }
                                        ],
                                        mediaCropping: [
                                            {
                                                sku: '61624074 ',
                                                mediaTypeId: 1092,
                                                left: 0.1,
                                                top: 0.1,
                                                scale: 0.8,
                                                dateLastModified: '2018-02-21T22:34:20.27'
                                            }
                                        ],
                                        mediaPreset: [
                                            {
                                                sku: '61624074 ',
                                                mediaPresetTypeName: 'EcomBrowseM',
                                                scene7PresentName: 'EcomBrowseM',
                                                mediaPresettypeId: 1,
                                                unSharpMaskAmount: 1,
                                                unSharpMaskRadius: 1,
                                                unSharpMaskThreshold: 6,
                                                dateLastModified: '2018-02-21T22:34:20.27'
                                            }
                                        ]
                                    },
                                    customExperienceTypes: [],
                                    customModuleTypes: [],
                                    customMountType: [],
                                    itemMediaStitchPositions: [],
                                    itemServices: {},
                                    categoryBasedDimensions: [
                                        {
                                            categoryId: 287458,
                                            endecaDvalId: '101287458',
                                            categoryName: 'Bracelets',
                                            endecaDimensionId: 1,
                                            endecaDimensionName: 'Categories',
                                            superCategoryId: '1013633780',
                                            superCategoryUrlUniqueId: 'jewelry',
                                            superCategoryName: 'Jewelry',
                                            displayOrder: 8,
                                            urlUniqueId: 'bracelets'
                                        },
                                        {
                                            categoryId: 288189,
                                            endecaDvalId: '101288189',
                                            categoryName: 'Paloma Picasso®',
                                            endecaDimensionId: 2,
                                            endecaDimensionName: 'Designers & Collections',
                                            superCategoryId: '101424454',
                                            displayOrder: 16,
                                            urlUniqueId: 'paloma-picasso'
                                        },
                                        {
                                            categoryId: 648346,
                                            endecaDvalId: '101648346',
                                            categoryName: 'Graffiti',
                                            endecaDimensionId: 3,
                                            endecaDimensionName: 'Collections',
                                            superCategoryId: '101424817',
                                            displayOrder: 7,
                                            urlUniqueId: 'paloma-picasso-graffiti'
                                        }
                                    ],
                                    itemCategories: [
                                        {
                                            categoryId: 287458,
                                            endecaDvalId: '101287458',
                                            categoryName: 'Bracelets',
                                            urlUniqueId: 'bracelets',
                                            canonicalMasterCategoryId: 148204,
                                            canonicalMasterCategoryUrlUniqueId: 'jewelry'
                                        },
                                        {
                                            categoryId: 288189,
                                            endecaDvalId: '101288189',
                                            categoryName: 'Paloma Picasso®',
                                            urlUniqueId: 'paloma-picasso',
                                            canonicalMasterCategoryId: 148206,
                                            canonicalMasterCategoryUrlUniqueId: 'collections'
                                        },
                                        {
                                            categoryId: 298241,
                                            endecaDvalId: '101298241',
                                            categoryName: 'Wall Street',
                                            urlUniqueId: 'wall-street',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 479592,
                                            endecaDvalId: '101479592',
                                            categoryName: 'Fifth Avenue In-Store Pickup',
                                            urlUniqueId: 'fifth-avenue-in-store-pickup',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 479593,
                                            endecaDvalId: '101479593',
                                            categoryName: 'New York City In-Store Pickup',
                                            urlUniqueId: 'wall-street-or-fifth-avenue',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 648346,
                                            endecaDvalId: '101648346',
                                            categoryName: 'Graffiti',
                                            urlUniqueId: 'paloma-picasso-graffiti',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        },
                                        {
                                            categoryId: 1639183,
                                            endecaDvalId: '1011639183',
                                            categoryName: 'Soho in-store pick up',
                                            urlUniqueId: 'soho-in-store-pick-up',
                                            canonicalMasterCategoryUrlUniqueId: 'jewlery'
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev01/ServicingsSystemApi/api/system/v1/servicings/services',
                    samplePayload: {
                        assortmentId: 64191127, // Required
                        siteId: 13131635
                    },
                    testRuns: [
                        {
                            payload: {},
                            response: {
                                errorGuid: '3ea795b9-c231-4c88-8764-1e24c3e217b0',
                                message: 'Bad Request',
                                validationErrors: {
                                    AssortmentId: 'The AssortmentId field is required.'
                                }
                            }

                        },
                        {
                            payload: {
                                assortmentId: 101
                            },
                            response: {
                                resultDto: [
                                    {
                                        serviceType: 'MachineEngraving',
                                        serviceTypeCode: 1,
                                        serviceTypeDisplayOrder: '1',
                                        serviceShowCaseStyleCode: '202',
                                        styleGroups: [
                                            {
                                                groupId: 1,
                                                groupDescription: 'ALL',
                                                groupDisplayOrder: 1,
                                                groupStyleImageName: 'default_vnt',
                                                groupStyleImagePreset: 'EngravePreviewOptionsSquare',
                                                groupStyleImagePresetSelected: 'EngravePreviewOptionsSquareSelected',
                                                groupStyleImageUrl: 'http://media.tiffany.com/is/image/tiffanyRenderDev?src=ir{tiffanyRenderDev/<imageName>?obj=engrave&decal&src=is{TiffanyDev/<styleCode>_<itemServiceTypeId>_text?scl=1}}&$text1l=<initial1>&$text1c=<initial2>&$text1r=<initial3>&wid=500&$<preset>$',
                                                styles: [
                                                    {
                                                        styleName: 'American_Typewriter',
                                                        styleDescription: 'American Typewriter',
                                                        styleCode: 290,
                                                        styleDisplayOrder: 1,
                                                        isTrueType: true
                                                    },
                                                    {
                                                        styleName: 'Block',
                                                        styleDescription: 'Block',
                                                        styleCode: 202,
                                                        styleDisplayOrder: 2,
                                                        isTrueType: true
                                                    },
                                                    {
                                                        styleName: 'Roman',
                                                        styleDescription: 'Roman',
                                                        styleCode: 201,
                                                        styleDisplayOrder: 3,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Script',
                                                        styleDescription: 'Script',
                                                        styleCode: 204,
                                                        styleDisplayOrder: 4,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'FrenchScript',
                                                        styleDescription: 'French Script',
                                                        styleCode: 203,
                                                        styleDisplayOrder: 5,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'ItalicRoman',
                                                        styleDescription: 'Italic Roman',
                                                        styleCode: 205,
                                                        styleDisplayOrder: 6,
                                                        isTrueType: false
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        serviceType: 'Monogramming',
                                        serviceTypeCode: 150,
                                        serviceTypeDisplayOrder: '2',
                                        serviceShowCaseStyleCode: '212',
                                        styleGroups: [
                                            {
                                                groupId: 3,
                                                groupDescription: 'ALL',
                                                groupDisplayOrder: 1,
                                                groupStyleImageName: 'default_vnt',
                                                groupStyleImagePreset: 'EngravePreviewOptionsSquare',
                                                groupStyleImagePresetSelected: 'EngravePreviewOptionsSquareSelected',
                                                groupStyleImageUrl: 'http://media.tiffany.com/is/image/tiffanyRenderDev?src=ir{tiffanyRenderDev/<imageName>?obj=engrave&decal&src=is{TiffanyDev/<styleCode>_<itemServiceTypeId>_text?scl=1}}&$text1l=<initial1>&$text1c=<initial2>&$text1r=<initial3>&wid=500&$<preset>$',
                                                styles: [
                                                    {
                                                        styleName: 'Monogramming_American_Typewriter',
                                                        styleDescription: 'American Typewriter',
                                                        styleCode: 240,
                                                        styleDisplayOrder: 1,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Monogramming_Roman',
                                                        styleDescription: 'Roman',
                                                        styleCode: 212,
                                                        styleDisplayOrder: 2,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Monogramming_Script',
                                                        styleDescription: 'Script',
                                                        styleCode: 214,
                                                        styleDisplayOrder: 3,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Monogramming_Roman_Script',
                                                        styleDescription: 'Roman/Script',
                                                        styleCode: 211,
                                                        styleDisplayOrder: 4,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Monogramming_Block',
                                                        styleDescription: 'Block',
                                                        styleCode: 213,
                                                        styleDisplayOrder: 5,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Monogramming_Round',
                                                        styleDescription: 'Round',
                                                        styleCode: 215,
                                                        styleDisplayOrder: 6,
                                                        isTrueType: false
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        serviceType: 'HandEngraving',
                                        serviceTypeCode: 15,
                                        serviceTypeDisplayOrder: '3',
                                        serviceShowCaseStyleCode: '204',
                                        styleGroups: [
                                            {
                                                groupId: 2,
                                                groupDescription: 'ALL',
                                                groupDisplayOrder: 1,
                                                groupStyleImageName: 'default_vnt',
                                                groupStyleImagePreset: 'EngravePreviewOptionsSquare',
                                                groupStyleImagePresetSelected: 'EngravePreviewOptionsSquareSelected',
                                                groupStyleImageUrl: 'http://media.tiffany.com/is/image/tiffanyRenderDev?src=ir{tiffanyRenderDev/<imageName>?obj=engrave&decal&src=is{TiffanyDev/<styleCode>_<itemServiceTypeId>_text?scl=1}}&$text1l=<initial1>&$text1c=<initial2>&$text1r=<initial3>&wid=500&$<preset>$',
                                                styles: [
                                                    {
                                                        styleName: 'American_Typewriter',
                                                        styleDescription: 'American Typewriter',
                                                        styleCode: 290,
                                                        styleDisplayOrder: 1,
                                                        isTrueType: true
                                                    },
                                                    {
                                                        styleName: 'Block',
                                                        styleDescription: 'Block',
                                                        styleCode: 202,
                                                        styleDisplayOrder: 2,
                                                        isTrueType: true
                                                    },
                                                    {
                                                        styleName: 'Roman',
                                                        styleDescription: 'Roman',
                                                        styleCode: 201,
                                                        styleDisplayOrder: 3,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Script',
                                                        styleDescription: 'Script',
                                                        styleCode: 204,
                                                        styleDisplayOrder: 4,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'FrenchScript',
                                                        styleDescription: 'French Script',
                                                        styleCode: 203,
                                                        styleDisplayOrder: 5,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'ItalicRoman',
                                                        styleDescription: 'Italic Roman',
                                                        styleCode: 205,
                                                        styleDisplayOrder: 6,
                                                        isTrueType: false
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        serviceType: 'MachineSymbolEngraving',
                                        serviceTypeCode: 11,
                                        serviceTypeDisplayOrder: '4',
                                        serviceShowCaseStyleCode: '751',
                                        styleGroups: [
                                            {
                                                groupId: 4,
                                                groupDescription: 'All Symbols',
                                                groupDisplayOrder: 1,
                                                groupStyleImageName: 'default_vnt',
                                                groupStyleImagePreset: 'EngravePreviewOptionsSquare',
                                                groupStyleImagePresetSelected: 'EngravePreviewOptionsSquareSelected',
                                                groupStyleImageUrl: 'http://media.tiffany.com/is/image/tiffanyRenderDev?src=ir{tiffanyRenderDev/<imageName>?obj=engrave&decal&src=is{TiffanyDev/<itemServiceTypeId>_text?scl=1}}&$text1c=<StyleName>&$<preset>$',
                                                styles: [
                                                    {
                                                        styleName: 'Tco_Logo',
                                                        styleDescription: 'T&Co. Logo',
                                                        styleCode: 751,
                                                        styleDisplayOrder: 1,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Diamond',
                                                        styleDescription: 'Diamond',
                                                        styleCode: 753,
                                                        styleDisplayOrder: 2,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Lock',
                                                        styleDescription: 'T&Co. Lock',
                                                        styleCode: 754,
                                                        styleDisplayOrder: 3,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Tco_Coffee_Cup',
                                                        styleDescription: 'T&Co. Coffee',
                                                        styleCode: 756,
                                                        styleDisplayOrder: 4,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Ampersand',
                                                        styleDescription: 'Ampersand',
                                                        styleCode: 750,
                                                        styleDisplayOrder: 5,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Peace',
                                                        styleDescription: 'Peace',
                                                        styleCode: 659,
                                                        styleDisplayOrder: 6,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Clover',
                                                        styleDescription: 'Clover',
                                                        styleCode: 652,
                                                        styleDisplayOrder: 7,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Horseshoe',
                                                        styleDescription: 'Horseshoe',
                                                        styleCode: 658,
                                                        styleDisplayOrder: 8,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Mars',
                                                        styleDescription: 'Mars',
                                                        styleCode: 660,
                                                        styleDisplayOrder: 9,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Venus',
                                                        styleDescription: 'Venus',
                                                        styleCode: 661,
                                                        styleDisplayOrder: 10,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Broken_Heart',
                                                        styleDescription: 'Broken Heart',
                                                        styleCode: 651,
                                                        styleDisplayOrder: 11,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Apple',
                                                        styleDescription: 'Apple',
                                                        styleCode: 653,
                                                        styleDisplayOrder: 12,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Keyhole',
                                                        styleDescription: 'Keyhole',
                                                        styleCode: 656,
                                                        styleDisplayOrder: 13,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Lovestruck',
                                                        styleDescription: 'Lovestruck',
                                                        styleCode: 650,
                                                        styleDisplayOrder: 14,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Lightning_Bolt',
                                                        styleDescription: 'Lightning Bolt',
                                                        styleCode: 655,
                                                        styleDisplayOrder: 15,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Anchor',
                                                        styleDescription: 'Anchor',
                                                        styleCode: 657,
                                                        styleDisplayOrder: 16,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Star',
                                                        styleDescription: 'Star',
                                                        styleCode: 654,
                                                        styleDisplayOrder: 17,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Aries',
                                                        styleDescription: 'Aries',
                                                        styleCode: 368,
                                                        styleDisplayOrder: 18,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Taurus',
                                                        styleDescription: 'Taurus',
                                                        styleCode: 369,
                                                        styleDisplayOrder: 19,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Gemini',
                                                        styleDescription: 'Gemini',
                                                        styleCode: 370,
                                                        styleDisplayOrder: 20,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Cancer',
                                                        styleDescription: 'Cancer',
                                                        styleCode: 371,
                                                        styleDisplayOrder: 21,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Leo',
                                                        styleDescription: 'Leo',
                                                        styleCode: 372,
                                                        styleDisplayOrder: 22,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Virgo',
                                                        styleDescription: 'Virgo',
                                                        styleCode: 373,
                                                        styleDisplayOrder: 23,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Libra',
                                                        styleDescription: 'Libra',
                                                        styleCode: 374,
                                                        styleDisplayOrder: 24,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Scorpio',
                                                        styleDescription: 'Scorpio',
                                                        styleCode: 375,
                                                        styleDisplayOrder: 25,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Sagittarius',
                                                        styleDescription: 'Sagittarius',
                                                        styleCode: 376,
                                                        styleDisplayOrder: 26,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Capricorn',
                                                        styleDescription: 'Capricorn',
                                                        styleCode: 377,
                                                        styleDisplayOrder: 27,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Aquarius',
                                                        styleDescription: 'Aquarius',
                                                        styleCode: 366,
                                                        styleDisplayOrder: 28,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Pisces',
                                                        styleDescription: 'Pisces',
                                                        styleCode: 367,
                                                        styleDisplayOrder: 29,
                                                        isTrueType: false
                                                    }
                                                ]
                                            },
                                            {
                                                groupId: 5,
                                                groupDescription: 'Icons',
                                                groupDisplayOrder: 2,
                                                groupStyleImageName: 'default_vnt',
                                                groupStyleImagePreset: 'EngravePreviewOptionsSquare',
                                                groupStyleImagePresetSelected: 'EngravePreviewOptionsSquareSelected',
                                                groupStyleImageUrl: 'http://media.tiffany.com/is/image/tiffanyRenderDev?src=ir{tiffanyRenderDev/<imageName>?obj=engrave&decal&src=is{TiffanyDev/<styleCode>_<itemServiceTypeId>_text?scl=1}}&$text1l=<initial1>&$text1c=<initial2>&$text1r=<initial3>&wid=500&$<preset>$',
                                                styles: [
                                                    {
                                                        styleName: 'Tco_Logo',
                                                        styleDescription: 'T&Co. Logo',
                                                        styleCode: 751,
                                                        styleDisplayOrder: 1,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Diamond',
                                                        styleDescription: 'Diamond',
                                                        styleCode: 753,
                                                        styleDisplayOrder: 2,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Lock',
                                                        styleDescription: 'T&Co. Lock',
                                                        styleCode: 754,
                                                        styleDisplayOrder: 3,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Tco_Coffee_Cup',
                                                        styleDescription: 'T&Co. Coffee',
                                                        styleCode: 756,
                                                        styleDisplayOrder: 4,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Ampersand',
                                                        styleDescription: 'Ampersand',
                                                        styleCode: 750,
                                                        styleDisplayOrder: 5,
                                                        isTrueType: false
                                                    }
                                                ]
                                            },
                                            {
                                                groupId: 6,
                                                groupDescription: 'Emblems',
                                                groupDisplayOrder: 3,
                                                groupStyleImageName: 'default_vnt',
                                                groupStyleImagePreset: 'EngravePreviewOptionsSquare',
                                                groupStyleImagePresetSelected: 'EngravePreviewOptionsSquareSelected',
                                                groupStyleImageUrl: 'http://media.tiffany.com/is/image/tiffanyRenderDev?src=ir{tiffanyRenderDev/<imageName>?obj=engrave&decal&src=is{TiffanyDev/<styleCode>_<itemServiceTypeId>_text?scl=1}}&$text1l=<initial1>&$text1c=<initial2>&$text1r=<initial3>&wid=500&$<preset>$',
                                                styles: [
                                                    {
                                                        styleName: 'Peace',
                                                        styleDescription: 'Peace',
                                                        styleCode: 659,
                                                        styleDisplayOrder: 1,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Clover',
                                                        styleDescription: 'Clover',
                                                        styleCode: 652,
                                                        styleDisplayOrder: 2,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Horseshoe',
                                                        styleDescription: 'Horseshoe',
                                                        styleCode: 658,
                                                        styleDisplayOrder: 3,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Mars',
                                                        styleDescription: 'Mars',
                                                        styleCode: 660,
                                                        styleDisplayOrder: 4,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Venus',
                                                        styleDescription: 'Venus',
                                                        styleCode: 661,
                                                        styleDisplayOrder: 5,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Broken_Heart',
                                                        styleDescription: 'Broken Heart',
                                                        styleCode: 651,
                                                        styleDisplayOrder: 6,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Apple',
                                                        styleDescription: 'Apple',
                                                        styleCode: 653,
                                                        styleDisplayOrder: 7,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Keyhole',
                                                        styleDescription: 'Keyhole',
                                                        styleCode: 656,
                                                        styleDisplayOrder: 8,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Lovestruck',
                                                        styleDescription: 'Lovestruck',
                                                        styleCode: 650,
                                                        styleDisplayOrder: 9,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Lightning_Bolt',
                                                        styleDescription: 'Lightning Bolt',
                                                        styleCode: 655,
                                                        styleDisplayOrder: 10,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Anchor',
                                                        styleDescription: 'Anchor',
                                                        styleCode: 657,
                                                        styleDisplayOrder: 11,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Star',
                                                        styleDescription: 'Star',
                                                        styleCode: 654,
                                                        styleDisplayOrder: 12,
                                                        isTrueType: false
                                                    }
                                                ]
                                            },
                                            {
                                                groupId: 7,
                                                groupDescription: 'Astrology',
                                                groupDisplayOrder: 4,
                                                groupStyleImageName: 'default_vnt',
                                                groupStyleImagePreset: 'EngravePreviewOptionsSquare',
                                                groupStyleImagePresetSelected: 'EngravePreviewOptionsSquareSelected',
                                                groupStyleImageUrl: 'http://media.tiffany.com/is/image/tiffanyRenderDev?src=ir{tiffanyRenderDev/<imageName>?obj=engrave&decal&src=is{TiffanyDev/<styleCode>_<itemServiceTypeId>_text?scl=1}}&$text1l=<initial1>&$text1c=<initial2>&$text1r=<initial3>&wid=500&$<preset>$',
                                                styles: [
                                                    {
                                                        styleName: 'Aries',
                                                        styleDescription: 'Aries',
                                                        styleCode: 368,
                                                        styleDisplayOrder: 1,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Taurus',
                                                        styleDescription: 'Taurus',
                                                        styleCode: 369,
                                                        styleDisplayOrder: 2,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Gemini',
                                                        styleDescription: 'Gemini',
                                                        styleCode: 370,
                                                        styleDisplayOrder: 3,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Cancer',
                                                        styleDescription: 'Cancer',
                                                        styleCode: 371,
                                                        styleDisplayOrder: 4,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Leo',
                                                        styleDescription: 'Leo',
                                                        styleCode: 372,
                                                        styleDisplayOrder: 5,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Virgo',
                                                        styleDescription: 'Virgo',
                                                        styleCode: 373,
                                                        styleDisplayOrder: 6,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Libra',
                                                        styleDescription: 'Libra',
                                                        styleCode: 374,
                                                        styleDisplayOrder: 7,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Scorpio',
                                                        styleDescription: 'Scorpio',
                                                        styleCode: 375,
                                                        styleDisplayOrder: 8,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Sagittarius',
                                                        styleDescription: 'Sagittarius',
                                                        styleCode: 376,
                                                        styleDisplayOrder: 9,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Capricorn',
                                                        styleDescription: 'Capricorn',
                                                        styleCode: 377,
                                                        styleDisplayOrder: 10,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Aquarius',
                                                        styleDescription: 'Aquarius',
                                                        styleCode: 366,
                                                        styleDisplayOrder: 11,
                                                        isTrueType: false
                                                    },
                                                    {
                                                        styleName: 'Pisces',
                                                        styleDescription: 'Pisces',
                                                        styleCode: 367,
                                                        styleDisplayOrder: 12,
                                                        isTrueType: false
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            payload: {},
                            response: {}
                        }
                    ]
                },
                {
                    url: 'http://devd.preview.cloud.red.ihost.com/ServicingsSystemApi/api/system/v1/servicings/item/services',
                    samplePayload: {
                        assortmentId: 54336399,
                        sku: 'cuudah',
                        groupSku: 'hetut',
                        priceMarketId: 27981046,
                        siteId: 60442621
                    },
                    testRuns: [
                        {
                            payload: {
                                assortmentId: 101,
                                sku: '29633444',
                                groupSku: 'GRP06398',
                                priceMarketId: 1,
                                siteId: 1
                            },
                            response: {
                                resultDto: {
                                    itemEngravingImagePreview: {
                                        servicingImageName: 'default_vnt',
                                        preset: 'EngravePreviewVNT',
                                        presetMobile: 'EngravePreviewMobileVNT',
                                        previewImageUrl: 'http://media.tiffany.com/is/image/tiffanyRenderDev?src=ir{tiffanyRenderDev/<imageName>?obj=engrave&decal&src=is{TiffanyDev/<styleCode>_<itemServiceTypeId>_text?scl=1}}&$text1l=<initial1>&$text1c=<initial2>&$text1r=<initial3>&wid=500&$<preset>$'
                                    },
                                    itemServicingOptions: [
                                        {
                                            itemServiceTypeId: 1,
                                            unitPrice: 25,
                                            servicingQuantity: 1
                                        },
                                        {
                                            itemServiceTypeId: 11,
                                            unitPrice: 25,
                                            servicingQuantity: 1
                                        },
                                        {
                                            itemServiceTypeId: 15,
                                            unitPrice: 45,
                                            servicingQuantity: 1
                                        },
                                        {
                                            itemServiceTypeId: 150,
                                            unitPrice: 60,
                                            servicingQuantity: 1
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            payload: {},
                            response: {}
                        }
                    ]
                }
            ]
        };

        console.log(GLOBAL_ENGRAVING);
    }
}
