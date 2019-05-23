// Packages
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';

// Object path Util
import objectPath from 'object-path';

import styleVariables from 'lib/utils/breakpoints';

/**
 * Engavable Toggle button Component
 */
class EngravableToggle extends React.Component {
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            showSubMenu,
            mobileFilter
        } = this.props;
        const {
            belowDesktopTablet,
            desktopTabletAbove
        } = styleVariables;

        return (
            <div
                className={
                    classNames('filters-component__engavable-wrapper',
                        {
                            'engavable-wrapper--show': showSubMenu || mobileFilter
                        })
                }
            >
                <MediaQuery query={desktopTabletAbove}>
                    <p className="engavable-wrapper__text--desktop">{objectPath.get(window, 'tiffany.labels.engravableTextDesktop', 'Engravable products only')}</p>
                </MediaQuery>
                <div className="engavable-wrapper__switch">
                    <span className="engavable-wrapper__switch--toggle" />
                </div>
                <MediaQuery query={belowDesktopTablet}>
                    <p className="engavable-wrapper__text--mobile">{objectPath.get(window, 'tiffany.labels.engravableTextMobile', 'Engravable')}</p>
                </MediaQuery>
            </div>
        );
    }
}

EngravableToggle.propTypes = {
    showSubMenu: PropTypes.bool,
    mobileFilter: PropTypes.bool
};

EngravableToggle.defaultProps = {
    showSubMenu: false,
    mobileFilter: false
};

export default EngravableToggle;
