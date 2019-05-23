/**
 * @module video
 * @version 1.0.0
 * @since Mon May 28 2018
 */

// dependencies
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import matchMedia from 'lib/dom/match-media';

import './video.hbs';
import './video.scss';

const $ = require('jquery');

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

const analyticsEvents = require('lib/utils/analytics-util');

const { triggerAnalyticsEvent } = analyticsEvents;


/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__video';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'video';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createVideoInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

    /**
     * Authored Video Container
     * @type {Element}
     */
    let $videoContainer;

    /**
     * overlayed image element
     * @type {Element}
     */
    let $mobileVideoImage;

    /**
     * Authored video Play button element
     * @type {Element}
     */
    let $mobileVideoPlayBtn;

    /**
     * Video element
     * @type {Element}
     */
    let $mobileVideoPlayer;
    /**
     * overlayed image element
     * @type {Element}
     */
    let $desktopVideoImage;

    /**
     * Authored video Play button element
     * @type {Element}
     */
    let $desktopVideoPlayBtn;

    /**
     * Video element
     * @type {Element}
     */
    let $desktopVideoPlayer;

    let playedManaually = false;

    /**
     * By setting `instance.domRefs` the baseComponent will replace the value
     * of each keys in `instance.domRefs.first` with single elements found
     * in `instance.element`. Same for `instance.domRefs.all`, but each key
     * will have an array of elements.
     *
     * `first` example: The value of `childEl` will be a `HTMLElement`
     * `all` example: The value of `rows` will be an `Array` of `HTMLElement`
     * @type {Object}
     */
    instance.domRefs = {
        definition: styleDefinition,
        first: {
            container: '__container'
        }
    };

    /** @type {Object} */
    const singleRefs = instance.domRefs.first;

    /** @type {Object} */
    // const listRefs = instance.domRefs.all;

    /**
     * Initialize any DOM elements which can be found within the hbs file for
     * this component.
     * @returns {void}
     */
    function initDOMReferences() {
        $videoContainer = $(singleRefs.container);

        const $desktopContainer = $videoContainer.find('.show__desktop-and-above');
        const $mobileContainer = $videoContainer.find('.hide__desktop-and-above');

        $mobileVideoPlayer = $mobileContainer.find('.video__container_video');
        $mobileVideoPlayBtn = $mobileContainer.find('.video__container_image_play');
        $mobileVideoImage = $mobileContainer.find('.video__container_image');

        $desktopVideoPlayer = $desktopContainer.find('.video__container_video');
        $desktopVideoPlayBtn = $desktopContainer.find('.video__container_image_play');
        $desktopVideoImage = $desktopContainer.find('.video__container_image');
    }

    /**
     * Logic to end author configured video : bring back overlayed image
     * @param {event} event target
     * @returns {void}
     */
    function onVideoEnd(event) {
        const isMobile = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (isMobile) {
            if ($mobileVideoPlayer.length > 0 && $mobileVideoPlayer.data('autoloop') === true) {
                $mobileVideoPlayer[0].play();

                if (playedManaually) {
                    triggerAnalyticsEvent(AnalyticsConstants.COMPLETE_VIDEO, { name: $mobileVideoPlayer.attr('src') });
                    playedManaually = false;
                }
            } else {
                $mobileVideoPlayer.fadeTo(100, 0);
                $mobileVideoImage.fadeTo(100, 1, () => {
                    $mobileVideoPlayer.css({
                        'z-index': -1
                    });
                });
                $mobileVideoPlayBtn.fadeTo(100, 1);
            }
        } else if ($desktopVideoPlayer.length > 0 && $desktopVideoPlayer.data('autoloop') === true) {
            $desktopVideoPlayer[0].play();
            if (playedManaually) {
                triggerAnalyticsEvent(AnalyticsConstants.COMPLETE_VIDEO, { name: $desktopVideoPlayer.attr('src') });
                playedManaually = false;
            }
        } else {
            $desktopVideoPlayer.fadeTo(100, 0);
            $desktopVideoImage.fadeTo(100, 1, () => {
                $desktopVideoPlayer.css({
                    'z-index': -1
                });
            });
            $desktopVideoPlayBtn.fadeTo(100, 1);
        }
    }

    /**
     * Logic to play video when video is ready
     * @param {Object} video Object to be played
     * @returns {void}
     */
    function playVideoOnReady(video) {
        video.play();
        video.focus();
    }

    /**
     * Logic to play the video on click of play button
     * Hide overlay image, button and show video player
     * @returns {void}
     */
    function playVideo() {
        const isMobile = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (isMobile) {
            $mobileVideoPlayer.fadeTo(100, 1);
            $mobileVideoPlayer[0].oncanplay = playVideoOnReady($mobileVideoPlayer[0]);
            $mobileVideoPlayer[0].onended = onVideoEnd;
            $mobileVideoImage.fadeTo(100, 0);
            $mobileVideoPlayBtn.fadeTo(100, 0, () => {
                $mobileVideoPlayer.css({
                    'z-index': 1
                });
            });
            triggerAnalyticsEvent(AnalyticsConstants.START_VIDEO, { name: $mobileVideoPlayer.attr('src') });
        } else {
            $desktopVideoPlayer.fadeTo(100, 1);
            $desktopVideoPlayer[0].oncanplay = playVideoOnReady($desktopVideoPlayer[0]);
            $desktopVideoPlayer[0].onended = onVideoEnd;
            $desktopVideoImage.fadeTo(100, 0);
            $desktopVideoPlayBtn.fadeTo(100, 0, () => {
                $desktopVideoPlayer.css({
                    'z-index': 1
                });
            });
            triggerAnalyticsEvent(AnalyticsConstants.START_VIDEO, { name: $desktopVideoPlayer.attr('src') });
        }

        playedManaually = true;
    }

    /**
     * Video play callback
     * @returns {void}
     */
    function videoPlayCallBack() {
        const playText = $videoContainer.find('.videostatus').data('play');

        $videoContainer.find('.video-status-text').text(playText);
    }

    /**
     * Video pause callback
     * @returns {void}
     */
    function videoPauseCallBack() {
        const pauseText = $videoContainer.find('.videostatus').data('pause');

        $videoContainer.find('.video-status-text').text(pauseText);
    }

    /**
     * video on click callback
     * @param {event} event of video on click
     * @returns {void}
     */
    function videoOnClick(event) {
        const playMsg = $videoContainer.find('.videostatus').data('playmsg');
        const pauseMsg = $videoContainer.find('.videostatus').data('pausemsg');
        const isMobile = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (isMobile) {
            if (!$mobileVideoPlayer[0].paused && $mobileVideoPlayer[0].currentTime > 0 && !$mobileVideoPlayer[0].ended) {
                $mobileVideoPlayer[0].pause();
                $mobileVideoPlayer[0].focus();
                $mobileVideoPlayer.attr('aria-label', playMsg);
            } else {
                $mobileVideoPlayer[0].play();
                $mobileVideoPlayer[0].focus();
                $mobileVideoPlayer.attr('aria-label', pauseMsg);
            }
        } else if (!$desktopVideoPlayer[0].paused && $desktopVideoPlayer[0].currentTime > 0 && !$desktopVideoPlayer[0].ended) {
            $desktopVideoPlayer[0].pause();
            $desktopVideoPlayer[0].focus();
            $desktopVideoPlayer.attr('aria-label', playMsg);
        } else {
            $desktopVideoPlayer[0].play();
            $desktopVideoPlayer[0].focus();
            $desktopVideoPlayer.attr('aria-label', pauseMsg);
        }
    }

    /**
     * video onKeyPress callback
     * @param {event} event of video keypress
     * @returns {void}
     */
    function videoOnKeyPress(event) {
        const classNames = event.target.className;
        const playMsg = $videoContainer.find('.videostatus').data('playmsg');
        const pauseMsg = $videoContainer.find('.videostatus').data('pausemsg');
        const isMobile = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (event.keyCode === 32 && classNames.indexOf('video__container_video') > -1) {
            event.preventDefault();
        }

        if (isMobile) {
            if ((event.keyCode === 13 || event.keyCode === 32) && ($mobileVideoPlayer.hasClass('autoloop') || $mobileVideoPlayer.hasClass('autoplay'))) {
                if (!$mobileVideoPlayer[0].paused && $mobileVideoPlayer[0].currentTime > 0 && !$mobileVideoPlayer[0].ended) {
                    $mobileVideoPlayer[0].pause();
                    $mobileVideoPlayer[0].focus();
                    $mobileVideoPlayer.attr('aria-label', playMsg);
                } else {
                    $mobileVideoPlayer[0].play();
                    $mobileVideoPlayer[0].focus();
                    $mobileVideoPlayer.attr('aria-label', pauseMsg);
                }
            }
        } else if ((event.keyCode === 13 || event.keyCode === 32) && ($desktopVideoPlayer.hasClass('autoloop') || $desktopVideoPlayer.hasClass('autoplay'))) {
            if (!$desktopVideoPlayer[0].paused && $desktopVideoPlayer[0].currentTime > 0 && !$desktopVideoPlayer[0].ended) {
                $desktopVideoPlayer[0].pause();
                $desktopVideoPlayer[0].focus();
                $desktopVideoPlayer.attr('aria-label', playMsg);
            } else {
                $desktopVideoPlayer[0].play();
                $desktopVideoPlayer[0].focus();
                $desktopVideoPlayer.attr('aria-label', pauseMsg);
            }
        }
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() { }

    /**
     * Append listeners to the element.
     * Adding listner for play button click
     * @returns {void}
     */
    function addListeners() {
        if ($desktopVideoPlayer && $desktopVideoPlayer.length > 0) {
            instance.addEventListener('click', playVideo, $desktopVideoPlayBtn[0]);
            instance.addEventListener('keypress', videoOnKeyPress, $desktopVideoPlayer[0]);
            instance.addEventListener('click', videoOnClick, $desktopVideoPlayer[0]);

            if ($desktopVideoPlayer.data('autoplay')) {
                $desktopVideoPlayer.fadeTo(100, 1);
                $desktopVideoImage.fadeTo(100, 0);
                $desktopVideoPlayBtn.fadeTo(100, 0, () => {
                    $desktopVideoPlayer.css({
                        'z-index': 1
                    });
                });
                $desktopVideoPlayer[0].onended = onVideoEnd;
            }

            $desktopVideoPlayer[0].addEventListener('play', videoPlayCallBack);
            $desktopVideoPlayer[0].addEventListener('pause', videoPauseCallBack);
        }

        if ($mobileVideoPlayer && $mobileVideoPlayer.length > 0) {
            instance.addEventListener('click', playVideo, $mobileVideoPlayBtn[0]);
            instance.addEventListener('keypress', videoOnKeyPress, $mobileVideoPlayer[0]);
            instance.addEventListener('click', videoOnClick, $mobileVideoPlayer[0]);

            if ($mobileVideoPlayer.data('autoplay')) {
                $mobileVideoPlayer.fadeTo(100, 1);
                $mobileVideoImage.fadeTo(100, 0);
                $mobileVideoPlayBtn.fadeTo(100, 0, () => {
                    $mobileVideoPlayer.css({
                        'z-index': 1
                    });
                });
                $mobileVideoPlayer[0].onended = onVideoEnd;
            }

            $mobileVideoPlayer[0].addEventListener('play', videoPlayCallBack);
            $mobileVideoPlayer[0].addEventListener('pause', videoPauseCallBack);
        }
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() { }

    /**
     * Auto play video
     * @returns {void}
     */
    function autoPlay() {
        const $video = $videoContainer.find('.video');

        if ($video.length > 0 && $video.attr('autoplay')) {
            $video.each((index, element) => {
                element.onended = onVideoEnd;
            });
        }
    }

    /**
     * The DOM Element was added to the DOM.
     * @returns {void}
     */
    instance.attached = () => {
        initDOMReferences();
        init();
        addListeners();
        autoPlay();
    };

    /**
     * The DOM Element was removed from the DOM.
     * Dealloc variables and removes any added listeners that was NOT added
     * through `instance.addEventListener`.
     * @returns {void}
     */
    instance.detached = () => {
        // console.log('detached!', instance.element);
        dispose();
    };

    return instance;
}

registerComponent(componentReference, createVideoInstance);
