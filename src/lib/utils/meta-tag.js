import { findFirst } from 'lib/dom/dom-util';

/**
 * @description adds a given metatag to document
 * @param {string} metaToAdd meta tag to add
 * @returns {void}
 */
const addMetaTag = (metaToAdd) => {
    const metaTag = findFirst('meta[name="viewport"]');

    if (metaTag.content.indexOf(metaToAdd) === -1) {
        metaTag.content = `${metaTag.content}, ${metaToAdd}`;
    }
};

/**
 * @description adds a given metatag to document
 * @param {string} metaToRemove meta tag to add
 * @returns {void}
 */
const removeMetaTag = (metaToRemove) => {
    const metaTag = findFirst('meta[name="viewport"]');

    metaTag.content = metaTag.content.split(', ').filter(value => value !== metaToRemove).join(', ');
};

/**
 * @description method to restict page zoom
 * @returns {void}
 */
export const restrictUserScalability = () => {
    addMetaTag('user-scalable=no');
};

/**
 * @description method to restict page zoom
 * @returns {void}
 */
export const releaseUserScalability = () => {
    removeMetaTag('user-scalable=no');
};

/**
 * @description updates page title
 * @param {string} title page title to update
 * @returns {void}
 */
export const updatePageTitle = (title) => {
    if (title.length > 0) {
        document.title = title;
    }
};
