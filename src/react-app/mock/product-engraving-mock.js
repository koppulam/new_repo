/**
 * @description mock data for product engraving
 * @returns {Object} mock for product engraving
 */
export default function getDefaultProductEngraving() {
    /**
    * Engraving Config (Under window.tiffany.pdpConfig):
    *
    * Holds required details to make ajax calls, show preview of engraving and Custom Engraving
    */
    // engravingConfig:
    return {
        /**
         * This is the default Preview image that has to be shown on clicking on engraving button
         *
         * default Src - Required and has to be a high resolution scene7 image
         * Sources - Array of object which define maximum view port size till which its respective soruce will be used for image
         *           Resolution of image may change based on the media query
         */
        previewConfig: {
            sources: [{
                maxMedia: 900,
                src: '//media.tiffany.com/is/image/Tiffany/62617691_986302_SV_1?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1'
            }, {
                maxMedia: 767,
                src: '//media.tiffany.com/is/image/Tiffany/62617691_986302_SV_1?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1'
            }],
            defaultSrc: '//media.tiffany.com/is/image/Tiffany/62617691_986302_SV_1?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1',
            isLazyLoad: true,
            altText: 'Some Image', // Alt text for this image
            customClass: 'product-preview-image' // Custom class that will be added to the image. Should not be changed
        },
        /**
         * Eligible Engravings :
         * Ajax call to fetch all eligible engravings
         */
        eligibleEngravings: {
            url: 'https://test-api.tiffco.net/tiffanyco/ecomqa01/servicingssystemapi/api/system/v1/servicings/item/services',
            method: 'post',
            payload: {
                assortmentId: 101,
                sku: '60879974',
                priceMarketId: 1,
                siteId: 1
            }
        },
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
                    defaultSrc: '//media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-palomas-graffitikiss-bracelet-61624058_981572_ED_M.jpg?$EcomItemL2$&id=5W2r83&fmt=jpg&fit=constrain,1&wid=1250&hei=1250',
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
    };
}
