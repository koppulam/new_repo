// Packages
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { hasClass, findFirst } from 'lib/dom/dom-util';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';

/**
 * CustomScrollBar Component
 */
class CustomScrollBar extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        let isIOS = false;

        this.customScroll = React.createRef();
        this.props.checkForClass.split(' ').forEach((className) => {
            if (hasClass(findFirst('body'), className)) {
                isIOS = true;
            }
        });

        this.state = {
            disableScroll: this.props.iosEnable ? !this.props.iosEnable : isIOS
        };
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        if (this.state.disableScroll) {
            return (this.props.children);
        }
        if (this.props.disableInMobile) {
            return (
                <Fragment>
                    <MediaQuery query={styleVariables.desktopAndBelow}>
                        {this.props.children}
                    </MediaQuery>
                    <MediaQuery query={styleVariables.desktopAndAbove}>
                        <PerfectScrollbar {...this.props.options} ref={this.customScroll}>
                            {this.props.children}
                        </PerfectScrollbar>
                    </MediaQuery>
                </Fragment>
            );
        }
        return (
            <PerfectScrollbar {...this.props.options} ref={this.customScroll}>
                {this.props.children}
            </PerfectScrollbar>
        );
    }
}

CustomScrollBar.propTypes = {
    children: PropTypes.object.isRequired,
    iosEnable: PropTypes.bool,
    options: PropTypes.object,
    checkForClass: PropTypes.string,
    disableInMobile: PropTypes.bool
};

CustomScrollBar.defaultProps = {
    iosEnable: false,
    options: {},
    checkForClass: 'ios',
    disableInMobile: false
};

export default CustomScrollBar;
