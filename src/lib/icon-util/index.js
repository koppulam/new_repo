import iconData from './icon-animations.json';
import lottie from 'lottie-web';
import { findAll } from 'lib/dom/dom-util';
import getDataAttributes from 'lib/dom/get-data-attributes';

function blurMouseLeaveHandler(anim, e) {
    e.stopPropagation();
    anim.goToAndStop(1);
}

function eventHandler(anim, animationData, e) {
    e.stopPropagation();
    // TODO: each icon can have different frames range to play, eg: wishlist icon [1,16] ; bag icon [1, 10]
    anim.playSegments([1, animationData.op], true);
}

export function initIcon(element) {
    let anim;

    if (element && !element.children.length) {
        const dataAttr = getDataAttributes(element);
        const params = {
            container: element,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: iconData[dataAttr.iconName]
        };


        if (lottie) {
            anim = lottie.loadAnimation(params);
        }

        element.firstElementChild.setAttribute('focusable', false);
        return {
            anim,
            data: params.animationData
        };
    }
}

export function initializeIcons() {
    const elems = findAll("button[data-icon='true']");

    elems.forEach(element => {
        initIcon(element, lottie);
    });
}