import React from 'react';
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ErrorBoundary from 'components/common/ErrorBoundary';
import store from 'react-app/store';

const scopeFocus = require('lib/dom/scope-focus');

/**
 * @description React component to show modal with dynamic content
 */
class TiffanyModal extends React.Component {
    /**
     * @param {*} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const { options } = props;

        options.tearDown = (node) => {
            ReactDOM.unmountComponentAtNode(node);
            this.props.onClose();
        };

        this.modal = new window.TiffanyModal({
            options
        });
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        this.toogleModal(this.props.visible, this.props.children, () => {
        });
    }

    /**
     * @description On props changed life cycle event
     * @param {object} nextProps updated params
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.visible !== nextProps.visible) {
            this.toogleModal(nextProps.visible, nextProps.children);
        } else if (nextProps.visible && this.modal.contentHolder) {
            ReactDOM.render(
                <Provider store={store}>
                    <ErrorBoundary>
                        {nextProps.children}
                    </ErrorBoundary>
                </Provider>, this.modal.contentHolder,
                () => {
                    this.props.onOpen();
                }
            );
        } else if (!nextProps.visible && this.modal.isOpened) {
            this.modal.close();
        }
    }

    /**
     * @description life cycle event to handle destruction
     * @returns {void}
     */
    componentWillUnmount() {
        if (this.modal.isOpened) {
            this.modal.close();
        }
    }

    /**
     * @description checks the state passed from parent and toggles modal accordingly
     * @param {boolean} isVisible boolean to check if modal is open
     * @param {any} children children
     * @param {function} callback a callback
     * @returns {void}
     */
    toogleModal(isVisible, children, callback = () => { }) {
        if (isVisible) {
            this.modal.open(() => {
                ReactDOM.render(
                    <Provider store={store}>
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                    </Provider>, this.modal.contentHolder,
                    () => {
                        this.props.onOpen();
                        scopeFocus.setScopeLimit(this.modal.contentHolder);
                    }
                );
            });
        } else if (this.modal.isOpened) {
            this.modal.close();
            scopeFocus.dispose();
        }
        callback();
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        return null;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
    };
};

TiffanyModal.propTypes = {
    visible: PropTypes.bool,
    children: PropTypes.any.isRequired,
    options: PropTypes.object,
    onOpen: PropTypes.func,
    onClose: PropTypes.func
};

TiffanyModal.defaultProps = {
    visible: false,
    options: {
        overlay: false
    },
    onOpen: () => { },
    onClose: () => { }
};

export default connect(mapStateToProps)(TiffanyModal);
