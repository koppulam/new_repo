/**
 * @module lazy-load
 * @version 1.0.0
 * @since Tue Feb 19 2018
 */

const domUtil = require('lib/dom/dom-util');

const lazyLoadImage = domUtil.findAll('img.lazy-load__image');

function loadDesktopImage() {
    domUtil.forEach(lazyLoadImage, el => {
        el.setAttribute('src', el.getAttribute('data-desktop-src'));
    });
}

function loadMobileImage() {
    domUtil.forEach(lazyLoadImage, el => {
        el.setAttribute('src', el.getAttribute('data-mobile-src'));
    });
}

let currentInnerWidth = window.innerWidth;
let isFirstLoad = true;

function lazyLoadImages() {
    if (isFirstLoad) {
        if (window.innerWidth <= 768) {
            loadMobileImage();
        } else {
            loadDesktopImage();
        }
        isFirstLoad = false;
        return;
    }

    if (window.innerWidth <= 768 && currentInnerWidth > 768) {
        loadMobileImage();
        currentInnerWidth = window.innerWidth;
    } else if (window.innerWidth > 768 && currentInnerWidth <= 768) {
        loadDesktopImage();
        currentInnerWidth = window.innerWidth;
    }
}

/**
 * Logic to run when Page is ready
 */
window.onload = function init() {
    lazyLoadImages();
};

window.onresize = function init() {
    lazyLoadImages();
};
