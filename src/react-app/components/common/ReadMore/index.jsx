import React from 'react';
import PropTypes from 'prop-types';

/**
 * Readmore component
 */
class ReadMore extends React.Component {
    /**
     * @constructor
     * @param {any} props props
     */
    constructor(props) {
        super(props);
        this.state = {
            lengthToShow: props.lengthToShow,
            style: { transition: `max-height ${this.props.animationTime}s ease-in` }
        };
        this.element = React.createRef();
        this.toggle = this.toggle.bind(this);
    }

    /**
     * @description Life cycle hook
     * @returns {void}
     */
    componentDidMount() {
        const { height } = this.element.current.getBoundingClientRect();

        this.setState({ collapsedHeight: height });
    }

    /**
     * @returns {string} text from props
     */
    getString = () => {
        if (this.props.text.length > this.state.lengthToShow) {
            const transformedString = this.getShortDescription();

            return transformedString;
        }
        return this.props.text;
    }

    /**
     * @description get short text based on the no of chars to be shown.
     * @param {string} productDetails  productDetails from API.
     * @returns {void}
     */
    getShortDescription = () => {
        const { lengthToShow } = this.state;
        const { text } = this.props;
        const textLen = text.length;
        const subStrOne = text.substring(0, lengthToShow);
        const checkForSpace = text.substring(lengthToShow, lengthToShow + 1);
        const subStrTwo = text.substring(lengthToShow, textLen);
        let shortDesc = '';

        if (textLen > lengthToShow) {
            if (checkForSpace === '') {
                shortDesc = subStrOne.concat('...');
            } else {
                const splitStr = subStrTwo.split(' ');

                shortDesc = subStrOne.concat(splitStr[0]).concat('...');
            }
        } else {
            shortDesc = subStrOne;
        }

        return shortDesc;
    };

    /**
     * @description transition End Handler
     * @returns {void}
     */
    transitionEndHandler = () => {
        this.setState({ lengthToShow: this.props.lengthToShow });
        this.element.current.removeEventListener('transitionend', this.transitionEndHandler);
        this.props.animationEnd();
    }

    /**
     * @description transition End Handler
     * @returns {void}
     */
    transitionExpandEndHandler = () => {
        const { height } = this.element.current.getBoundingClientRect();

        this.setState({ style: { maxHeight: height } });
        this.element.current.removeEventListener('transitionend', this.transitionExpandEndHandler);
        this.props.animationEnd();
    }

    /**
     * @description Toogles the text
     * @returns {void}
     */
    toggle = () => {
        const { height } = this.element.current.getBoundingClientRect();

        if (this.props.lengthToShow === this.state.lengthToShow) {
            this.setState({ lengthToShow: this.props.text.length, style: { maxHeight: height, transition: `max-height ${this.props.animationTime}s ease-in` } }, () => {
                this.setState({ style: { transition: `max-height ${this.props.animationTime}s ease-out`, maxHeight: this.element.current.scrollHeight } });
                this.element.current.addEventListener('transitionend', this.transitionExpandEndHandler, false);
            });
        } else {
            this.element.current.addEventListener('transitionend', this.transitionEndHandler, false);
            this.setState({ style: { transition: `max-height ${this.props.animationTime}s ease-out`, maxHeight: this.state.collapsedHeight } }, () => {
            });
        }
    }

    /**
     * @returns {HTML} html
     */
    render() {
        return (
            <p style={this.state.style} ref={this.element} className={this.props.className} dangerouslySetInnerHTML={{ __html: this.getString() }} />
        );
    }
}

ReadMore.propTypes = {
    animationTime: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    lengthToShow: PropTypes.number.isRequired,
    animationEnd: PropTypes.func
};

ReadMore.defaultProps = {
    animationEnd: () => { }
};

export default ReadMore;
