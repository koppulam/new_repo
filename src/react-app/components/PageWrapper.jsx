// Packages
import React, { Component } from 'react';

// Components

// Actions

/**
 * Render Component.
 *@param {object} Cmp component instance
 *@param {object} args component props
 *@returns {object} html instance
 */
function pageWrapper(Cmp, args) {
    return class PageWrapper extends Component {
        /**
         * Render Component.
         * @returns {object} html instance
         */
        render() {
            return (
                <div className="PageWrapper">
                    <Cmp {...this.props} {...args} />
                </div>
            );
        }
    };
}

export default pageWrapper;
