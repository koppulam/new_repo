// @flow
// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Lottie from 'react-lottie';
import objectPath from 'object-path';
import { findFirst } from 'lib/dom/dom-util';
// import * as cookieUtil from 'lib/utils/cookies';
import iconData from 'lib/icon-util/icon-animations.json';
// import customEventTrigger from 'lib/events/custom-event-trigger';
import IC from 'constants/IconsConstants';

// import './index.scss';

type Props = {
    interceptor: Object
};

type State = {
    showHourGlass: boolean
};

/**
 * HourGlass component
 */
class HourGlass extends React.Component<Props, State> {
    /**
     * @description Render Method
     * @returns {HTML} html
     */
    render() {
        const header = findFirst('.header.splash-helper');
        const headerDesktop = findFirst('.header.splash-helper-desktop');
        const { interceptor } = this.props;
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: iconData['loader-icon'],
            rendererSettings: {
                preserveAspectRatio: IC.SLICE_ASPECT
            }
        };

        const html = (
            <div className="hour-glass-holder tf-g tf-g__middle tf-g__center" role="alert" aria-label={objectPath.get(window, 'tiffany.labels.hourGlassLabel', 'Content loading')}>
                <div className="hour-glass-lottie">
                    <Lottie
                        options={defaultOptions}
                    />
                </div>
            </div>
        );

        return interceptor.count > 0 && interceptor.enabled && !header && (!headerDesktop || (headerDesktop && window.innerWidth <= 899)) ? html : null;
    }
}

HourGlass.propTypes = {
    interceptor: PropTypes.any.isRequired
};

const mapStateToProps = (state) => {
    return {
        interceptor: state.interceptor
    };
};

export default connect(mapStateToProps)(HourGlass);
