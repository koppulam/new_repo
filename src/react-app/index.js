// Packages
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as objectPath from 'object-path';
import fetchIntercept from 'fetch-intercept';
import { changeURL } from 'lib/utils/replace-url';
import * as cookieUtil from 'lib/utils/cookies';

// Global Styles
// import 'stylesheets/globals.scss';

// Store
import store from 'react-app/store';

// Application Start dependencies
// import 'react-app/build-info';
// import 'react-app/dependency';

// actions
import triggerPageActions, { setSession, registerActionListeners } from 'actions/PageActions';
import { add, remove } from 'actions/InterceptorActions';
import { updateFilters } from 'actions/FiltersActions';

import AEM_CONSTANTS from 'constants/AemConstants';

import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import ErrorBoundary from 'components/common/ErrorBoundary';
import LazyLoadWrapper from 'components/common/LazyLoadWrapper';
import componentMap from './componentMap';

require('lib/vendor/css-polyfills.js');

const cstidExpiryErrorUrls = {
    [window.tiffany.apiUrl.skuEcomAddEndPoint]: 'Failed to Add SKU',
    [window.tiffany.apiUrl.skuEcomAddGroupTypeOneEndPoint]: 'Failed to Add SKU',
    [window.tiffany.apiUrl.skuEcomAddGroupTypeTwoEndPoint]: 'Failed to Add SKU',
    // these URLS are not needed since we are validating the byo save before doing these calls
    // [window.tiffany.apiUrl.byoAddToBagUrl]: '',
    // [window.tiffany.apiUrl.byoAddToBagRequest]: '',
    // [window.tiffany.apiUrl.byoSaveNameUrl]: '',
    // [window.tiffany.apiUrl.savehintByo]: ''
    [window.tiffany.apiUrl.byoSaveDesignUrl]: { key: 'isSuccess' },
    [window.tiffany.apiUrl.wishListAddEndPoint]: 'WebCustomerId Not Found',
    [window.tiffany.apiUrl.preferredStoreAddEndPoint]: 'Failure',
    [window.location.origin + window.tiffany.apiUrl.dropHintUrl]: 'WebCustomerId Not Found'
    // [window.tiffany.apiUrl.wishlistDeleteUrl] // this wont work
};

/* eslint-disable */

function serializeRequest(request, sid) {
    var headers = {};
    if(request.headers) {
        for (var entry of request.headers.entries()) {
            headers[entry[0]] = entry[1];
        }
    }
    var serialized = {
        headers: headers,
        method: request.method,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer
    };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        return request.clone().json().then(function (body) {
            serialized.body = JSON.stringify({ ...body, webCustomerId: sid });
            return Promise.resolve(new Request(request.url, serialized));
        });
    }
    return Promise.resolve(new Request(request.url, serialized));
}

let isAnonymousInProgess = false;
let queuedRequests = [];

const listenerx = () => {
    window.removeEventListener('gotWebCustomerId', listenerx);
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');

    queuedRequests.forEach(queuedRequest => {
        serializeRequest(queuedRequest, cookieUtil.getCookies(cookieName)).then(val => {
            queuedRequest.resolve(val);
        });
    });
    queuedRequests = [];
};
window.addEventListener('gotWebCustomerId', listenerx);
const checkWebCustomerID = (keys, req, newreq, reqconfig) => {
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');

    return new Promise((resolve, reject) => {
        let found = false;
        for (let x = 0; x < keys.length; x += 1) {
            if (keys[x].toLowerCase() === 'webcustomerid') {
                found = true;
            }
        }
        if (found) {
            if (!isAnonymousInProgess) {
                isAnonymousInProgess = true;
                setSession().then(cstId => {
                    cookieUtil.setCookie(cookieName, cstId, { secure: true }, true);
                    serializeRequest(newreq, cstId).then(val => {
                        const evt = document.createEvent("HTMLEvents");

                        isAnonymousInProgess = false;
                        evt.initEvent("gotWebCustomerId", false, true);
                        window.dispatchEvent(evt);
                        resolve(val);
                    })
                });
            } else {
                queuedRequests.push({ request: newreq, resolve });
            }
        } else {
            reject();
        }
    });
};

function getRequest(req, reqconfig) {
    return new Promise((resolve, reject) => {
        const newreq = req.clone();

        if (req.method === 'POST') {
            req.json().then(requespayload => {
                const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
                const webCustomerId = cookieUtil.getCookies(cookieName);

                if (!webCustomerId) {
                    const keys = Object.keys(requespayload);
                    checkWebCustomerID(keys, req, newreq, reqconfig).then((transformedreq) => {
                        store.dispatch(add(req));
                        resolve([transformedreq, reqconfig]);
                    }).catch(err => {
                        store.dispatch(add(req));
                        resolve([newreq, reqconfig]);
                    });
                } else {
                    store.dispatch(add(req));
                    resolve([newreq, reqconfig]);
                }
            });
        } else {
            store.dispatch(add(req));
            resolve([newreq, reqconfig]);
        }
    });
}

