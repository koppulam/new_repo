/**
 * Creates a dispatcher object.
 *
 */
'use strict';

var forEach = require('lodash/forEach');

function createEventDispatcher() {
    /**
     * Returned object.
     * @var object
     */
    var dispatcher = {};

    /**
     * Container for event types.
     * @var object
     */
    var listeners = {};

    /**
     * Creates or appends an event to the container of events.
     *
     * @param {string} type
     * @param {Function} fn method that will be triggered.
     */
    dispatcher.register = function(type, fn) {
        if (typeof listeners[type] === 'undefined') {
            listeners[type] = [fn];
            return;
        }
        listeners[type].push(fn);
    };

    /**
     * Completely removes all listeners for an event.
     *
     * @param {string} type
     * @param {Function} opt_fn
     */
    dispatcher.unregister = function(type, opt_fn) {
        if (typeof listeners[type] === 'undefined') {
            return;
        }
        if (typeof opt_fn === 'function') {
            var i = listeners[type].length;
            while (i--) {
                var fn = listeners[type][i];
                if (fn === opt_fn) {
                    listeners[type].splice(i, 1);
                }
            }
            return;
        }
        listeners[type].length = 0;
    };

    /**
     * Completely removes all listeners.
     *
     * @param {string} type
     */
    dispatcher.removeAllListeners = function() {
        listeners = {};
    };

    /**
     * Triggers an event.
     *
     * @param {string} type
     * @param {mixed} args
     */
    dispatcher.dispatch = function(type, args) {
        if (typeof listeners[type] === 'undefined') {
            return;
        }
        forEach(listeners[type], function(fn) {
            fn(args);
        });
    };

    return dispatcher;
}

module.exports = createEventDispatcher;
