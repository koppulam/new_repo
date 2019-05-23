// Packages
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Picture component
 */
class Picture extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            isImageLoadingBroken: false
        };
        this.handleImageLoadingError = this.handleImageLoadingError.bind(this);
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentDidMount() {
        const { isLazyLoad } = this.props;

        if (isLazyLoad && window.lazyLoad) {
            window.lazyLoad.update();
        }
    }

    /**
     * Lifcycle hook
     * @param {*} nextProps changed props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        const { defaultSrc } = this.props;

        if (nextProps.defaultSrc !== defaultSrc) {
            this.setState({ isImageLoadingBroken: true }, () => {
                this.setState({ isImageLoadingBroken: false });
            });
        }
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentDidUpdate() {
        const { isLazyLoad } = this.props;

        if (isLazyLoad && window.lazyLoad) {
            window.lazyLoad.update();
        }
    }

    /**
     * @returns {void}
     */
    onLoadHandler() {
        if (window.aos) {
            window.aos.refresh();
        }
    }

    /**
     * @returns {void}
     */
    handleImageLoadingError() {
        this.setState({ isImageLoadingBroken: true });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            isLazyLoad,
            altText,
            sources,
            defaultSrc,
            customClass,
            clickHandler,
            keypressHandler,
            isClickable,
            hiddenOnError,
            captionAlignment,
            caption,
            onLoadHandler
        } = this.props;
        const { isImageLoadingBroken } = this.state;

        const dynamicAttributes = isClickable ? {
            role: 'button',
            onClick: clickHandler,
            onKeyPress: keypressHandler,
            tabIndex: '-1'
        } : {};

        sources.sort((a, b) => {
            if (a.maxMedia < b.maxMedia) {
                return -1;
            }
            if (a.maxMedia > b.maxMedia) {
                return 1;
            }
            return 0;
        });

        return (
            !isImageLoadingBroken
                ? (
                    <div
                        className={customClass}
                        {...dynamicAttributes}
                    >
                        {
                            captionAlignment.toLowerCase() === 'top'
                            && <span className="picture-caption">{caption}</span>
                        }
                        <picture>
                            {
                                sources.length > 0
                                && sources.map((reference, index) => (
                                    <source
                                        key={index.toString()}
                                        media={`(max-width: ${reference.maxMedia}px)`}
                                        data-srcset={isLazyLoad ? reference.src : ''}
                                        srcSet={!isLazyLoad ? reference.src : ''}
                                    />))
                            }
                            {
                                hiddenOnError
                                && (
                                    <img
                                        src={defaultSrc}
                                        alt={altText}
                                        className="image"
                                        onError={this.handleImageLoadingError}
                                        onLoad={onLoadHandler}
                                    />
                                )
                            }
                            {
                                !hiddenOnError
                                && (
                                    <img
                                        data-src={isLazyLoad ? defaultSrc : ''}
                                        src={!isLazyLoad ? defaultSrc : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQAQMAAAC6caSPAAAABlBMVEX///////9VfPVsAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABzklEQVR4nO3aMW7bMBTG8e+ViejBldUtAQQkR3A3DgGi9CTqDdytW1h0yZT0AD1IRmbLMXSEZPNgRKUs2u3GZwNuEOT7DYY0/EETEp8XA0RERERERERERERERERERERERG+Bx2R7XUHyQbBPuE7XJ3jBrMsVEmZL9H68cdLj7CmXmHC2kj6MN99N7y+X+aSu5WGb/PTO5RIbXGl8N94srYRFnU/mhUGbkgKhneaSj2FR2JTIfYnQZZPT0NoCi/W1cVN0oVQkpsAcF+LXSRuKXPI5JbXxKHZLSgNt8nWTWGCqSx5SYuOuTw6VyI/QmVs4mN/A3NX4FmwmMf8mC10iKZH4AreqpJC0F8RjElR72SOZ9cttIn1/6CRuf+fkXpvECTOel+G5QHde4mG3dkiGI+9KdJ0iGc/+8I7Bqc6+pAkzvPxwqgkjaY6NiWqOSZqWw0GOiWZabmbymKhmsqTJ7yTED9Xkxx6/L0RERERERERERERERERERPRuNM1Bk3KbfDhe+RtU06rKJJO/ydF5TABVIuc7JjL8i2LnVdaJWcVE0PzKJWXlzfPssfmyzyoxuRmST+pksl5lolrlqLmSzfbvHuf55/KfNa/9Bd6bP2vFraTVfi13AAAAAElFTkSuQmCC'}
                                        alt={altText}
                                        className={classNames('image', {
                                            'load-lazily': isLazyLoad
                                        })}
                                        onLoad={onLoadHandler}
                                    />
                                )
                            }
                        </picture>
                        {
                            captionAlignment.toLowerCase() === 'bottom'
                            && <span className="picture-caption">{caption}</span>
                        }
                    </div>
                ) : null
        );
    }
}

Picture.propTypes = {
    isLazyLoad: PropTypes.bool,
    isClickable: PropTypes.bool,
    altText: PropTypes.string.isRequired,
    sources: PropTypes.array,
    defaultSrc: PropTypes.string.isRequired,
    customClass: PropTypes.string,
    clickHandler: PropTypes.func,
    keypressHandler: PropTypes.func,
    hiddenOnError: PropTypes.bool,
    onLoadHandler: PropTypes.func,
    caption: PropTypes.string,
    captionAlignment: PropTypes.string
};

Picture.defaultProps = {
    customClass: '',
    sources: [],
    clickHandler: () => { },
    keypressHandler: () => { },
    onLoadHandler: () => { },
    isClickable: false,
    hiddenOnError: false,
    caption: '',
    captionAlignment: 'bottom',
    isLazyLoad: true
};

export default Picture;
