// Packages
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as objectPath from 'object-path';

// Store
import store from 'react-app/store';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import ErrorBoundary from 'components/common/ErrorBoundary';
import SearchModal from 'components/containers/Search';
import HeaderFlyout from 'components/containers/HeaderFlyout';
import EngravingInModal from 'components/containers/EngravingVariations/EngravingInModal';
import FooterFlyout from 'components/containers/FooterFlyout';
import MiniPdpCta from 'components/containers/MiniPdp/MiniPdpCta';
import MiniPdpModal from 'components/containers/MiniPdp/MiniPdpModal';

// actions
import triggerPageActions, { registerActionListeners } from 'actions/PageActions';

// Global Styles
import 'stylesheets/globals.scss';
import '../clientlibs/css/exposed-components.scss';

const componentMap = {
    'tiffany-search': { comp: SearchModal, isPure: false },
    'tiffany-search-modal': { comp: SearchModal, isPure: false },
    'tiffany-header-flyout': { comp: HeaderFlyout, isPure: false },
    'tiffany-engraving-in-modal': { comp: EngravingInModal, isPure: false },
    'tiffany-footer-flyout': { comp: FooterFlyout, isPure: false },
    'tiffany-mini-pdp-cta': { comp: MiniPdpCta, isPure: false },
    'tiffany-mini-pdp-modal': { comp: MiniPdpModal, isPure: false }
};

/**
* @description Change all URLs in AEM data
* @param {object} object AEM object
* @returns {void};
*/
function changeURL(object) {
    Object.keys(object).map(key => {
        if (typeof object[key] === 'string' &&
            (
                key === 'url' ||
                key === 'richURL' ||
                key === 'enabledStoresURL' ||
                key === 'availabilitybystores' ||
                key === 'secretkey' ||
                key === 'clientkey'
            )
        ) {
            if (window.tiffany.apiUrl[object[key]]) {
                object[key] = window.tiffany.apiUrl[object[key]];
            }
        } else if (object[key] && typeof object[key] === 'object') {
            return changeURL(object[key]);
        }
        return null;
    });
    return object;
}
window.tiffany.authoredContent = changeURL(objectPath.get(window, 'tiffany.authoredContent', {}));
window.tiffany.pdpConfig = changeURL(objectPath.get(window, 'tiffany.pdpConfig', {}));

// trigger page level calls
store.dispatch(triggerPageActions());
store.dispatch(registerActionListeners());

/**
 * @description this function renders the appropriate component at the selected node
 * @param {*} tag HTML tag to be replaced by the react component
 * @param {*} Comp A React Component to replace the HTML tag
 * @param {*} node HTMl node
 * @param {*} i index of the tag in array
 * @returns {void}
 */
function renderNode(tag, Comp, node, i) {
    const attrs = Array.prototype.slice.call(node.attributes);
    const props = {
        key: `${tag}-${i}`
    };

    attrs.map((attr) => {
        const words = attr.name.split('-');

        words.forEach((word, index) => {
            if (index !== 0) {
                words[index] = word.charAt(0).toUpperCase() + word.slice(1);
            }
        });
        const capWord = words.reduce((a, b) => a + b);

        props[capWord] = attr.value === '' ? true : attr.value;
        return null;
    });

    if (props.class) {
        props.className = props.class;
        delete props.class;
    }
    if (!node.attributes.bootstraped) {
        ReactDOM.render(
            <Provider store={store}>
                <ErrorBoundary>
                    <Comp {...props} />
                </ErrorBoundary>
            </Provider>,
            node
        );
        node.setAttribute('bootstraped', true);
    }
}

/**
 * @description renders a React component for the given custom HTML tag
 * @param {*} tag HTML tag to be replaced by the react component
 * @param {*} Comp A React Component to replace the HTML tag
 * @returns {void}
 */
function render(tag, Comp) {
    document.createElement(tag);
    const nodes = Array.from(document.getElementsByTagName(tag));

    nodes.map((node, i) => renderNode(tag, Comp.comp, node, i));
    // return Comp;
}

/**
 * @description This will boot strap all the components with custom tags
 * @returns {void}
 */
function bootStrap() {
    Object.keys(componentMap).forEach(key => {
        render(key, componentMap[key]);
    });
}

/**
 * @callback
 * @description Listner for all the mutations
 * @param {array} mutationList list of all mutations that occurs on document
 * @returns {void}
 */
function mutationListner(mutationList) {
    let nodes;

    Object.keys(componentMap).forEach(key => {
        nodes = Array.from(document.getElementsByTagName(key));
        nodes.forEach(node => {
            if (!node.attributes.bootstraped) {
                render(key, componentMap[key]);
            }
        });
    });
}

// Observer for mutations
const observer = new MutationObserver(mutationListner);

// mutation options for which the observer listens
const config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
};

// starting the observer
observer.observe(document, config);

bootStrap();
