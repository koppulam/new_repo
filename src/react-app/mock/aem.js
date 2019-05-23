/**
 * @description Inits mock AEM data.
 * @returns {void}
 */
export default function initAemData() {
    if (IS_DEV) {
        window.tiffany = {};
        window.tiffany.isAuthormode = false;
        window.tiffany.locale = 'en_us';
        window.tiffany.regionCode = 'us';
        window.tiffany.isDistanceInKm = false;
        window.tiffany.caDomain = '.tiffany.ca';
        window.tiffany.apiUrl = {
            wishListSystemUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/saveditemssystemapi/api/system/v1/saveditems/item/list',
            customWishListSystemUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/buildyourownsystemapi/api/system/v1/buildyourown/getcustomdesignlists',
            shoppingBagCountUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagsprocessapi/api/process/v1/shoppingbags/item/count',
            shoppingBagSystemUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagssystemapi/api/system/v1/shoppingbags/item/list',
            supplementalServiceUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/productsupplementalinfossystemapi/api/system/v1/product/items/supplemental',
            eStoreValidationUrl: 'https://dev1-aem.edev.estore-tco.com:8080/customer/account/signin.aspx/EstoreValidateFormsAuthentication',
            eStoreLoginUrl: 'https://dev1-aem.edev.estore-tco.com:8080/internal/estore/estoresignin.aspx',
            retailInventoryUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/productinventoriessystemapi/api/system/v1/productinventories/item/retail',
            allStoresUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/storessystemapi/api/system/v1/stores/list',
            storesByCountryUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/storessystemapi/api/system/v1/stores/listbycountry',
            // distributionInvApiUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/productinventoriessystemapi/api/system/v1/productinventories/item/distributioncenter',
            distributionInvApiUrl: '/api/distributionInv',
            onOrderStatusUrl: '/api/onOrderStatus',
            miniPdpUrl: '/api/miniPdp',
            giftCardCheckBalanceUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/giftcardsprocessapi/api/process/v1/giftcards/balance',
            sessionUrl: 'https://dev-api.tiffco.net/ibmdev/dev01//customerssystemapi/api/system/v1/customers/customer/create/anonymous',
            browseUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/ecomproductsearchprocessapi/api/process/v1/productsearch/ecomguidedsearch',
            // browseUrl: 'https://test-api.tiffco.net/tiffanyco/ecomqa03/ecomproductsearchprocessapi/api/process/v1/productsearch/ecomguidedsearch',
            engagementUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/ecomproductsearchprocessapi/api/process/v1/productsearch/ecomguidedsearch',
            searchUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/ecomproductsearchprocessapi/api/process/v1/productsearch/ecomguidedsearch',
            byoUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/ecomproductsearchprocessapi/api/process/v1/productsearch/byoguidedsearch',
            wishlistGetUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/saveditemsprocessapi/api/process/v1/saveditems/item/list',
            wishlistGetUrlMock: '/api/saveditems',
            wishListAddEndPoint: 'https://dev-api.tiffco.net/ibmdev/dev01/saveditemsprocessapi/api/process/v1/saveditems/item/add',
            wishlistDeleteUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/saveditemsprocessapi/api/process/v1/saveditems/item/delete',
            rrUrl: 'https://recs.richrelevance.com/rrserver/api/rrPlatform/recsForPlacements',
            rrLocalUrl: '/api/rich',
            rrTestUrl: 'https://integration.richrelevance.com/rrserver/api/rrPlatform/recsForPlacements',
            skuUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/productsprocessapi/api/process/v1/products/itemlist', // '/api/sku'
            categoryUrl: '/api/categories',
            itemCompleteUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/productsprocessapi/api/process/v1/products/item/complete',
            groupCompleteUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/productsprocessapi/api/process/v1/products/group/complete',
            itemPriceUrl: '/api/price',
            groupPriceUrl: '',
            productDetailsEndPointForPrice: '/api/price',
            groupProductDetailsEndPointForPrice: '/api/price',
            // skuEcomAddEndPoint: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagsprocessapi/api/process/v1/shoppingbags/item/group-type2/add',
            skuEcomAddEndPoint: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagsprocessapi/api/process/v1/shoppingbags/item/sku-ecom/add',
            // skuEcomAddEndPoint: '/api/addToBag',
            typeAheadUrl: 'https://devd.preview.cloud.red.ihost.com/ecomproductsearchsystemapi/api/system/v1/productsearch/typeahead',
            enabledStoresUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/finditeminstoresprocessapi/api/process/v1/fiis/enabledstores/list',
            availabilityByStoresUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/finditeminstoresprocessapi/api/process/v1/fiis/product/availabilitybystores/list',
            // siteEngravingsUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/servicingssystemapi/api/system/v1/servicings/services',
            // siteEngravingsUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/servicingssystemapi/api/system/v1/servicings/services',
            // siteEngravingsUrl: 'http://test1-aem.edev.tiffany.com:8080/content/tiffany-n-co/_jcr_content/servlets/pdpengraving.1.101.json',
            // productEngravingURL: 'https://tclwbaemd001:8080/content/tiffany-n-co/_jcr_content/servlets/byoengraving.GRP_SKU.SELECTEDSKU.IS_BYO.REGION.LOCALE.json',
            siteEngravingsUrl: 'api/engraving/siteEngravings',
            productEngravingURL: 'api/engraving/productLevelEngravings',
            selectMaterialUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/ecomproductsearchprocessapi/api/process/v1/productsearch/byoguidedsearch',
            braceletsUrl: '/api/byo/bracelets',
            necklacesUrl: '/api/byo/necklaces',
            storesListUrl: '/api/storesList',
            claspUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/buildyourownprocessapi/api/process/v1/buildyourown/getmountinggroupdetails',
            claspMock: '/api/byo/clasp',
            preferredStoreUrl: '/api/preferredStore',
            getPreferredStoreUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/customerssystemapi/api/system/v1/customers/customer/preferredstore/view',
            preferredStoreAddEndPoint: 'https://dev-api.tiffco.net/ibmdev/dev01/customerssystemapi/api/system/v1/customers/customer/preferredstore/add',
            webCustomerUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/customerssystemapi/api/system/v1/customers/customer/create/anonymous',
            upcomingEventsConfigUrl: '/api/upcomingEvents',
            byoGroupUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/productsprocessapi/api/process/v1/products/byogroup',
            dropHintUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/aememailsexperienceapi/api/experience/v1/aememails/dropahint',
            savehint: 'https://dev-api.tiffco.net/ibmdev/dev01/saveditemsprocessapi/api/process/v1/saveditems/dropahint/save',
            getRegionsUrl: '/api/regions',
            storeLocatorUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/storessystemapi/api/system/v1/stores/list',
            byoGroupMock: '/api/byo/group',
            byoMockUrl: '/api/byo',
            clientid: 'MzJmNzM1NWItODM4Ni00NTkzLWFiMGYtYWE0OGU4MTc1NDEx',
            secret: 'aEU1ZFkzaEU3c0Q2cE81a0cyaEkzcUEwYlc4dUo0ak03Y0Q1ak4za041dEEycVQzY1c=',
            // clientid: 'NTEwY2JmYzUtZmY1NC00NTkxLTk4MDQtZmEwYTg2M2U0NDlk',
            // secret: 'YVQ1dVYyc0s1alg2YUwwaVcxaE0xaEcxeEwwa1gxeVU2cUM4ZlM4dkk0b1QxZk4zdFQ=',
            // Client and secret id for Test API.
            // clientid: 'NDhiMDIwOGUtYmZmYi00NzA5LThlYjAtZDU5YTQ0MmEyYmI0',
            // secret: 'UzF0VDF0TTdyVTJqSDRtTjVsSzBjWDhtQzFqRTRtQzdhSjZiRzFzTTF5UTdzTTVpSzM=',
            byoSaveDesignUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/buildyourownprocessapi/api/process/v1/buildyourown/save',
            byoGetUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/buildyourownprocessapi/api/process/v1/buildyourown/get',
            browseGridProductImageUrl: '//media.tiffany.com/is/image/TiffanyDev/<Preset>/reader-tote-<ImageName>.jpg',
            byoSaveNameUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/buildyourownprocessapi/api/process/v1/buildyourown/templatedesign/save',
            byoAddToBagRequest: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagsprocessapi/api/process/v1/shoppingbags/buildyourown/add',
            byoskuEcomAddEndPoint: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagsprocessapi/api/process/v1/shoppingbags/buildyourown/add',
            savehintByo: '/api/ByoDropAHint',
            diamondSelectionUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/ecomproductsearchprocessapi/api/process/v1/productsearch/engagementgroupsearch',
            diamondSelectionMock: '/api/engagement/groupsearch',
            designForDropAHint: '/api/ByoDropAHint',
            listbycountry: 'https://dev-api.tiffco.net/ibmdev/dev01/storessystemapi/api/system/v1/stores/listbycountry',
            enGroupCompleteUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/productsprocessapi/api/process/v1/products/engagementgroup/complete',
            nearbyStoreEndPoint: 'https://dev-api.tiffco.net/ibmdev/dev01/storesprocessapi/api/process/v1/stores/store/neareststore',
            nearbyStoreEndPointMock: '/api/engagement/nearStore',
            userSessionRefresh: {
                endPoint: '/content/tiffany-n-co/_jcr_content/servlets/usersession.refresh.json?currentTime=',
                cookieName: 'samebrowsersession'
            }
        };
        window.tiffany.authoredContent = {
            selLanCookExpDate: 20,
            preventFlyoutHover: false,
            richRelevanceMarketCarouselLazyLoad: true,
            wishlistSystemConfig: {
                url: 'wishListSystemUrl',
                method: 'POST',
                payload: {
                    priceMarketID: '1',
                    siteid: '1',
                    assortmentID: '101',
                    webCustomerID: ''
                }
            },
            customDesignsSystemRequest: {
                url: 'customWishListSystemUrl',
                method: 'POST',
                payload: {
                    priceMarketID: '1',
                    siteid: '1',
                    assortmentID: '101',
                    webCustomerID: ''
                }
            },
            shoppingBagCountRequest: {
                url: 'shoppingBagCountUrl',
                method: 'POST',
                payload: {
                    priceMarketID: '1',
                    siteid: '1',
                    assortmentID: '101',
                    webCustomerID: ''
                }
            },
            shoppingBagSystemRequest: {
                url: 'shoppingBagSystemUrl',
                method: 'POST',
                payload: {
                    priceMarketID: '1',
                    siteid: '1',
                    assortmentID: '101',
                    webCustomerID: ''
                }
            },
            isEstore: false,
            areComponentsExposed: false,
            siteID: 102,
            isClickToPay: true,
            autocompleteServlet: '/content/blank',
            globalSiteConfig: [
                { siteID: 1, googleMapRegionCode: 'US', googleMapLanguageCode: 'en' },
                { siteID: 5, googleMapRegionCode: 'CN', googleMapLanguageCode: 'en' }
            ],
            countryEUArray: {
                values: ['en_GB', 'en_IE', 'en_BE', 'en_NL', 'fr_FR', 'de_DE', 'de_AT', 'it_IT', 'es_ES']
            },
            namedCountries: {
                en_US: 'United States',
                ru_RU: 'Россия',
                fr_CA: 'Canada (Français)',
                en_CA: 'Canada',
                es_MX: 'México',
                pt_BR: 'Brazil',
                en_AU: '한국',
                ja_JP: '日本',
                ko_KR: 'Australia',
                de: [
                    'Vereinigtes Königreich',
                    'Irland',
                    'Belgien',
                    'Niederlande',
                    'Frankreich',
                    'Deutschland',
                    'Österreich',
                    'Italien',
                    'Spanien',
                    'Tschechien',
                    'Schweiz'
                ],
                en: [
                    'United Kingdom',
                    'Ireland',
                    'Belgium',
                    'Netherlands',
                    'France',
                    'Germany',
                    'Austria',
                    'Italy',
                    'Spain',
                    'Czech Republic',
                    'Switzerland'
                ],
                fr: [
                    'Royaume-Uni',
                    'Irlande',
                    'Belgique',
                    'Pays-Bas',
                    'France',
                    'Allemagne',
                    'Autriche',
                    'Italie',
                    'Espagne',
                    'Tchéquie',
                    'Suisse'
                ],
                es: [
                    'Reino Unido',
                    'Irlanda',
                    'Bélgica',
                    'Países Bajos',
                    'Francia',
                    'Alemania',
                    'Austria',
                    'Italia',
                    'España',
                    'Chequia',
                    'Suiza'
                ],
                it: [
                    'Regno Unito',
                    'Irlanda',
                    'Belgio',
                    'Paesi Bassi',
                    'Francia',
                    'Germania',
                    'Austria',
                    'Italia',
                    'Spagna',
                    'Repubblica Ceca',
                    'Svizzera'
                ]
            },
            isEngravingExposed: false,
            atYourService: {
                imageIcon: './icons/email.svg',
                imageIconAlt: 'Shipping and returns',
                emailInteractionName: 'Email'
            },
            engagementpdpConfig: {
                description: 'Description',
                dropHint: {
                    heading: 'Engagement Drop a hint',
                    ariaLabelText: 'Drop a hint',
                    dropHintIcon: './icons/shopping-bag.svg',
                    dropHintIconAltText: 'Drop a Hint',
                    dropHintLabelText: 'Drop a Hint',
                    ariaLabels: {
                        closeAriaLabel: 'Close icon',
                        leftArrowAriaLabel: 'Left arrow icon'
                    },
                    fields: {
                        recipientFirstName: {
                            placeholder: 'Recipient\'s First Name',
                            maxLength: 16,
                            mandatoryMessage: 'RFN field is mandatory'
                        },
                        recipientMail: {
                            placeholder: 'Recipient\'s Email',
                            maxLength: 16,
                            mandatoryMessage: 'RM field is mandatory',
                            missMatchMessage: 'RM is not valid'
                        },
                        firstName: {
                            placeholder: 'Your First Name',
                            maxLength: 16,
                            mandatoryMessage: 'FN field is mandatory'
                        },
                        mail: {
                            placeholder: 'Your Email',
                            maxLength: 16,
                            mandatoryMessage: 'M field is mandatory',
                            missMatchMessage: 'M is not valid'
                        }
                    },
                    cta: {
                        text: 'Send',
                        url: 'dropHintUrl',
                        method: 'POST',
                        payload: {
                            CategoryId: '',
                            DropAHintSource: 1,
                            DropAHintType: 1,
                            GroupSku: 'GRP09538',
                            ParentGroupSku: '',
                            SceneSelection: 1,
                            assortmentID: 101,
                            imageUrl: '',
                            mailSubject: '{{%receiverName}},  Here\'s a little hint from {{%senderName}}',
                            recipientEmail: '',
                            recipientName: '',
                            senderEmail: '',
                            senderName: '',
                            siteId: 1,
                            sku: '60450323',
                            webCustomerId: '',
                            isEngagement: false
                        }
                    },
                    saveHintConfig: {
                        url: 'savehint',
                        method: 'POST',
                        payload: {
                            DropAHintListCode: '',
                            webCustomerId: '',
                            ListTypeId: 6,
                            SiteId: 1
                        }
                    },
                    captcha: {
                        heading: 'Protected by recaptcha',
                        icon: {
                            defaultSrc: '//media.tiffany.com/is/image/Tiffany/DAH_200x200_Thumb_4',
                            altText: 'captcha icon'
                        },
                        maxCta: 4,
                        ctas: [
                            {
                                text: 'Privacy',
                                link: '/',
                                target: '_new'
                            },
                            {
                                text: 'Terms',
                                link: '/',
                                target: '_new'
                            }
                        ]
                    },
                    thumbnails: {
                        images: [
                            {
                                defaultSrc: '//media.tiffany.com/is/image/Tiffany/DAH_200x200_Thumb_4',
                                isLazyLoad: true,
                                altText: 'Dumy post card image',
                                ariaLabel: 'Thumbnail 1 aria label',
                                preview: {
                                    defaultSrc: '//media.tiffany.com/is/image/Tiffany/DAH_200x200_Thumb_4?&hei=456&wid=456',
                                    isLazyLoad: true,
                                    altText: 'Some Image'
                                }
                            },
                            {
                                defaultSrc: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/tiffany-hardwearball-dangle-ring-60450455_969563_ED_M.jpg?op_usm=1.5,1,6&defaultImage=NoImageAvailable&&',
                                isLazyLoad: true,
                                altText: 'Dumy image',
                                ariaLabel: 'Thumbnail 2 aria label',
                                preview: {
                                    defaultSrc: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/tiffany-hardwearball-dangle-ring-60450455_969563_ED_M.jpg?op_usm=1.5,1,6&defaultImage=NoImageAvailable&&hei=456&wid=456',
                                    isLazyLoad: true,
                                    altText: 'Some Image'
                                }
                            }
                        ],
                        hint: '<div class="tiffany-rte"><p>Dear RECIPIENT_NAME,<br/>Apparently SENDER_NAME has been daydreaming about this and we thought you’d definitely want to know. A hint from your friends at Tiffany.</p></div>',
                        isHintRTE: true
                    },
                    confirmation: {
                        text: 'Your message has be successfully Sent!',
                        showAll: {
                            text: 'See my sent hints',
                            link: '/',
                            target: '_new'
                        },
                        duration: 4000
                    }
                }
            },
            currencyConfig: {
                locale: 'fr-ca', // Defaults to en-US
                currency: 'CAD', // defaults to USD
                currencyDisplay: 'symbol', // name/code/symbol Ex: US dollars, USD, $ // default: symbol
                charactersToIgnore: 3, // number of characters to be ignored from the ending. This will take effect only when show decimals is false
                showDecimals: false, // show decimals or not
                customCurrency: 'CDN$', // custom currency to be displayed
                displayAhead: true, // where should the currency be displayed if custom
                delimeterToSearch: '%C2%A0', // the delimeter that will be searched according to the custom currency
                delimeterToReplace: ',' // the delimeter that will be replaced according to the custom currency
            },
            productNotPurchasableConfig: {
                productImageUrl: '//media.tiffany.com/is/image/TiffanyDev/EcomInlineM/return-to-tiffanyheart-tag-charm-bracelet-18967529_922618_ED_M.jpg?&defaultImage=NoImageAvailableInternal&&',
                notifyMeButtonText: 'Notify me when available',
                textBeforeProductName: 'We will let you know when',
                textAfterProductName: 'becomes available.',
                emailDescriptionRTE: '<div class="tiffany-rte"><p>Your email address will only be used to let you know when the product becomes available.</p></div>',
                emailInputPlaceholder: 'Your email address',
                submitButtonLabel: 'Submit',
                invalidMailError: 'Please enter a valid e-mail address',
                confirmTextBeforeProductName: 'We will let you know when',
                confirmTextAfterProductName: 'becomes available.',
                istatusNotificationUrl: 'https://dev-api.tiffco.net/ibmdev/dev01/saveditemsprocessapi/api/process/v1/saveditems/item/notification/add',
                istatusMethod: 'POST',
                iStatusNotificationPayloadBean: {
                    emailAddress: '',
                    groupSku: '',
                    parentGroupSku: '',
                    sku: '',
                    assortmentId: '101',
                    categoryId: '',
                    priceMarketId: '1',
                    requestedPageName: '',
                    siteId: '1'
                }
            },
            captchaConfig: {
                siteKey: '6LeEHGoUAAAAAJdKkOfDjJ6JUdvyzPKZc_5ltBNO'
            },
            requestAuthHeaders: {
                secretkey: 'secret',
                clientkey: 'clientid'
            },
            baseUrl: '/shop/tiffanyt',
            filterPriorityMap: ['MATERIALS', 'DESIGNERS & COLLECTIONS', 'COLLECTIONS', 'GEMSTONECOLOR', 'GEMSTONES', 'CUSTOM PRICE', 'PRICE RANGES', 'CATEGORIES'],
            // For Engagement Priority map for Dev
            // filterPriorityMap: ['COLLECTIONS', 'DIAMONDS', 'MATERIALS', 'SETTINGS', 'GEMSTONES', 'UNMAPPED CATEGORIES'],
            filtersMap: [
                {
                    filterUrlId: 'tableware',
                    filterCategoryId: '3779737',
                    filterDimensionId: '1603779737',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'price-500-1000',
                    filterCategoryId: '',
                    filterDimensionId: '1015010',
                    filterOrder: '3',
                    filterType: 'PRICE RANGES'
                },
                {
                    filterUrlId: 'price-0-250',
                    filterCategoryId: '',
                    filterDimensionId: '1010025',
                    filterOrder: '1',
                    filterType: 'PRICE RANGES'
                },
                {
                    filterUrlId: 'price-250-500',
                    filterCategoryId: '',
                    filterDimensionId: '1012550',
                    filterOrder: '2',
                    filterType: 'PRICE RANGES'
                },
                {
                    filterUrlId: 'price-1000-2000',
                    filterCategoryId: '',
                    filterDimensionId: '1011020',
                    filterOrder: '4',
                    filterType: 'PRICE RANGES'
                },
                {
                    filterUrlId: 'price-5000-above',
                    filterCategoryId: '',
                    filterDimensionId: '1015000',
                    filterOrder: '6',
                    filterType: 'PRICE RANGES'
                },
                {
                    filterUrlId: 'price-2000-5000',
                    filterCategoryId: '',
                    filterDimensionId: '1012050',
                    filterOrder: '5',
                    filterType: 'PRICE RANGES'
                },
                {
                    filterUrlId: 'price ranges',
                    filterCategoryId: '',
                    filterDimensionId: '4',
                    filterOrder: '',
                    filterType: ''
                },
                {
                    filterUrlId: 'price ranges',
                    filterCategoryId: '',
                    filterDimensionId: 'custom',
                    filterOrder: '2',
                    filterType: 'CUSTOM PRICE'
                },
                {
                    filterUrlId: 'tanzanites',
                    filterCategoryId: '',
                    filterDimensionId: '1011664798',
                    filterOrder: '4',
                    filterType: 'GEMSTONES'
                },
                {
                    filterUrlId: 'sapphires',
                    filterCategoryId: '',
                    filterDimensionId: '101323353',
                    filterOrder: '5',
                    filterType: 'GEMSTONES'
                },
                {
                    filterUrlId: 'colored-diamonds',
                    filterCategoryId: '',
                    filterDimensionId: '1012531876',
                    filterOrder: '2',
                    filterType: 'GEMSTONES'
                },
                {
                    filterUrlId: 'aquamarines',
                    filterCategoryId: '',
                    filterDimensionId: '101323354',
                    filterOrder: '6',
                    filterType: 'GEMSTONES'
                },
                {
                    filterUrlId: 'onyx',
                    filterCategoryId: '',
                    filterDimensionId: '101323356',
                    filterOrder: '8',
                    filterType: 'GEMSTONES'
                },
                {
                    filterUrlId: 'diamonds',
                    filterCategoryId: '',
                    filterDimensionId: '101323351',
                    filterOrder: '1',
                    filterType: 'GEMSTONES'
                },
                {
                    filterUrlId: 'no-gemstone',
                    filterCategoryId: '',
                    filterDimensionId: '1013625968',
                    filterOrder: '10',
                    filterType: 'GEMSTONES'
                },
                {
                    filterUrlId: 'colored-gemstones',
                    filterCategoryId: '',
                    filterDimensionId: '101323357',
                    filterOrder: '9',
                    filterType: 'GEMSTONES'
                },
                {
                    filterUrlId: 'pearls',
                    filterCategoryId: '',
                    filterDimensionId: '101323352',
                    filterOrder: '3',
                    filterType: 'GEMSTONES'
                },
                {
                    filterUrlId: 'turquoise',
                    filterCategoryId: '',
                    filterDimensionId: '101323355',
                    filterOrder: '7',
                    filterType: 'GEMSTONES'
                },
                {
                    filterUrlId: 'gemstones',
                    filterCategoryId: '',
                    filterDimensionId: '6',
                    filterOrder: '',
                    filterType: ''
                },
                {
                    filterUrlId: 'bone-china',
                    filterCategoryId: '',
                    filterDimensionId: '101323344',
                    filterOrder: '9',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'lacquer',
                    filterCategoryId: '',
                    filterDimensionId: '101323348',
                    filterOrder: '13',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'copper',
                    filterCategoryId: '',
                    filterDimensionId: '1012539212',
                    filterOrder: '24',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'platinum',
                    filterCategoryId: '',
                    filterDimensionId: '101323340',
                    filterOrder: '3',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'porcelain',
                    filterCategoryId: '',
                    filterDimensionId: '101323349',
                    filterOrder: '14',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'gold',
                    filterCategoryId: '',
                    filterDimensionId: '101323339',
                    filterOrder: '2',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'glass',
                    filterCategoryId: '',
                    filterDimensionId: '101323347',
                    filterOrder: '12',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'leather',
                    filterCategoryId: '',
                    filterDimensionId: '101323350',
                    filterOrder: '15',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'titanium',
                    filterCategoryId: '',
                    filterDimensionId: '101323343',
                    filterOrder: '8',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'rubedo-metal',
                    filterCategoryId: '',
                    filterDimensionId: '101746884',
                    filterOrder: '6',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'sterling-silver',
                    filterCategoryId: '',
                    filterDimensionId: '101323338',
                    filterOrder: '1',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'silk',
                    filterCategoryId: '',
                    filterDimensionId: '1012574113',
                    filterOrder: '20',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'crystal',
                    filterCategoryId: '',
                    filterDimensionId: '101323345',
                    filterOrder: '10',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'exotic-skin',
                    filterCategoryId: '',
                    filterDimensionId: '101662202',
                    filterOrder: '16',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'stainless-steel',
                    filterCategoryId: '',
                    filterDimensionId: '101323342',
                    filterOrder: '7',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'white-gold',
                    filterCategoryId: '',
                    filterDimensionId: '101323341',
                    filterOrder: '4',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'satin',
                    filterCategoryId: '',
                    filterDimensionId: '101662203',
                    filterOrder: '18',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'pewter',
                    filterCategoryId: '',
                    filterDimensionId: '101756886',
                    filterOrder: '21',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'earthenware',
                    filterCategoryId: '',
                    filterDimensionId: '101323346',
                    filterOrder: '11',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'ruthenium',
                    filterCategoryId: '',
                    filterDimensionId: '1012472586',
                    filterOrder: '23',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'rose-gold',
                    filterCategoryId: '',
                    filterDimensionId: '101607567',
                    filterOrder: '5',
                    filterType: 'MATERIALS'
                },
                {
                    filterUrlId: 'materials',
                    filterCategoryId: '',
                    filterDimensionId: '5',
                    filterOrder: '',
                    filterType: ''
                },
                {
                    filterUrlId: 'tiffany t',
                    filterCategoryId: '3240509',
                    filterDimensionId: '1013240509',
                    filterOrder: '5',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-soleste',
                    filterCategoryId: '1666181',
                    filterDimensionId: '1011666181',
                    filterOrder: '30',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'watches-tiffany-ct60',
                    filterCategoryId: '586216',
                    filterDimensionId: '101586216',
                    filterOrder: '44',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-notes',
                    filterCategoryId: '471074',
                    filterDimensionId: '101471074',
                    filterOrder: '28',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'the-shell-and-thread-collection',
                    filterCategoryId: '130409',
                    filterDimensionId: '101130409',
                    filterOrder: '67',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-circlet',
                    filterCategoryId: '574694',
                    filterDimensionId: '101574694',
                    filterOrder: '13',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-enchant',
                    filterCategoryId: '1638643',
                    filterDimensionId: '1011638643',
                    filterOrder: '16',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany yellow diamonds',
                    filterCategoryId: '',
                    filterDimensionId: '101649502',
                    filterOrder: '9',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'the-atlas-collection',
                    filterCategoryId: '288192',
                    filterDimensionId: '101288192',
                    filterOrder: '7',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso',
                    filterCategoryId: '288189',
                    filterDimensionId: '101288189',
                    filterOrder: '2',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-locks',
                    filterCategoryId: '675129',
                    filterDimensionId: '101675129',
                    filterOrder: '27',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'the-floral-vine-collection',
                    filterCategoryId: '2995766',
                    filterDimensionId: '1012995766',
                    filterOrder: '60',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'chrysanthemum',
                    filterCategoryId: '130394',
                    filterDimensionId: '101130394',
                    filterOrder: '50',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-signature',
                    filterCategoryId: '288200',
                    filterDimensionId: '101288200',
                    filterOrder: '32',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-legacy',
                    filterCategoryId: '288199',
                    filterDimensionId: '101288199',
                    filterOrder: '26',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'hampton',
                    filterCategoryId: '130400',
                    filterDimensionId: '101130400',
                    filterOrder: '51',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'watches-tiffany-east-west',
                    filterCategoryId: '460369',
                    filterDimensionId: '101460369',
                    filterOrder: '45',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-bezet',
                    filterCategoryId: '661664',
                    filterDimensionId: '101661664',
                    filterOrder: '12',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'jean-schlumberger',
                    filterCategoryId: '288190',
                    filterDimensionId: '101288190',
                    filterOrder: '4',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'the-provence-collection',
                    filterCategoryId: '130407',
                    filterDimensionId: '101130407',
                    filterOrder: '61',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-sparklers',
                    filterCategoryId: '594261',
                    filterDimensionId: '101594261',
                    filterOrder: '31',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'etoile',
                    filterCategoryId: '288194',
                    filterDimensionId: '101288194',
                    filterOrder: '17',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany keys',
                    filterCategoryId: '',
                    filterDimensionId: '101573050',
                    filterOrder: '25',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-beads',
                    filterCategoryId: '554142',
                    filterDimensionId: '101554142',
                    filterOrder: '11',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany infinity',
                    filterCategoryId: '',
                    filterDimensionId: '1012605744',
                    filterOrder: '23',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-metro',
                    filterCategoryId: '579740',
                    filterDimensionId: '101579740',
                    filterOrder: '29',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'the-faneuil-collection',
                    filterCategoryId: '130397',
                    filterDimensionId: '101130397',
                    filterOrder: '59',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-jazz',
                    filterCategoryId: '288197',
                    filterDimensionId: '101288197',
                    filterOrder: '24',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-twist',
                    filterCategoryId: '670056',
                    filterDimensionId: '101670056',
                    filterOrder: '35',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-holiday-china',
                    filterCategoryId: '130345',
                    filterDimensionId: '101130345',
                    filterOrder: '71',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'the-english-king',
                    filterCategoryId: '2995765',
                    filterDimensionId: '1012995765',
                    filterOrder: '58',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti',
                    filterCategoryId: '288187',
                    filterDimensionId: '101288187',
                    filterOrder: '1',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-cobblestone',
                    filterCategoryId: '2653697',
                    filterDimensionId: '1012653697',
                    filterOrder: '15',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-aria',
                    filterCategoryId: '2632089',
                    filterDimensionId: '1012632089',
                    filterOrder: '10',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'the-revere-collectiontabletop',
                    filterCategoryId: '2659643',
                    filterDimensionId: '1012659643',
                    filterOrder: '64',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'tiffany-weave',
                    filterCategoryId: '130342',
                    filterDimensionId: '101130342',
                    filterOrder: '69',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'rtt',
                    filterCategoryId: '288196',
                    filterDimensionId: '101288196',
                    filterOrder: '19',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'ziegfeld-collection',
                    filterCategoryId: '2610354',
                    filterDimensionId: '1012610354',
                    filterOrder: '38',
                    filterType: 'DESIGNERS & COLLECTIONS'
                },
                {
                    filterUrlId: 'DESIGNERS & COLLECTIONS',
                    filterCategoryId: '',
                    filterDimensionId: '2',
                    filterOrder: '',
                    filterType: ''
                },
                {
                    filterUrlId: 'paloma-picasso-other-picasso-designs',
                    filterCategoryId: '297704',
                    filterDimensionId: '101297704',
                    filterOrder: '52',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-pearls-by-the-yard',
                    filterCategoryId: '476811',
                    filterDimensionId: '101476811',
                    filterOrder: '16',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-bean',
                    filterCategoryId: '297646',
                    filterDimensionId: '101297646',
                    filterOrder: '4',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-bottle',
                    filterCategoryId: '698707',
                    filterDimensionId: '101698707',
                    filterOrder: '5',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-cat-island',
                    filterCategoryId: '2646111',
                    filterDimensionId: '1012646111',
                    filterOrder: '9',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-doughnut',
                    filterCategoryId: '2580396',
                    filterDimensionId: '1012580396',
                    filterOrder: '12',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-mesh',
                    filterCategoryId: '660252',
                    filterDimensionId: '101660252',
                    filterOrder: '14',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-wave',
                    filterCategoryId: '2580397',
                    filterDimensionId: '1012580397',
                    filterOrder: '24',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-apple',
                    filterCategoryId: '2608334',
                    filterDimensionId: '1012608334',
                    filterOrder: '2',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-melody',
                    filterCategoryId: '718897',
                    filterDimensionId: '101718897',
                    filterOrder: '31',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-venezia-luce',
                    filterCategoryId: '715768',
                    filterDimensionId: '101715768',
                    filterOrder: '44',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-hammered',
                    filterCategoryId: '635729',
                    filterDimensionId: '101635729',
                    filterOrder: '35',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-accessories',
                    filterCategoryId: '2979875',
                    filterDimensionId: '1012979875',
                    filterOrder: '26',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-accessories',
                    filterCategoryId: '297699',
                    filterDimensionId: '101297699',
                    filterOrder: '51',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'jean-schlumberger-rope',
                    filterCategoryId: '2632049',
                    filterDimensionId: '1012632049',
                    filterOrder: '68',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-carved-stone',
                    filterCategoryId: '2580398',
                    filterDimensionId: '1012580398',
                    filterOrder: '7',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-starfish',
                    filterCategoryId: '660253',
                    filterDimensionId: '101660253',
                    filterOrder: '19',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-color-by-the-yard',
                    filterCategoryId: '3053507',
                    filterDimensionId: '1013053507',
                    filterOrder: '10',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-bone',
                    filterCategoryId: '2580399',
                    filterDimensionId: '1012580399',
                    filterOrder: '6',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'quintessential-schlumberger',
                    filterCategoryId: '316254',
                    filterDimensionId: '101316254',
                    filterOrder: '70',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-modern-heart',
                    filterCategoryId: '641480',
                    filterDimensionId: '101641480',
                    filterOrder: '39',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-olive-leaf',
                    filterCategoryId: '2590357',
                    filterDimensionId: '1012590357',
                    filterOrder: '40',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-venezia-goldoni',
                    filterCategoryId: '715767',
                    filterDimensionId: '101715767',
                    filterOrder: '43',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-aegean',
                    filterCategoryId: '2580401',
                    filterDimensionId: '1012580401',
                    filterOrder: '3',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-venezia',
                    filterCategoryId: '712279',
                    filterDimensionId: '101712279',
                    filterOrder: '42',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-sevillana',
                    filterCategoryId: '297649',
                    filterDimensionId: '101297649',
                    filterOrder: '18',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-loving-heart',
                    filterCategoryId: '297689',
                    filterDimensionId: '101297689',
                    filterOrder: '36',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-sugar-stacks',
                    filterCategoryId: '297694',
                    filterDimensionId: '101297694',
                    filterOrder: '41',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-other-peretti-designs',
                    filterCategoryId: '297652',
                    filterDimensionId: '101297652',
                    filterOrder: '28',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-padova',
                    filterCategoryId: '130395',
                    filterDimensionId: '101130395',
                    filterOrder: '25',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'peretti-home',
                    filterCategoryId: '297651',
                    filterDimensionId: '101297651',
                    filterOrder: '22',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-thumbprint',
                    filterCategoryId: '2580402',
                    filterDimensionId: '1012580402',
                    filterOrder: '23',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-mens-designs-accessories',
                    filterCategoryId: '316261',
                    filterDimensionId: '101316261',
                    filterOrder: '38',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-round',
                    filterCategoryId: '316220',
                    filterDimensionId: '101316220',
                    filterOrder: '17',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-baby',
                    filterCategoryId: '158115',
                    filterDimensionId: '101158115',
                    filterOrder: '27',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-designs-for-men',
                    filterCategoryId: '2980150',
                    filterDimensionId: '1012980150',
                    filterOrder: '21',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'schlumberger-lynn',
                    filterCategoryId: '2648227',
                    filterDimensionId: '1012648227',
                    filterOrder: '69',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-full-heart',
                    filterCategoryId: '1647849',
                    filterDimensionId: '1011647849',
                    filterOrder: '13',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-diamonds-by-the-yard',
                    filterCategoryId: '297647',
                    filterDimensionId: '101297647',
                    filterOrder: '11',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'gifts-for-him-palomas-groove',
                    filterCategoryId: '316259',
                    filterDimensionId: '101316259',
                    filterOrder: '50',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'paloma-picasso-graffiti',
                    filterCategoryId: '648346',
                    filterDimensionId: '101648346',
                    filterOrder: '34',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'jean-schlumberger-sixteen-stone',
                    filterCategoryId: '3000435',
                    filterDimensionId: '1013000435',
                    filterOrder: '67',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-teardrop',
                    filterCategoryId: '297650',
                    filterDimensionId: '101297650',
                    filterOrder: '20',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'schlumberger-enamel',
                    filterCategoryId: '566421',
                    filterDimensionId: '101566421',
                    filterOrder: '66',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'elsa-peretti-cabochon',
                    filterCategoryId: '712578',
                    filterDimensionId: '101712578',
                    filterOrder: '8',
                    filterType: 'COLLECTIONS'
                },
                {
                    filterUrlId: 'collections',
                    filterCategoryId: '',
                    filterDimensionId: '3',
                    filterOrder: '',
                    filterType: ''
                },
                {
                    filterUrlId: 'brown',
                    filterCategoryId: '',
                    filterDimensionId: '1013620947',
                    filterOrder: '3',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'blue',
                    filterCategoryId: '',
                    filterDimensionId: '1013044789',
                    filterOrder: '2',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'multicolored',
                    filterCategoryId: '',
                    filterDimensionId: '1013044791',
                    filterOrder: '6',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'black',
                    filterCategoryId: '',
                    filterDimensionId: '1013044788',
                    filterOrder: '1',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'red',
                    filterCategoryId: '',
                    filterDimensionId: '1013044795',
                    filterOrder: '10',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'orange',
                    filterCategoryId: '',
                    filterDimensionId: '1013044792',
                    filterOrder: '7',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'yellow',
                    filterCategoryId: '',
                    filterDimensionId: '1013044797',
                    filterOrder: '12',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'purple',
                    filterCategoryId: '',
                    filterDimensionId: '1013044794',
                    filterOrder: '9',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'colorless',
                    filterCategoryId: '',
                    filterDimensionId: '1013620948',
                    filterOrder: '4',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'pink',
                    filterCategoryId: '',
                    filterDimensionId: '1013044793',
                    filterOrder: '8',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'green',
                    filterCategoryId: '',
                    filterDimensionId: '1013044790',
                    filterOrder: '5',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'white',
                    filterCategoryId: '',
                    filterDimensionId: '1013044796',
                    filterOrder: '11',
                    filterType: 'GEMSTONECOLOR'
                },
                {
                    filterUrlId: 'gemstonecolor',
                    filterCategoryId: '',
                    filterDimensionId: '14',
                    filterOrder: '',
                    filterType: ''
                },
                {
                    filterUrlId: 'audubon-flatware',
                    filterCategoryId: '130391',
                    filterDimensionId: '101130391',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'sense-sensuality-style-edit',
                    filterCategoryId: '3597697',
                    filterDimensionId: '1013597697',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'the-most-brilliant-proposal',
                    filterCategoryId: '449303',
                    filterDimensionId: '101449303',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'jewelry-1500-under',
                    filterCategoryId: '578712',
                    filterDimensionId: '101578712',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'wall-street-or-fifth-avenue',
                    filterCategoryId: '479593',
                    filterDimensionId: '101479593',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'plaid-crystal',
                    filterCategoryId: '2992011',
                    filterDimensionId: '1012992011',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'jewelry-250-under',
                    filterCategoryId: '563632',
                    filterDimensionId: '101563632',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'gilded-graphic-style-edit',
                    filterCategoryId: '3597696',
                    filterDimensionId: '1013597696',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-charms-travel',
                    filterCategoryId: '543409',
                    filterDimensionId: '101543409',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'gifts-for-him-mens-accessories',
                    filterCategoryId: '316228',
                    filterDimensionId: '101316228',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'king-william',
                    filterCategoryId: '130404',
                    filterDimensionId: '101130404',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'elsa-peretti-home',
                    filterCategoryId: '129078',
                    filterDimensionId: '101129078',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-pink-diamonds',
                    filterCategoryId: '2500847',
                    filterDimensionId: '1012500847',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'patek-philippe-partnership',
                    filterCategoryId: '3275979',
                    filterDimensionId: '1013275979',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'bridal-party-gifts',
                    filterCategoryId: '316227',
                    filterDimensionId: '101316227',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'afternoon-tea',
                    filterCategoryId: '2659564',
                    filterDimensionId: '1012659564',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'rubedo-metal-designs',
                    filterCategoryId: '746861',
                    filterDimensionId: '101746861',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'mens-bracelets',
                    filterCategoryId: '288161',
                    filterDimensionId: '101288161',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'return-to-tiffany-love',
                    filterCategoryId: '3552345',
                    filterDimensionId: '1013552345',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'gifts-for-him',
                    filterCategoryId: '288180',
                    filterDimensionId: '101288180',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'elsa-peretti-250-under',
                    filterCategoryId: '563631',
                    filterDimensionId: '101563631',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'wedding-china-gifts',
                    filterCategoryId: '316224',
                    filterDimensionId: '101316224',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'timeless-chic',
                    filterCategoryId: '543413',
                    filterDimensionId: '101543413',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'gifts-500-under',
                    filterCategoryId: '563629',
                    filterDimensionId: '101563629',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'a-joyous-union',
                    filterCategoryId: '2659576',
                    filterDimensionId: '1012659576',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'soft-and-subtle-style-edit',
                    filterCategoryId: '3616635',
                    filterDimensionId: '1013616635',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'solitaire-jewelry',
                    filterCategoryId: '287467',
                    filterDimensionId: '101287467',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'gifts-for-dad',
                    filterCategoryId: '484981',
                    filterDimensionId: '101484981',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-nature-jewelry',
                    filterCategoryId: '484813',
                    filterDimensionId: '101484813',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'atlas-womens-watches',
                    filterCategoryId: '319420',
                    filterDimensionId: '101319420',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'glamorous-chic',
                    filterCategoryId: '543414',
                    filterDimensionId: '101543414',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'san-lorenzo',
                    filterCategoryId: '130408',
                    filterDimensionId: '101130408',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tfb-tiffany-recognition-programs',
                    filterCategoryId: '3144378',
                    filterDimensionId: '1013144378',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'holiday-business-gifts',
                    filterCategoryId: '560880',
                    filterDimensionId: '101560880',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'hamilton',
                    filterCategoryId: '130399',
                    filterDimensionId: '101130399',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'palmette',
                    filterCategoryId: '130406',
                    filterDimensionId: '101130406',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'this-is-tiffany',
                    filterCategoryId: '616856',
                    filterDimensionId: '101616856',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'peretti-home-module-padova',
                    filterCategoryId: '671062',
                    filterDimensionId: '101671062',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'corporate-responsibility',
                    filterCategoryId: '3216226',
                    filterDimensionId: '1013216226',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'elsa-peretti-snake-and-scorpion',
                    filterCategoryId: '2980149',
                    filterDimensionId: '1012980149',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'ct60-3-hand-diamonds',
                    filterCategoryId: '460340',
                    filterDimensionId: '101460340',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'patek-philippe-tiffany',
                    filterCategoryId: '3262786',
                    filterDimensionId: '1013262786',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'jewelry-500-under',
                    filterCategoryId: '3366777',
                    filterDimensionId: '1013366777',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'wave-edge',
                    filterCategoryId: '130410',
                    filterDimensionId: '101130410',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'mix-and-mingle-style-edit',
                    filterCategoryId: '3614580',
                    filterDimensionId: '1013614580',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-ct60-3-hand-non-diamond',
                    filterCategoryId: '736985',
                    filterDimensionId: '101736985',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'atlas-horizontal',
                    filterCategoryId: '3177534',
                    filterDimensionId: '1013177534',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'isnt-it-romantic',
                    filterCategoryId: '2659575',
                    filterDimensionId: '1012659575',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'mens-sterling-accessories',
                    filterCategoryId: '288185',
                    filterDimensionId: '101288185',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'wedding-gift-guide-wedding-bands',
                    filterCategoryId: '288152',
                    filterDimensionId: '101288152',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tabletop-serving-pieces',
                    filterCategoryId: '316225',
                    filterDimensionId: '101316225',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'fall-magazine',
                    filterCategoryId: '3421390',
                    filterDimensionId: '1013421390',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'everyday-elegance',
                    filterCategoryId: '2659572',
                    filterDimensionId: '1012659572',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'the-wedding-guide-gifts-for-the-bridesmaids',
                    filterCategoryId: '3209447',
                    filterDimensionId: '1013209447',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'elsa-peretti-peretti-favorites',
                    filterCategoryId: '316262',
                    filterDimensionId: '101316262',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'new-jewelry',
                    filterCategoryId: '622067',
                    filterDimensionId: '101622067',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'the-wedding-guide-bridal-jewelry',
                    filterCategoryId: '3209444',
                    filterDimensionId: '1013209444',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-high-jewelry',
                    filterCategoryId: '3554751',
                    filterDimensionId: '1013554751',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'the-wedding-guide-gifts-for-the-groom',
                    filterCategoryId: '3209446',
                    filterDimensionId: '1013209446',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'teapots-cups-tabletop',
                    filterCategoryId: '2674305',
                    filterDimensionId: '1012674305',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'bamboo-flatware',
                    filterCategoryId: '130392',
                    filterDimensionId: '101130392',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-silver-jewelry',
                    filterCategoryId: '288158',
                    filterDimensionId: '101288158',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tcs-new-york-city-marathon-collection',
                    filterCategoryId: '609081',
                    filterDimensionId: '101609081',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'seguso-for-tiffany-co',
                    filterCategoryId: '2674005',
                    filterDimensionId: '1012674005',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'wedding-bands',
                    filterCategoryId: '716543',
                    filterDimensionId: '101716543',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'gifts-250-under',
                    filterCategoryId: '563630',
                    filterDimensionId: '101563630',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'the-wedding-guide-gifts-for-the-groomsmen',
                    filterCategoryId: '3209448',
                    filterDimensionId: '1013209448',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'express-your-love',
                    filterCategoryId: '449307',
                    filterDimensionId: '101449307',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'mens-writing-instruments',
                    filterCategoryId: '288182',
                    filterDimensionId: '101288182',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'hollowware',
                    filterCategoryId: '129091',
                    filterDimensionId: '101129091',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'jazz-age-glamour',
                    filterCategoryId: '2605758',
                    filterDimensionId: '1012605758',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'favorite-things',
                    filterCategoryId: '2659573',
                    filterDimensionId: '1012659573',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'peretti-home-module-wave',
                    filterCategoryId: '671073',
                    filterDimensionId: '101671073',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'olympian',
                    filterCategoryId: '130405',
                    filterDimensionId: '101130405',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-masterpieces',
                    filterCategoryId: '3626872',
                    filterDimensionId: '1013626872',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-accessories',
                    filterCategoryId: '288210',
                    filterDimensionId: '101288210',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'cocktail-hour',
                    filterCategoryId: '2992024',
                    filterDimensionId: '1012992024',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'english-king',
                    filterCategoryId: '130396',
                    filterDimensionId: '101130396',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'the-hampton-collectiontabletop',
                    filterCategoryId: '2659637',
                    filterDimensionId: '1012659637',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'flemish',
                    filterCategoryId: '130398',
                    filterDimensionId: '101130398',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'the-wedding-guide-gifts-for-the-bride',
                    filterCategoryId: '3209445',
                    filterDimensionId: '1013209445',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-lockets',
                    filterCategoryId: '582232',
                    filterDimensionId: '101582232',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'silver accessories',
                    filterCategoryId: '',
                    filterDimensionId: '101096675',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'century',
                    filterCategoryId: '130393',
                    filterDimensionId: '101130393',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'engraving-customization',
                    filterCategoryId: '288209',
                    filterDimensionId: '101288209',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'gifts-for-the-home',
                    filterCategoryId: '288215',
                    filterDimensionId: '101288215',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'elsa-peretti-star',
                    filterCategoryId: '576814',
                    filterDimensionId: '101576814',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'womens-wedding-bands',
                    filterCategoryId: '4359101',
                    filterDimensionId: '1014359101',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'groomsmens-gifts',
                    filterCategoryId: '554571',
                    filterDimensionId: '101554571',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'quartz-watches',
                    filterCategoryId: '556529',
                    filterDimensionId: '101556529',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'cool-and-current-style-edit',
                    filterCategoryId: '3621164',
                    filterDimensionId: '1013621164',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'soho-in-store-pick-up',
                    filterCategoryId: '1639183',
                    filterDimensionId: '1011639183',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'business-gifts',
                    filterCategoryId: '288178',
                    filterDimensionId: '101288178',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-bow',
                    filterCategoryId: '3209537',
                    filterDimensionId: '1013209537',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'baby-china-gifts',
                    filterCategoryId: '316222',
                    filterDimensionId: '101316222',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-wedding-gifts',
                    filterCategoryId: '650229',
                    filterDimensionId: '101650229',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'east-and-west-style-edit',
                    filterCategoryId: '3621299',
                    filterDimensionId: '1013621299',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'ct60-chronograph',
                    filterCategoryId: '207058',
                    filterDimensionId: '101207058',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tabletop-gifts',
                    filterCategoryId: '288208',
                    filterDimensionId: '101288208',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'wall-street',
                    filterCategoryId: '298241',
                    filterDimensionId: '101298241',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'mens-key-rings',
                    filterCategoryId: '288181',
                    filterDimensionId: '101288181',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'atlas-chronograph-watches',
                    filterCategoryId: '556509',
                    filterDimensionId: '101556509',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'american-garden',
                    filterCategoryId: '130390',
                    filterDimensionId: '101130390',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'diamond-watches',
                    filterCategoryId: '3544448',
                    filterDimensionId: '1013544448',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'atlas-3-hand-watches',
                    filterCategoryId: '556526',
                    filterDimensionId: '101556526',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'celebration-rings',
                    filterCategoryId: '287462',
                    filterDimensionId: '101287462',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'graduation-gifts',
                    filterCategoryId: '3538606',
                    filterDimensionId: '1013538606',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'glass-and-crystal',
                    filterCategoryId: '2978116',
                    filterDimensionId: '1012978116',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'all-watches',
                    filterCategoryId: '684226',
                    filterDimensionId: '101684226',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'fifth-avenue-in-store-pickup',
                    filterCategoryId: '479592',
                    filterDimensionId: '101479592',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'peretti-home-module-thumbprint',
                    filterCategoryId: '671072',
                    filterDimensionId: '101671072',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'wedding-guide-gifts-for-the-happy-couple',
                    filterCategoryId: '3429537',
                    filterDimensionId: '1013429537',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'dinner-at-eight',
                    filterCategoryId: '2659570',
                    filterDimensionId: '1012659570',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'tiffany-metropolis',
                    filterCategoryId: '288203',
                    filterDimensionId: '101288203',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'mens-necklaces-pendants',
                    filterCategoryId: '288170',
                    filterDimensionId: '101288170',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'now-and-then-style-edit',
                    filterCategoryId: '3608501',
                    filterDimensionId: '1013608501',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'windham',
                    filterCategoryId: '130411',
                    filterDimensionId: '101130411',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'effortless-chic',
                    filterCategoryId: '543206',
                    filterDimensionId: '101543206',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'patek-fifth-ave-store',
                    filterCategoryId: '3275978',
                    filterDimensionId: '1013275978',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'table-accessories',
                    filterCategoryId: '316226',
                    filterDimensionId: '101316226',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'wedding-guide-view-all',
                    filterCategoryId: '3209443',
                    filterDimensionId: '1013209443',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'the-wedding-guide-gifts-for-the-mother-of-the-bride-and-groom',
                    filterCategoryId: '3209449',
                    filterDimensionId: '1013209449',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'gift-guide-least-expect-it',
                    filterCategoryId: '616860',
                    filterDimensionId: '101616860',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'a-tiffany-gift',
                    filterCategoryId: '3563539',
                    filterDimensionId: '1013563539',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'atlas-2-hand-watches',
                    filterCategoryId: '556523',
                    filterDimensionId: '101556523',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                },
                {
                    filterUrlId: 'unmapped categories',
                    filterCategoryId: '',
                    filterDimensionId: '',
                    filterOrder: '',
                    filterType: ''
                },
                {
                    filterUrlId: 'tiffany-charms-pure-tiffany',
                    filterCategoryId: '543407',
                    filterDimensionId: '101543407',
                    filterOrder: '1',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'tiffany-charms-personalized',
                    filterCategoryId: '566469',
                    filterDimensionId: '101566469',
                    filterOrder: '3',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'tiffany-charms-symbols',
                    filterCategoryId: '566472',
                    filterDimensionId: '101566472',
                    filterOrder: '7',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'tiffany-charms-celebrations',
                    filterCategoryId: '566542',
                    filterDimensionId: '101566542',
                    filterOrder: '4',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'tiffany-charms-whimsy',
                    filterCategoryId: '3475333',
                    filterDimensionId: '1013475333',
                    filterOrder: '5',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'tiffany-charms-love',
                    filterCategoryId: '543408',
                    filterDimensionId: '101543408',
                    filterOrder: '2',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'tiffany-charms-nature',
                    filterCategoryId: '566536',
                    filterDimensionId: '101566536',
                    filterOrder: '8',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'tiffany-charms-travel-hobbies',
                    filterCategoryId: '543406',
                    filterDimensionId: '101543406',
                    filterOrder: '9',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'save-the-wild',
                    filterCategoryId: '288195',
                    filterDimensionId: '101288195',
                    filterOrder: '10',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'rtt',
                    filterCategoryId: '288196',
                    filterDimensionId: '101288196',
                    filterOrder: '8',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'tiffany-tags',
                    filterCategoryId: '3770118',
                    filterDimensionId: '1013770118',
                    filterOrder: '9',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'whimsy',
                    filterCategoryId: '4359103',
                    filterDimensionId: '1014359103',
                    filterOrder: '1',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'blue-themed',
                    filterCategoryId: '4359105',
                    filterDimensionId: '1014359105',
                    filterOrder: '3',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'lockets',
                    filterCategoryId: '4359106',
                    filterDimensionId: '1014359106',
                    filterOrder: '4',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'tiffany-keys',
                    filterCategoryId: '573050',
                    filterDimensionId: '101573050',
                    filterOrder: '7',
                    filterType: 'CHARMS'
                },
                {
                    filterUrlId: 'tiffany-co-charms',
                    filterCategoryId: '',
                    filterDimensionId: '101570368',
                    filterOrder: '2',
                    filterType: 'CATEGORIES'
                },
                {
                    filterUrlId: 'earrings',
                    filterCategoryId: '287464',
                    filterDimensionId: '101287464',
                    filterOrder: '5',
                    filterType: 'JEWELRY'
                },
                {
                    filterUrlId: 'bracelets',
                    filterCategoryId: '287458',
                    filterDimensionId: '101287458',
                    filterOrder: '1',
                    filterType: 'JEWELRY'
                },
                {
                    filterUrlId: 'rings',
                    filterCategoryId: '287466',
                    filterDimensionId: '101287466',
                    filterOrder: '7',
                    filterType: 'JEWELRY'
                },
                {
                    filterUrlId: 'cuff-links',
                    filterCategoryId: '288160',
                    filterDimensionId: '101288160',
                    filterOrder: '4',
                    filterType: 'JEWELRY'
                },
                {
                    filterUrlId: 'necklaces-pendants',
                    filterCategoryId: '287465',
                    filterDimensionId: '101287465',
                    filterOrder: '6',
                    filterType: 'JEWELRY'
                },
                {
                    filterUrlId: 'brooches',
                    filterCategoryId: '287461',
                    filterDimensionId: '101287461',
                    filterOrder: '2',
                    filterType: 'JEWELRY'
                },
                {
                    filterUrlId: 'chains-and-cords',
                    filterCategoryId: '488435',
                    filterDimensionId: '101488435',
                    filterOrder: '3',
                    filterType: 'JEWELRY'
                },
                {
                    filterUrlId: 'jewelry',
                    filterCategoryId: '',
                    filterDimensionId: '1013633780',
                    filterOrder: '1',
                    filterType: 'CATEGORIES'
                },
                {
                    filterUrlId: 'platters-trays',
                    filterCategoryId: '297559',
                    filterDimensionId: '101297559',
                    filterOrder: '6',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'clocks',
                    filterCategoryId: '297636',
                    filterDimensionId: '101297636',
                    filterOrder: '13',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'flatware',
                    filterCategoryId: '297597',
                    filterDimensionId: '101297597',
                    filterOrder: '8',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'serving-accessories',
                    filterCategoryId: '297560',
                    filterDimensionId: '101297560',
                    filterOrder: '7',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'candlesticks',
                    filterCategoryId: '297635',
                    filterDimensionId: '101297635',
                    filterOrder: '12',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'pitchers',
                    filterCategoryId: '297558',
                    filterDimensionId: '101297558',
                    filterOrder: '5',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'china',
                    filterCategoryId: '288236',
                    filterDimensionId: '101288236',
                    filterOrder: '4',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'vases',
                    filterCategoryId: '297638',
                    filterDimensionId: '101297638',
                    filterOrder: '16',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'stemware',
                    filterCategoryId: '288227',
                    filterDimensionId: '101288227',
                    filterOrder: '2',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'frames',
                    filterCategoryId: '297637',
                    filterDimensionId: '101297637',
                    filterOrder: '14',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'barware',
                    filterCategoryId: '288184',
                    filterDimensionId: '101288184',
                    filterOrder: '1',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'bowls',
                    filterCategoryId: '297612',
                    filterDimensionId: '101297612',
                    filterOrder: '10',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'holiday-ornaments',
                    filterCategoryId: '442280',
                    filterDimensionId: '101442280',
                    filterOrder: '15',
                    filterType: 'HOME'
                },
                {
                    filterUrlId: 'home',
                    filterCategoryId: '',
                    filterDimensionId: '101424402',
                    filterOrder: '5',
                    filterType: 'CATEGORIES'
                },
                {
                    filterUrlId: 'womens-watches',
                    filterCategoryId: '288186',
                    filterDimensionId: '101288186',
                    filterOrder: '1',
                    filterType: 'WATCHES'
                },
                {
                    filterUrlId: 'mens-watches',
                    filterCategoryId: '288171',
                    filterDimensionId: '101288171',
                    filterOrder: '2',
                    filterType: 'WATCHES'
                },
                {
                    filterUrlId: 'cocktail-watches',
                    filterCategoryId: '288141',
                    filterDimensionId: '101288141',
                    filterOrder: '3',
                    filterType: 'WATCHES'
                },
                {
                    filterUrlId: 'watches',
                    filterCategoryId: '',
                    filterDimensionId: '101424401',
                    filterOrder: '4',
                    filterType: 'CATEGORIES'
                },
                {
                    filterUrlId: 'other-accessories',
                    filterCategoryId: '297642',
                    filterDimensionId: '101297642',
                    filterOrder: '9',
                    filterType: 'ACCESSORIES'
                },
                {
                    filterUrlId: 'writing-instruments',
                    filterCategoryId: '297641',
                    filterDimensionId: '101297641',
                    filterOrder: '7',
                    filterType: 'ACCESSORIES'
                },
                {
                    filterUrlId: 'scarves',
                    filterCategoryId: '616598',
                    filterDimensionId: '101616598',
                    filterOrder: '3',
                    filterType: 'ACCESSORIES'
                },
                {
                    filterUrlId: 'key-rings',
                    filterCategoryId: '297640',
                    filterDimensionId: '101297640',
                    filterOrder: '5',
                    filterType: 'ACCESSORIES'
                },
                {
                    filterUrlId: 'bookmarks-paperweights',
                    filterCategoryId: '297644',
                    filterDimensionId: '101297644',
                    filterOrder: '11',
                    filterType: 'ACCESSORIES'
                },
                {
                    filterUrlId: 'ties',
                    filterCategoryId: '715659',
                    filterDimensionId: '101715659',
                    filterOrder: '8',
                    filterType: 'ACCESSORIES'
                },
                {
                    filterUrlId: 'accessories',
                    filterCategoryId: '',
                    filterDimensionId: '101424403',
                    filterOrder: '6',
                    filterType: 'CATEGORIES'
                },
                {
                    filterUrlId: 'product-care-items',
                    filterCategoryId: '2489941',
                    filterDimensionId: '1012489941',
                    filterOrder: '1',
                    filterType: 'PRODUCT CARE'
                },
                {
                    filterUrlId: 'product-care',
                    filterCategoryId: '',
                    filterDimensionId: '1013111505',
                    filterOrder: '11',
                    filterType: 'CATEGORIES'
                },
                {
                    filterUrlId: 'sunglasses-classic',
                    filterCategoryId: '3520982',
                    filterDimensionId: '1013520982',
                    filterOrder: '10',
                    filterType: 'SUNGLASSES'
                },
                {
                    filterUrlId: 'alternate fit',
                    filterCategoryId: '',
                    filterDimensionId: '1012641794',
                    filterOrder: '9',
                    filterType: 'SUNGLASSES'
                },
                {
                    filterUrlId: 'sunglasses-butterfly',
                    filterCategoryId: '2641795',
                    filterDimensionId: '1012641795',
                    filterOrder: '2',
                    filterType: 'SUNGLASSES'
                },
                {
                    filterUrlId: 'sunglasses-aviator',
                    filterCategoryId: '2633456',
                    filterDimensionId: '1012633456',
                    filterOrder: '1',
                    filterType: 'SUNGLASSES'
                },
                {
                    filterUrlId: 'sunglasses-rectangle',
                    filterCategoryId: '2641797',
                    filterDimensionId: '1012641797',
                    filterOrder: '4',
                    filterType: 'SUNGLASSES'
                },
                {
                    filterUrlId: 'sunglasses-round',
                    filterCategoryId: '2641799',
                    filterDimensionId: '1012641799',
                    filterOrder: '6',
                    filterType: 'SUNGLASSES'
                },
                {
                    filterUrlId: 'sunglasses-oval',
                    filterCategoryId: '3520983',
                    filterDimensionId: '1013520983',
                    filterOrder: '12',
                    filterType: 'SUNGLASSES'
                },
                {
                    filterUrlId: 'polarized',
                    filterCategoryId: '',
                    filterDimensionId: '1012995669',
                    filterOrder: '8',
                    filterType: 'SUNGLASSES'
                },
                {
                    filterUrlId: 'sunglasses-cat-eye',
                    filterCategoryId: '2641796',
                    filterDimensionId: '1012641796',
                    filterOrder: '3',
                    filterType: 'SUNGLASSES'
                },
                {
                    filterUrlId: 'sunglasses-square',
                    filterCategoryId: '2641800',
                    filterDimensionId: '1012641800',
                    filterOrder: '7',
                    filterType: 'SUNGLASSES'
                },
                {
                    filterUrlId: 'tiffany-eyewear',
                    filterCategoryId: '',
                    filterDimensionId: '1012633602',
                    filterOrder: '10',
                    filterType: 'CATEGORIES'
                },
                {
                    filterUrlId: 'categories',
                    filterCategoryId: '',
                    filterDimensionId: '1',
                    filterOrder: '',
                    filterType: ''
                },
                {
                    filterUrlId: 'round-brilliant',
                    filterCategoryId: '4359083',
                    filterDimensionId: '1014359083',
                    filterOrder: '1',
                    filterType: 'DIAMONDS'
                },
                {
                    filterUrlId: 'true',
                    filterCategoryId: '4359084',
                    filterDimensionId: '1014359084',
                    filterOrder: '2',
                    filterType: 'DIAMONDS'
                },
                {
                    filterUrlId: 'princess',
                    filterCategoryId: '4359085',
                    filterDimensionId: '1014359085',
                    filterOrder: '3',
                    filterType: 'DIAMONDS'
                },
                {
                    filterUrlId: 'cushion',
                    filterCategoryId: '4359086',
                    filterDimensionId: '1014359086',
                    filterOrder: '4',
                    filterType: 'DIAMONDS'
                },
                {
                    filterUrlId: 'emerald',
                    filterCategoryId: '4359087',
                    filterDimensionId: '1014359087',
                    filterOrder: '5',
                    filterType: 'DIAMONDS'
                },
                {
                    filterUrlId: 'pear',
                    filterCategoryId: '4359089',
                    filterDimensionId: '1014359089',
                    filterOrder: '7',
                    filterType: 'DIAMONDS'
                },
                {
                    filterUrlId: 'halo',
                    filterCategoryId: '4359077',
                    filterDimensionId: '1014359077',
                    filterOrder: '3',
                    filterType: 'SETTINGS'
                },
                {
                    filterUrlId: 'three-Stone',
                    filterCategoryId: '4359076',
                    filterDimensionId: '1014359076',
                    filterOrder: '2',
                    filterType: 'SETTINGS'
                },
                {
                    filterUrlId: 'solitaire',
                    filterCategoryId: '4359075',
                    filterDimensionId: '1014359075',
                    filterOrder: '1',
                    filterType: 'SETTINGS'
                },
                {
                    filterUrlId: 'classic',
                    filterCategoryId: '2632049',
                    filterDimensionId: '1012632049',
                    filterOrder: '57',
                    filterType: 'BANDS'
                },
                {
                    filterUrlId: 'diamond',
                    filterCategoryId: '297652',
                    filterDimensionId: '101297652',
                    filterOrder: '29',
                    filterType: 'BANDS'
                },
                {
                    filterUrlId: 'intricate',
                    filterCategoryId: '3000435',
                    filterDimensionId: '1013000435',
                    filterOrder: '56',
                    filterType: 'BANDS'
                },
                {
                    filterUrlId: 'platinum',
                    filterCategoryId: '323340',
                    filterDimensionId: '101323340',
                    filterOrder: '3',
                    filterType: 'METALCOLOR'
                },
                {
                    filterUrlId: 'rose-gold',
                    filterCategoryId: '607567',
                    filterDimensionId: '101607567',
                    filterOrder: '5',
                    filterType: 'METALCOLOR'
                },
                {
                    filterUrlId: 'white-gold',
                    filterCategoryId: '323341',
                    filterDimensionId: '101323341',
                    filterOrder: '4',
                    filterType: 'METALCOLOR'
                },
                {
                    filterUrlId: 'h',
                    filterCategoryId: '',
                    filterDimensionId: '1014359071',
                    filterOrder: '5',
                    filterType: 'DIAMOND COLOR'
                },
                {
                    filterUrlId: 'i',
                    filterCategoryId: '',
                    filterDimensionId: '1014359072',
                    filterOrder: '6',
                    filterType: 'DIAMOND COLOR'
                },
                {
                    filterUrlId: 'd',
                    filterCategoryId: '',
                    filterDimensionId: '1014359067',
                    filterOrder: '1',
                    filterType: 'DIAMOND COLOR'
                },
                {
                    filterUrlId: 'e',
                    filterCategoryId: '',
                    filterDimensionId: '1014359068',
                    filterOrder: '2',
                    filterType: 'DIAMOND COLOR'
                },
                {
                    filterUrlId: 'f',
                    filterCategoryId: '',
                    filterDimensionId: '1014359069',
                    filterOrder: '2',
                    filterType: 'DIAMOND COLOR'
                },
                {
                    filterUrlId: 'g',
                    filterCategoryId: '',
                    filterDimensionId: '1014359070',
                    filterOrder: '2',
                    filterType: 'DIAMOND COLOR'
                },
                {
                    filterUrlId: 'fl',
                    filterCategoryId: '',
                    filterDimensionId: '1014359086',
                    filterOrder: '5',
                    filterType: 'DIAMOND CLARITY'
                },
                {
                    filterUrlId: 'if',
                    filterCategoryId: '',
                    filterDimensionId: '1014359078',
                    filterOrder: '6',
                    filterType: 'DIAMOND CLARITY'
                },
                {
                    filterUrlId: 'vvs1',
                    filterCategoryId: '',
                    filterDimensionId: '1014359079',
                    filterOrder: '1',
                    filterType: 'DIAMOND CLARITY'
                },
                {
                    filterUrlId: 'vvs2',
                    filterCategoryId: '',
                    filterDimensionId: '1014359080',
                    filterOrder: '2',
                    filterType: 'DIAMOND CLARITY'
                },
                {
                    filterUrlId: 'vs1',
                    filterCategoryId: '',
                    filterDimensionId: '1014359081',
                    filterOrder: '2',
                    filterType: 'DIAMOND CLARITY'
                },
                {
                    filterUrlId: 'vs2',
                    filterCategoryId: '',
                    filterDimensionId: '1014359082',
                    filterOrder: '2',
                    filterType: 'DIAMOND CLARITY'
                },
                {
                    filterUrlId: 'engagement-rings',
                    filterCategoryId: '3878956',
                    filterDimensionId: '1013878956',
                    filterOrder: '',
                    filterType: 'UNMAPPED CATEGORIES'
                }
            ],
            byoThemeFiltersMap: {
                101288196: 'Return to Tiffany®',
                1013770118: 'Tiffany Tags',
                1014359103: 'Whimsy'
            },
            byoThemeFilterConfig: {
                id: '101570368',
                displayName: 'Themes'
            },
            /* eslint-disable-next-line */
            themeFilterImages: {
                rtt: '//s7d2.scene7.com/is/image/tiffanydmdt1/tiffany-beads?wid=398&hei=248',
                'tiffany-tags': '//s7d2.scene7.com/is/image/tiffanydmdt1/elsa-peretti?wid=398&hei=248',
                whimsy: '/content/dam/tiffany/us/en_us/designer-collection/tiffany-locks.png',
                engravable: '/content/dam/tiffany/us/en_us/designer-collection/tiffany-aria.jpg',
                'blue-themed': '/content/dam/tiffany/us/en_us/designer-collection/tiffany-beads.png',
                lockets: '/content/dam/tiffany/us/en_us/designer-collection/tiffany-circlet.png',
                twist: '/content/dam/tiffany/us/en_us/designer-collection/tiffany-infinity.png',
                'letters-words': '/content/dam/tiffany/us/en_us/designer-collection/tiffany-bezet.png'
            },
            sessionConfig: {
                url: 'sessionUrl',
                method: 'POST',
                payload: {
                    siteId: 1
                }
            },
            richRelevanceSessionId: 'r_session_id',
            richRelevanceUserId: 'mysid2',
            sessionCookieName: 'mysid2',
            salesServiceCookieName: 'salesSrvSite',
            salesServiceCookieDomain: 'localhost',
            salesServiceCookiePath: '/',
            salesServiceRedirectUrl: '/redirect',
            salesServiceDefaultHost: 'localhost',
            supplementalServiceApiConfig: {
                url: 'supplementalServiceUrl',
                method: 'POST',
                payload: {
                    sku: '19431347', // '62033940',
                    siteId: 21
                }
            },
            sortOptionsConfig: {
                options: [{
                    sortFilterName: 'Relevance',
                    value: 11,
                    sortUrlKey: 'sort relevance'
                },
                {
                    sortFilterName: 'New To Tiffany',
                    value: 3,
                    sortUrlKey: 'sort new to-tiffany'
                },
                {
                    sortFilterName: 'Price High to Low',
                    value: 1,
                    sortUrlKey: 'sort-high-to-low'
                },
                {
                    sortFilterName: 'Price Low to High',
                    value: 2,
                    sortUrlKey: 'sort-low-to-high'
                }]
            },

            storeLocatorSearchBar: {
                heading: 'Find a Store',
                distance: [
                    '25',
                    '50',
                    '100',
                    '1500'
                ],
                distanceLabel: 'miles',
                storesWithinLabel: 'Search for stores within',
                ofLabel: 'of',
                offerLabel: 'that offer',
                locationPlaceholder: 'Country, City or ZIP',
                findAStore: 'Find a Store',
                reset: 'Reset',
                siteId: '1',
                requestMethod: 'post',
                viewAllStores: {
                    label: 'view all stores',
                    url: 'google.com',
                    target: '_blank'
                },
                allowedServices: [
                    'Personal Shopping',
                    'Jewelry and Gift Engraving',
                    'Watch Repair & Sales'
                ],
                serviceLabels: {
                    allServices: 'all services',
                    service: 'service',
                    services: 'services'
                },
                adaLabels: {
                    distanceButtonLabel: 'select distance',
                    servicesLabel: 'select service'
                },
                payloadKeys: {
                    storeIdKey: 'StoreIds',
                    siteIdKey: 'siteid'
                },
                storeLocatorConfig: {
                    url: 'storeLocatorUrl',
                    method: 'post'
                }
            },

            storeLocatorSearchResultLabels: {
                mipsLabel: 'MIPS: #',
                noResultsLabel: 'Sorry, we can not find any results',
                resultslabel: 'Showing store with',
                assistanceCopyLabel: 'Need Help?',
                contactTiffanyLabel: '<div class="tiffany-rte"><p>Contact Tiffany Concierge <br> Call <span class="text-phnumber">800-843-3269</span> </p></div>',
                storesNearYouLabel: 'Stores Near You',
                emailStoreLabel: 'Email Store',
                noEmailStoreLabel: 'Email Store',
                eventsCtaLabel: 'Make reservation',
                eventsCtaUrl: '/eventUrl?eventId=',
                eventsImagePrefix: 'https://www.tiffany.com/Shared/Images/',
                storeDetailUrl: '/jewellery-stores'
            },

            engagementHeadLineTextPattern: '{2} {28} {24} {6} Engagement Rings {5} {30}',
            engagementFilterSeparator: '#',
            engagementPatternMatchingMap: {
                2: '{DESIGNERS \u0026 COLLECTIONS}',
                28: '{DIAMOND CUT}',
                24: '{SETTING}',
                6: '{GEMSTONES}',
                5: 'in {MATERIALS}',
                30: 'with {COLOR}'
            },
            coreFilterSeparator: '',
            coreHeadLineTextPattern: '{2} {5} Rings {6} {1}',

            corePatternMatchingMap: {
                1: '- {CATEGORIES}',
                2: '{DESIGNERS & COLLECTIONS}',
                5: '{MATERIALS}',
                6: 'with {GEMSTONES}'
            },

            engagementH1Strategy: 'multiple',

            coreH1Strategy: 'multiple',

            ENDECA_FILTER_DIMENSIONS_ORDER: [
                {
                    filterDisplayName: 'Category',
                    name: 'CATEGORIES',
                    value: 1
                }, {
                    filterDisplayName: 'Prices',
                    name: 'PRICE RANGES',
                    value: 4
                }, {
                    filterDisplayName: 'Materials',
                    name: 'MATERIALS',
                    value: 5
                }, {
                    filterDisplayName: 'Gemstones',
                    name: 'GEMSTONES',
                    value: 6
                }, {
                    filterDisplayName: 'Collection and Designer',
                    name: 'DESIGNERS & COLLECTIONS',
                    value: 2
                }, {
                    filterDisplayName: 'Collections',
                    name: 'Collections',
                    value: 3
                }
            ],
            // TO DO - Uncomment for Engagement grid
            // ENDECA_FILTER_DIMENSIONS_ORDER: [
            //     {
            //         filterDisplayName: 'Collections',
            //         name: 'COLLECTIONS',
            //         value: 2
            //     }, {
            //         filterDisplayName: 'Diamonds',
            //         name: 'DIAMONDS',
            //         value: 27
            //     }, {
            //         filterDisplayName: 'Materials',
            //         name: 'MATERIALS',
            //         value: 5
            //     }, {
            //         filterDisplayName: 'Settings',
            //         name: 'SETTINGS',
            //         value: 24
            //     }, {
            //         filterDisplayName: 'Gemstones',
            //         name: 'GEMSTONE',
            //         value: 6
            //     }
            // ],

            shoppableTextWithImageConfig: {
                image: {
                    sources: [
                        {
                            maxMedia: 900,
                            src: './images/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right.jpg'
                        },
                        {
                            maxMedia: 767,
                            src: './images/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right.jpg'
                        }
                    ],
                    defaultSrc: './images/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right.jpg',
                    isLazyLoad: true,
                    altText: 'Sample',
                    customClass: 'picture-item'
                },
                contentTile: {
                    heading: 'Timeless. Transcedent. Tiffany T',
                    ctaText: 'Shop the Collection',
                    ctaLink: '/',
                    ctaTarget: '_new',
                    textAlignment: 'tf-g__center',
                    ctaAlignment: 'tf-g__center',
                    secondCtaAlignment: 'tf-g__end'
                }
            },
            fullWidthShoppableTileConfig: {
                marketingTilePosition: 'right',
                skuConfig: {
                    SiteId: 1,
                    AssortmentId: 101,
                    PriceMarketId: 1,
                    Sku: [
                        '10000111',
                        '20000222'
                    ]
                },
                shoppableTextWithImageConfig: 'shoppableTextWithImageConfig'
            },
            onHoverProductTileConfig: {
                customizableText: 'Customizable',
                viewDetailsText: 'View Details',
                addCharm: 'Add Charm',
                productPayload: {
                    SiteId: '1',
                    AssortmentId: '101',
                    PriceMarketId: 1,
                    Sku: 'GRP02985'
                },
                imageUrl: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/<ImagePrefix>-<ImageName>.jpg'
            },
            /* eslint-disable-next-line */
            designerCollections: {
                'tiffany-weave': '/content/dam/tiffany/us/en_us/designer-collection/tiffany-weave.png',
                'elsa-peretti': '/content/dam/tiffany/us/en_us/designer-collection/elsa-peretti.png',
                'tiffany-locks': '/content/dam/tiffany/us/en_us/designer-collection/tiffany-locks.png',
                'tiffany-aria': '/content/dam/tiffany/us/en_us/designer-collection/tiffany- aria.jpg',
                'tiffany-beads': '/content/dam/tiffany/us/en_us/designer-collection/tiffany-beads.png',
                'tiffany-circlet': '/content/dam/tiffany/us/en_us/designer-collection/tiffany-circlet.png',
                'tiffany-infinity': '/content/dam/tiffany/us/en_us/designer-collection/tiffany-infinity.png',
                'tiffany-bezet ': '/content/dam/tiffany/us/en_us/designer-collection/tiffany-bezet.png'
            },
            color: {
                brown: '/content/dam/tiffany/us/en_us/color/brown.png',
                orange: '/content/dam/tiffany/us/en_us/color/orange.png',
                tiffanyblue: '/content/dam/tiffany/us/en_us/color/Tiffany blue.png',
                red: '/content/dam/tiffany/us/en_us/color/red.png',
                green: '/content/dam/tiffany/us/en_us/color/green.png',
                pink: '/content/dam/tiffany/us/en_us/color/pink.png',
                blue: '/content/dam/tiffany/us/en_us/color/blue.png',
                purple: '/content/dam/tiffany/us/en_us/color/purple.png',
                black: '/content/dam/tiffany/us/en_us/color/black.png',
                yellow: '/content/dam/tiffany/us/en_us/color/yellow.png',
                multicolored: '/content/dam/tiffany/us/en_us/color/multicolored.png',
                colorless: '/content/dam/tiffany/us/en_us/color/colorless.png',
                white: '/content/dam/tiffany/us/en_us/color/white.png'
            },
            /* eslint-disable-next-line */
            diamond: {
                emerald: '//media.tiffany.com/is/image/TiffanyDev/emerald?wid=24&hei=24',
                cushion: '//media.tiffany.com/is/image/TiffanyDev/cushion?wid=24&hei=24',
                heart: '//media.tiffany.com/is/image/TiffanyDev/heart?wid=24&hei=24',
                oval: '//media.tiffany.com/is/image/TiffanyDev/oval?wid=24&hei=24',
                pear: '//media.tiffany.com/is/image/TiffanyDev/pear?wid=24&hei=24',
                princess: '//media.tiffany.com/is/image/TiffanyDev/princess?wid=24&hei=24',
                excellent: '//media.tiffany.com/is/image/TiffanyDev/excellent?wid=24&hei=24',
                'round-brilliant': '//media.tiffany.com/is/image/TiffanyDev/round-brilliant?wid=24&hei=24'
            },
            /* eslint-disable-next-line */
            bands: {
                platinum: '//media.tiffany.com/is/image/TiffanyDev/platinum?wid=40&hei=24',
                'white-gold': '//media.tiffany.com/is/image/TiffanyDev/white-gold?wid=40&hei=24',
                gold: '//media.tiffany.com/is/image/TiffanyDev/gold?wid=40&hei=24'
            },
            /* eslint-disable-next-line */
            material: {
                platinum: '//media.tiffany.com/is/image/TiffanyDev/platinum?wid=40&hei=24',
                'white-gold': '//media.tiffany.com/is/image/TiffanyDev/white-gold?wid=40&hei=24',
                gold: '//media.tiffany.com/is/image/TiffanyDev/gold?wid=40&hei=24'
            },
            /* eslint-disable-next-line */
            settings: {
                classic: '//media.tiffany.com/is/image/TiffanyDev/Classic?wid=40&hei=24',
                'three-stone': '//media.tiffany.com/is/image/TiffanyDev/three-stone?wid=40&hei=24',
                halo: '//media.tiffany.com/is/image/TiffanyDev/halo?wid=40&hei=24'
            },
            mediaTypeIdOrder: ['1092', '1093', '1098'],
            browseConfig: {
                showBrowseHeading: true,
                isCollectionBrowseGrid: false,
                browseGridHeading: 'Rings',
                pageTitleSuffix: '| Tiffany & Co',
                h1Toggle: 'HERO_BANNER', // 'FILTER_TEXT',
                filterByText: 'Filter by',
                isLazyLoad: true,
                sortByText: 'Sort by: ',
                clearCtaText: 'Clear All',
                engravableTextMobile: 'Engravable',
                engravableTextDesktop: 'Engravable products only',
                request: {
                    url: 'browseUrl', // 'api/noSearchResults',
                    method: 'POST',
                    defaultDimensionId: 101287458,
                    payload: {
                        assortmentID: 101,
                        sortTypeID: 5,
                        categoryid: 287458,
                        navigationFilters: [
                            101,
                            101287458
                        ],
                        recordsOffsetNumber: 0,
                        recordsCountPerPage: 10,
                        priceMarketID: '1',
                        searchModeID: 2,
                        siteid: 1
                    }
                }
            },
            threeTileCarouselConfig: {
                title: 'More Ways To Shop Carousel',
                heading: 'More Ways to Shop',
                description: 'As Experts in all matters of the heart, Tiffany is at your service from start to finish.',
                isRte: true,
                isHeading: false,
                isCustomCta: true,
                images: [
                    {
                        id: '1',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-1.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-1.png'
                        }],
                        defaultSrc: './images/ways-1.png',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: '',
                        contentTile: {
                            ctaText: 'Best Sellers',
                            ctaLink: '/',
                            ctaTarget: '_self',
                            leftPos: '10%',
                            topPos: '40%'
                        },
                        isCustomCta: true
                    },
                    {
                        id: '2',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-2.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-2.png'
                        }],
                        defaultSrc: './images/ways-2.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: '',
                        contentTile: {
                            ctaText: 'The Tiffany Edit',
                            ctaLink: '/',
                            ctaTarget: '_blank',
                            leftPos: '10%',
                            topPos: '40%'
                        },
                        isCustomCta: true
                    },
                    {
                        id: '3',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-3.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-3.png'
                        }],
                        defaultSrc: './images/ways-3.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: '',
                        contentTile: {
                            ctaText: 'Wedding Season',
                            ctaLink: '/',
                            ctaTarget: '_self',
                            leftPos: '10%',
                            topPos: '40%'
                        },
                        isCustomCta: true
                    },
                    {
                        id: '4',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-1.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-1.png'
                        }],
                        defaultSrc: './images/ways-1.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: '',
                        contentTile: {
                            ctaText: 'Holiday Season',
                            ctaLink: '/',
                            ctaTarget: '_blank',
                            leftPos: '10%',
                            topPos: '40%'
                        },
                        isCustomCta: true
                    }
                ]
            },
            threeTileVariation1: {
                id: 'more-ways-1',
                title: 'More Ways To Shop Carousel',
                heading: 'More Ways to Shop',
                description: 'As Experts in all matters of the heart, Tiffany is at your service from start to finish.',
                isRte: true,
                isHeading: false,
                paddingBottom: 'padding-bottom-56',
                images: [
                    {
                        id: '1',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-1.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-1.png'
                        }],
                        defaultSrc: './images/ways-1.png',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'threeTileImg',
                        contentTile: {
                            isRte: false,
                            ctaText: 'Best Sellers',
                            ctaLink: '/',
                            ctaTarget: '_self',
                            heading: 'More Ways to Shop',
                            description: 'As Experts in all matters of the heart, Tiffany is at your service.'
                        }
                    },
                    {
                        id: '2',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-2.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-2.png'
                        }],
                        defaultSrc: './images/ways-2.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        contentTile: {
                            isRte: false,
                            ctaText: 'The Tiffany Edit',
                            ctaLink: '/',
                            ctaTarget: '_blank',
                            heading: 'More Ways to Shop',
                            description: 'As Experts in all matters of the heart, Tiffany is at your service.'
                        }
                    },
                    {
                        id: '3',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-3.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-3.png'
                        }],
                        defaultSrc: './images/ways-3.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        contentTile: {
                            isRte: false,
                            ctaText: 'Wedding Season',
                            ctaLink: '/',
                            ctaTarget: '_self',
                            heading: 'More Ways to Shop',
                            description: 'As Experts in all matters of the heart, Tiffany is at your service.'
                        }
                    },
                    {
                        id: '4',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-1.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-1.png'
                        }],
                        defaultSrc: './images/ways-1.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        contentTile: {
                            isRte: false,
                            ctaText: 'Holiday Season',
                            ctaLink: '/',
                            ctaTarget: '_blank',
                            heading: 'More Ways to Shop',
                            description: 'As Experts in all matters of the heart, Tiffany is at your service.'
                        }
                    }
                ]
            },
            threeTileVariation2: {
                id: 'more-ways-2',
                title: 'More Ways To Shop Carousel',
                heading: 'More Ways to Shop',
                description: 'As Experts in all matters of the heart, Tiffany is at your service from start to finish.',
                isRte: true,
                isHeading: true,
                paddingBottom: 'padding-bottom-16',
                images: [
                    {
                        id: '1',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-1.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-1.png'
                        }],
                        defaultSrc: './images/ways-1.png',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'threeTileImg',
                        contentTile: {
                            ctaText: 'Best Sellers',
                            ctaLink: '/',
                            ctaTarget: '_self',
                            textAlignment: 'tf-g__start'
                        }
                    },
                    {
                        id: '2',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-2.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-2.png'
                        }],
                        defaultSrc: './images/ways-2.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        contentTile: {
                            ctaText: 'The Tiffany Edit',
                            ctaLink: '/',
                            ctaTarget: '_blank',
                            textAlignment: 'tf-g__center'
                        }
                    },
                    {
                        id: '3',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-3.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-3.png'
                        }],
                        defaultSrc: './images/ways-3.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        contentTile: {
                            ctaText: 'Wedding Season',
                            ctaLink: '/',
                            ctaTarget: '_self',
                            textAlignment: 'tf-g__end'
                        }
                    },
                    {
                        id: '4',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-1.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-1.png'
                        }],
                        defaultSrc: './images/ways-1.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        contentTile: {
                            ctaText: 'Holiday Season',
                            ctaLink: '/',
                            ctaTarget: '_blank',
                            textAlignment: 'tf-g__start'
                        }
                    }
                ]
            },
            threeTileVariation3: {
                id: 'more-ways-3',
                title: 'More Ways To Shop Carousel',
                heading: 'More Ways to Shop',
                description: 'As Experts in all matters of the heart, Tiffany is at your service from start to finish.',
                isRte: true,
                isHeading: true,
                paddingBottom: 'no-padding-bottom',
                images: [
                    {
                        id: '1',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-1.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-1.png'
                        }],
                        defaultSrc: './images/ways-1.png',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'threeTileImg',
                        contentTile: {
                            ctaText: 'Best Sellers',
                            ctaLink: '/',
                            ctaTarget: '_self',
                            heading: 'More Ways to Shop',
                            description: 'As Experts in all matters of the heart, Tiffany is at your service.'
                        }
                    },
                    {
                        id: '2',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-2.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-2.png'
                        }],
                        defaultSrc: './images/ways-2.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        contentTile: {
                            ctaText: 'The Tiffany Edit',
                            ctaLink: '/',
                            ctaTarget: '_blank',
                            heading: 'More Ways to Shop',
                            description: 'As Experts in all matters of the heart, Tiffany is at your service.'
                        }
                    },
                    {
                        id: '3',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-3.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-3.png'
                        }],
                        defaultSrc: './images/ways-3.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        contentTile: {
                            isRte: false,
                            ctaText: 'Wedding Season',
                            ctaLink: '/',
                            ctaTarget: '_self',
                            heading: 'More Ways to Shop',
                            description: 'As Experts in all matters of the heart, Tiffany is at your service.'
                        }
                    },
                    {
                        id: '4',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-1.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-1.png'
                        }],
                        defaultSrc: './images/ways-1.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        contentTile: {
                            isRte: false,
                            ctaText: 'Holiday Season',
                            ctaLink: '/',
                            ctaTarget: '_blank',
                            heading: 'More Ways to Shop',
                            description: 'As Experts in all matters of the heart, Tiffany is at your service.'
                        }
                    }
                ]
            },
            threeTileVariation4: {
                id: 'more-ways-4',
                title: 'More Ways To Shop Carousel',
                heading: 'More Ways to Shop',
                description: 'As Experts in all matters of the heart, Tiffany is at your service from start to finish.',
                isRte: true,
                isHeading: true,
                stackInMobile: true,
                images: [
                    {
                        id: '1',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-1.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-1.png'
                        }],
                        defaultSrc: './images/ways-1.png',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'threeTileImg',
                        isCustomCta: true,
                        contentTile: {
                            isRte: false,
                            ctaText: 'Best Sellers',
                            ctaLink: '/',
                            ctaTarget: '_self',
                            leftPos: '10%',
                            topPos: '40%',
                            mobileLeftPos: '10%',
                            mobileTopPos: '40%',
                            textColor: 'black'
                        }
                    },
                    {
                        id: '2',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-2.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-2.png'
                        }],
                        defaultSrc: './images/ways-2.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        isCustomCta: true,
                        contentTile: {
                            isRte: false,
                            ctaText: 'The Tiffany Edit',
                            ctaLink: '/',
                            ctaTarget: '_blank',
                            leftPos: '10%',
                            topPos: '40%',
                            mobileLeftPos: '10%',
                            mobileTopPos: '40%',
                            textColor: 'white'
                        }
                    },
                    {
                        id: '3',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-3.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-3.png'
                        }],
                        defaultSrc: './images/ways-3.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        isCustomCta: true,
                        contentTile: {
                            isRte: false,
                            ctaText: 'Wedding Season',
                            ctaLink: '/',
                            ctaTarget: '_self',
                            leftPos: '10%',
                            topPos: '40%',
                            mobileLeftPos: '10%',
                            mobileTopPos: '40%',
                            textColor: 'black'
                        }
                    },
                    {
                        id: '4',
                        sources: [{
                            maxMedia: 900,
                            src: './images/ways-1.png'
                        }, {
                            maxMedia: 767,
                            src: './images/ways-1.png'
                        }],
                        defaultSrc: './images/ways-1.png',
                        isLazyLoad: true,
                        altText: 'Sample1',
                        customClass: 'threeTileImg',
                        isCustomCta: true,
                        contentTile: {
                            isRte: false,
                            ctaText: 'Holiday Season',
                            ctaLink: '/',
                            ctaTarget: '_blank',
                            leftPos: '10%',
                            topPos: '40%',
                            mobileLeftPos: '10%',
                            mobileTopPos: '40%',
                            textColor: 'black'
                        }
                    }
                ]
            },
            twoTileMarkettingConfig: {
                content: {
                    title: 'Two Tile Marketting Component',
                    textAlignment: 'tf-g__start',
                    heading: 'Fifth Avenue Flagship',
                    description: 'Lorem ipsum dolor sit amet, dicat diem aeterno aliquip eu eos, ad quo dictas et convenire eclat reprehendunt. Solet intellegat voluptaria sed ad.',
                    ctaText: 'Read more',
                    rte: false,
                    ctaLink: '/',
                    ctaTarget: '_new',
                    images: [
                        {
                            id: '1',
                            sources: [{
                                maxMedia: 900,
                                src: './images/Shot_02_0150_07_ext_am_V2.png'
                            }, {
                                maxMedia: 767,
                                src: './images/Shot_02_0150_07_ext_am_V2.png'
                            }],
                            defaultSrc: './images/Shot_02_0150_07_ext_am_V2.png',
                            isLazyLoad: true,
                            altText: 'Sample',
                            customClass: ''
                        },
                        {
                            id: '2',
                            sources: [{
                                maxMedia: 900,
                                src: './images/Image2.png'
                            }, {
                                maxMedia: 767,
                                src: './images/Image2.png'
                            }],
                            defaultSrc: './images/Image2.png',
                            isLazyLoad: true,
                            altText: 'Sample1',
                            customClass: ''
                        }
                    ]
                }
            },
            noSearchResultsConfig: {
                request: {
                    url: 'api/noSearchResults',
                    method: 'POST',
                    payload:
                    {
                        assortmentID: 101,
                        sortTypeID: 1,
                        searchTerms: 'Rings',
                        navigationFilters: [
                        ],
                        recordsOffsetNumber: 0,
                        recordsCountPerPage: 20,
                        priceMarketID: '01',
                        searchModeID: 1,
                        siteid: 1,
                        isPreviewMode: false
                    }
                }
            },
            searchConfig: {
                request: {
                    url: 'searchUrl',
                    method: 'POST',
                    payload:
                    {
                        assortmentID: 101,
                        sortTypeID: 1,
                        searchTerms: 'Rings',
                        navigationFilters: [
                        ],
                        recordsOffsetNumber: 0,
                        recordsCountPerPage: 20,
                        priceMarketID: '01',
                        searchModeID: 1,
                        siteid: 1,
                        isPreviewMode: false
                    }
                }
            },
            wishlistConfig: {
                get: {
                    url: 'wishlistGetUrl',
                    method: 'POST',
                    payload: {
                        PriceMarketId: 1,
                        siteId: 1,
                        isInline: 'false'
                    }
                },
                add: {
                    url: 'wishListAddEndPoint',
                    method: 'POST',
                    payload: {
                        PriceMarketId: 1,
                        siteId: 1,
                        assortmentId: 101,
                        listTypeId: 1
                    }
                },
                delete: {
                    url: 'wishlistDeleteUrl',
                    method: 'POST',
                    payload: {
                        siteId: 1
                    }
                }
            },
            marketingContentTileConfig: {
                contentTile: {
                    heading: 'Concierge',
                    description: 'As experts in all matters of the heart,Tiffany is at your service from start to finish.we are pleased to assit you evry step of the way,beginning of the every piece.',
                    ctaText: 'Speak to a tiffany expert',
                    ctaLink: '/',
                    ctaTarget: '_new'
                }
            },
            marketingPictureTileConfig: {
                image: {
                    sources: [
                        {
                            maxMedia: 900,
                            src: './images/8144c08b94d9a37119b75e8fed585b2eaa1d2c0f.png'
                        },
                        {
                            maxMedia: 767,
                            src: './images/8144c08b94d9a37119b75e8fed585b2eaa1d2c0f.png'
                        }
                    ],
                    defaultSrc: './images/8144c08b94d9a37119b75e8fed585b2eaa1d2c0f.png',
                    isLazyLoad: true,
                    altText: 'Sample',
                    customClass: 'picture-tile',
                    ctaLink: '/',
                    ctaTarget: '_new'
                }
            },
            textWithImageConfig: {
                textPosition: 'right',
                image: {
                    sources: [
                        {
                            maxMedia: 900,
                            src: './images/d345e2effa693ae0a58e8250e9ec66b8e726f9e7.png'
                        },
                        {
                            maxMedia: 767,
                            src: './images/d345e2effa693ae0a58e8250e9ec66b8e726f9e7.png'
                        }
                    ],
                    defaultSrc: './images/d345e2effa693ae0a58e8250e9ec66b8e726f9e7.png',
                    isLazyLoad: true,
                    altText: 'Sample',
                    customClass: ''
                },
                contentTile: {
                    heading: 'Hand Engraving',
                    description: 'Lorem ipsum dolor sit amet,consectuter adipiscing elit,sed do eiusmod tempor incididnt ut labore et dolere magna ali.',
                    ctaText: 'Shop Engravable Designs ',
                    ctaLink: '/',
                    ctaTarget: '_new'
                }
            },
            TextWithImageMarketingTileConfig: {
                image: {
                    sources: [
                        {
                            maxMedia: 900,
                            src: './images/marketing1.png'
                        },
                        {
                            maxMedia: 767,
                            src: './images/marketing1.png'
                        }
                    ],
                    defaultSrc: './images/marketing1.png',
                    isLazyLoad: true,
                    altText: 'Sample',
                    customClass: 'picture-item'
                },
                contentTile: {
                    heading: 'Tiffany T',
                    description: 'Copy about shop gift guide / best seller.First image doesnt necessary to contain recommended products within.',
                    ctaText: 'Shop the Look',
                    ctaLink: '/',
                    ctaTarget: '_new'
                },
                skuConfig: {
                    SiteId: 1,
                    AssortmentId: 101,
                    PriceMarketId: 1,
                    Sku: [
                        '10000111',
                        '20000222'
                    ]
                }
            },
            marketingProductTilesCarouselConfig: {
                desktopPaddingBottom: 'padding-bottom-16',
                mobilePaddingBottom: 'mobile-padding-bottom-56',
                productTilesConfig: {
                    totalProductTiles: 20,
                    itemsPerFirstRow: 4,
                    itemPerRow: 8
                },
                marketingTiles: [{
                    sources: [{
                        maxMedia: 900,
                        src: '//media.tiffany.com/is/image/tiffanydmqa1/20150901_MC_Collections_Tile8_2x2Promo_US_Tiffany_Infinity?wid=2992&hei=1120'
                    }, {
                        maxMedia: 767,
                        src: '//media.tiffany.com/is/image/tiffanydmqa1/20150402_CL_CT60_Watches_Tile4_2x2Promo_US_Tiffany_Watches_Service?wid=720&hei=720'
                    }],
                    defaultSrc: '//media.tiffany.com/is/image/tiffanydmqa1/20150901_MC_Collections_Tile8_2x2Promo_US_Tiffany_Infinity?wid=2992&hei=1120',
                    isLazyLoad: true,
                    altText: 'Marketing Tile 1',
                    customClass: '',
                    browseGridLayout: '2x2'
                },
                {
                    sources: [{
                        maxMedia: 900,
                        src: '//media.tiffany.com/is/image/tiffanydmqa1/20140626_MC_Gifts_Tile6_Summer_2x2Promo_US_CA_UK_AU_EU_SUMMER_2014_Gifts_2x2?wid=2992&hei=1120'
                    }, {
                        maxMedia: 767,
                        src: '//media.tiffany.com/is/image/tiffanydmqa1/20150421_HP_MDay_Tile6_2x2Promo_US_LITTLE_LUXURIES?wid=720&hei=720'
                    }],
                    defaultSrc: '//media.tiffany.com/is/image/tiffanydmqa1/20140626_MC_Gifts_Tile6_Summer_2x2Promo_US_CA_UK_AU_EU_SUMMER_2014_Gifts_2x2?wid=2992&hei=1120',
                    isLazyLoad: true,
                    altText: 'Marketing Tile 1',
                    customClass: '',
                    browseGridLayout: '2x2'
                }],
                ctaOptions: {
                    ctaText: 'Show more',
                    ctaLink: '/',
                    ctaTarget: '_new'
                },
                skuConfig: {
                    SiteId: '27',
                    AssortmentId: '2701',
                    PriceMarketId: 7,
                    Sku: ['60014069', '63477885', '61523030', '60013271', '36339292', 'GRP09920', 'GRP10131', 'GRP09941', 'GRP10794', 'GRP03754', 'GRP05172', 'GRP03666', 'GRP03754', 'GRP04572']
                },
                categoryConfig: {
                    siteid: '1',
                    assortmentID: '101',
                    sortTypeID: '5',
                    navigationFilters: ['101', '150287466'],
                    recordsOffsetNumber: '0',
                    recordsCountPerPage: '40',
                    priceMarketID: '1',
                    searchModeID: '2'
                }
            },
            diamondGuideMarketingTile: {
                position: {
                    tile1: 'left',
                    tile2: 'right'
                },
                tile1Config: [{
                    contentTile: {
                        heading: 'The world’s best diamonds deserve the best craftsmanship.',
                        description: 'This is why Tiffany’s legendary engagement rings are meticulously handcrafted by highly skilled artisans. From the moment a diamond is discovered until the ring is finished, each design can take up to a year to complete.',
                        ctaText: 'Discover the Tiffany Difference',
                        ctaLink: '/',
                        ctaTarget: '_new',
                        secondCtaText: 'Shop the Look',
                        secondCtaLink: '/',
                        secondCtaTarget: '_new',
                        leftPos: '10%',
                        topPos: '10%',
                        width: 'full-width'
                    },
                    backgroundImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/tile1.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/tile1.jpg'
                            }
                        ],
                        defaultSrc: './images/tile1.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-background-image'
                    }
                }],
                tile2Config: [{
                    contentTile: {
                        heading: 'Cut',
                        description: 'Tiffany diamond cutters refuse to compromise. When the choice is size or beauty, we always choose beauty, so that we outshine all others. Lorem ipsum dolar sit.',
                        ctaText: 'Explore our guide to diamonds',
                        ctaLink: '/',
                        ctaTarget: '_new',
                        secondCtaText: 'Shop the Look',
                        secondCtaLink: '/',
                        secondCtaTarget: '_new',
                        textAlignment: 'tf-g__start'
                    },
                    backgroundImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/background.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/background.jpg'
                            }
                        ],
                        defaultSrc: './images/background.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-background-image'
                    },
                    foregroundTileImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/tile2-foreground.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/tile2-foreground.jpg'
                            }
                        ],
                        defaultSrc: './images/tile2-foreground.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-foreground-image',
                        caption: 'Perfect proportion'
                    }
                }]
            },
            diamondGuideMarketingTileVaraition1: {
                position: {
                    tile1: 'left',
                    tile2: 'right'
                },
                tile1Config: [{
                    contentTile: {
                        heading: 'The world’s best diamonds deserve the best craftsmanship.',
                        description: 'This is why Tiffany’s legendary engagement rings are meticulously handcrafted by highly skilled artisans. From the moment a diamond is discovered until the ring is finished, each design can take up to a year to complete.',
                        ctaText: 'Discover the Tiffany Difference',
                        ctaLink: '/',
                        ctaTarget: '_new',
                        secondCtaText: 'Shop the Look',
                        secondCtaLink: '/',
                        secondCtaTarget: '_new',
                        leftPos: '10%',
                        topPos: '10%',
                        width: 'full-width'
                    },
                    backgroundImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/tile1.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/tile1.jpg'
                            }
                        ],
                        defaultSrc: './images/tile1.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-background-image'
                    }
                },
                {
                    contentTile: {
                        heading: 'The best diamonds @2.',
                        description: 'This is why Tiffany’s legendary engagement rings are meticulously handcrafted by highly skilled artisans. From the moment a diamond is discovered until the ring is finished, each design can take up to a year to complete.',
                        ctaText: 'Discover the Tiffany Difference',
                        ctaLink: '/',
                        ctaTarget: '_new',
                        secondCtaText: 'Shop the Look',
                        secondCtaLink: '/',
                        secondCtaTarget: '_new',
                        leftPos: '10%',
                        topPos: '10%',
                        width: 'full-width'
                    },
                    backgroundImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/tile1.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/tile1.jpg'
                            }
                        ],
                        defaultSrc: './images/tile1.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-background-image'
                    }
                }],
                tile2Config: [{
                    contentTile: {
                        heading: 'Cut',
                        description: 'Tiffany diamond cutters refuse to compromise. When the choice is size or beauty, we always choose beauty, so that we outshine all others. Lorem ipsum dolar sit.',
                        ctaText: 'Explore our guide to diamonds',
                        ctaLink: '/',
                        ctaTarget: '_new',
                        secondCtaText: 'Shop the Look',
                        secondCtaLink: '/',
                        secondCtaTarget: '_new',
                        textAlignment: 'tf-g__start'
                    },
                    backgroundImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/background.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/background.jpg'
                            }
                        ],
                        defaultSrc: './images/background.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-background-image'
                    },
                    foregroundTileImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/tile2-foreground.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/tile2-foreground.jpg'
                            }
                        ],
                        defaultSrc: './images/tile2-foreground.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-foreground-image',
                        caption: 'Perfect proportion'
                    }
                }]
            },
            diamondGuideMarketingTileVaraition2: {
                position: {
                    tile1: 'left',
                    tile2: 'right'
                },
                tile1Config: [{
                    contentTile: {
                        heading: 'The world’s best diamonds deserve the best craftsmanship.',
                        description: 'This is why Tiffany’s legendary engagement rings are meticulously handcrafted by highly skilled artisans. From the moment a diamond is discovered until the ring is finished, each design can take up to a year to complete.',
                        ctaText: 'Discover the Tiffany Difference',
                        ctaLink: '/',
                        ctaTarget: '_new',
                        secondCtaText: 'Shop the Look',
                        secondCtaLink: '/',
                        secondCtaTarget: '_new',
                        leftPos: '10%',
                        topPos: '10%',
                        width: 'full-width'
                    },
                    backgroundImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/tile1.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/tile1.jpg'
                            }
                        ],
                        defaultSrc: './images/tile1.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-background-image'
                    }
                }],
                tile2Config: [{
                    contentTile: {
                        heading: 'Cut',
                        description: 'Tiffany diamond cutters refuse to compromise. When the choice is size or beauty, we always choose beauty, so that we outshine all others. Lorem ipsum dolar sit.',
                        ctaText: 'Explore our guide to diamonds',
                        ctaLink: '/',
                        ctaTarget: '_new',
                        secondCtaText: 'Shop the Look',
                        secondCtaLink: '/',
                        secondCtaTarget: '_new',
                        textAlignment: 'tf-g__start'
                    },
                    backgroundImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/background.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/background.jpg'
                            }
                        ],
                        defaultSrc: './images/background.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-background-image'
                    },
                    foregroundTileImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/tile2-foreground.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/tile2-foreground.jpg'
                            }
                        ],
                        defaultSrc: './images/tile2-foreground.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-foreground-image',
                        caption: 'Perfect proportion'
                    }
                },
                {
                    contentTile: {
                        heading: 'Cut',
                        description: 'Tiffany diamond cutters refuse to compromise. When the choice is size or beauty, we always choose beauty, so that we outshine all others. Lorem ipsum dolar sit.',
                        ctaText: 'Explore our guide to diamonds',
                        ctaLink: '/',
                        ctaTarget: '_new',
                        secondCtaText: 'Shop the Look',
                        secondCtaLink: '/',
                        secondCtaTarget: '_new',
                        textAlignment: 'tf-g__start'
                    },
                    backgroundImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/background.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/background.jpg'
                            }
                        ],
                        defaultSrc: './images/background.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-background-image'
                    },
                    foregroundTileImage: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/tile2-foreground.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/tile2-foreground.jpg'
                            }
                        ],
                        defaultSrc: './images/tile2-foreground.jpg',
                        isLazyLoad: true,
                        altText: 'Sample',
                        customClass: 'diamond-guide-foreground-image',
                        caption: 'Perfect proportion'
                    }
                }]
            },
            homeCarouselConfig: {
                title: 'Home Carousel',
                skuConfig: {
                    SiteId: '27',
                    AssortmentId: '2701',
                    PriceMarketId: 7,
                    Sku: ['60014069', '63477885', '61523030', '60013271', '36339292', 'GRP09920', 'GRP10131', 'GRP09941', 'GRP10794', 'GRP03754', 'GRP05172', 'GRP03666', 'GRP03754', 'GRP04572']
                }
            },

            pdpMarketingCarouselConfig: {
                content: {
                    title: 'Marketing Carousel',
                    textAlignment: 'tf-g__start',
                    heading: 'Everyday Objects',
                    description: 'Beautiful things shouldn just live in a drawer. Carefully crafted by Tiffany artisans in sterling silver, enamel and wood, this collection elevates everyday home and garden accessories with a wit that transforms the ordinary into works of art.',
                    ctaText: 'Shop the collection',
                    rte: false,
                    ctaLink: '/',
                    ctaTarget: '_new',
                    images: [
                        {
                            id: '1',
                            sources: [{
                                maxMedia: 900,
                                src: './images/Shot_02_0150_07_ext_am_V2.png'
                            }, {
                                maxMedia: 767,
                                src: './images/Shot_02_0150_07_ext_am_V2.png'
                            }],
                            defaultSrc: './images/Shot_02_0150_07_ext_am_V2.png',
                            isLazyLoad: true,
                            altText: 'Sample',
                            customClass: ''
                        },
                        {
                            id: '2',
                            sources: [{
                                maxMedia: 900,
                                src: './images/Image2.png'
                            }, {
                                maxMedia: 767,
                                src: './images/Image2.png'
                            }],
                            defaultSrc: './images/Image2.png',
                            isLazyLoad: true,
                            altText: 'Sample1',
                            customClass: ''
                        }
                    ]
                }
            },
            circleCarouselConfig: {
                noOfSlots: 6,
                skuConfig: {
                    SiteId: 1,
                    AssortmentId: 101,
                    PriceMarketId: 1,
                    Sku: []
                },
                content: {
                    description: 'Copy explaining the product recommendations. Sit consectetur adipiscing elit.',
                    ctaText: 'See more',
                    ctaUrl: '/',
                    ctaTarget: '_new'
                },
                marketingTiles: [{
                    ctaLink: 'true',
                    ctaText: 'Shop',
                    ctaUrl: '/',
                    ctaTarget: '_new',
                    imageTarget: '_new',
                    link_url: '//integration.richrelevance.com/rrserver/click?a=9fcc91a121441cb2&vg=4d1387d9-85f1-468f-9d1a-7558e2f4ec83&pti=13&pa=rr1&hpi=8842&stn=NewArrivalsSiteWideTopSellers&stid=147&rti=1&sgs=&mvtId=34400&mvtTs=1527064711928&uguid=2461a0dd-3366-452f-dfb6-4a58e1c3cf7e&channelId=WEB&s=01B6C2PAFCS92GBV00AKHX1DTSF4105A&pg=3315&p=GRP10415&ind=0&ct=http%3A%2F%2Flocalhost%3A6565%2Fjewelry%2Fnecklaces-pendants%2Ftiffany-keys-modern-keys-open-round-key-pendant-GRP10415',
                    slot: 1,
                    sources: [{
                        maxMedia: 900,
                        src: './images/marketing1.png'
                    }, {
                        maxMedia: 767,
                        src: './images/marketing1.png'
                    }],
                    defaultSrc: './images/marketing1.png',
                    isLazyLoad: true,
                    altText: 'Marketing Tile 1',
                    customClass: ''
                }, {
                    ctaLink: '',
                    ctaText: '',
                    ctaUrl: '',
                    ctaTarget: '',
                    link_url: '//integration.richrelevance.com/rrserver/click?a=9fcc91a121441cb2&vg=4d1387d9-85f1-468f-9d1a-7558e2f4ec83&pti=13&pa=rr1&hpi=8842&stn=NewArrivalsSiteWideTopSellers&stid=147&rti=1&sgs=&mvtId=34400&mvtTs=1527064711928&uguid=2461a0dd-3366-452f-dfb6-4a58e1c3cf7e&channelId=WEB&s=01B6C2PAFCS92GBV00AKHX1DTSF4105A&pg=3315&p=61108254&ind=1&ct=http%3A%2F%2Flocalhost%3A6565%2Fjewelry%2Fnecklaces-pendants%2Fatlas-cube-pendant-61108254',
                    slot: 4,
                    sources: [{
                        maxMedia: 900,
                        src: './images/marketing2.png'
                    }, {
                        maxMedia: 767,
                        src: './images/marketing2.png'
                    }],
                    defaultSrc: './images/marketing2.png',
                    isLazyLoad: true,
                    altText: 'Marketing Tile 2',
                    customClass: ''
                }],
                richrelevance: {
                    noClientHeaders: true,
                    richURL: 'rrUrl',
                    queryParams: {
                        apiKey: '9fcc91a121441cb2',
                        apiClientKey: '1f88d8a9478dda98',
                        sessionId: 'test',
                        placements: 'item_page.rr1_AEM',
                        productId: 'GRP07776',
                        includeStrategyData: 'true'
                    }
                },

                mobileSlidesShowCount: 2,
                mobileSlidesScrollCount: 2,
                mobileShowArrows: true
            },
            pdpCarouselConfig: {
                title: 'PDP Carousel',
                richURL: 'rrLocalUrl',
                noClientHeaders: true,
                queryParams: {
                    apiKey: '9fcc91a121441cb2',
                    apiClientKey: '1f88d8a9478dda98',
                    sessionId: 'test',
                    placements: 'item_page.rr1_AEM',
                    productId: 'GRP07776',
                    includeStrategyData: 'true'
                },
                skuConfig: {
                    SiteId: 1,
                    AssortmentId: 101,
                    PriceMarketId: 1,
                    Sku: []
                },
                mobileSlidesShowCount: 0,
                mobileSlidesScrollCount: 0,
                mobileShowArrows: true
            },
            pdpProductCareConfig: {
                textAlignment: 'tf-g__start',
                heading: 'Product Care',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor.',
                ctaPresent: false,
                carouselType: 'RICH_REL',
                isLazyLoad: true,
                carouselConfigKey: 'pdpProductCareCarouselConfig'
            },
            pdpProductCareCarouselConfig: {
                slideToShow: 2,
                richURL: 'rrTestUrl',
                noClientHeaders: true,
                queryParams: {
                    apiKey: '9fcc91a121441cb2',
                    apiClientKey: '1f88d8a9478dda98',
                    sessionId: '',
                    placements: 'item_page.rr2_AEM',
                    productId: '36821078',
                    includeStrategyData: 'true'
                },
                skuConfig: {
                    SiteId: 1,
                    AssortmentId: 101,
                    PriceMarketId: 1,
                    Sku: ['GRP10572', 'GRP10506', 'GRP10560', 'GRP10574', 'GRP10575', 'GRP10515', 'GRP10520']
                }
            },
            skuServiceConfig: {
                url: 'skuUrl',
                method: 'POST'

            },
            categoryServiceConfig: {
                url: 'categoryUrl',
                method: 'POST'
            },
            itemCompleteServiceConfig: {
                url: 'itemCompleteUrl',
                method: 'POST'
            },
            groupCompleteServiceConfig: {
                url: 'groupCompleteUrl',
                method: 'POST'
            },
            engagementProductPreviewDetails: {
                images: [
                    {
                        sources: [
                            {
                                maxMedia: 900,
                                src: 'media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_939616_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                            },
                            {
                                maxMedia: 767,
                                src: 'media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_939616_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                            }
                        ],
                        defaultSrc: 'media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_939616_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                        isLazyLoad: true,
                        altText: 'altText 1',
                        closeIconAlt: 'click to close',
                        mediaFileName: '61235678_987654_ED_1',
                        mediaTypeID: 1092,
                        customClass: 'product-preview-image',
                        smallImage: {
                            src: 'media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_939616_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                        },
                        largeImage: {
                            src: 'media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_939616_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                            width: 3840,
                            height: 3840
                        },
                        scene7ViewerConfig: {
                            containerId: '33278748_950336_SV_1_M',
                            params: {
                                imagereload: '1,breakpoint,1308;1250',
                                zoomfactor: '1,-1,1',
                                asset: 'TiffanyDev/33278748_950336_SV_1_M?$EcomItemL2$',
                                contenturl: '//media.tiffany.com/skins/',
                                config: 'Scene7SharedAssets/Universal_HTML5_Zoom_Inline',
                                serverurl: '//media.tiffany.com/is/image/',
                                stageSize: '1408, 1408',
                                tip: '0,0,0'
                            }
                        }
                    },
                    {
                        sources: [
                            {
                                maxMedia: 900,
                                src: '//media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_950336_SV_1_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                            },
                            {
                                maxMedia: 767,
                                src: '//media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_950336_SV_1_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                            }
                        ],
                        defaultSrc: '//media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_950336_SV_1_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                        isLazyLoad: true,
                        altText: 'altText 2',
                        closeIconAlt: 'click to close',
                        mediaFileName: '61235678_987654_ED_2',
                        mediaTypeID: 1093,
                        customClass: 'product-preview-image',
                        smallImage: {
                            src: '//media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_950336_SV_1_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                        },
                        largeImage: {
                            src: '//media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_950336_SV_1_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                            width: 3840,
                            height: 3840
                        },
                        scene7ViewerConfig: {
                            containerId: '33278748_950336_SV_1_M',
                            params: {
                                imagereload: '1,breakpoint,1308;1250',
                                zoomfactor: '1,-1,1',
                                asset: 'TiffanyDev/33278748_950336_SV_1_M.jpg?$EcomItemL2$',
                                contenturl: '//media.tiffany.com/skins/',
                                config: 'Scene7SharedAssets/Universal_HTML5_Zoom_Inline',
                                serverurl: '//media.tiffany.com/is/image/',
                                stageSize: '1408, 1408',
                                tip: '0,0,0'
                            }
                        }
                    }
                ],
                caratMapping: [
                    {
                        sku: 'GRP10572,GRP10575',
                        pattern: [
                            {
                                range: '0.5-0.74',
                                text: '{} carats shown'
                            },
                            {
                                range: '0.75-0.99',
                                text: '{} carats shown'
                            },
                            {
                                range: '1.00-1.24',
                                text: '{} carats shown'
                            },
                            {
                                range: '1.25-1.49',
                                text: '{} carats shown'
                            },
                            {
                                range: '1.50-1.74',
                                text: '{} carats shown 2'
                            },
                            {
                                range: '1.75-1.99',
                                text: '{} carats shown 3'
                            }
                        ]
                    },
                    {
                        sku: 'GRP10560,GRP10575',
                        pattern: [
                            {
                                range: '0.25-0.49',
                                text: '{} carats shown Text 1'
                            },
                            {
                                range: '0.50-0.74',
                                text: '{} carats shown Text 2'
                            },
                            {
                                range: '0.75-0.99',
                                text: '{} carats shown Text 3'
                            },
                            {
                                range: '0-99',
                                text: '{} carats shown Text 4'
                            }
                        ]
                    }
                ],
                caratWeight: '3.62'
            },
            productPreviewDetails: {
                images: [{
                    sources: [{
                        maxMedia: 900,
                        src: '//media.tiffany.com/is/image/Tiffany/62617691_986302_SV_1?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1'
                    }, {
                        maxMedia: 767,
                        src: '//media.tiffany.com/is/image/Tiffany/62617691_986302_SV_1?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1'
                    }],
                    defaultSrc: '//media.tiffany.com/is/image/Tiffany/62617691_986302_SV_1?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1',
                    isLazyLoad: true,
                    altText: 'Some Image 1',
                    mediaFileName: '61235678_987654_ED_1',
                    mediaTypeID: 1092,
                    customClass: 'product-preview-image',
                    smallImage: {
                        src: '//media.tiffany.com/is/image/Tiffany/62617691_986302_SV_1?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1'
                    },
                    largeImage: {
                        src: '//media.tiffany.com/is/image/Tiffany/62617691_986302_SV_1?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1',
                        width: 3840,
                        height: 3840
                    }
                }, {
                    sources: [{
                        maxMedia: 900,
                        src: '//media.tiffany.com/is/image/Tiffany/62617691_985524_ED?$EcomItemL2$&id=31GqF1&fmt=jpg&fit=constrain,1'
                    }, {
                        maxMedia: 767,
                        src: '//media.tiffany.com/is/image/Tiffany/62617691_985524_ED?$EcomItemL2$&id=31GqF1&fmt=jpg&fit=constrain,1'
                    }],
                    defaultSrc: '//media.tiffany.com/is/image/Tiffany/62617691_985524_ED?$EcomItemL2$&id=31GqF1&fmt=jpg&fit=constrain,1',
                    isLazyLoad: true,
                    altText: 'Some Image 2',
                    mediaFileName: '61235678_987654_ED_2',
                    mediaTypeID: 1093,
                    customClass: 'product-preview-image',
                    smallImage: {
                        src: '//media.tiffany.com/is/image/Tiffany/62617691_985524_ED?$EcomItemL2$&id=31GqF1&fmt=jpg&fit=constrain,1'
                    },
                    largeImage: {
                        src: '//media.tiffany.com/is/image/Tiffany/62617691_985524_ED?$EcomItemL2$&id=31GqF1&fmt=jpg&fit=constrain,1',
                        width: 3840,
                        height: 3840
                    }
                }, {
                    sources: [{
                        maxMedia: 900,
                        src: '//media.tiffany.com/is/image/Tiffany/34684456_945591_SV_1?$EcomItemL2$&id=q7gqk2&fmt=jpg&fit=constrain,1'
                    }, {
                        maxMedia: 767,
                        src: '//media.tiffany.com/is/image/Tiffany/34684456_945591_SV_1?$EcomItemL2$&id=q7gqk2&fmt=jpg&fit=constrain,1'
                    }],
                    defaultSrc: '//media.tiffany.com/is/image/Tiffany/34684456_945591_SV_1?$EcomItemL2$&id=q7gqk2&fmt=jpg&fit=constrain,1',
                    isLazyLoad: true,
                    altText: 'Some Image 3',
                    mediaFileName: '61235678_987654_ED_3',
                    mediaTypeID: 1098,
                    customClass: 'product-preview-image',
                    smallImage: {
                        src: '//media.tiffany.com/is/image/Tiffany/34684456_945591_SV_1?$EcomItemL2$&id=q7gqk2&fmt=jpg&fit=constrain,1'
                    },
                    largeImage: {
                        src: '//media.tiffany.com/is/image/Tiffany/34684456_945591_SV_1?$EcomItemL2$&id=q7gqk2&fmt=jpg&fit=constrain,1',
                        width: 3840,
                        height: 3840
                    }
                }]
            },
            productPreviewDetailsS7: {
                images: [
                    {
                        sources: [
                            {
                                maxMedia: 900,
                                src: 'media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_939616_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                            },
                            {
                                maxMedia: 767,
                                src: 'media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_939616_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                            }
                        ],
                        defaultSrc: 'media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_939616_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                        isLazyLoad: true,
                        altText: 'altText 1',
                        closeIconAlt: 'click to close',
                        mediaFileName: '61235678_987654_ED_1',
                        mediaTypeID: 1092,
                        customClass: 'product-preview-image',
                        smallImage: {
                            src: 'media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_939616_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                        },
                        largeImage: {
                            src: 'media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_939616_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                            width: 3840,
                            height: 3840
                        },
                        scene7ViewerConfig: {
                            containerId: '33278748_939616_ED_M',
                            params: {
                                imagereload: '1,breakpoint,1308;1250',
                                zoomfactor: '1,-1,1',
                                config: 'Scene7SharedAssets/Universal_HTML5_Zoom_Inline',
                                contenturl: '//media.tiffany.com/skins/',
                                asset: 'TiffanyDev/33278748_939616_ED_M?$EcomItemL2$',
                                serverurl: 'media.tiffany.com/is/image/',
                                stageSize: '1408, 1408',
                                tip: '0,0,0'
                            }
                        }
                    },
                    {
                        sources: [
                            {
                                maxMedia: 900,
                                src: '//media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_950336_SV_1_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                            },
                            {
                                maxMedia: 767,
                                src: '//media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_950336_SV_1_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                            }
                        ],
                        defaultSrc: '//media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_950336_SV_1_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                        isLazyLoad: true,
                        altText: 'altText 2',
                        closeIconAlt: 'click to close',
                        mediaFileName: '61235678_987654_ED_2',
                        mediaTypeID: 1093,
                        customClass: 'product-preview-image',
                        smallImage: {
                            src: '//media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_950336_SV_1_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                        },
                        largeImage: {
                            src: '//media.tiffany.com/is/image/TiffanyDev/EcomItemL/tiffany-classicwedding-band-ring-33278748_950336_SV_1_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&',
                            width: 3840,
                            height: 3840
                        },
                        scene7ViewerConfig: {
                            containerId: '33278748_950336_SV_1_M',
                            params: {
                                imagereload: '1,breakpoint,1308;1250',
                                zoomfactor: '1,-1,1',
                                asset: 'TiffanyDev/33278748_950336_SV_1_M?$EcomItemL2$',
                                contenturl: '//media.tiffany.com/skins/',
                                config: 'Scene7SharedAssets/Universal_HTML5_Zoom_Inline',
                                serverurl: '//media.tiffany.com/is/image/',
                                stageSize: '1408, 1408',
                                tip: '0,0,0'
                            }
                        }
                    }
                ],
                caratMapping: [],
                watermarkConfig: {
                    header: 'Tiffany & Co. Employee Store',
                    description: 'Purchase for resale is prohibited'
                },
                logo: {}
            },
            productDetailsConfig: {
                url: 'itemPriceUrl',
                groupUrl: 'groupPriceUrl',
                method: 'POST',
                payload: {
                    assortmentId: 101,
                    priceMarketId: 1,
                    sku: '37003409',
                    siteId: 1
                }
            },
            clickToPayConfig: {
                clickToPayURL: 'www.google.com',
                clickToPayText: 'Click To Pay'
            },
            productSharingConfig: {
                productImage: 'icons/instagram.svg',
                qrCodeTitle: 'Tiffany & Co.',
                qrCodeImage: 'icons/instagram.svg',
                qrCodeDesc: 'Please open WeChat; tap Discover and use Scan to send this page to Chat or share it on Moments.',
                properties: {
                    weChatDataInteractionName_tif_nt: ''
                }
            },
            addToCartConfig: {
                mysid2Life: 7300,
                currency: '$',
                url: 'skuEcomAddEndPoint',
                method: 'POST',
                payload: {
                    assortmentId: 101,
                    siteId: 1,
                    groupSku: 'GRP02985',
                    parentGroupSKU: 'GRP04077',
                    sku: 25508327,
                    quantity: 1,
                    categoryID: 287465,
                    masterCategoryID: 148204,
                    partialShip: false,
                    orderOriginationId: 1,
                    webCustomerID: 'ca05c84fa7244a6ca554c40e188242c7'
                }
            },
            typeId: 'SKU',
            popularProductConfig: {
                title: 'Most Popular',
                popularProductConfigType: 'typeId',
                skuConfig: {
                    SiteId: 1,
                    AssortmentId: 101,
                    PriceMarketId: 1,
                    Sku: ['GRP10572', 'GRP10506', 'GRP10560', 'GRP10574', 'GRP10575', 'GRP10515', 'GRP10520']
                },
                categoryConfig: {
                    assortmentID: 101,
                    sortTypeID: 11,
                    searchTerms: 'Rings',
                    navigationFilters: [
                        101
                    ],
                    recordsOffsetNumber: 0,
                    recordsCountPerPage: 10,
                    priceMarketID: '01',
                    searchModeID: 1,
                    siteid: '01'
                }
            },
            noSearchConfig: {
                noSearchLabel: 'No search results found for search term',
                telephoneNumber: '1-847-555-5555',
                contactInfoRTE: '<div class="tiffany-rte"> <h5>Need Help?</h5> <br><p><a href="www.google.com" target="_blank">Contact us</a><b><a href="www.google.com" target="_blank">Tiffany Concierge</a></b> or call<span class="text-phnumber">adfa</span></p></div>'
            },
            nonPurchasebleInformationTextConfig: {
                telephoneNumber: '800-843-3269',
                informationTextRTE: '<p>Call Sales Service at <b> <span class="text-phnumber">800-843-3269</span></b> for more information</p>'
            },
            iStatusInformationTextConfig: {
                informationTextRTE: '<p>Currently,the product is <b><span class="unavailable"> unavailable online.</span></b></p>'
            },
            retiredInformationConfig: {
                telephoneNumber: '800-843-3269',
                informationTextRTE: '<div class="tiffany-rte"><p><b>Currently, the product is unavailable</b></p><p>Call Sales Service at <b> <span class="text-phnumber">800-843-3269</span></b> for more information</p></div>'
            },
            changeStoreHelpText: {
                informationTextRTE: '<p>Need help? Contact our Sales Customer Service at <b> <span class="text-phnumber">800-843-3269</span></b> </p>',
                telephoneNumber: '800-843-3269'
            },
            changeStoreErrorMsg: {
                informationTextRTE: '<p class="error-msg">There are no stores lorem ipusm dolor sit amet consectetur... Need help? Contact our Sales Service at <b> <span class="text-phnumber">800 843 3269</span></b> </p>',
                telephoneNumber: '800 843 3269'
            },
            disclaimerDescriptionConfig: {
                informationTextRTE: '<ul><li>Do not burn candle for longer than three-hour intervals.</li><li> Do not set the candle in a draft or leave candle burning unattended.</li><li>Keep away from children, curtains and pets.<li>Keep wax pool free of debris.</li><li>Should any black smoke appear, trim the tip of the wick.</li><li>Keep wick clean and no longer than ¼ inches or 5 mm at all times.</li><li>Always burn on a fire and heat-resistant stable surface.</li><li>Do not burn candle all the way down.</li><li>Keep your candle in a dry and temperate environment between 16–26° C.</li><li>Keep your candle in a dry and temperate environment between 16–26° C.</li><li>Keep your candle in a dry and temperate environment between 16–26° C.</li><li>Keep your candle in a dry and temperate environment between 16–26° C.</li><li>Keep your candle in a dry and temperate environment between 16–26° C.</li><li>Keep your candle in a dry and temperate environment between 16–26° C.</li><li>Keep your candle in a dry and temperate environment between 16–26° C.</li><li>Keep your candle in a dry and temperate environment between 16–26° C.</li><ul>'
            },
            giftCardTermsConfig: {
                telephoneNumber: '00800 2000 1122',
                informationTextRTE: '<strong>What is a Tiffany Gift Card?</strong><p>The Tiffany Gift Card is redeemable for Tiffany &amp; Co. merchandise up to the prepaid value of the card. It acts like a gift certificate, but looks like a credit card. Available in denominations from $50 to $10,000. The Tiffany Gift Card allows the purchaser to share with their gift recipient the experience of shopping at Tiffany. To purchase a Tiffany Gift Card, choose a value from the drop-down menu, enter a quantity and click on the purchase button.</p><br/><strong>Where can a Tiffany Gift Card be used?</strong><p>The Tiffany Gift Card is recognized at all Tiffany &amp; Co. stores in the United States, Tiffany.com and on orders placed by telephone,<span class="text-phnumber">800-843-3269</span></p>'
            },
            counterfeitWarningConfig: {
                telephoneNumber: '00800 2000 1122',
                informationTextRTE: '<p><span class="strong-text">Warning against counterfeiting</span><br/><br/>The goods of Tiffany & Co. are only available from Tiffany & Co. If you want to be sure that you are buying original Tiffany merchandise, please purchase online at Tiffany.co.uk, in a Tiffany &amp; Co. store or by calling toll-free <span class="text-phnumber">00800 2000 1122</span>. Suspected goods from Tiffany & Co. sold through unauthorized channels are suspicious. Beware of fakes!</p>'
            },
            typeSearchConfig: {
                telephoneNumber: '00800 2000 1122',
                gettypeaheadUrl: {
                    url: 'typeAheadUrl',
                    method: 'POST',
                    payload: {
                        assortmentID: 101,
                        searchTerms: 'Rings',
                        siteId: 1
                    }
                },
                config: {
                    mobilePlaceholder: 'Search Mobile',
                    desktopPlaceholder: 'Search Desktop',
                    searchHistoryHeading: 'Your Search History',
                    searchUrl: '/Search?q=',
                    quickLinksMobileEnabled: true,
                    hideMobileSearchLinks: false
                },
                searchQuickLinks: {
                    heading: 'Quick Links',
                    results: [{
                        name: 'Gift Finder',
                        url: '/',
                        id: 1,
                        target: '_new',
                        analyticsLinkType: 'search:quick-links',
                        analyticsLinkName: 'gift-finder'
                    }, {
                        name: 'Build Your Own',
                        url: '/',
                        id: 2,
                        target: '_new',
                        analyticsLinkType: 'search:quick-links',
                        analyticsLinkName: 'build-your-own'
                    }, {
                        name: 'Seasonal search phrase',
                        url: '/',
                        id: 3,
                        target: '_new',
                        analyticsLinkType: 'search:quick-links',
                        analyticsLinkName: 'seasonal-search-phrase'
                    }, {
                        name: 'Stores',
                        url: '/',
                        id: 4,
                        target: '_new',
                        analyticsLinkType: 'search:quick-links',
                        analyticsLinkName: 'stores'
                    }, {
                        name: 'FAQs',
                        url: '/',
                        id: 5,
                        target: '_new',
                        analyticsLinkType: 'search:quick-links',
                        analyticsLinkName: 'faqs'
                    }]
                },
                searchFooterData: '<div class="tiffany-rte"><h5>Need help?</h5><ul><li><p>Contact&nbsp;<a href="/content/tiffany-n-co/www/us/en_us/customer-service.html">Customer Service</a></p></li><li><span class="text-phnumber">Call Us</span></li></ul></div>'
            },
            dynamicMarketingContentConfig: {
                /* eslint-disable */
                marketingTilesFallOff: true,
                "content": [
                    {
                        "component": "tiffany-marketing-content-tile",
                        "layout": "1x1",
                        "mobileLayout": "2x1",
                        "config": "marketingContentTile",
                        "tileConfig": {
                            "heading": "<div class='tiffany-rte'><p>The Tiffany® Setting</p>\r\n</div>",
                            "description": "We handcrafted a ring with a diamond so rare, it deserved to be lifted above the band. In so doing, we created something not just brilliant, but legendary: the engagement ring as we know it today.",
                            "customClass": "marketingContentTile",
                            "ctaText": "See more",
                            "ctaLink": "https://www.tiffany.com/jewelry/rings?trackbgfm=nav/",
                            "ctaTarget": "_blank",
                            "textAlignment": "tf-g__start",
                            "paddingBottom": "padding-bottom-16",
                            "textColor": "black",
                            "isRte": "true"
                        },
                        "slot": 5,
                        "key": "marketingTile4"
                    },
                    {
                        "component": "tiffany-marketing-content-tile",
                        "layout": "1x1",
                        "mobileLayout": "2x1",
                        "config": "marketingContentTile",
                        "tileConfig": {
                            "heading": "<div class='tiffany-rte'><h3 style=\"text-align: center;\"><span class=\"font-size-32\"><span class=\"sterling-regular\">Emerald</span></span><span class=\"font-size-40\"></span><span class=\"santral-italic\"></span><span class=\"sterling-italic\"></span></h3>\r\n</div>",
                            "description": "Although the emerald-cut diamond has 58 facets like round and princess-cut diamonds, it is the parallel facets that help highlight the stone’s color and clarity.",
                            "customClass": "marketingContentTile",
                            "ctaText": null,
                            "ctaLink": null,
                            "ctaTarget": "_self",
                            "textAlignment": "tf-g__start",
                            "paddingBottom": "padding-bottom-16",
                            "textColor": "black",
                            "isRte": "true"
                        },
                        "slot": 10,
                        "key": "marketingTile9"
                    },
                    {
                        "props": {
                            "type": "IMAGE"
                        },
                        "component": "tiffany-marketing-content-picture-tile",
                        "layout": "2x1",
                        "tileConfig": {
                            "image": {
                                "defaultSrc": "//media.tiffany.com/is/image/tiffanydmdt1/STL?wid=1406&hei=710",
                                "isLazyLoad": true,
                                "altText": null,
                                "ctaLink": null,
                                "ctaTarget": "_self",
                                "customClass": "picture-tile",
                                "sources": [
                                    {
                                        "maxMedia": 900,
                                        "src": "//media.tiffany.com/is/image/tiffanydmdt1/STL?wid=1406&hei=710"
                                    },
                                    {
                                        "maxMedia": 767,
                                        "src": null
                                    }
                                ]
                            },
                            "paddingBottom": "no-padding-bottom"
                        },
                        "slot": 19,
                        "key": "marketingTile18"
                    },
                    {

                    },
                    {
                        "layout": "2x2",
                        "props": {
                            "type": "SKU"
                        },
                        "tileConfig": {
                            "contentTile": {
                                "heading": "<div class='tiffany-rte'><p><span class=\"sterling-regular\"><span class=\"font-size-32\">Tiffany Eau de Parfum Sheer</span></span></p>\r\n</div>",
                                "description": "<div class='tiffany-rte'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</div>",
                                "isRte": "true",
                                "ctaText": "Shop Now",
                                "ctaLink": "www.tiffany.com/",
                                "ctaTarget": "_blank",
                                "ctaOneStyle": "underline",
                                "ctaTwoStyle": "underline",
                                "secondCtaText": null,
                                "secondCtaLink": null,
                                "secondCtaTarget": "_self",
                                "width": "full-width",
                                "leftPos": "0%",
                                "topPos": "0%",
                                "textColor": "black",
                                "textAlignment": "tf-g__start"
                            },
                            "paddingBottom": "no-padding-bottom",
                            "slideChangeAlertlabel": "Slide Changed",
                            "image": {
                                "defaultSrc": "//media.tiffany.com/is/image/tiffanydmdt1/2x2 tile?wid=1488&hei=1488",
                                "isLazyLoad": true,
                                "altText": "Alt Text",
                                "customClass": "picture-item",
                                "sources": [
                                    {
                                        "maxMedia": 900,
                                        "src": "//media.tiffany.com/is/image/tiffanydmdt1/2x2 tile?wid=1488&hei=1488"
                                    },
                                    {
                                        "maxMedia": 767,
                                        "src": "//media.tiffany.com/is/image/tiffanydmdt1/2x2 tile?wid=1488&hei=1488"
                                    }
                                ]
                            },
                            "skuConfig": {
                                "siteid": "1",
                                "assortmentID": "101",
                                "priceMarketID": "1",
                                "Sku": [
                                    "GRP10515",
                                    "GRP10575"
                                ]
                            }
                        },
                        "component": "tiffany-text-with-image-carousel",
                        "slot": 30,
                        "key": "marketingTile29"
                    },
                    {
                        "tileConfig": {
                            "id": "more-ways-to-shop",
                            "title": "More Ways to Shop",
                            "heading": "More Ways to Shop",
                            "description": "<div class='tiffany-rte'><p style=\"text-align: center;\">Express your eternal love with a trio of scintillating stones.</p>\r\n</div>",
                            "isRte": "true",
                            "paddingBottom": "no-padding-bottom",
                            "images": [
                                {
                                    "id": 1,
                                    "sources": [
                                        {
                                            "maxMedia": 900,
                                            "src": "//media.tiffany.com/is/image/tiffanydmdt1/ways-1?wid=988&hei=988",
                                            "lazyLoad": false
                                        },
                                        {
                                            "maxMedia": 767,
                                            "src": "//media.tiffany.com/is/image/tiffanydmdt1/ways-1?wid=988&hei=988",
                                            "lazyLoad": false
                                        }
                                    ],
                                    "defaultSrc": "//media.tiffany.com/is/image/tiffanydmdt1/ways-1?wid=988&hei=988",
                                    "isLazyLoad": true,
                                    "altText": "Tiffany image slot 01",
                                    "customClass": "threeTileImg",
                                    "contentTile": {
                                        "isRte": "true",
                                        "ctaText": "See Rings",
                                        "ctaLink": "/jewelry/shop/gold-ring/",
                                        "ctaTarget": "_blank",
                                        "textColor": "black"
                                    }
                                },
                                {
                                    "id": 2,
                                    "sources": [
                                        {
                                            "maxMedia": 900,
                                            "src": "//media.tiffany.com/is/image/tiffanydmdt1/ways-3?wid=988&hei=988",
                                            "lazyLoad": false
                                        },
                                        {
                                            "maxMedia": 767,
                                            "src": "//media.tiffany.com/is/image/tiffanydmdt1/ways-3?wid=988&hei=988",
                                            "lazyLoad": false
                                        }
                                    ],
                                    "defaultSrc": "//media.tiffany.com/is/image/tiffanydmdt1/ways-3?wid=988&hei=988",
                                    "isLazyLoad": true,
                                    "altText": "Tiffany image slot 2",
                                    "customClass": "threeTileImg",
                                    "contentTile": {
                                        "isRte": "true",
                                        "ctaText": "See charms",
                                        "ctaLink": "/jewelry/shop/Charms/",
                                        "ctaTarget": "_blank",
                                        "textColor": "black"
                                    }
                                },
                                {
                                    "id": 3,
                                    "sources": [
                                        {
                                            "maxMedia": 900,
                                            "src": "//media.tiffany.com/is/image/tiffanydmdt1/ways-2?wid=988&hei=988",
                                            "lazyLoad": false
                                        },
                                        {
                                            "maxMedia": 767,
                                            "src": "//media.tiffany.com/is/image/tiffanydmdt1/ways-2?wid=988&hei=988",
                                            "lazyLoad": false
                                        }
                                    ],
                                    "defaultSrc": "//media.tiffany.com/is/image/tiffanydmdt1/ways-2?wid=988&hei=988",
                                    "isLazyLoad": true,
                                    "altText": "Tiffany image slot 2",
                                    "customClass": "threeTileImg",
                                    "contentTile": {
                                        "isRte": "true",
                                        "ctaText": "Earrings",
                                        "ctaLink": "/jewelry/shop/earrings/",
                                        "ctaTarget": "_self",
                                        "textColor": "black"
                                    }
                                }
                            ],
                            "isHeading": true
                        },
                        "layout": "4x1",
                        "component": "tiffany-three-tile-carousel",
                        "slot": 38,
                        "key": "marketingTile37"
                    },
                    {
                        "key": "marketingTile49",
                        "props": {
                            "type": "CATEGORY"
                        },
                        "layout": "4x1",
                        "component": "tiffany-full-width-shoppable-tile",
                        "slot": 50,
                        "tileConfig": {
                            "marketingTilePosition": "right",
                            "categoryConfig": {
                                "assortmentID": 101,
                                "sortTypeID": 5,
                                "categoryid": 287458,
                                "navigationFilters": [
                                    101,
                                    101287458
                                ],
                                "recordsOffsetNumber": 0,
                                "recordsCountPerPage": 40,
                                "priceMarketID": "1",
                                "searchModeID": 2,
                                "siteid": 1
                            },
                            "key": "marketingTile49_shop",
                            "tileConfig": {
                                "image": {
                                    "sources": [
                                        {
                                            "maxMedia": 900,
                                            "src": "//media.tiffany.com/is/image/tiffanydmdt1/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right?wid=1232&hei=1680",
                                            "lazyLoad": false
                                        },
                                        {
                                            "maxMedia": 767,
                                            "src": "//media.tiffany.com/is/image/tiffanydmdt1/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right?wid=1232&hei=1680",
                                            "lazyLoad": false
                                        }
                                    ],
                                    "defaultSrc": "//media.tiffany.com/is/image/tiffanydmdt1/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right?wid=1232&hei=1680",
                                    "isLazyLoad": false,
                                    "altText": "Full width shoppable image",
                                    "customClass": "picture-item"
                                },
                                "contentTile": {
                                    "heading": "Timeless. Transcendent. Tiffany T.",
                                    "ctaText": "Shop Collection",
                                    "ctaLink": "/jewelry/shop/gold-ring/",
                                    "ctaTarget": "_blank",
                                    "ctaAlignment": "start",
                                    "textAlignment": "tf-g__start"
                                }
                            }
                        }
                    },
                    {
                        "props": {
                            "type": "IMAGE"
                        },
                        "component": "tiffany-marketing-content-picture-tile",
                        "layout": "2x1",
                        "tileConfig": {
                            "image": {
                                "defaultSrc": "//media.tiffany.com/is/image/tiffanydmdt1/STL?wid=1406&hei=710",
                                "isLazyLoad": true,
                                "altText": null,
                                "ctaLink": null,
                                "ctaTarget": "_self",
                                "customClass": "picture-tile",
                                "sources": [
                                    {
                                        "maxMedia": 900,
                                        "src": "//media.tiffany.com/is/image/tiffanydmdt1/STL?wid=1406&hei=710"
                                    },
                                    {
                                        "maxMedia": 767,
                                        "src": null
                                    }
                                ]
                            },
                            "paddingBottom": "no-padding-bottom"
                        },
                        "slot": 41,
                        "key": "marketingTile40"
                    },
                    {

                    },
                    {
                        "layout": "2x2",
                        "props": {
                            "type": "SKU"
                        },
                        "tileConfig": {
                            "contentTile": {
                                "heading": "<div class='tiffany-rte'><p><span class=\"sterling-regular\"><span class=\"font-size-32\">Tiffany Eau de Parfum Sheer</span></span></p>\r\n</div>",
                                "description": "<div class='tiffany-rte'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</div>",
                                "isRte": "true",
                                "ctaText": "Shop Now",
                                "ctaLink": "www.tiffany.com/",
                                "ctaTarget": "_blank",
                                "ctaOneStyle": "underline",
                                "ctaTwoStyle": "underline",
                                "secondCtaText": null,
                                "secondCtaLink": null,
                                "secondCtaTarget": "_self",
                                "width": "full-width",
                                "leftPos": "0%",
                                "topPos": "0%",
                                "textColor": "black",
                                "textAlignment": "tf-g__start"
                            },
                            "paddingBottom": "no-padding-bottom",
                            "slideChangeAlertlabel": "Slide Changed",
                            "image": {
                                "defaultSrc": "//media.tiffany.com/is/image/tiffanydmdt1/2x2 tile?wid=1488&hei=1488",
                                "isLazyLoad": true,
                                "altText": "Alt Text",
                                "customClass": "picture-item",
                                "sources": [
                                    {
                                        "maxMedia": 900,
                                        "src": "//media.tiffany.com/is/image/tiffanydmdt1/2x2 tile?wid=1488&hei=1488"
                                    },
                                    {
                                        "maxMedia": 767,
                                        "src": "//media.tiffany.com/is/image/tiffanydmdt1/2x2 tile?wid=1488&hei=1488"
                                    }
                                ]
                            },
                            "skuConfig": {
                                "siteid": "1",
                                "assortmentID": "101",
                                "priceMarketID": "1",
                                "Sku": [
                                    "",
                                    ""
                                ]
                            }
                        },
                        "component": "tiffany-text-with-image-carousel",
                        "slot": 46,
                        "key": "marketingTile45"
                    }
                ]
            },
            supplementalLabelsConfig: {
                sku: 'SKU:',
                department: 'Department:',
                class: 'Class:',
                style: 'Style:',
                MIPStatus: 'MIPS Status:',
                serviceableFlag: 'Serviceable flag:',
                servicingType: 'Servicing type 1:',
                infoIconconfig: {
                    ariaLabel: 'Information icon',
                    icon: './icons/information.svg',
                    altText: 'Info icon'
                },
                modalConfig: {
                    closeAriaLabel: 'Close supplemental info Modal',
                    leftArrowAriaLabel: 'Slide to left'
                }
            },
            supplementalProdInfoConfig: {
                headingText: 'SKU {}- Supplemental Information',
                gemologicalCta: {
                    ctaText: 'Gemological Report',
                    ctaLink: '/',
                    ctaTarget: '_new'
                },
                physicalSpecConfig: {
                    physicalSpec: 'Physical Specifications',
                    primaryGemstone: 'Primary gemstone',
                    noOfPieces: 'Number of pieces',
                    metalMaterial: 'Metal Material',
                    size: 'Size',
                    metalType: 'Metal Type',
                    weight: 'Weight',
                    total: 'Total weight in',
                    height: 'Height in',
                    length: 'Length in',
                    width: 'width in',
                    units: {
                        grams: 'Gm',
                        oz: 'Oz',
                        lb: 'Lb',
                        inches: 'Inches',
                        mm: 'MM'
                    }
                },
                classificationConfig: {
                    originClassification: 'Origin / Classification',
                    productType: 'Product type',
                    family: 'Family',
                    businessPillar: 'Business Pillar',
                    pattern: 'Collection/pattern',
                    department: 'Department',
                    class: 'Class',
                    style: 'Style',
                    color: 'Color',
                    countryOfOrigin: 'Country of Origin',
                    primaryVendor: 'Primary Vendor',
                    cites: 'Cites',
                    discountableFlag: 'Discountable flag'
                },
                IRConfig: {
                    IRHeading: 'IR / Diamond Information',
                    IRFlag: 'IR flag',
                    gemclarity: 'Gem clarity',
                    gemColor: 'Gem Color'
                },
                servicingConfig: {
                    servicingInfo: 'Servicing Information',
                    serviceableFlag: 'Serviceable Flag',
                    servicingType: 'Servicing Type',
                    eCommEngravingAttr: 'E-Comm Engraving Attributes',
                    ecommengravingquantity: 'Position -',
                    ecommengravingposition: 'Quantity -'
                },
                packagingConfig: {
                    packagingInformationLabel: 'Packaging Information',
                    takebox: 'Take box',
                    sendBox: 'Send Box',
                    pouch: 'Flannel/Pouch',
                    attachment: 'Attachment 1'
                },
                ticketConfig: {
                    ticket: 'Ticket',
                    ticketDesc: 'Ticket description'
                },
                skuMemoConfig: {
                    skuMemoLabel:'SKU Memo'
                }
            },
            supplementalDefaultSku: '12 345 678',
            engagementpdp: {
                socialSharingConfig: {
                    productSharingConfig: 'productSharingConfig',
                    engagementProductPreviewDetails: 'engagementProductPreviewDetails',
                    eyebrowCtaText: 'Engagement',
                    eyebrowTextURL: '/SearchPageURL{}?q=engagement',
                    eyebrowTextTarget: '_blank',
                    productTitle: 'Sterling Silver Flower Pot',
                    productDesc: 'Sterling Silver Flower Pot and short desc',
                    productImage: 'icons/weibo.png',
                    isChina: true,
                    properties: {
                        weiboDataInteractionName_tif_nt: ''
                    },
                    socialSharingLinks: [
                        {
                            icon: 'icons/weibo.png',
                            label: 'weibo',
                            cta: {
                                ctaLink: '/',
                                ctaText: 'weibo'
                            },
                            weiboURL: 'http://service.weibo.com/share/share.php',
                            isWeChat: false
                        },
                        {
                            icon: 'icons/wechat.png',
                            label: 'wechat',
                            isWeChat: true
                        }
                    ]
                },
                changeMetalColorConfig: {
                    heading: 'Lorem ipsum if you change your metal color, you’ll need to choose a new diamond.',
                    description: 'Lorem ipsum sit dolor amed consectetur.',
                    ctaText: 'Change metal color',
                    ctaLink: '/',
                    ctaTarget: '_blank',
                    cancelCtaText: 'Cancel',
                    ctaOneStyle: 'secondary'
                },
                ringNotAvailable: {
                    isRingAvailable: true,
                    statusText: 'This item is no longer available',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    ctaText: 'Lorem Ipsum',
                    groupUrl: '/'
                },
                updateRingSizeConfig: {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev02/shoppingbagsprocessapi/api/process/v1/shoppingbags/item/update',
                    method: 'post',
                    payload: {
                        SiteId: 1,
                        ShoppingBagItemId: 248591,
                        Sku: 23570661,
                        WebCustomerID: '26b015b832384d18a9b4c2d6c7d76b2e',
                        ItemServicing:
                        {
                            itemServiceTypeID: 16,
                            style: 290,
                            instruction: '',
                            text: 5,
                            serviceQuantity: 2
                        }
                    }
                },
                groupCompleteResponse: {
                    eyebrowtext: 'Engagement',
                    title: 'Plat Round Diamon Pendant',
                    specifications: 'specification 1; specification 2; specification 3',
                    style: '46166',
                    caratWeight: '3.62',
                    minCaratWeight: '1.00',
                    maxCaratWeight: '5.00',
                    lowerPriceLimit: '6400',
                    upperPriceLimit: '7400',
                    diamondColor: ['E'],
                    diamondClarity: ['VVS1'],
                    diamondShape: ['Round Brilliant', 'True', 'Princess', 'Pear', 'Heart'],
                    diamondCut: ['Excellent'],
                    longDescription: 'Graphic and geometric with a T-shaped detail in the setting,<br/> the Tiffany True engagement ring is a new icon of modern love. With a refined platinum band and a Tiffany True diamond, a new square mixed-cut diamond unique to Tiffany, the Tiffany True engagement ring features clean lines and striking details.<br><br>At Tiffany, we ethically source our diamonds. Integrity and social responsibility are at the core of our sourcing practices.',
                    additionalInfo: 'Additional Information text',
                    minPrice: 12456,
                    sku: 'GRP10572',
                    countryOfOrigin: 'Botswana',
                    price: 22300,
                    selectedSku: '',
                    itemServiceTypeId: '16',
                    servicingQuantity: '1',
                    defaultRingSize: 6,
                    lineListedItems: [
                        {
                            linkText: 'Rose Gold',
                            listEntryDisplayOrder: 2,
                            canonicalURL: '/jewelry/bracelets/oval-link-bracelet-GRP09033/oval-link-bracelet-36667338'
                        },
                        {
                            linkText: 'Yellow Gold',
                            listEntryDisplayOrder: 1,
                            canonicalURL: '/jewelry/bracelets/oval-link-bracelet-GRP09033/oval-link-bracelet-36667338'
                        },
                        {
                            linkText: 'White Gold',
                            listEntryDisplayOrder: 3,
                            canonicalURL: '/jewelry/bracelets/oval-link-bracelet-GRP09033/oval-link-bracelet-36667338'
                        }
                    ],
                    showChooseDiamond: true,
                    isAvailableOnline: true,
                    showAvailableOnlineFilter: true,
                    hideContactDiamondExpert: false
                },
                forced1BVariation: false,
                hideCountryOfOrigin: false,
                labels: {
                    chinaShareText: 'Share',
                    description: 'Description',
                    yourSelectionHeading: 'Your Diamond Selection',
                    confirmationPdpRingPreText: 'Need help choosing ring size?',
                    confirmationPdpRingPostText: 'choose RingSize',
                    styleLabel: 'Style #',
                    informationText: 'Lorem ipsum subject to availability, price references an IVS2',
                    caratText: 'Carat shown',
                    priceText: 'Priced from ',
                    readMoreLabel: 'Read more',
                    closeLabel: 'Close',
                    priceInformationText: 'Lorem ipsum Lorem ipsum Lorem ipsum',
                    chooseDiamondLabel: 'Choose a diamond',
                    contactExpertLabel: 'Contact a diamond expert',
                    diamondExpertLabel: 'diamond expert',
                    metalAvailabilityText: '',
                    metalAvailabilityTarget: '_new',
                    viewRingText: 'View this ring in',
                    yourSuggestionsText: 'Your suggestions',
                    descriptionText: 'Description text',
                    toolTipIcon: './icons/information.svg',
                    toolTipAltText: 'tool tip',
                    cutLabel: 'Cut',
                    CutImage: './icons/wishlist-new.svg',
                    cutToolTipText: 'choose your style of cut from the below options',
                    caratWeightLabel: 'Carat Weight',
                    caratToolTipText: 'choose your carat from the below options',
                    colorLabel: 'Color',
                    colorToolTipText: 'choose your color from the below options',
                    clarityLabel: 'Clarity',
                    clarityToolTipText: 'choose the clarity you want from below available options',
                    priceLabel: 'Price',
                    avialableOnlineText: 'Available online',
                    resetText: 'Reset filters',
                    minLabel: 'min',
                    maxLabel: 'max',
                    toLabel: 'to',
                    filterByLabel: 'Filter By',
                    applyFiltersLabel: 'Apply filters',
                    caratErrorMsg: 'Please select a different carat weight range',
                    caratSliderAriaLabel: 'Carat slider',
                    priceErrorMsg: 'Please select a diferent price range',
                    priceSliderAriaLabel: 'Price slider',
                    chooseDiamondTitle: 'Choose your diamond',
                    chooseDiamondDescription: 'The superlative beauty of Tiffany\'s engagement diamonds is the result of strict quality standards and our obsession with creating the most beautiful diamonds at every step.',
                    chooseDiamondCtaText: 'Discover the Tiffany Difference',
                    chooseDiamondCtaLink: '/',
                    chooseDiamondTarget: '_new',
                    chooseDiamondLazyload: true,
                    suggestionHeading: 'Your Suggestions',
                    suggestionDesc: 'Lorem ipsum sit dolor amed consectetur select a Tiffany diamond.',
                    availableText: 'Available online',
                    availableIcon: './icons/shopping-bag.svg',
                    availableIconAlt: '',
                    callUsText: 'Call to order',
                    callUsLink: 'tel:81',
                    callUsIcon: './icons/call.svg',
                    callUsIconAlt: '',
                    cardsCaratTitle: 'Carats',
                    cardsColorTitle: 'Color',
                    cardsClarityTitle: 'Clarity',
                    cardsCutTitle: 'Cut',
                    moreCardsText: 'More like this',
                    needHelpText: 'Need help choosing?',
                    needHelpIcon: './icons/diamondexpert.svg',
                    needHelpIconAlt: '',
                    contactExpertText: 'Contact a diamond consultant',
                    contactExpertLink: '/',
                    contactExpertTarget: '',
                    showingMoreHeader: 'Showing more diamonds',
                    showingMoreCardText: 'showing more like this',
                    selectedCardText: 'Your selected diamond',
                    noResultsText: 'There are no diamonds with your last filter criteria. Please remove your last filter or restart.',
                    undoFilterText: 'Undo last filter',
                    resetFilterText: 'Reset Filters',
                    modalCloseIcon: './icons/close.svg',
                    modalCloseIconAltText: 'modal close',
                    editDiamondIcon: './icons/edit.svg',
                    editDiamondAltText: 'Edit your selection',
                    moreWaysLabel: 'More Ways',
                    selectedModifierLabel: 'selected size',
                    diamondIcon: 'https://media.tiffany.com/is/content/tiffanydmdt3/diamond_newest-2?wid=24&hei=18',
                    noResultsTile: {
                        sources: [
                            {
                                maxMedia: 900,
                                src: './images/360x360_img1.png'
                            },
                            {
                                maxMedia: 767,
                                src: './images/360x360_img1.png'
                            }
                        ],
                        defaultSrc: './images/360x360_img1.png',
                        isLazyLoad: true,
                        altText: 'Alt text',
                        title: 'Customize your ring',
                        description: 'A unique love deserves a unique ring. Our new program allows you to choose a diamond, setting and personal inscription that speak to you and beautifully represent your love.',
                        ctaText: 'Make an Appointment',
                        ctaTarget: '_new',
                        ctaLink: '/',
                        resetText: 'Please reset filter to see more rings.',
                        callUsText: 'Call us at (212) 456-5656',
                        callUsLink: 'tel:81',
                        ctaLabel: 'make an appointment',
                        callUsLabel: 'phone'
                    },
                    beautifulChoice: {
                        stylePrefix: 'Style #',
                        heading: 'Beautiful choice! Lorem ipsum finish up your order below.',
                        carat: 'Carat',
                        color: 'Color',
                        clarity: 'Clarity',
                        cut: 'Cut',
                        descriptionText: 'Currently, this product is unavailable. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        excellentcut: 'Excellent',
                        originCountry: 'Country of origin',
                        certification: 'Diamond certified by Tiffany',
                        certifiedTooltipIcon: './images/tooltip.svg',
                        certifiedTooltipIconAlt: 'tooltip',
                        originCountryTooltipIcon: './images/tooltip.svg',
                        originCountryTooltipIconAlt: 'tooltip',
                        certifiedTooltiptext: 'Some Text',
                        originCountryTooltipText: 'Some Text',
                        certificationDiamondIcon: './images/diamond.png',
                        certificationDiamondIconAltText: 'Diamond Icon',
                        dropHintIcon: './icons/dropahint.svg',
                        dropHintIconAlt: 'Drop a Hint',
                        imagesShouldLoadLazily: true,
                        toolTips: {
                            beautifulchoiceRTE: {
                                informationTextRTE: '<p>Beautiful choice.!!! The availability of the item is subject to change. The cut may not be available for all the variations of the diamond<a href=\'#\' alt=\'test\'>beautiful click here</a></p>'
                            },
                            countryOfOriginRTE: {
                                informationTextRTE: '<p>Beautiful choice.!!! The availability of the item is subject to change. The cut may not be available for all the variations of the diamond<a href=\'#\' alt=\'test\'>beautiful click here</a></p>'
                            }
                        },
                        modifiers: {
                            heading: 'Ring Size',
                            notSureText: 'I’m not sure.',
                            recommendationText: 'We recommend a size 6 and offer complimentary resizing.',
                            sizeGuideRte: '<p>Need help with sizing? Look at our <a href="/" target="_new">Ring Size Guide.</a></p>',
                            variations: [{
                                label: '5',
                                isSelected: false
                            }, {
                                label: '6',
                                isSelected: true
                            }, {
                                label: '7 1/2',
                                isSelected: false
                            }, {
                                label: '8',
                                isSelected: false
                            }, {
                                label: '9',
                                isSelected: false
                            }]
                        },
                        addToBag: 'Add To Bag',
                        addedToBag: 'Added To Bag',
                        addToBagSuccessA: 'Congratulations A',
                        addToBagSuccessB: 'Congratulations B',
                        wishlistSaveText: 'Save',
                        wishlistSavedText: 'Saved',
                        paymentPlansPreText: 'Pre text',
                        paymentPlansCtaText: 'Payment Plans',
                        paymentPlansPostText: 'Post text',
                        helpText: 'Have any questions? Our diamond experts are here to help.',
                        contactOptions: [{
                            icon: './icons/chat.svg',
                            alt: 'chat',
                            ctaText: 'Chat with a Diamond Expert',
                            ctaTarget: '_new',
                            ctaUrl: '/',
                            ctaLabel: 'chat:diamond-expert',
                            chatWidgetID: 'engagement-overlay-chat',
                            showChat: false,
                            isChat: true
                        }, {
                            icon: './icons/call.svg',
                            alt: 'call',
                            ctaText: 'Call us at (212) 456-5656',
                            ctaTarget: '_new',
                            ctaUrl: '+81',
                            ctaLabel: 'phone'
                        }, {
                            icon: './icons/email.svg',
                            alt: 'email',
                            ctaText: 'Email Us',
                            isEmail: true,
                            ctaLabel: 'email'
                        }, {
                            icon: './icons/diamondexpert.svg',
                            alt: 'consult',
                            ctaText: 'Consult with a Diamond Expert',
                            ctaTarget: '_new',
                            ctaUrl: '/',
                            ctaLabel: ''
                        }],
                        moreLikeThisLoadingText: 'Finding Similar Rings just for you...',
                        moreLikeThisLoadingIcon: './images/ring.svg',
                        moreLikeThisLoadingIconAlt: 'beautiful choice'

                    },
                    ringSizeSuccess: 'Added to your Bag',
                    ringSizeSuccessIcon: './images/checkmark.svg',
                    ringSizeSuccessIconAlt: 'alt'
                },
                eyebrowCtaLink: '/SearchPageURL{}?q=engagement',
                eyebrowCtaTarget: '_blank',
                diamondExpertLink: '/diamondExpertLink',
                diamondExpertTarget: '_blank',
                productApiConfig: {
                    url: '/api/engagement/product',
                    method: 'POST',
                    payload: {
                        SiteId: '1',
                        AssortmentId: '101',
                        PriceMarketId: 1,
                        Sku: 'GRP10572',
                        SelectedSku: '31421055'
                    }
                },
                diamondApiConfig: {
                    url: '/api/engagement/diamondFilters',
                    method: 'POST',
                    payload: {
                        SiteId: '1',
                        sortTypeID: 1,
                        priceMarketID: 1,
                        group: 'GRP105201',
                        assortmentId: '101'
                    }
                },
                listOfColors: ['D', 'E', 'F', 'G', 'H', 'I'],
                listOfClarities: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2'],
                defaultMinCaratPosition: '1.25',
                defaultMaxCaratPosition: '3.00',
                caratSliderStep: 0.01,
                priceSliderStep: 100,
                caratErrorMsg: 'Please select a different carat range',
                priceErrorMsg: 'Please select a different price range',
                toolTips: {
                    diamondCutText: {
                        informationTextRTE: '<p>The availability of the item is subject to change. The cut may not be available for all the variations of the diamond</p>'
                    },
                    diamondCaratText: {
                        informationTextRTE: '<p>The availability of the item is subject to change. The <b>carat</b> may not be available for all the variations of the diamond</p>'
                    },
                    diamondColorText: {
                        informationTextRTE: '<p>The availability of the item is subject to change. The <b>Color</b> may not be available for all the variations of the diamond</p>'
                    },
                    diamondClarityText: {
                        informationTextRTE: '<p>The availability of the item is subject to change. The <b>Clarity</b> may not be available for all the variations of the diamond</p>'
                    },
                    diamondPriceText: {
                        informationTextRTE: '<p>The availability of the item is subject to change. The <b>Price</b> may vary for all the variations of the diamond</p>'
                    },
                    diamondPricedFromRTE: {
                        informationTextRTE: '<p>The availability of the item is subject to change. The <b>Price</b> may vary for all the variations of the diamond<a href=\'#\' alt=\'test\'>Priced from  click here</a></p>'
                    }
                },
                diamondSelectionConfig: {
                    url: 'diamondSelectionUrl',
                    method: 'POST',
                    payload: {
                        assortmentID: 101,
                        group: 'GRP10572',
                        sortTypeID: 1,
                        navigationFilters: [
                            101
                        ],
                        minCaratWeight: '0.25',
                        maxCaratWeight: '3.00',
                        upperPriceLimit: '2000',
                        lowerPriceLimit: '1000',
                        siteid: 1,
                        priceMarketID: '01',
                        isAvailableOnline: ''
                    }
                },
                groupCompleteConfig: {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev01/productsprocessapi/api/process/v1/products/engagementgroup/complete',
                    method: 'POST',
                    payload: {
                        siteid: '1',
                        assortmentID: '101',
                        priceMarketID: '1',
                        Sku: 'GRP10572',
                        selectedSku: ''
                    }
                }
            },
            engagementCaratModifier: {
                label: 'Carat',
                type: 'CARAT',
                variations: [
                    {
                        label: '0.25',
                        isSelected: false,
                        URL: 'www.google.com'
                    }, {
                        label: '0.5',
                        isSelected: false,
                        URL: 'www.google.com'
                    }, {
                        label: '1',
                        isSelected: true,
                        URL: 'www.google.com'
                    }, {
                        label: '1.5',
                        isSelected: false,
                        URL: 'www.google.com'
                    }, {
                        label: '2',
                        isSelected: false,
                        URL: 'www.google.com'
                    }, {
                        label: '2.5',
                        isSelected: false,
                        URL: 'www.google.com'
                    }
                ]
            },
            /**
             * All the configs related to engraving goes here
             */
            engraving: {
                hasCustomEngraving: true,
                permisableCharacters: {
                    monograming: 'a-zA-Z',
                    isTrueType: 'a-zA-Z0-9!.@#$%&*(")_+|:<,>?=\'-',
                    notTrueType: 'a-zA-Z0-9'
                },
                /**
                 * Engraving Map (Under window.tiffany.authoredContent):
                 *
                 * Holds all the engravings that are available for a product except custom engraving
                 * As custom engraving is completely authourable, its configuration is added as part of window.tiffany.pdpConfig.engravingConfig
                 *
                 * Every Engraving has its own OrderBy property. This defines order of the display.
                 * The Authored order will be given firwst priority over the order recieved from API responses.
                 *
                 * Catagories:
                 * List of categories under every engraving type.
                 */
                engravingMap: [
                    {
                        label: 'Intials', // Lable to be displayed for Initials
                        component: 'INITIALS_COMPONENT', // Reference for React component should not be changed
                        orderBy: 1, // Order in which engravings have to be displayed,
                        categories: [
                            {
                                serviceTypeId: 1, // Key to link this object with the API response
                                orderBy: 1, // Order in which categories have to be displayed
                                label: 'Standard Engraving', // Label or heading for the category
                                description: 'Standard Engraving description. Standard Engraving description. Standard Engraving description.', // Description for the category
                                isRte: false // True if description is RTE
                            },
                            {
                                serviceTypeId: 15,
                                orderBy: 7,
                                label: 'Hand Engraving',
                                description: 'Hand Engraving description. Hand Engraving description. Hand Engraving description.',
                                isRte: false
                            },
                            {
                                serviceTypeId: 150,
                                orderBy: 6,
                                label: 'Monogram',
                                description: 'Monogram description. Monogram PRICE_GOES_HERE description. Monogram description.',
                                isRte: true,
                                previewConfig: {
                                    sources: [],
                                    altText: 'monogram image alt text',
                                    defaultSrc: '//media.tiffany.com/is/image/tiffanyRenderDev?src=ir{tiffanyRenderDev/default_vnt?obj=engrave&decal&src=is{TiffanyDev/240_150_text?scl=1}}&$text1l=Q&$text1c=w&$text1r=e&wid=500&$EngravePreviewOptionsSquare$',
                                    hiddenOnError: true
                                }
                            }
                        ]
                    },
                    {
                        label: 'Symbols',
                        component: 'SYMBOLS_COMPONENT',
                        orderBy: 3,
                        categories: [
                            {
                                serviceTypeId: 11,
                                orderBy: 1,
                                label: 'symbols'
                            }
                        ]
                    }
                ],
                /**
                 * Product Engravings :
                 * Ajax call to fetch details related to a SKU
                 */
                productEngravings: {
                    url: 'productEngravingURL',
                    method: 'GET'
                },
                /**
                 * engravingDefaults:
                 * Defaults to be populated on components load
                 */
                engravingDefaults: {
                    initials: {
                        itemServiceTypeId: 1,
                        styleCode: 290
                    },
                    symbols: {
                        itemServiceTypeId: 11,
                        styleCode: 751,
                        groupId: 4
                    },
                    monogramServiceID: 150,
                    monogramLinkedTo: 15
                },
                /**
                 * Site Engravings :
                 * Ajax call to fetch all site engravings
                 */
                siteEngravings: {
                    url: 'siteEngravingsUrl',
                    method: 'post',
                    payload: {
                        assortmentId: 101,
                        siteId: 1
                    }
                },
                fontsConfig: {
                    styles: [{
                        code: 201,
                        delimiter: '%C2%B7'
                    }, {
                        code: 202,
                        delimiter: '.'
                    }, {
                        code: 203,
                        delimiter: '.'
                    }, {
                        code: 204,
                        delimiter: '.'
                    }],
                    exceptionFor: 150
                },
                interactionName: 'some-engraving'
            },
            byoConfig: {
                isCurationAllowed: true,
                saveDesignParamname: 'designName',
                baseBYOUrl: '/BYOLandingPage/shop/BYOConfigurator/',
                designId: '',
                curatedByoUrl: '/BYOLandingPage/shop/',
                designIdIdentifier: 'byo',
                productTypeDescription: 'Bracelet',
                isLazyLoad: true,
                urlUniqueId: '',
                charmsCategory: {
                    categoryId: 1234,
                    categoryName: 'Bracelets..'
                },
                ctxMenu: {
                    move: 'Move',
                    remove: 'Remove',
                    edit: 'Edit',
                    personalize: 'Personalize'
                },
                materialDimensionId: 5,
                isEcommEnabled: true,
                materialFilterColor: {
                    path: './images/collections',
                    extension: 'png'
                },
                canvas: {
                    anchorPointUrl: './images/byo-anchor-point.png',
                    anchorPointActiveUrl: './images/byo-anchor-point.png',
                    anchorPointImgAlt: 'anchor point',
                    anchorPointActiveImgAlt: 'anchor active point',
                    anchorAlt: '{{}} of {{}}',
                    tapCharmMessage: 'Tap charm to move and edit',
                    tapCharmErrorMessage: 'Tap charm to move and edit',
                    tapCharmTimeOut: 5000,
                    saveCanvasMessageTimeOut: 500000
                },
                fixtureCompleteRequest: {
                    url: 'itemCompleteUrl',
                    method: 'POST',
                    payload: {
                        SiteId: '1',
                        AssortmentId: '101',
                        PriceMarketId: 1,
                        Sku: ''
                    }
                },
                silhoutte: {
                    isSilhouette: true,
                    isBracelet: false,
                    maxCharmsAllowed: 6,
                    image: 'https://s7d2.scene7.com/is/image/TiffanyDev/mini-silhoutte?wid=700&hei=700&fmt=png-alpha',
                    imageURL: 'https://s7d2.scene7.com/is/image/TiffanyDev/silhouette?wid=1118&hei=542&fmt=png-alpha',
                    altText: 'silhoutte',
                    name: 'silhoutte',
                    title: 'silhoutte',
                    fixturePositions: [
                        [
                            166,
                            212
                        ],
                        [
                            253,
                            334
                        ],
                        [
                            406,
                            392
                        ],
                        [
                            596,
                            406
                        ],
                        [
                            779,
                            374
                        ],
                        [
                            913,
                            297
                        ]
                    ],
                    price: 0
                },
                noCharmsMessage: {
                    timeout: 50000,
                    instructionImage: './images/arrow_instruct.png',
                    instructionImageAlt: 'Instruction Image',
                    silhoutteInformationalMessage: 'Drag the charms to your canvas. You can place up to {{}} charms on a chain and play with different combinations',
                    silhoutteMaxCharmMessage: 'Oops! You can only add {{}}',
                    bracelet: { braceletMaxcharmLimitMessage: '<div class="tiffany-rte"><p>Oops! You can only add <i>{{}}</i></p></div>' },
                    necklace: { necklaceMaxcharmLimitMessage: '<div class="tiffany-rte"><p>Oops! You can only add<i>{{}}</i></p></div' },
                    braceletInformational: {
                        braceletInformationalMessage: '<div class="tiffany-rte"><p>Drag the charms to your canvas. You can place up to <i>{{}}</i> charms on a necklace and play with different combinations</p></div>'
                    },
                    necklaceInformational: {
                        necklaceInformationalMessage: '<div class="tiffany-rte"><p>Drag the charms to your canvas. You can place up to<i>{{}}</i> charms on a necklace and play with different combinations</p></div>'
                    }
                },
                fixtureImagePreset: '2X',
                fixtureImageQueryParam: '&fmt=png-alpha',
                fixtureMediaTypeId: 1122,
                charmImagePreset: '2X',
                byoImagePreset: 'ByoPreview',
                charmImageQueryParam: '&fmt=png-alpha',
                charmMediaTypeId: ['1123'],
                colpoMediaTypeId: ['1124'],
                colpoImageClaspQueryParam: '&mask=clasp_mask_420',
                charmImageClaspQueryParam: '&mask=clasp_mask_420_right',
                selectMaterialRequest: [
                    {
                        label: 'Bracelets',
                        request: {
                            url: 'selectMaterialUrl',
                            method: 'POST',
                            payload: {
                                assortmentID: 101,
                                sortTypeID: 5,
                                categoryid: 287458,
                                navigationFilters: [
                                    101,
                                    101287458
                                ],
                                recordsOffsetNumber: 0,
                                recordsCountPerPage: 10,
                                priceMarketID: '1',
                                searchModeID: 2,
                                ByoModuleType: 1,
                                ByoItemType: 1,
                                ByoMountTypeList: [],
                                siteid: 1,
                                userId: ''
                            }
                        }
                    }, {
                        label: 'Necklaces',
                        request: {
                            url: 'selectMaterialUrl',
                            method: 'POST',
                            payload: {
                                assortmentID: 101,
                                sortTypeID: 5,
                                categoryid: 287465,
                                navigationFilters: [
                                    101,
                                    101287465
                                ],
                                recordsOffsetNumber: 0,
                                recordsCountPerPage: 10,
                                priceMarketID: '01',
                                searchModeID: 2,
                                ByoModuleType: 1,
                                ByoItemType: 1,
                                ByoMountTypeList: [],
                                siteid: 1,
                                userId: ''
                            }
                        }
                    }
                ],
                gridRequest: {
                    url: 'byoUrl',
                    method: 'POST',
                    payload: {
                        assortmentID: 101,
                        sortTypeID: 11,
                        navigationFilters: [
                            101,
                            101570368
                        ],
                        recordsOffsetNumber: 0,
                        recordsCountPerPage: 10,
                        priceMarketID: '01',
                        searchModeID: 2,
                        ByoModuleType: 1,
                        ByoItemType: 2,
                        ByoMountTypeList: [],
                        siteid: 1
                    }
                },
                groupRequest: {
                    url: 'byoGroupUrl',
                    method: 'POST',
                    payload: {
                        SiteId: '1',
                        AssortmentId: '101',
                        PriceMarketId: 1,
                        Sku: ''
                    }
                },
                claspRequest: {
                    url: 'claspMock',
                    method: 'GET'
                },
                claspMountTypeId: 4,
                braceletCategoryId: '287458',
                claspEnabledCategoryId: ['287458'],
                imagesConfig: {
                    imageURL: 'https://media.tiffany.com/is/image/Tiffany/EcomBrowseS/<imageURL>.jpg?defaultImage=NoImageAvailable&&&fmt=png-alpha',
                    claspURL: 'https://media.tiffany.com/is/image/Tiffany/2X/<imageURL>.jpg?defaultImage=NoImageAvailable&&&fmt=png-alpha&mask=clasp_mask_420_right',
                    transparentURL: 'https://media.tiffany.com/is/image/Tiffany/2X/<imageURL>.jpg?defaultImage=NoImageAvailable&&&fmt=png-alpha'
                },
                saveByoRequest: {
                    url: 'byoSaveDesignUrl',
                    method: 'POST',
                    payload: {
                        Items: {
                            Items: []
                        },
                        siteId: 1,
                        designID: '',
                        webCustomerID: ''
                    }
                },
                saveByoUniqueUrl: {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev01/buildyourownprocessapi/api/process/v1/buildyourown/templatedesign/save',
                    method: 'POST',
                    payload: {
                        designID: '',
                        designName: '',
                        siteId: 1
                    }
                },
                getByoRequest: {
                    url: 'byoGetUrl',
                    method: 'POST',
                    payload: {
                        urlUniqueID: '',
                        designID: '',
                        siteId: 1,
                        webCustomerID: '',
                        AssortmentId: 101,
                        PriceMarketId: 1
                    }
                },
                byoAddToBagRequest: {
                    url: 'byoskuEcomAddEndPoint',
                    method: 'POST',
                    payload: {
                        webCustomerID: '',
                        designID: '',
                        siteId: 1,
                        assortmentID: 101,
                        quantity: 1
                    }
                },
                byoCanvasAction: {
                    startOver: {
                        icon: './images/startover.png',
                        alt: 'Start Over'
                    },
                    wishList: {
                        icon: './icons/wishlist.svg',
                        alt: 'Add to Wishlist'
                    },
                    dropaHint: {
                        icon: './icons/dropahint.svg',
                        alt: 'Drop a Hint',
                        designData: {
                            url: 'designForDropAHint',
                            method: 'GET'
                        },
                        designDataPattern: '/api/ByoDropAHin'
                    }
                },
                chainItemTypeId: 1,
                charmItemTypeId: 2,
                byoImageData: {
                    url: 'https://media.tiffany.com/is/image/TiffanyDev/<Preset>/<ImagePrefix>.jpg?op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal',
                    charm: {
                        url: 'https://media.tiffany.com/is/image/TiffanyDev/<Preset>/<ImagePrefix>-<ImageName>.jpg?op_usm=<MediaPreset>&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&'
                    }
                },
                byoSaveDropHintRequest: {
                    url: 'savehintByo',
                    method: 'POST',
                    payload: {
                        siteId: 1,
                        webCustomerId: '',
                        designId: ''
                    }
                }
            },
            storesConfig: {
                isStoresPage: true,
                pinImage: 'https://media.tiffany.com/is/content/tiffanydmqa2/Map-pin-Blue?wid=100&hei=100',
                defaultMapRadius: 50,
                defaultMapCenter: { lat: 40.7128, lng: -74.0060 },
                listApiConfig: {
                    url: 'storesListUrl',
                    method: 'get'
                },
                googleMapsDomain: 'https://maps.google.com/',
                googleMapsTarget: '_blank'
            },
            /* eslint-disable */
            globalFlagShipConfig: {
                "heading":"Boutiques dans le monde",
                "description":"Découvrez des bijoux emblématiques, des bagues de fiançailles en diamant, d’élégants accessoires et des cadeaux extraordinaires pour toute occasion dans nos boutiques flagship du monde entier.",
                "chooseRegionText":"Choisir une région",
                "regionsConfig":[
                   {
                      "region":"Australie",
                      "storesData":[
                         {
                            "id":"652"
                         }
                      ]
                   },
                   {
                      "region":"Canada",
                      "storesData":[
                         {
                            "id":"729"
                         },
                         {
                            "id":"812"
                         }
                      ]
                   },
                   {
                      "region":"Chine",
                      "storesData":[
                         {
                            "id":"1044"
                         },
                         {
                            "id":"1362"
                         },
                         {
                            "id":"1039"
                         }
                      ]
                   },
                   {
                      "region":"France",
                      "storesData":[
                         {
                            "id":"1314"
                         }
                      ]
                   },
                   {
                      "region":"Hong Kong",
                      "storesData":[
                         {
                            "id":"1005"
                         }
                      ]
                   },
                   {
                      "region":"Japon",
                      "storesData":[
                         {
                            "id":"726"
                         }
                      ]
                   },
                   {
                      "region":"Singapour",
                      "storesData":[
                         {
                            "id":"683"
                         }
                      ]
                   },
                   {
                      "region":"Émirats arabes unis",
                      "storesData":[
                         {
                            "id":"1028"
                         }
                      ]
                   },
                   {
                      "region":"Royaume-Uni",
                      "storesData":[
                         {
                            "id":"676"
                         }
                      ]
                   },
                   {
                      "region":"États-Unis",
                      "storesData":[
                         {
                            "id":"644"
                         },
                         {
                            "id":"682"
                         },
                         {
                            "id":"702"
                         }
                      ]
                   }
                ]
            },
            wishlistFlyoutConfig: {
                isWishlistEmpty: true,
                isLoggedOut: true,
                cookieName: 'mysid2',
                customDesignsTitle: 'Custom Design Title',
                customDesignsCTALink: 'https://dev1-aem.edev.tiffany.com:8080/BYOLandingPage/shop/BYOConfigurator/byo',
                listFetchRequest: {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev01/saveditemsprocessapi/api/process/v1/saveditems/item/list', // '/api/saveditems',
                    method: 'POST',
                    payload: {
                        webCustomerID: '78eb591587e74d0f931c5f7df991c3e0',
                        siteId: 1,
                        PriceMarketId: 1,
                        isInline: 'false'
                    }
                },
                customDesignsFetchRequest: {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev01/buildyourownprocessapi/api/process/v1/buildyourown/getcustomdesignlists',
                    method: 'POST',
                    payload: {
                        webCustomerID: '4QGXFKFFPWSH2GKU00A3HEB5SQBJAA7B',
                        siteId: 1,
                        AssortmentId: 101,
                        PriceMarketId: 1
                    }
                },
                addToBagRequest: {
                    skuEcomAddGroupTypeOneEndPoint: {
                        url: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagsprocessapi/api/process/v1/shoppingbags/item/group-type1/add',
                        method: 'POST',
                        payload: {
                            WebCustomerID: '4QGXFKFFPWSH2GKU00A3HEB5SQBJAA7B',
                            siteId: 1,
                            AssortmentId: 101,
                            PriceMarketId: 1
                        }
                    },
                    skuEcomAddGroupTypeTwoEndPoint: {
                        url: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagsprocessapi/api/process/v1/shoppingbags/item/group-type2/add',
                        method: 'POST',
                        payload: {
                            WebCustomerID: '4QGXFKFFPWSH2GKU00A3HEB5SQBJAA7B',
                            siteId: 1,
                            AssortmentId: 101,
                            PriceMarketId: 1
                        }
                    },
                    skuEcomAddRequest: {
                        url: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagsprocessapi/api/process/v1/shoppingbags/item/sku-ecom/add',
                        method: 'POST',
                        payload: {
                            WebCustomerID: '4QGXFKFFPWSH2GKU00A3HEB5SQBJAA7B',
                            siteId: 1,
                            AssortmentId: 101,
                            PriceMarketId: 1
                        }
                    },
                    addDesignToBag: {
                        url: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagsprocessapi/api/process/v1/shoppingbags/buildyourown/add',
                        method: 'POST',
                        payload: {
                            webCustomerID: '4QGXFKFFPWSH2GKU00A3HEB5SQBJAA7B',
                            designID: '',
                            siteId: '1',
                            AssortmentId: '101',
                            PriceMarketId: 1
                        }
                    }
                },
                removeRequest: {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev01/saveditemssystemapi/api/system/v1/saveditems/item/delete',
                    method: 'POST',
                    payload: {
                        WebCustomerID: '6902f523f2164dc9921881e76c97fe66',
                        siteId: 1,
                        listItemID: 0
                    }
                },
                customDesignRemoveRequest: {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev01/buildyourownprocessapi/api/process/v1/buildyourown/delete',
                    method: 'POST',
                    payload: {
                        designID: 'b842ae646f084e67b30f628148942879'
                    }
                }
            },
            shoppingBagFlyoutConfig: {
                isCartEmpty: false,
                isLoggedOut: true,
                cookieName: 'mysid2',
                customDesignsTitle: 'Custom Design Title',
                listFetchRequest: {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagsprocessapi/api/process/v1/shoppingbags/item/list',
                    method: 'POST',
                    payload: {
                        webCustomerID: '231962d5e5d14f98a1afd289467862d1',
                        priceMarketID: 1,
                        siteid: 1,
                        assortmentID: 101
                    }
                },
                removeRequest: {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagssystemapi/api/system/v1/shoppingbags/item/delete',
                    method: 'POST',
                    payload: {
                        webCustomerID: '61f3db1713674baa9e0cbe6807d1207e',
                        siteId: 1,
                        shoppingBagItemID: ''
                    }
                },
                customDesignRemoveRequest: {
                    url: 'https://dev-api.tiffco.net/ibmdev/dev01/shoppingbagsprocessapi/api/process/v1/shoppingbags/buildyourown/delete',
                    method: 'POST',
                    payload: {
                        designID: '',
                        assortmentID: 84271793,
                        webCustomerID: 'fd2d3fe3f0b344ca80e2a781a8cea746',
                        siteId: 1
                    }
                }
            },
            myAccountConfig: {
                url: '/api/myAccount',
                method: 'POST',
                payload: {
                    cookieVal: '',
                    siteId: '1'
                }
            },
            conciergeFlyoutConfig: {
                ctaTextLabel: 'Contact',
                ctaIcon: './icons/concierge.svg',
                showContactCta: true
            },
            shippingFlyoutConfig: {
                ctaTextLabel: 'Call to Action',
                rteAuthored: '<h4>Shipping and Returns</h4><p>Enjoy complementary shipping and returns on all orders.</p><br/><h5>Shipping and Returns</h5><p>Currently we are only able to accept online orders to shipping addresses within the United States, and do not ship internationally. To ensure the secure delivery of your order, Tiffany & Co. does not ship orders to post office boxes. Tiffany & Co. is able to accept post office box addresses for your billing needs.</p><br/><p>For each address within the United States, the following charges apply:</p><br/><h4>Returns Policy</h4><p>Tiffany & Co. offers complimentary shipping for any item that you’d like to return. Simply visit Tiffany.com/Returns to print out a shipping label. Then drop off your package at the nearest UPS location.</p>',
                closeIcon: './icons/close.svg',
                closeIconAlt: 'close icon',
                backIcon: './icons/left.svg',
                backIconAlt: 'back icon'
            },
            paymentsandReturnsFlyoutConfig: {
                closeIcon: './icons/close.svg',
                closeIconAlt: 'close icon',
                backIcon: './icons/left.svg',
                backIconAlt: 'back icon',
                ctaTextLabel: 'Payments and Returns',
                paymentPlansLabel: 'payment plans',
                rteAuthored: '<h4>Payments and Returns</h4><p>Enjoy complementary shipping and returns on all orders.</p><br/><h5>Shipping and Returns</h5><p>Currently we are only able to accept online orders to shipping addresses within the United States, and do not ship internationally. To ensure the secure delivery of your order, Tiffany & Co. does not ship orders to post office boxes. Tiffany & Co. is able to accept post office box addresses for your billing needs.</p><br/><p>For each address within the United States, the following charges apply:</p><br/><h4>Returns Policy</h4><p>Tiffany & Co. offers complimentary shipping for any item that you’d like to return. Simply visit Tiffany.com/Returns to print out a shipping label. Then drop off your package at the nearest UPS location.</p>'
            },
            upcomingEventsConfig: {
                content: {
                    heading: 'Upcoming events'
                },
                defaultFilterRadius: 50,
                upcomingEventsApiConfig: {
                    url: 'upcomingEventsConfigUrl',
                    method: 'get',
                    path: 'testurl'
                },
                preferredStoreConfig: {
                    url: 'preferredStoreUrl',
                    method: 'post'
                }
            },
            preferredStoreConfig: {
                cookieName: 'preferredStore',
                getStoreConfig: {
                    url: 'getPreferredStoreUrl',
                    method: 'post',
                    payload: {
                        siteId: 1
                    }
                },
                setStoreConfig: {
                    url: 'preferredStoreAddEndPoint',
                    method: 'post',
                    payload: {
                        siteId: 1
                    }
                },
                creatWebCustomerConfig: {
                    url: 'webCustomerUrl',
                    method: 'post',
                    payload: {
                        siteId: 1
                    }
                }
            },
            storeInformationConfig: {
                nearbyDistance: 50
            },
            heroBannerHeading: 'HERO BANNER HEADING',
            engagementConfig: {
                browseGridHeading: 'Engagement Rings',
                showBrowseHeading: true,
                h1Toggle: 'FILTER_TEXT', // 'HERO_BANNER','FILTER_TEXT',
                request: {
                    url: 'engagementUrl',
                    method: 'POST',
                    defaultDimensionId: 1013878956,
                    payload: {
                        assortmentID: 101,
                        sortTypeID: 5,
                        categoryid: 3878956,
                        navigationFilters: [1013878956, 101],
                        recordsOffsetNumber: 0,
                        recordsCountPerPage: 10,
                        priceMarketID: '1',
                        searchModeID: 2,
                        siteid: 1
                    }
                }
            },
            pinImage: 'https://media.tiffany.com/is/content/tiffanydmqa2/Map-pin-Blue?wid=100&hei=100',
            beautyTileConfig: {
                shopBy: 'Shop by',
                classificationSelected: 'Selected',
                content: [
                    {
                        heading: 'moment',
                        subClassification: [
                            {
                                subHeading: 'Engagement',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './images/beauty-tile-2.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './images/beauty-tile-2.png'
                                        }
                                    ],
                                    defaultSrc: './images/beauty-tile-2.png',
                                    isLazyLoad: true,
                                    altText: 'Alt text',
                                    title: 'Engagement',
                                    description: 'The superlative beauty of our engagement rings is the result of the highest quality standards and an obsession with creating the most brilliant diamonds at every step.',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/ring.html',
                                    ctaText: 'BROWSE ENGAGEMENT RINGS',
                                    ctaTarget: '_blank',
                                    colorStyle: 'white-label',
                                    beautyTilePos: '6'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '101287466'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '8',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/wedding-bands---wedding-rings.html',
                                showMoreTarget: '_blank',
                                showMoreProductsDesktopFlag: true,
                                showMoreProductsMobileFlag: true,
                                showFewerLinkLabel: 'Show Fewer',
                                paddingBottom: 'padding-bottom-56'
                            },
                            {
                                subHeading: 'Wedding',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './images/beauty-tile.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './images/beauty-tile.png'
                                        }
                                    ],
                                    defaultSrc: './images/beauty-tile.png',
                                    isLazyLoad: true,
                                    altText: 'Alt text1',
                                    title: 'Wedding and Bands',
                                    description: 'Wedding bands and gifts',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/wedding-bands---wedding-rings.html',
                                    ctaText: 'SHOP NOW',
                                    ctaTarget: '_blank',
                                    colorStyle: '',
                                    beautyTilePos: '7'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '101287466'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '5',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/wedding-bands---wedding-rings.html',
                                showMoreTarget: '_blank',
                                showMoreProductsDesktopFlag: true,
                                showMoreProductsMobileFlag: true,
                                showFewerLinkLabel: 'Show Fewer',
                                paddingBottom: 'padding-bottom-16'
                            },
                            {
                                subHeading: 'Anniversary',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/anniversary.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/anniversary.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/anniversary.png',
                                    isLazyLoad: true,
                                    altText: 'Alt text2',
                                    title: 'Anniversary ',
                                    description: 'Best anniversary gifts',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/wedding-bands---wedding-rings.html',
                                    ctaText: 'Shop More',
                                    ctaTarget: '_blank',
                                    colorStyle: '',
                                    beautyTilePos: '1'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '101287458'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '5',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/paloma-picasso.html',
                                showMoreTarget: '_blank',
                                showMoreProductsDesktopFlag: true,
                                showMoreProductsMobileFlag: true,
                                showFewerLinkLabel: 'Show Less',
                                paddingBottom: 'no-padding-bottom'
                            },
                            {
                                subHeading: 'Birthday',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/2x2 image_3.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/2x2 image_3.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/2x2 image_3.png',
                                    isLazyLoad: true,
                                    altText: 'Alt text3',
                                    title: 'Birthday',
                                    description: 'Birthday Gifts',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/diamond-watches-.html',
                                    ctaText: 'Shop Now',
                                    ctaTarget: '_blank',
                                    colorStyle: 'white-label',
                                    beautyTilePos: '4'
                                },
                                displayType: 'SKU',
                                skuConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    priceMarketID: '1',
                                    Sku: [
                                        {
                                            skuId: 'GRP10581',
                                            alternateSkuId: '37003409'
                                        },
                                        {
                                            skuId: '37003409',
                                            alternateSkuId: '37003409'
                                        },
                                        {
                                            skuId: '37003417',
                                            alternateSkuId: '37003417'
                                        },
                                        {
                                            skuId: '27010784',
                                            alternateSkuId: '27010784'
                                        },
                                        {
                                            skuId: '10000084',
                                            alternateSkuId: '10000084'
                                        },
                                        {
                                            skuId: '37003409',
                                            alternateSkuId: '37003409'
                                        },
                                        {
                                            skuId: '60879974',
                                            alternateSkuId: 'GRP06386'
                                        },
                                        {
                                            skuId: '27563376',
                                            alternateSkuId: '27563376'
                                        },
                                        {
                                            skuId: '18408988',
                                            alternateSkuId: '18408988'
                                        },
                                        {
                                            skuId: '10072425',
                                            alternateSkuId: '10072425'
                                        },
                                        {
                                            skuId: '10785472',
                                            alternateSkuId: '10785472'
                                        },
                                        {
                                            skuId: '12228759',
                                            alternateSkuId: '10339405'
                                        },
                                        {
                                            skuId: 'GRP09947',
                                            alternateSkuId: 'GRP06386'
                                        },
                                        {
                                            skuId: 'GRP06386',
                                            alternateSkuId: '60879974'
                                        }
                                    ]
                                },
                                productsToShow: '5',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/necklace-and-pendants.html',
                                showMoreTarget: '_blank',
                                showMoreProductsDesktopFlag: true,
                                showMoreProductsMobileFlag: true,
                                showFewerLinkLabel: 'Show Less',
                                paddingBottom: 'padding-bottom-16'
                            },
                            {
                                subHeading: 'New Parents',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/img3.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/img4.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/img3.png',
                                    isLazyLoad: true,
                                    altText: 'Alt text4',
                                    title: 'Gifts for New Parents',
                                    description: '',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/Charms.html',
                                    ctaText: 'Explore',
                                    ctaTarget: '_blank',
                                    colorStyle: '',
                                    beautyTilePos: '5'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '101607567',
                                        '101287458'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '11',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: '',
                                showMoreTarget: '',
                                showMoreProductsDesktopFlag: true,
                                showMoreProductsMobileFlag: true,
                                showFewerLinkLabel: 'Show Fewer',
                                paddingBottom: 'padding-bottom-56'
                            },
                            {
                                subHeading: 'Just Because',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/just because.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/just because.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/just because.png',
                                    isLazyLoad: true,
                                    altText: 'alt1',
                                    title: 'Just Because',
                                    description: 'The best gifts don’t need a reason.',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/new-jewelry.html',
                                    ctaText: 'Browse Now',
                                    ctaTarget: '_blank',
                                    colorStyle: '',
                                    beautyTilePos: '6'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '1013755542'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '14',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: '',
                                showMoreTarget: '',
                                showMoreProductsDesktopFlag: true,
                                showMoreProductsMobileFlag: true,
                                showFewerLinkLabel: 'Show Fewer',
                                paddingBottom: 'padding-bottom-16'
                            },
                            {
                                subHeading: 'Business Gifts',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/Business_1.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/business_2.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/Business_1.png',
                                    isLazyLoad: true,
                                    altText: 'alt1',
                                    title: 'SHINING ACCOMPLISHMENTS',
                                    description: 'For important clients, employees and colleagues,  nothing is more exciting to receive than a gift in the  famous Tiffany Blue Box®.',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/gifts/business-gifts.html',
                                    ctaText: 'Browse Business Gifts',
                                    ctaTarget: '_blank',
                                    colorStyle: '',
                                    beautyTilePos: '6'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '101573050'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '8',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: '',
                                showMoreTarget: '',
                                showMoreProductsDesktopFlag: false,
                                showMoreProductsMobileFlag: false,
                                showFewerLinkLabel: 'Show Fewer',
                                paddingBottom: 'no-padding-bottom'
                            }
                        ]
                    },
                    {
                        heading: 'recipient',
                        subClassification: [
                            {
                                subHeading: 'For Her',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/just because.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/just because.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/just because.png',
                                    isLazyLoad: true,
                                    altText: 'alt1',
                                    title: 'For Her ',
                                    description: 'The best gifts don’t need a reason.',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/gold-ring.html',
                                    ctaText: '',
                                    ctaTarget: '',
                                    colorStyle: '',
                                    beautyTilePos: '1'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '101287458'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '5',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/bracelets.html',
                                showMoreTarget: '_blank',
                                showMoreProductsDesktopFlag: true,
                                showMoreProductsMobileFlag: true,
                                showFewerLinkLabel: 'Show Fewer',
                                paddingBottom: 'padding-bottom-16'
                            },
                            {
                                subHeading: 'For Him',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/gifts_for_him.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/gifts_for_him.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/gifts_for_him.png',
                                    isLazyLoad: true,
                                    altText: 'alt2',
                                    title: 'For Him',
                                    description: 'The best gifts don’t need a reason.',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/fragrance.html',
                                    ctaText: '',
                                    ctaTarget: '',
                                    colorStyle: '',
                                    beautyTilePos: '2'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '101661567'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '5',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/-men-s-jewelry.html',
                                showMoreTarget: '_blank',
                                showMoreProductsDesktopFlag: true,
                                showMoreProductsMobileFlag: true,
                                showFewerLinkLabel: 'Show Less',
                                paddingBottom: 'padding-bottom-56'
                            },
                            {
                                subHeading: 'For Baby',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/gifts_for_baby.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/gifts_for_baby.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/gifts_for_baby.png',
                                    isLazyLoad: true,
                                    altText: 'Alt text',
                                    title: 'For Baby',
                                    description: 'The best gifts don’t need a reason.',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/gifts/the-tiffany-gift-card.html',
                                    ctaText: '',
                                    ctaTarget: '',
                                    colorStyle: '',
                                    beautyTilePos: '3'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '101288202'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '8',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: '',
                                showMoreTarget: '',
                                showMoreProductsDesktopFlag: false,
                                showMoreProductsMobileFlag: false,
                                showFewerLinkLabel: 'Show Fewer',
                                paddingBottom: 'padding-bottom-56'
                            },
                            {
                                subHeading: 'For the Home',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/Gifts_for_home.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/Gifts_for_home.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/Gifts_for_home.png',
                                    isLazyLoad: true,
                                    altText: 'alt3',
                                    title: 'For Home',
                                    description: 'The best gifts don’t need a reason.',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/accessories/shop/shop-all-home-accessories.html',
                                    ctaText: 'Shop Now',
                                    ctaTarget: '_blank',
                                    colorStyle: 'white-label',
                                    beautyTilePos: '4'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '101424402'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '11',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: './content/tiffany-n-co/www/us/en_us/accessories/shop/new-designs-home.html',
                                showMoreTarget: '_blank',
                                showMoreProductsDesktopFlag: true,
                                showMoreProductsMobileFlag: true,
                                showFewerLinkLabel: 'Show Less',
                                paddingBottom: 'padding-bottom-16'
                            },
                            {
                                subHeading: 'For the Bride',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/Gifts_for_bride.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/Gifts_for_bride.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/Gifts_for_bride.png',
                                    isLazyLoad: true,
                                    altText: 'alt4',
                                    title: 'For Bride',
                                    description: 'The best gifts don’t need a reason.',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/jewelry/shop/necklace-and-pendants.html',
                                    ctaText: 'Browse Now',
                                    ctaTarget: '_blank',
                                    colorStyle: '',
                                    beautyTilePos: '5'
                                },
                                displayType: 'SKU',
                                skuConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    priceMarketID: '1',
                                    Sku: [
                                        {
                                            skuId: '60879974',
                                            alternateSkuId: '60879974'
                                        },
                                        {
                                            skuId: '60879974',
                                            alternateSkuId: '10072328'
                                        },
                                        {
                                            skuId: '27563376',
                                            alternateSkuId: '27563376'
                                        },
                                        {
                                            skuId: '18408988',
                                            alternateSkuId: '18408988'
                                        },
                                        {
                                            skuId: '10072425',
                                            alternateSkuId: '10072425'
                                        },
                                        {
                                            skuId: '10785472',
                                            alternateSkuId: '12228759'
                                        },
                                        {
                                            skuId: '10339405',
                                            alternateSkuId: 'GRP09947'
                                        },
                                        {
                                            skuId: 'GRP09947',
                                            alternateSkuId: 'GRP09947'
                                        },
                                        {
                                            skuId: 'GRP06386',
                                            alternateSkuId: 'GRP06386'
                                        },
                                        {
                                            skuId: '60879974',
                                            alternateSkuId: '60879974'
                                        }
                                    ]
                                },
                                productsToShow: '5',
                                showMoreLinkLabel: '',
                                showMoreLinkUrl: '',
                                showMoreTarget: '',
                                showMoreProductsDesktopFlag: false,
                                showMoreProductsMobileFlag: false,
                                showFewerLinkLabel: '',
                                paddingBottom: 'no-padding-bottom'
                            },
                            {
                                subHeading: 'For the Groom',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/Gifts_for_grooms.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/Gifts_for_grooms.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/Gifts_for_grooms.png',
                                    isLazyLoad: true,
                                    altText: 'alt6',
                                    title: 'For the Groom',
                                    description: 'The best gifts don’t need a reason.',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/accessories/shop/men-s-accessories.html',
                                    ctaText: '',
                                    ctaTarget: '',
                                    colorStyle: '',
                                    beautyTilePos: '6'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '101288142',
                                        '101288160'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '11',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: './content/tiffany-n-co/www/us/en_us/accessories/shop/men-s-accessories.html',
                                showMoreTarget: '_blank',
                                showMoreProductsDesktopFlag: true,
                                showMoreProductsMobileFlag: true,
                                showFewerLinkLabel: 'Show Less',
                                paddingBottom: 'no-padding-bottom'
                            },
                            {
                                subHeading: 'For the Wedding',
                                beautyTile: {
                                    sources: [
                                        {
                                            maxMedia: 900,
                                            src: './content/dam/tiffany/testScene7/Tiffany T.png'
                                        },
                                        {
                                            maxMedia: 767,
                                            src: './content/dam/tiffany/testScene7/Tiffany T.png'
                                        }
                                    ],
                                    defaultSrc: './content/dam/tiffany/testScene7/Tiffany T.png',
                                    isLazyLoad: true,
                                    altText: 'alt7',
                                    title: 'For Wedding',
                                    description: 'The best gifts don’t need a reason.',
                                    tileUrl: './content/tiffany-n-co/www/us/en_us/accessories/shop/shop-all-accessories-.html',
                                    ctaText: '',
                                    ctaTarget: '_blank',
                                    colorStyle: '',
                                    beautyTilePos: '7'
                                },
                                displayType: 'CATEGORY',
                                categoryConfig: {
                                    siteid: '1',
                                    assortmentID: '101',
                                    sortTypeID: '5',
                                    navigationFilters: [
                                        '101',
                                        '101288142',
                                        '101297640',
                                        '101616598',
                                        '101715659'
                                    ],
                                    recordsOffsetNumber: '0',
                                    recordsCountPerPage: '40',
                                    priceMarketID: '1',
                                    searchModeID: '2'
                                },
                                productsToShow: '14',
                                showMoreLinkLabel: 'Show More',
                                showMoreLinkUrl: './content/tiffany-n-co/www/us/en_us/accessories/shop/decorative-accents.html',
                                showMoreTarget: '_blank',
                                showMoreProductsDesktopFlag: true,
                                showMoreProductsMobileFlag: true,
                                showFewerLinkLabel: 'Show Less',
                                paddingBottom: 'padding-bottom-16'
                            }
                        ]
                    }
                ]
            },
            listbycountryConfig: {
                url: 'listbycountry',
                method: 'POST'
            },
            globalBannerConfig: {
                bannerRequest: {
                    url: '/api/globalBanner.json',
                    method: 'POST',
                    payload: {
                    }
                }
            }
        };
        window.tiffany.authoredContent.findAStoreConfig = window.tiffany.authoredContent.findAStoreConfig || {
            enabledStoresURL: 'enabledStoresUrl',
            availabilitybystores: 'availabilityByStoresUrl'
        };
        window.tiffany.authoredContent.storeLocatorConfig = {
            url: 'nearbyStoreEndPointMock',
            method: 'POST',
            payload: {
                siteid: '1',
                latitudeInput: '',
                longitudeInput: ''
            }
        };
        window.tiffany.authoredContent.parallaxConfig = {
            duration: 1000,
            offset: 300
        };
        window.tiffany.labels = {
            doneText: 'Done',
            customDesignCharmsTitle: 'with custom charms',
            closeBtnAraiLabel: 'click to close',
            rightArrowArialLabel: 'Slide to right',
            leftArrowAriaLabel: 'Slide to left',
            selectedLabel: 'Selected',
            filtersVerb: 'with',
            findInStoreLabel: 'Find in store',
            notifyLabel: 'Notify me when available',
            addToBag: 'Add to Bag',
            addToBagActive: 'Added to bag',
            addToBagActiveTextForMobile: 'Go to bag',
            quantity: 'Quantity',
            newLabel: 'New',
            wishlistAddLabel: 'Click to add to wishlist',
            wishlistRemoveLabel: 'Click to remove from wishlist',
            wishlistAddedIcon: './icons/wishlist.svg',
            wishlistAddIcon: './icons/wishlist.svg',
            wishlistAltText: 'Wishlist',
            wishlistDefaultImg: './icons/wishlist_default.svg',
            wishlistHoverImg: './icons/wishlist_hover.svg',
            wishlistSavedImg: './icons/wishlist_saved.svg',
            removeFilterLabel: 'Remove Filter',
            currency: '$',
            showMoreLinkLabel: 'Load more',
            backToTopLabel: 'Back to Top',
            filterByText: 'Filter by',
            sortByText: 'Sort by',
            clearCtaText: 'Clear All',
            engravableTextMobile: 'Engravable',
            engravableTextDesktop: 'Engravable products only',
            customPriceDesc: 'Custom price range lorem ipsum for ADA compliance.',
            nextProductLabel: 'Tab to go to next product',
            customPriceLabel: 'Custom Prices',
            customPriceMin: '$min',
            customPriceMax: '$max',
            customPriceTo: 'to',
            increment: 'increment',
            decrement: 'decrement',
            customPriceApply: 'Apply',
            customPriceMinAriaLabel: 'Min',
            customPriceMaxAriaLabel: 'Max',
            productAddedtoWishlist: 'Product added to wishlist',
            showingLabel: {
                preText: 'Showing',
                postText: 'of'
            },
            loadingLabel: {
                preText: 'Loading',
                postText: 'of'
            },
            searchLabel: 'search text',
            searchModalCloseLabel: 'search modal close',
            searchButtonLabel: 'search button',
            findStoreButtonLabel: 'find store',
            findStoreCloseLabel: 'find store modal close',
            changeStoreCloseLabel: 'change store modal close',
            changeStoreSearchLabel: 'change store',
            chooseLanguagePage: '/ChooseYourLanguage',
            referenceUrl: '/browse-grid.html',
            /**
             * Engraving (under window.tiffany.labels):
             *
             * Labels that will be used across engraving globally
             */
            engraving: {
                engravingError: 'Some unexpected error occured',
                cta: 'Engravable',
                modalCloseLabel: 'Click to close engraving preview',
                heading: 'Choose a style of engraving to personalize your design.',
                subHeading: 'Engraving 1 of 2 Tiffany ID wrap bracelet ',
                orderBy: 'Order by [date] to receive before [date]',
                deliveryHeading: 'Delivery and returns',
                deliveryDescription: '<div class="tiffany-rte"><div> Please allow an additional 1-2 days for delivery of machine-engraved items and an additional 3-4 days for delivery of monogrammed and hand-engraved items. <br><br>Please note that <b>engraved items may not be returned or exchanged.</b> If you are not sure of the size, you can try the [ item name ] on and then engrave it.</div><p>See it in store or call <b> <span class="text-phnumber">800-843-3269</span></b> for more information</p></div>',
                deliveryDescriptionNumber: '800-843-3269',
                showDRInConfirmation: true,
                showDRAcrossEngraving: false,
                isDeliveryDescriptionRte: true,
                engravingTypeHeading: '1. Select your engraving type',
                initialsInputHeading: '2. Enter your initials',
                stylesHeading: '3. Choose a font style',
                customButtonLabel: 'Engrave this charm',
                editEngraving: {
                    label: 'Edit Engraving',
                    ariaLabel: 'Editing engraving'
                },
                initials: {
                    placeHolderOne: 'Q',
                    placeHolderTwo: 'w',
                    placeHolderThree: 'e',
                    inpLabelOne: 'Enter initial one',
                    inpLabelTwo: 'Enter initial two',
                    inpLabelThree: 'Enter initial three',
                    mandatoryMessage: 'All fields are mandatory',
                    invalidCharacters: 'This character is not valid',
                    nonMonogramCharacters: 'This character is not valid for monogram engraving'
                },
                backBtn: 'Back',
                nextBtn: 'Next',
                contactUs: 'Contact Us',
                confirmationHeading: '<h3>Copy to confirm the engraving and have ability to edit</h3>',
                isConfirmationHeadingRTE: true,
                backToEdit: 'Go back and edit',
                startOver: 'Start over',
                addToBag: 'Finish and add to bag',
                symbolsHeading: 'Copy to pick symbol',
                initialMessage: 'Fetching data to engrave this product',
                noSkuMessage: 'No sku and groupsku details provided to fetch data',
                productErrorMessage: 'Unable to fetch details for this product',
                closeAriaLabel: 'Close engraving modal',
                eligibleErrorMessage: 'Error while fetching eligible engravings for this product',
                customButtonAriaLabel: 'Click to act for custom action in engraving',
                /**
                 * Custom Engraving configurations object
                 */
                custom: {
                    label: 'Custom engraving', // Label for custom engraving
                    component: 'CUSTOM_COMPONENT', // React component reference Should not be deleted
                    heading: 'Copy to explain custom engravings. Include examples to spark ideas:',
                    orderBy: 2, // Order nunmber to display custom engraving
                    description: '<div><p>some paragraph text</p> <span class="span-class">some span text</span></div>',
                    isDescriptionRTE: true,
                    /**
                     * Each option contains config object for preview
                     */
                    options: [
                        {
                            altText: 'first Image alt text',
                            sources: [{
                                maxMedia: 900,
                                src: '//media.tiffany.com/is/image/Tiffany/EcomItemL/tiffany-locksring-28126905_934415_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&&wid=900&hei=900'
                            },
                            {
                                maxMedia: 767,
                                src: '//media.tiffany.com/is/image/Tiffany/EcomItemL/tiffany-locksring-28126905_934415_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&&wid=1250&hei=1250'
                            }],
                            defaultSrc: '//media.tiffany.com/is/image/Tiffany/EcomItemL/tiffany-locksring-28126905_934415_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=<MediaCrop>&defaultImage=NoImageAvailableInternal&&&wid=2500&hei=2500',
                            hiddenOnError: true
                        },
                        {
                            altText: 'second Image alt text',
                            sources: [{
                                maxMedia: 900,
                                src: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-tiffany-infinityring-27999301_934325_ED_M.jpg&wid=900&hei=900'
                            },
                            {
                                maxMedia: 767,
                                src: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-tiffany-infinityring-27999301_934325_ED_M.jpg&wid=1250&hei=1250'
                            }],
                            defaultSrc: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-tiffany-infinityring-27999301_934325_ED_M.jpg&wid=2500&hei=2500',
                            hiddenOnError: true
                        },
                        {
                            altText: 'third Image alt text',
                            sources: [{
                                maxMedia: 900,
                                src: './images/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right.jpg'
                            }],
                            defaultSrc: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-palomas-graffitikiss-bracelet-61624058_981572_ED_M?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1&wid=1250&hei=1250',
                            hiddenOnError: true
                        },
                        {
                            altText: 'fourth Image alt text',
                            sources: [{
                                maxMedia: 900,
                                src: './images/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right.jpg'
                            }],
                            defaultSrc: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-palomas-graffitikiss-bracelet-61624058_981572_ED_M.jpg?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1&wid=1250&hei=1250',
                            hiddenOnError: true
                        },
                        {
                            altText: 'five Image alt text',
                            sources: [{
                                maxMedia: 900,
                                src: './images/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right.jpg'
                            }],
                            defaultSrc: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-palomas-graffitikiss-bracelet-61624058_981572_ED_M.jpg?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1&wid=1250&hei=1250',
                            hiddenOnError: true
                        },
                        {
                            altText: 'six Image alt text',
                            sources: [{
                                maxMedia: 900,
                                src: './images/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right.jpg'
                            },
                            {
                                maxMedia: 767,
                                src: './images/20180503_CL_To_A_T_Tile1_5x3Promo_US_tiffany_to_a_t_right.jpg'
                            }],
                            defaultSrc: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-palomas-graffitikiss-bracelet-61624058_981572_ED_M.jpg?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1&wid=1250&hei=1250',
                            hiddenOnError: true
                        }
                    ],
                    /**
                     * Help text configurations
                     */
                    helpConfig: {
                        informationTextRTE: '<p>See it in store or call <b> <span class="text-phnumber">800-843-3269</span></b> for more information</p>',
                        telephoneNumber: '800-843-3269'
                    },
                    /**
                     * Optional CTA. If provided in config this button will apear along with back button
                     */
                    cta: {
                        text: 'Contact Us',
                        link: '/',
                        target: '_new'
                    }
                }
            },
            incrementAdaLabel: 'Click to increase quantity',
            decrementAdaLabel: 'Click to decrease quantity',
            decreasedQuantityLabel: 'Quantity decreased to ',
            increasedQuantityLabel: 'Quantity increased to ',
            modifierAriaLabel: 'Choose',
            byo: {
                engraving: {
                    engravingFinishLabel: 'Finish'
                },
                claspAlt: 'clasp',
                charmAlt: 'charm',
                clearFilterCta: 'Byo Clear All',
                filterHeadLine: 'Byo Filter',
                filterMobileHeadLine: 'Byo Filter',
                hotspotLabel: 'charm hotspot',
                selectMaterial: {
                    heading: 'A charmed life is only steps away',
                    subHeading: 'First, choose your chain',
                    skipDescriptionText: 'You can edit or change this later too. ',
                    skipCtaText: 'Skip',
                    countLabel: 'Total products available are',
                    filterLabel: 'Filter By: ',
                    errorState: {
                        title: 'Concise error title',
                        description: 'Concise error message here',
                        ctaText: 'cta',
                        ctaURL: '/',
                        ctaTarget: '_blank'
                    }
                },
                silhoutte: {
                    imageUrl: './images/Product_Tile MJ_FPO.png',
                    imageAltText: 'Alt Text',
                    dropAHintMessage: 'silhoutte drop a hint message'
                },
                tray: {
                    optionsText: 'Your Options ',
                    startText: 'Start Creating',
                    continueText: 'Continue Creating',
                    yourChain: 'Your Chain',
                    addChain: 'Add Chain',
                    addCharmText: 'Add Charm',
                    chooseCharmText: 'Choose your charms below',
                    removeCharm: 'remove charm label',
                    arrowUp: 'Up',
                    arrowDown: 'Down',
                    trayInstructionImage: './images/arrow_instruct.png',
                    trayInstructionImageAlt: 'Add charms from below',
                    scrollVerticallScrollPos: 0
                },
                clasp: {
                    notification: 'Please note: ',
                    rte: {
                        colpoClaspMessage: '<p>You need clasping links ($20 each) to add charms to this bracelet. These will automatically be added to your bag.</p>'
                    },
                    cancel: 'Cancel',
                    acknowledge: 'OK',
                    mobileAcknowledge: 'OK',
                    closeText: 'close'
                },
                size: {
                    heading: 'Select chain length.',
                    linkText: 'What\'s my size',
                    linkUrl: '/',
                    linkTarget: '_blank',
                    ctaText: 'Add Chain',
                    errorText: 'Please select size first'
                },
                addChain: {
                    closeText: 'close',
                    headingText: 'Your Selected Chain',
                    noSelectionText: 'You havent chosen your chain',
                    caretOpen: 'Opened',
                    caretClosed: 'Closed',
                    cancelText: 'Cancel',
                    doneText: 'Done',
                    chainType: 'Chain Type',
                    chainSize: 'Chain Size',
                    noChainText: 'no chain',
                    claspMessage: 'This chain requires clasping links to connect charms ($20 per link). These will be automatically applied.',
                    allFilter: {
                        text: 'All',
                        index: -1
                    }
                },
                addCharmToTray: 'charm added to tray',
                variations: {
                    letter: {
                        backToCharmCTA: 'Back to Charm ',
                        continueBtnText: 'Choose Letter ',
                        ctaText: 'Add Charm ',
                        editCharmText: 'Choose Letter ',
                        errorText: 'Please select Letter first ',
                        heading: 'Choose Letter '
                    },
                    size: {
                        charmCtaText: 'Add Charm ',
                        continueBtnText: 'Choose Size ',
                        ctaText: 'Add Chain',
                        editCharmText: 'Choose Size ',
                        errorChainText: 'Please choose a size first',
                        errorText: 'Please select a Size first',
                        heading: 'Select a chain length.',
                        isSize: true,
                        linkTarget: '_blank',
                        linkText: 'What’s my size ',
                        linkUrl: './content/tiffany-n-co/www/us/en_us/size-guide.html'
                    },
                    sizeText: 'size',
                    zodiac_sign: {
                        backToCharmCTA: 'Back to Charm ',
                        continueBtnText: 'Choose Zodiac ',
                        ctaText: 'Add Charm ',
                        editCharmText: 'Choose Zodiac ',
                        errorText: 'Please select Zodiac first ',
                        heading: 'Choose Zodiac '
                    }
                },
                editCharm: {
                    cancelText: 'Cancel',
                    changeText: 'Change',
                    closeAltText: 'Close',
                    doneText: 'Done'
                },
                drawer: {
                    drawerHeading: 'selected item',
                    closeDrawerText: 'close',
                    drawerBackToTray: 'Back to tray',
                    changeChain: 'Change Chain',
                    addChain: 'Add Chain',
                    size: 'Size: ',
                    personalize: 'Personalize',
                    edit: 'Edit',
                    removeItemLabel: 'Remove Item',
                    addToBag: 'Finish and add to bag',
                    updateBag: 'Update Bag',
                    showDetails: 'Show Details',
                    saveToWishList: 'Save to Wishlist',
                    canvasWishlistSuccess: 'Your configuration has been saved',
                    slideUpIconAltText: 'drawer opened icon',
                    slideDownIconAltText: 'drawer closed icon',
                    openDrawerLabel: 'Click to open drawer',
                    closeDrawerLabel: 'Click to close drawer',
                    saveDesignName: {
                        heading: 'Save a sample design',
                        placeholder: 'Enter Design name',
                        buttonSaveText: 'Save',
                        buttonSavedText: 'Saved'
                    },
                    variations: {
                        size: {
                            name: 'Size: '
                        },
                        zodiac_sign: {
                            name: 'Zodiac: '
                        },
                        letter: {
                            name: 'Letter: '
                        }
                    }
                },
                saveCreation: {
                    heading: 'please note',
                    text: 'Starting over clears all your design and selections. Would you like to cancel to save your design or continue?',
                    startButton: 'Save',
                    cancelButton: 'Exit',
                    close: 'Close'
                },
                resetCreation: {
                    heading: 'please note',
                    text: 'Starting over clears all your design and selections. Would you like to cancel to save your design or continue?',
                    startButton: 'Start Over',
                    cancelButton: 'Cancel',
                    close: 'Close'
                }
            },
            shoppingBagFlyout: {
                currency: '$',
                noCartItemsTitle: 'Welcome to your Bag',
                cartDescription: '<p>This is where you will find all the products you add to your bag before proceeding to the checkout.</p>',
                cartMessage: 'To speed up the checkout process, sign in now.',
                ctaText1: 'Sign in now',
                ctaUrl1: './content/tiffany-n-co/www/language-masters/en.html',
                ctaTarget1: '_blank',
                ctaText2: 'Sign in now',
                ctaUrl2: './content/tiffany-n-co/www/language-masters/en.html',
                ctaTarget2: '_blank',
                complimentaryShipping: 'Complimentary shipping delivered by July 10.',
                shippingOption: 'View different shipping options',
                shippingOptionUrl: './content/tiffany-n-co/www/language-masters/en.html',
                shippingOptionTarget: '_blank',
                shoppingBag: 'View Bag Details',
                shoppingBagUrl: './content/tiffany-n-co/www/language-masters/en.html',
                shoppingBagTarget: '_blank',
                subtotalLabel: 'Estimated Total',
                checkOut: 'Checkout',
                checkoutUrl: 'https://www.google.com',
                quantity: 'Quantity',
                remove: 'Remove',
                customDesignsCTALink: 'https://dev1-aem.edev.tiffany.com:8080/BYOLandingPage/shop/BYOConfigurator/byo'
            },
            wishlistFlyout: {
                wishlistTitle: 'Welcome to your Wishlist',
                wishlistDescription: 'This is were you will find all the products you save/like, including your Build Your Own designs, the hints you dropped and those you received.',
                wishlistMessage: 'Take full advantage of your wishlist',
                ctaText: 'Sign in now',
                ctaUrl: './content/tiffany-n-co/www/language-masters/en.html',
                ctaTarget: '_blank',
                savedItems: 'Saved Items',
                customDesigns: 'Custom Designs',
                customDesignsTitle: 'Custom Product Title',
                ctaText2: 'View all saved products',
                ctaUrl2: './content/tiffany-n-co/www/language-masters/en.html',
                ctaTarget2: '_blank',
                wishListHeading: 'To fully take advantage of the Wishlist',
                addToBag: 'Add to bag',
                remove: 'Remove',
                customDesignsCTALink: 'https://dev1-aem.edev.tiffany.com:8080/BYOLandingPage/shop/BYOConfigurator/byo'
            },
            loginFlyout: {
                title: 'Sign in or register for your Tiffany Account',
                description: 'With a Tiffany.com account, you can save time during checkout, access your shopping bag and saved items from any device and view your order history.',
                loginText: 'Sign in to your account',
                loginUrl: './content/tiffany-n-co/www/language-masters/en.html',
                loginTarget: '_blank',
                signupText: 'Create an account',
                signupUrl: './content/tiffany-n-co/www/language-masters/en.html',
                signupTarget: '_blank'
            },
            myAccountFlyout: {
                prefixHeadlineText: 'Welcome to your space,',
                suffixHeadlineText: ' suffix',
                onlineOrdersHistoryLabel: 'Online Orders History',
                onlineOrdersCtaUrl: './content/tiffany-n-co/www/us/en.html',
                onlineOrdersCtaTarget: '_blank',
                personalInfoLabel: 'Personal Information',
                personalInfoCtaUrl: './content/tiffany-n-co/www/us/en.html',
                personalInfoCtaTarget: '_blank',
                loginInfoLabel: 'Login Information',
                loginInfoCtaUrl: './content/tiffany-n-co/www/us/en.html',
                loginInfoCtaTarget: '_blank',
                emailPreferenceLabel: 'Email Preferences',
                emailPreferenceCtaUrl: './content/tiffany-n-co/www/us/en.html',
                emailPreferenceCtaTarget: '_self',
                addressBookLabel: 'Address Book',
                addressBookCtaUrl: './content/tiffany-n-co/www/us/en.html',
                addressBookCtaTarget: '_blank',
                preferredStoreLabel: 'Your preferred store',
                signOutLabel: 'Sign out',
                signOutUrl: '/Customer/Account/sign_out.aspx'
            },
            concierge: {
                mobileHeading: 'Concierge',
                headline: 'Tiffany Concierge is here to help.',
                description: 'Contacting a Sales Service representative or a Diamond Expert is quick and easy.',
                options: [
                    {
                        type: 'chat',
                        order: 1,
                        showStatus: true,
                        chatWidgetID: 'concierge-chat', // ID to be provided to LivePerson
                        name: 'some name'
                    },
                    {
                        type: 'phone',
                        order: 2,
                        icon: 'icons/call.svg',
                        labelText: 'Call us',
                        state: 'drawer',
                        salesService: {
                            text: 'Call the Tiffany Sales Service at ',
                            number: '800-843-3269',
                            name: 'sales'
                        },
                        diamondService: {
                            text: 'Call a Tiffany Diamond Expert at ',
                            number: '800-518-5555',
                            name: 'diamond-expert'
                        },
                        showStatus: true
                    },
                    {
                        type: 'email',
                        order: 3,
                        icon: 'icons/email.svg',
                        labelText: 'Email',
                        showStatus: true
                    },
                    {
                        type: 'diamond',
                        order: 4,
                        icon: 'icons/diamondexpert.svg',
                        labelText: 'Diamond Expert',
                        url: 'www.google.com',
                        target: '_blank',
                        showStatus: true
                    }
                ],
                learnMore: {
                    labelText: 'Learn more about Tiffany Concierge',
                    url: 'www.google.com',
                    target: '_blank'
                },
                heading: 'Concierge',
                email: {
                    emailus: 'Email us',
                    description: 'For questions or assistance, please complete the following form.',
                    cancelBtn: 'Cancel',
                    backBtn: 'Go Back',
                    ErrorMessage: 'Please enter a valid email address',
                    sendBtn: 'Send',
                    countryCode: '+91',
                    emailTemplate: 'First Name: {{%FirstName}}, Last Name: {{%LastName}}, Message: {{%Message}}, Email: {{%Email}}, Phone: {{%Phone}}, Title: {{%Title}}, ',
                    request: {
                        url: 'https://dev-api.tiffco.net/ibmdev/dev01/emailservicessystemapi/api/system/v1/sendemail/send',
                        method: 'POST',
                        payload: {},
                        pagePath: 'some page path'
                    },
                    formFields: [{
                        fieldName: 'Message',
                        placeHolder: 'Message placeholder',
                        autocompleteName: 'message',
                        type: 'text',
                        optional: false,
                        order: 1,
                        hide: false
                    },
                    {
                        fieldName: 'Email',
                        placeHolder: 'Email Placeholder',
                        autocompleteName: 'email',
                        type: 'text',
                        optional: false,
                        order: 2,
                        hide: false
                    },
                    {
                        fieldName: 'FirstName',
                        placeHolder: 'FirstName Placeholder',
                        autocompleteName: 'given-name',
                        type: 'text',
                        optional: false,
                        order: 4,
                        hide: false
                    },
                    {
                        fieldName: 'LastName',
                        placeHolder: 'LastName Placeholder',
                        autocompleteName: 'family-name',
                        type: 'text',
                        optional: false,
                        order: 3,
                        hide: false
                    },
                    {
                        fieldName: 'Phone',
                        placeHolder: 'Phone Placeholder',
                        autocompleteName: 'tel',
                        type: 'text',
                        optional: true,
                        order: 5,
                        hide: false
                    },
                    {
                        fieldName: 'Phone hidden',
                        placeHolder: 'Phone Placeholder',
                        autocompleteName: 'tel',
                        type: 'text',
                        optional: true,
                        order: 5,
                        hide: true
                    },
                    {
                        fieldName: 'Title',
                        placeHolder: 'Phone Placeholder',
                        autocompleteName: 'tel',
                        type: 'dropdown',
                        dropValues: [
                            'Mr',
                            'Mrs'
                        ],
                        optional: false,
                        order: 5
                    },
                    {
                        fieldName: 'Gender',
                        placeHolder: 'Phone Placeholder',
                        autocompleteName: 'tel',
                        type: 'radio',
                        radioValues: [
                            'Male',
                            'Female'
                        ],
                        optional: false,
                        order: 5
                    }],
                    subjectListHide: false,
                    subjectList: [
                        {
                            name: 'General Inquiry',
                            recipient: 'harshgupta9@deloitte.com',
                            fromAddress: 'CustomerService@tiffany.com'
                        },
                        {
                            name: 'Order Inquiry / Order Change',
                            recipient: 'CustomerService@tiffany.com',
                            fromAddress: 'test@test.com'
                        },
                        {
                            name: 'Billing Inquiry',
                            recipient: 'retailcredit@tiffany.com',
                            fromAddress: 'test@test.com'
                        },
                        {
                            name: 'Repair Inquiry',
                            recipient: 'CustomerRelations@Tiffany.com',
                            fromAddress: 'test@test.com'
                        },
                        {
                            name: 'Tiffany for Business - Account Management',
                            recipient: 'CustomerService@Tiffany.com',
                            fromAddress: 'test@test.com'
                        },
                        {
                            name: 'Engagement Inquiry',
                            recipient: 'DiamondSpecialist@Tiffany.com',
                            fromAddress: 'test@test.com'
                        }
                    ],
                    confirmationHeading: 'Thank you for your inquiry',
                    confirmationMessage: 'Your email/store request was successfully submitted. A Tiffany representative will contact you in the next 24 hours.'
                }
            },
            distanceSingular: 'Km',
            distancePlural: 'Kms'
        };
        window.tiffany.pdpConfig = {
            price: 120,
            formattedPrice: '$ 132',
            isGroup: false,
            sku: '60929416',
            selectedSku: '60929416',
            groupDefaultItemSku: '60929416',
            categoryID: 287458,
            masterCategoryID: 148204,
            partialShip: false,
            orderOriginationId: 1,
            maxQuantity: 20,
            currency: '$',
            isServiceable: true,
            isPdpPage: true,
            modifiersConfig: {
                label: 'motif',
                isMotif: false,
                isColorSwatch: false,
                sizeGuideLabel: 'Size Guide',
                sizeGuideIcon: './icons/size_scale.png',
                sizeGuideIconAlt: 'size guide icon',
                variations: [
                    {
                        label: 'A',
                        imageURL: './images/collections/red.png',
                        URL: 'www.google.com',
                        isSelected: false
                    }, {
                        label: 'B',
                        imageURL: './images/collections/red.png',
                        URL: 'www.google.com',
                        isSelected: false
                    }, {
                        label: 'C',
                        imageURL: './images/collections/red.png',
                        URL: 'www.google.com',
                        isSelected: false
                    }, {
                        label: 'D',
                        imageURL: './images/collections/red.png',
                        URL: 'www.google.com',
                        isSelected: false,
                        sku: 'sku3'
                    }, {
                        label: 'E',
                        imageURL: './images/collections/red.png',
                        URL: 'www.google.com',
                        isSelected: false,
                        sku: 'sku4'
                    }, {
                        label: 'D1',
                        imageURL: './images/collections/red.png',
                        URL: 'www.google.com',
                        isSelected: false,
                        sku: 'sku5'
                    }, {
                        label: 'G23',
                        imageURL: './images/collections/red.png',
                        URL: 'www.google.com',
                        isSelected: true,
                        sku: 'sku6'
                    }
                ]
            },
            bopsConfig: {
                bopsRTE: '',
                learnMoreLabel: 'Learn More',
                defaultBOPSLabel: 'Buy online now and pick up in store',
                learnMoreUrl: '#',
                target: '_blank'
            },
            changeStore: {
                availabilityPlaceholderText: 'In Store Availability',
                selectMilesArialLabel: 'Select miles',
                text: 'Find a store within',
                radiusOptions: [10, 25, 50, 100, 200],
                radiusUnit: 'miles',
                concatenationText: 'of',
                inputPlaceholder: 'City, state, or zip code',
                buttonText: 'Search',
                helpText: 'changeStoreHelpText',
                errorMsg: 'changeStoreErrorMsg',
                currentLocation: 'Use my current location',
                StaticDropdownText: 'in',
                regionsConfig: [
                    {
                        region: 'United States',
                        siteId: 1,
                        regionLabel: 'United States'
                    },
                    {
                        region: 'Italy',
                        siteId: 102,
                        regionLabel: 'Italy'
                    },
                    {
                        region: 'France',
                        siteId: 103,
                        regionLabel: 'France'
                    },
                    {
                        region: 'Canada',
                        siteId: 5,
                        regionLabel: 'Canada'
                    }
                ]
            },
            store: {
                searchDefaultRadius: 50,
                buttonPlaceholder: 'Find in Store',
                availability: {
                    toolTipConfig: {
                        availabile: {
                            informationTextRTE: '<p>The availability of the item is subject to change. Please contact us at <span class="text-phnumber">800-843-3269</span> to confirm that your item is still available.</p>',
                            telephoneNumber: '800-843-3269'
                        },
                        limitedAvailable: {
                            informationTextRTE: '<p>The availability of the item is subject to change. Please contact us at <span class="text-phnumber">800-843-3269</span> to confirm that your item is still available.</p>',
                            telephoneNumber: '800-843-3269'
                        },
                        callToConfirm: {
                            informationTextRTE: '<p>The availability of the item is subject to change. Please contact us at <span class="text-phnumber">800-843-3269</span> to confirm that your item is still available.</p>',
                            telephoneNumber: '800-843-3269'
                        }
                    },
                    availabile: 'Available at',
                    limitedAvailable: 'Limited availability at',
                    callToConfirm: '<p>Call <span class="text-phnumber">800-843-3269</span> to confirm availability at</p>'
                },
                inStoreAvailability: 'In-store Availability',
                changeStore: 'Change Store',
                availabileStores: {
                    get: {
                        url: 'availabilityByStoresUrl',
                        method: 'POST',
                        payload: {
                            assortmentId: 101,
                            siteId: 1,
                            sku: '60929416'
                        }
                    }
                },
                storesList: {
                    get: {
                        url: 'enabledStoresUrl',
                        method: 'POST',
                        payload: {
                            siteId: 1
                        }
                    }
                }
            },
            findInStoreConfig: {
                ctaText: 'Find in Store'
            },
            notifyWhenAvailConfig: {
                ctaText: 'Notify me when available'
            },
            nonPurchasebleInformationTextKey: 'nonPurchasebleInformationTextConfig',
            retiredInformationConfigKey: 'retiredInformationConfig',
            iStatusInformationTextKey: 'iStatusInformationTextConfig',
            disclaimerDescriptionKey: 'disclaimerDescriptionConfig',
            giftCardTermsKey: 'giftCardTermsConfig',
            counterfeitWarningKey: 'counterfeitWarningConfig',
            productBundleScrollConfig: {
                heading: 'Buy this item separately',
                image: [{
                    id: '1',
                    isLazyLoad: true,
                    sku: 'GRP10415',
                    isNew: false,
                    price: '',
                    name: '',
                    url: '//media.tiffany.com/is/image/Tiffany/EcomItemM/tiffany-keys-modern-keys-open-round-key-pendant-21771953_982112_ED_G_M.jpg?defaultImage=NoImageAvailable&',
                    image: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-37003409_965333_ED.jpg'
                }, {
                    id: '2',
                    isLazyLoad: false,
                    sku: 'GRP10415',
                    isNew: true,
                    price: '',
                    name: '',
                    url: '//media.tiffany.com/is/image/Tiffany/EcomItemM/tiffany-keys-modern-keys-open-round-key-pendant-21771953_982112_ED_G_M.jpg?defaultImage=NoImageAvailable&',
                    image: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-37003409_965333_ED.jpg'
                }, {
                    id: '3',
                    isLazyLoad: true,
                    sku: 'GRP10415',
                    isNew: false,
                    price: '',
                    name: '',
                    url: '//media.tiffany.com/is/image/Tiffany/EcomItemM/tiffany-keys-modern-keys-open-round-key-pendant-21771953_982112_ED_G_M.jpg?defaultImage=NoImageAvailable&',
                    image: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-37003409_965333_ED.jpg'
                }]
            },
            quantityErrorConfig: {
                informationTextRTE: '<p>The online shopping limit for this product is 4. If you wish to place a larger order, please call. <b> <span class="text-phnumber">800-843-3269</span></b> for more information</p>',
                telephoneNumber: '800-843-3269'
            },
            giftCardConfig: {
                checkBalance: {
                    request: {
                        url: 'giftCardCheckBalanceUrl',
                        method: 'POST',
                        payload: {
                            siteId: 1
                        }
                    },
                    headlineText: 'Check Your Tiffany Gift Card Balance',
                    remainingBalance: 'Remaining Balance',
                    checkAnotherBalance: 'Check another gift card\'s balance'
                },
                giftCardCheckBalanceLabel: 'Gift Card Check Balance',
                cardNumberLabel: 'Gift Card Number',
                pinLabel: 'PIN',
                checkBalanceCTA: 'Check Balance',
                closeAriaLabel: 'Close button',
                validations: {
                    required: {
                        pin: 'Please enter pin',
                        cardNumber: 'Please enter valid Card Number'
                    },
                    server: {
                        mismatch: 'Pin and card number mismatch'
                    }
                },
                disclaimer: {
                    informationTextRTE: '<p>The PIN is located underneath the scratch-off bar on the back of the card. Tiffany Gift Cards must contain a PIN (Personal Identification Number) to be used on the Web. Tiffany Gift Cards purchased prior to October 1, 2003, do not have a PIN.<p>If your Tiffany Gift Card does not have an imprinted PIN, please call			        for assistance.<p>See it in store or call <b> <span class="text-phnumber">800-843-3269</span></b> for more information</p>',
                    telephoneNumber: '800-843-3269'
                }
            },
            storeSearchConfig: {
                headingText: 'Stores',
                availabilityText: {
                    informationTextRTE: '<p>Availability<span> (updated every 30 min)</span></p>'
                },
                showPickupCtaText: 'Show pick up in store only',
                selectStoreBtnText: 'Select this store',
                unavailableText: 'Call to confirm availability',
                limitedAvailText: 'Limited availability',
                availableText: 'Currently Available in Store',
                bopsStatustext: 'Purchase online and pick up in store',
                isToggle: true,
                closeAriaLabel: 'Close icon',
                leftArrowAriaLabel: 'Left arrow icon',
                toggleAriaLabel: 'Toggle switch button',
                toolTipConfig: {
                    pickUpStore: {
                        informationTextRTE: '<p>Choose &quot;In-store-pickup&quot; within the checkout process to pickup the product in store.</p>'
                    },
                    availability: {
                        informationTextRTE: '<p>The availability of the item is subject to change. Please contact us at <span class="text-phnumber">800-843-3269</span> to confirm that your item is still available.</p>',
                        telephoneNumber: '800-843-3269'
                    },
                    limitedAvailability: {
                        informationTextRTE: '<p>Please contact us at <span class="text-phnumber">800-843-3269</span> to confirm that your item is still available.</p>',
                        telephoneNumber: '800-843-3269'
                    },
                    unAvailable: {
                        informationTextRTE: '<p>Please contact us at <span class="text-phnumber">800-843-3269</span> to confirm that your item is still available.</p>',
                        telephoneNumber: '800-843-3269'
                    }
                }
            },
            dropHint: {
                heading: 'Drop a hint',
                ariaLabelText: 'Drop a hint',
                dropHintIcon: './icons/shopping-bag.svg',
                dropHintIconAltText: 'Drop a Hint',
                dropHintLabelText: 'Drop a Hint',
                ariaLabels: {
                    closeAriaLabel: 'Close icon',
                    leftArrowAriaLabel: 'Left arrow icon'
                },
                fields: {
                    recipientFirstName: {
                        placeholder: 'Recipient\'s First Name',
                        maxLength: 16,
                        mandatoryMessage: 'RFN field is mandatory'
                    },
                    recipientMail: {
                        placeholder: 'Recipient\'s Email',
                        maxLength: 16,
                        mandatoryMessage: 'RM field is mandatory',
                        missMatchMessage: 'RM is not valid'
                    },
                    firstName: {
                        placeholder: 'Your First Name',
                        maxLength: 16,
                        mandatoryMessage: 'FN field is mandatory'
                    },
                    mail: {
                        placeholder: 'Your Email',
                        maxLength: 16,
                        mandatoryMessage: 'M field is mandatory',
                        missMatchMessage: 'M is not valid'
                    }
                },
                cta: {
                    text: 'Send',
                    url: '/api/dropAHintEmail',
                    method: 'POST',
                    payload: {
                        CategoryId: '',
                        DropAHintSource: 1,
                        DropAHintType: 1,
                        GroupSku: 'GRP09538',
                        ParentGroupSku: '',
                        SceneSelection: 1,
                        assortmentID: 101,
                        imageUrl: '',
                        mailSubject: '{{%receiverName}},  Here\'s a little hint from {{%senderName}}',
                        recipientEmail: '',
                        recipientName: '',
                        senderEmail: '',
                        senderName: '',
                        siteId: 1,
                        sku: '60450323',
                        webCustomerId: '',
                        isEngagement: true
                    }
                },
                saveHintConfig: {
                    url: '/api/saveHintEmail',
                    method: 'POST',
                    payload: {
                        DropAHintListCode: '',
                        webCustomerId: '',
                        ListTypeId: 6,
                        SiteId: 1
                    }
                },
                captcha: {
                    heading: 'Protected by recaptcha',
                    icon: {
                        defaultSrc: '//media.tiffany.com/is/image/Tiffany/DAH_200x200_Thumb_4',
                        altText: 'captcha icon'
                    },
                    maxCta: 4,
                    ctas: [
                        {
                            text: 'Privacy',
                            link: '/',
                            target: '_new'
                        },
                        {
                            text: 'Terms',
                            link: '/',
                            target: '_new'
                        }
                    ]
                },
                thumbnails: {
                    images: [
                        {
                            defaultSrc: '//media.tiffany.com/is/image/Tiffany/DAH_200x200_Thumb_4',
                            isLazyLoad: true,
                            altText: 'Dumy post card image',
                            ariaLabel: 'Thumbnail 1 aria label',
                            preview: {
                                defaultSrc: '//media.tiffany.com/is/image/Tiffany/DAH_200x200_Thumb_4?&hei=456&wid=456',
                                isLazyLoad: true,
                                altText: 'Some Image'
                            }
                        },
                        {
                            defaultSrc: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/tiffany-hardwearball-dangle-ring-60450455_969563_ED_M.jpg?op_usm=1.5,1,6&defaultImage=NoImageAvailable&&',
                            isLazyLoad: true,
                            altText: 'Dumy image',
                            ariaLabel: 'Thumbnail 2 aria label',
                            preview: {
                                defaultSrc: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/tiffany-hardwearball-dangle-ring-60450455_969563_ED_M.jpg?op_usm=1.5,1,6&defaultImage=NoImageAvailable&&hei=456&wid=456',
                                isLazyLoad: true,
                                altText: 'Some Image'
                            }
                        }
                    ],
                    // hint: '<div class="tiffany-rte"><p>Dear RECIPIENT_NAME,<br/>Apparently SENDER_NAME has been daydreaming about this and we thought you’d definitely want to know. A hint from your friends at Tiffany.</p></div>',
                    hint: '<div class="tiffany-rte"><p><span class="drop-a-hint__extra-gap">Dear RECIPIENT_NAME,</span></p><p>A little hint that this caught SENDER_NAME\'s eye.</p><p>Love,</p><p>your friends at Tiffany.</p></div>',
                    isHintRTE: true
                },
                confirmation: {
                    text: 'Your message has be successfully Sent!',
                    showAll: {
                        text: 'See my sent hints',
                        link: '/',
                        target: '_new'
                    },
                    duration: 4000
                }
            }
        };
        window.tiffany.authoredContent.icons = {
            backToTop: {
                src: '//s7d2.scene7.com/is/content/tiffanydmdt1/backtotop?wid=32&hei=32',
                altText: 'back to top image'
            },
            tooltip: {
                src: './icons/information.svg',
                altText: 'tooltip image'
            },
            dropdown: {
                src: '/icons/dropdown.svg',
                altText: 'drop down icon'
            },
            diamondExpert: {
                src: './icons/diamondexpert.svg',
                altText: 'diamond expert icon'
            },
            close: {
                src: './icons/close.svg',
                altText: 'close icon'
            },
            email: {
                src: './icons/email.svg',
                altText: 'email icon'
            },
            call: {
                src: './icons/call.svg',
                altText: 'call icon'
            },
            chat: {
                src: './icons/chat.svg',
                altText: 'chat icon'
            },
            edit: {
                src: './icons/account.svg',
                altText: 'edit icon'
            },
            store: {
                src: './icons/store-locator.svg',
                altText: 'store icon'
            },
            byoArrow: {
                src: './icons/facebook.svg',
                altText: 'byo arrow icon'
            },
            savedStoreDefault: {
                src: './icons/saved-store_default.svg',
                altText: 'byo arrow icon'
            },
            savedStoreSaved: {
                src: './icons/saved-store_saved.svg',
                altText: 'byo arrow icon'
            }
        };
        window.tiffany.authoredContent.browseConfig.headingPattern = {
            single: [
                {
                    endecaDimensionId: 1,
                    format: '{browseHeading} - {filter}'
                },
                {
                    endecaDimensionId: 5,
                    format: '{filter} {browseHeading}'
                },
                {
                    endecaDimensionId: 6,
                    format: '{filter} {browseHeading}'
                },
                {
                    endecaDimensionId: 2,
                    format: '{filter} {browseHeading}'
                },
                {
                    endecaDimensionId: 3,
                    format: '{filter} {browseHeading}'
                },
                {
                    endecaDimensionId: 14,
                    format: '{browseHeading}'
                },
                {
                    endecaDimensionId: 4,
                    format: '{browseHeading}'
                }
            ],
            multiple: [
                {
                    type: 'material-gemstone',
                    format: '{material} {browseHeading} with {gemstone}'
                },
                {
                    type: 'category-any',
                    format: '{filter} {browseHeading} - {category}'
                },
                {
                    type: 'collection-any',
                    format: '{collection} {filter} {browseHeading}'
                }
            ]
        };
        window.tiffany.authoredContent.addtocartconfig = {
            mysid2Life: 7300,
            currency: '$',
            url: 'skuEcomAddEndPoint',
            method: 'POST',
            payload: {
                assortmentId: 101,
                siteId: 1,
                groupSku: 'GRP02985',
                parentGroupSKU: 'GRP04077',
                sku: 25508327,
                quantity: 1,
                categoryID: 287465,
                masterCategoryID: 148204,
                partialShip: false,
                orderOriginationId: 1,
                webCustomerID: 'ca05c84fa7244a6ca554c40e188242c7'
            }
        };
        window.tiffany.authoredContent.salesServiceCenter = {
            months: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ],
            tabs: [{
                title: 'Retail Store Inventory',
                key: 'retailStore',
                href: '#',
                columnHeadings: {
                    storeNumber: 'Store Number',
                    storeName: 'DC Store Name',
                    totalInTransit: 'Total in transit',
                    onHand: 'On Hand',
                    reserved: 'Reserved',
                    available: 'Available',
                    assorted: 'Assorted'
                }
            },
            {
                title: 'Distribution Center Inventory',
                key: 'distributionCenter',
                href: '#',
                columnHeadings: {
                    dcNubmer: 'DC Number',
                    dcStoreName: 'DC Store Name',
                    transitTime: 'Total in transit',
                    onHand: 'On Hand',
                    reserved: 'Reserved',
                    available: 'Available'
                }
            },
            {
                title: 'On Order Status',
                key: 'orderStatus',
                href: '#',
                columnHeadings: {
                    storeNumber: 'Store Number',
                    dcName: 'DC Name',
                    poOrder: 'PO Order',
                    onOrder: 'On Order',
                    reserved: 'Reserved',
                    available: 'Available',
                    expectedDate: 'Expected Date',
                    countryOfOrigin: 'Country of Origin'
                }
            }],
            ariaLabels: {
                closeAriaLabel: 'Close icon',
                leftArrowAriaLabel: 'Left arrow icon'
            },
            retailStoreRequest: {
                url: 'retailStoreApiUrl',
                method: 'POST',
                payload: {
                    sku: '62996420'
                }
            },
            storeNameMap: {
                53: 'RSC',
                403: 'Global Trade',
                50: 'test'
            },
            onOrderNoResultsLabel: 'No results found',
            distributionNoResultsLabel: 'No distribution inventory results found',
            onOrderStatusRequest: {
                url: 'onOrderStatusUrl',
                method: 'POST',
                payload: {
                    sku: '37608432',
                    storeNumbers: [
                        '445',
                        '688',
                        '689',
                        '430',
                        '629',
                        '9205',
                        '9200',
                        '624',
                        '627',
                        '625',
                        '623',
                        '628',
                        '626',
                        '403',
                        '53',
                        '98',
                        '56',
                        '50'
                    ]
                }
            },
            distributionInvRequest: {
                url: 'distributionInvApiUrl',
                method: 'POST',
                payload: {
                    hideZeroInventory: true,
                    sku: '60409293',
                    storeNumbers: [
                        '445',
                        '688',
                        '689',
                        '430',
                        '629',
                        '9205',
                        '9200',
                        '624',
                        '627',
                        '625',
                        '623',
                        '628',
                        '626',
                        '403',
                        '53',
                        '98',
                        '56',
                        '50'
                    ]
                }
            },
            retailStore: {
                searchTypes: [{
                    type: 'address',
                    displayValue: 'Search by address, city or postal code',
                    placeHolder: 'Enter Address courty, zipcode'
                }, {
                    displayValue: 'Search by store number',
                    type: 'store',
                    placeHolder: 'Store Number'
                }],
                noResultsLabel: 'No store results',
                searchTermMandatoryLabel: 'Please search for some store',
                regionsMap: [{
                    value: '30',
                    type: 'distance',
                    displayValue: '30 miles/ 48 kilometers'
                }, {
                    value: '40',
                    type: 'distance',
                    displayValue: '40 miles/ 54 kilometers'
                }, {
                    value: '15',
                    type: 'distance',
                    displayValue: '15 miles/ 24 kilometers'
                }, {
                    value: 'all',
                    type: 'all',
                    displayValue: 'All',
                    isSelected: true
                }, {
                    value: 'United States',
                    type: 'country',
                    displayValue: 'United States'
                }, {
                    value: 'Australia',
                    type: 'country',
                    displayValue: 'Australia'
                }],
                getAllStoresRequest: {
                    url: 'allStoresUrl',
                    method: 'POST',
                    payload: {}
                },
                getStoresByCountryRequest: {
                    url: 'storesByCountryUrl',
                    method: 'POST',
                    payload: {
                        country: 'Croatia',
                        siteId: 42331725
                    }
                },
                getRetailInventoryRequest: {
                    url: 'retailInventoryUrl',
                    method: 'POST',
                    payload: {
                        hideZeroInventory: true,
                        sku: '10769213',
                        storeNumbers: [

                        ]
                    }
                },
                searchLabel: 'Search',
                withinLabel: 'within',
                availableStoresLabel: 'Available Store Label'
            },
            availableFooterLabel: 'Available row'
        };
        window.tiffany.authoredContent.miniPdpConfig = {
            request: {
                url: 'miniPdpUrl',
                method: 'GET'
            }
        };
        window.tiffany.authoredContent.activeGroupPattern = ',3,';
        window.tiffany.authoredContent.richRelevanceSessionId = 'r_session_id';
        window.tiffany.authoredContent.richRelevanceUserId = 'mysid2';

        window.tiffany.authoredContent.canadaEnglishCookieName = 'selectedLanguage';
        window.tiffany.authoredContent.canadaEnglishCookieValue = 'ca';
        window.tiffany.authoredContent.canadaEnglishDomain = '/';

        window.tiffany.apiUrl.userSessionRefresh.endPoint = '/content/tiffany-n-co/_jcr_content/servlets/usersession.refresh.json?currentTime=';
        window.tiffany.apiUrl.userSessionRefresh.cookieName = 'samebrowsersession';
        window.tiffany.authoredContent.lazyLoadConfigs = [{
            component: 'tiffany-product-carousel',
            props: {
                type: 'RICH_REL',
                config: 'pdpCarouselConfig'
            }
        },
        {
            component: 'tiffany-circle-carousel',
            props: {
                config: 'circleCarouselConfig'
            }
        }];
    }
}
