/**
 * @module content-tile
 * @version 1.0.0
 * @since Sun May 27 2018
 */

// dependencies
import './content-tile.hbs';
import './content-tile.scss';

const { findFirst, findAll } = require('lib/dom/dom-util');

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__content-tile';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'content-tile';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createContenttileInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

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

        }
    };

    let videoCta = [];

    /** @type {Object} */
    // const singleRefs = instance.domRefs.first;

    // /** @type {Object} */
    // const listRefs = instance.domRefs.all;

    const videoModals = {};

    /**
     * `created` is called before `attached`. Can be used to pass data to
     * childrens `params` property.
     */
    // instance.created = () => {
    //   forEach(instance.children, updateChildParams);
    // };

    /**
     * Update the `instance.params` for `childInstance`.
     *
     * @param {object} childInstance
     */
    // function updateChildParams(childInstance) {
    //   childInstance.receiveNewParams({
    //     id: instance.attribute.id,
    //     updateId: onIdChanged
    //   });
    // }

    /**
     * The `instance.params` object was changed from parent calling `instance.receiveNewParams`.
     * Properties and callback functions can be dealt with or passed down to
     * child components.
     */
    // instance.onNewParamsReceived = () => {
    //   forEach(instance.children, child => {
    //     child.receiveNewParams({
    //       updateId: instance.params.updateId
    //     });
    //   });
    // };

    /**
     * Initialize any DOM elements which can be found within the hbs file for
     * this component.
     * @returns {void}
     */
    function initDOMReferences() {
        // myEl = domUtil.findFirst('.'
        //  .concat(exports.styleDefinition)
        //  .concat('__my-el'),
        //  instance.element
        //  );
        videoCta = Array.prototype.slice.call(findAll('[data-video]', instance.element));
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {}
    /**
     * Update browse grid header with filters
     * @param {object} data event data
     * @returns {void}
     */
    function updateHeader(data) {
        const details = data.detail;

        if (details && Object.keys(details).length > 0) {
            data.target.innerHTML = details;
        }
    }

    /**
     * Update browse grid header with filters
     * @param {event} evt event data
     * @returns {void}
     */
    function onVideoCtaClick(evt) {
        evt.preventDefault();
        const ele = evt.currentTarget;
        const { href } = evt.currentTarget;
        const closeLabel = ele.getAttribute('data-close-label');
        const title = ele.getAttribute('data-video-title');
        const mobilesrc = ele.getAttribute('data-mobilesrc');
        const isyoutubevideo = ele.getAttribute('data-video') === 'youtube';

        if (!videoModals[href]) {
            videoModals[href] = new window.TiffanyModal({
                options: {
                    overlay: false,
                    element: 'tiffany-video',
                    closeClass: 'video-cta__header-close',
                    className: 'video-modal-overlay',
                    blockMobileScrollability: true,
                    blockDesktopScrollability: true,
                    blockVerticalScroll: true,
                    exitFocusRef: evt.currentTarget,
                    props: {
                        isyoutubevideo,
                        videourl: href,
                        mobilevideourl: mobilesrc,
                        title,
                        closelabel: closeLabel,
                        isiframe: true,
                        islazyload: false
                    },
                    closeonTapOutside: {
                        isClose: true,
                        modalContainerClass: 'video-cta'
                    }
                }
            });
        }

        if (!videoModals[href].isOpened) {
            videoModals[href].open();
        }
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        instance.addEventListener('updateHeader', updateHeader, findFirst('.browse-grid-header'));
        // using Array.prototype because forEach is not supported for Nodelist on IE
        videoCta.forEach((cta) => {
            instance.addEventListener('click', onVideoCtaClick, cta);
        });

        // TODO remove inline comments, just example code.
        // To attach an event, use one of the following methods.
        // No need remove the listener in `instance.detached`
        // instance.addEventListener('click', onClick); //attached to `instance.element`
        // instance.addEventListener('click', onClick, myEl); //attached to `myEl`
        // instance.addEventListener('click', makeReservationClick, singleRefs.makeReservation);
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() {}

    /**
     * The DOM Element was added to the DOM.
     * @returns {void}
     */
    instance.attached = () => {
        initDOMReferences();
        init();
        addListeners();
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

registerComponent(componentReference, createContenttileInstance);
