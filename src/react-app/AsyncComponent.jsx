import React, { Component } from 'react';

/**
 * @param {*} getComponent function
 * @returns {void}
 */
export default function asyncComponent(getComponent) {
    /**
     * Default class.
     * @returns {object} html instance
     */
    class AsyncComponent extends Component {
        /**
         * @param {*} props super props
         * @returns {void}
         */
        constructor(props) {
            super(props);
            this.state = {
                Child: AsyncComponent.Child
            };
        }

        /**
         * Lifcycle hook for
         * @returns {void}
         */
        componentWillMount() {
            if (!this.state.Child) {
                getComponent().then(Child => {
                    AsyncComponent.Child = Child;
                    this.setState({ Child });
                });
            }
        }

        /**
         * Render Component.
         * @returns {object} html instance
         */
        render() {
            const { Child } = this.state;

            if (Child) {
                return <Child {...this.props} />;
            }
            return null;
        }
    }
    return AsyncComponent;
}