function recursiveValidateError(object, validationObject) {
    let isError = false;
    const keys = Object.keys(object);
    for (let x = 0; x < keys.length; x++) {
        const key = keys[x];

        if (typeof validationObject === 'string' && typeof object[key] === 'string') {
            // validate if the key's value has same value
            isError = object[key].toLowerCase().trim().indexOf(validationObject.toLowerCase().trim()) !== -1;
            if (isError) {
                return isError;
            }
        } else if (key === validationObject.key && typeof object[key] === 'boolean'){
            // check if the keys are euqal and vlaue is false
            isError = !object[key];
            if (isError) {
                return isError;
            }
        } else if (typeof object[key] === 'object'){
            // recursive traverse the object
            isError = recursiveValidateError(object[key], validationObject);
        }
    }
    return isError;
}

/**
 * @description tries parsing the Response to see if
 * the provided reponse is an error response hidden in a sucess code
 * @param {Response} response the response object obtained from fetch
 * @param {boolean} isError check if the method was triggered from error
 * @param {Response} unReadResponse response to be resolved
 * @returns {Promise} a promise that resolves a cloned response object
 */
function validateResponse(response, isError, unReadResponse) {
    return new Promise((resolve, reject) => {
        if (!Object.keys(cstidExpiryErrorUrls).filter(key => response.url.indexOf(key) !== -1)[0]) {
            resolve(unReadResponse);
        } else {
            response.json().then((body) => {
                if (recursiveValidateError(body, cstidExpiryErrorUrls[Object.keys(cstidExpiryErrorUrls).filter(key => response.url.indexOf(key) !== -1)[0]])) {
                    // delete cookie
                    cookieUtil.removeSidCookies();
                    store.dispatch({
                        type: AEM_CONSTANTS.INVALID_COOKIE_RESET
                    });
                    reject(new Error('COOKIE_RESET'));
                } else {
                    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');

                    cookieUtil.setCookie(cookieName, cookieUtil.getCookies(cookieName), { secure: true}, true);
                    resolve(unReadResponse)
                }
            }).catch(err => {
                resolve(unReadResponse)
            });
        }
    });
}

fetchIntercept.register({
    request: async (req, reqconfig) => {
        return new Promise(async (resolve, reject) => {
            getRequest(req, reqconfig).then(obj => {
                resolve(obj);
            });
        });
    },
    requestError(error) {
        store.dispatch(remove(error));
        return error;
    },
    response(response) {
        store.dispatch(remove(response));
        if (response.clone) {
            const unReadResponse = response.clone();

            return validateResponse(response, false, unReadResponse);
        }
        return validateResponse(response, false, response);
    },
    responseError(errResponse) {
        store.dispatch(remove(errResponse));
        if (errResponse.clone) {
            const unReadResponse = errResponse.clone();

            return validateResponse(errResponse, false, unReadResponse);
        }
        return validateResponse(errResponse, false, errResponse);
        
    }
});
/* eslint-disable */

window.tiffany.authoredContent = changeURL(objectPath.get(window, 'tiffany.authoredContent', {}));
window.tiffany.pdpConfig = changeURL(objectPath.get(window, 'tiffany.pdpConfig', {}));

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
    const noSearchContainer = document.querySelector('.no-search-results__hidden');

    if (noSearchContainer && noSearchContainer.contains(node)) {
        return;
    }
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
        if (node.dataset.lazyLoad === 'true') {
            ReactDOM.render(
                <Provider store={store}>
                    <LazyLoadWrapper height={node.dataset.lazyHeight} offset={node.dataset.lazyOffset}>
                        <ErrorBoundary>
                            <Comp {...props} />
                        </ErrorBoundary>
                    </LazyLoadWrapper>
                </Provider>,
                node
            );
        } else {
            ReactDOM.render(
                <Provider store={store}>
                    <ErrorBoundary>
                        <Comp {...props} />
                    </ErrorBoundary>
                </Provider>,
                node
            );
        }

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

window.onpopstate = (event) => {
    if (event.state && event.state.filters) {
        const filterOptions = {
            filters: event.state.filters,
            init: true,
            isPop: true
        };

        store.dispatch(updateFilters(filterOptions));
    }
};
