import { scrollTo } from './utils/scroll-to-content';

(function () {

    (function ($, window, document, undefined_) {

        /**
         * navLinks : Holds list of navigation elements and their details.
         *
         * {
         *  name - name of link, just for reference
         *  refTo - Id of the element this link is refering to
         *  offset - Distance of this element from its parent starting in x-direction
         *  position - distance to scroll on page to reach the section
         * }
         */
        var navLinks = [];
        /**
         * Scroll position till which we will have to ignore
         * Ideally the position of the first nav link
         */
        var ignoreScroll;

        // Speed with which scroll animation should happen
        var scrollSpeed = 500;
        // Height of navigation container
        var navHeight;
        // Class to be added on list element on activation
        var listActiveClass = 'active';
        // Class to fix the navigation container
        var classTofix = 'stick';
        // gutterSpace to be considered while scrolling nav bar
        var gutterSpace;
        // Array of selectors that get sticky on scrolling the page
        var stickyElements = ['.stick.header__nav-container', '.sticky-nav.app-js__sticky-nav'];
        var collapseElements = ['.choose-country__banner', '.global-banner__body, .banner__holder'];

        let scrollCount = 0;

        /**
         * Calculates height of all the sticky elements when scrolling
         * @returns {Number} height of sticky elements
         */
        var stickyElementsHeightCalculator = function () {
            var stickyElementsHeight = 0;

            // adding height of collapsable elements if needed
            if (!($('.page-wrap').hasClass('header__sticky'))) {
                if (collapseElements) {
                    collapseElements.forEach(function (selector, index) {
                        if ($(selector).length && $(selector).is(':visible')) {
                            stickyElementsHeight += $(selector).outerHeight();
                        } else {
                            stickyElementsHeight += 0;
                        }
                    })
                }
            }

            return stickyElementsHeight;
        }

        /**
         * fetchReferences - Method to fetch references from navigation;
         *
         * Iterate through all the links in this nav element,
         * Fetch and create a object with references to Dom.
         *
         * Also check if these elements are present on the page.
         * If not present then throw error right away.
         */
        var fetchReferences = function (navContainer) {
            var listItemDetails = {};
            // Clear navLinks when this is called to avoid duplicates
            // When this method is called on resize this will be useful
            navLinks = [];

            $.each(navContainer.find('a'), function (listIndex, listElement) {
                listItemDetails = {};
                try {
                    if ($(listElement).attr('href') && $($(listElement).attr('href')).length) {
                        if (!listIndex) {
                            ignoreScroll = $($(listElement).attr('href')).offset().top
                        }
                        navLinks.push({
                            refTo: $(listElement).attr('href'),
                            offset: Math.floor($(listElement).offset().left)
                        });
                    } else {
                        console.warn(`No element with id ${$(listElement).attr('href').substring(1)}`);
                    }
                } catch (error) {
                    console.warn('Elements do not have proper hrefs');
                }
            });

            navHeight = $(navContainer).height();
            gutterSpace = $(window).width() > 900 ? 80 : 0;
        }

        /**
         * Events that willb be bound on the menu elements and on window scroll
         */
        var eventBinder = function (container) {
            let navClicked = false;

            $(container).find('a').on('click', function (e) {
                // e.preventDefault(); // preventDefault() is causing flickering
                if (!navClicked) {
                    try {
                        let completeCounter = 0;
                        navClicked = true;
                        $(window).off('scroll', scrollCallback);
                        $(container).find('.'+listActiveClass).removeClass(listActiveClass);
                        $(this).addClass(listActiveClass);

                        const clientRects  = $(container)[0].getBoundingClientRect();
                        let containerBottom = clientRects.bottom;

                        containerBottom -= stickyElementsHeightCalculator();

                        if ($($(this).attr('href')) && $($(this).attr('href'))[0] && $($(this).attr('href'))[0].getBoundingClientRect) {
                            const targetElement = $($(this).attr('href'))[0];
                            const targetRects = targetElement.getBoundingClientRect();

                            if (targetRects.top !== containerBottom) {
                                const $ref = $($(this).attr('href'));
                                let intailTop = Math.ceil($ref.offset().top);
                                const $body = $('body');

                                if (!$body.hasClass('fixed-header')) {
                                    intailTop -= clientRects.height;
                                }

                                const sctop = intailTop - containerBottom;
                                scrollCount = 0;

                                $('html, body').animate(
                                    {
                                        scrollTop: sctop,
                                        speed: 1500,
                                    },
                                    {
                                        progress: function(ani, percentage) {
                                            const newTop = Math.ceil($ref.offset().top);

                                            if (newTop !== intailTop) {
                                                let topDIff = newTop - intailTop;
                                                ani.tweens[0].end += topDIff;
                                                intailTop = newTop;
                                            }
                                        },
                                        complete: function() {
                                            setTimeout(()=> {
                                                completeCounter += 1;
                                                if (completeCounter === 2) {
                                                    navClicked = false;
                                                    $(window).on('scroll', scrollCallback);
                                                }
                                            }, 100);
                                        }
                                    }
                                );

                                const currentIndex = $(container).find('a').index($(this));

                                if (currentIndex > -1 && navLinks[currentIndex]) {
                                    $(container).find('ul').scrollLeft(navLinks[currentIndex].offset - (gutterSpace + 16));
                                }

                                $(this).blur();
                            } else {
                                navClicked = false;
                            }
                        } else {
                            navClicked = false;
                        }
                    } catch(e) {

                    }
                }
            });

            const scrollCallback = function () {
                const containerBottom = $(container)[0].getBoundingClientRect();

                scrollCount += 1;

                if (!navClicked && scrollCount > 1) {
                    // Having a reference after below loop is complete
                    let activeReferenceIndex;

                    navLinks.forEach(function (linkDetails, listIndex) {
                        if ($(linkDetails.refTo) && $(linkDetails.refTo)[0] && $(linkDetails.refTo)[0].getBoundingClientRect()) {
                            const offset = $(linkDetails.refTo)[0].getBoundingClientRect();

                            if (containerBottom.bottom > offset.top && containerBottom.bottom < offset.bottom) {
                                $(container).find('.'+listActiveClass).removeClass(listActiveClass);
                                $(container).find('a').eq(listIndex).addClass(listActiveClass);
                                activeReferenceIndex = listIndex;
                            } else {
                                $(container).find('a').eq(listIndex).removeClass(listActiveClass);
                            }
                        }
                    });

                    // Remove active button if user goes out of sections related to tabs
                    if (activeReferenceIndex > -1) {
                        $(container).find('ul').scrollLeft(navLinks[activeReferenceIndex].offset - (gutterSpace + 16));
                    }
                }
            };

            if (navLinks && navLinks.length > 0) {
                $(window).on('scroll', scrollCallback);
            }
        }
        var init = function (container) {
            /**
             * As soon as this plgin is called.
             * - Create references fot this plugin to work.
             * - Bind events to the elements and window accordingly.
             */
            fetchReferences(container);
            eventBinder(container);
        }
        return $.fn.StickyNav = function () {
            var navElement = this;

            // Initializing sticky nav
            init(navElement);
        };
    })(jQuery, window, document);

}).call(this);
