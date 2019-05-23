// Packages
import React from 'react';
import PropTypes from 'prop-types';
import ReactImageMagnify from 'react-image-magnify';

// Components
import Picture from 'components/common/Picture';
import TiffanyModal from 'components/common/TiffanyModal';

// import './index.scss';

/**
 * ImageZoom component
 */
class ImageZoom extends React.Component {
    /**
     * @description Constructor
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            propsClass: props.customClass
        };
        this.containerRef = React.createRef();
    }

    /**
     * @description click event handler to close icon of modal pop.
     * @returns {void}
     */
    onClose = () => {
        this.setState({ previewVisible: false });
    }

    /**
     * @description Method to over write the image url based on width and height
     * @param {object} imageDetails image related information
     * @returns {void}
     */
    setImageURL = (imageDetails) => {
        // Using 1250 as default width and height as existing site using this resolution
        const { width = 1250, height = 1250 } = imageDetails;

        imageDetails.src = `${imageDetails.src}&wid=${width}&hei=${height}`;
    };

    /**
     * @description Pure function to check if the image url passed has params to set its dimentions
     * @param {string} imageURL image url
     * @returns {boolean} returns truthy based on the check
     */
    isImageURLProper = (imageURL) => ((imageURL.search('&wid=') > 0) && (imageURL.search('&hei=') > 0));

    /**
     * @description Method to check through image details and set the imageUrl properly
     * @param {object} imageDetails image related information
     * @returns {void}
     */
    checkAndSetImage = (imageDetails) => {
        if (!this.isImageURLProper(imageDetails.src)) {
            this.setImageURL(imageDetails);
        }
    }

    /**
     * @description click event handler to open modal pop up for pinch zoom
     * @returns {void}
     */
    openPinchPan = () => {
        this.setState({ previewVisible: true });
    }

    /**
     * @description click event handler to open zoomed
     * @returns {void}
     */
    previewZoomIn = () => {
        const {
            customClass
        } = this.props;
        const {
            propsClass
        } = this.state;
        const updatedClass = `${customClass} ${(propsClass.search('full-view') !== -1) ? '' : 'full-view'}`;

        this.setState({
            propsClass: updatedClass
        });
        // to make sure that setTimeout happens only when containerRef is available
        setTimeout(() => {
            // Moving the container scroll so that it looks as if the images is zoomed i nfrom the center
            // The ratio 1/4 is to give the zoomed effect so that 1/4 of the images is to left and 1/4 of image is to right of the viewport.
            this.containerRef.current.scrollLeft = (this.containerRef.current.scrollWidth / 4);
        });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            largeImage,
            smallImage,
            altText,
            closeAltText,
            sources,
            defaultSrc,
            customClass,
            isLazyLoad
        } = this.props;

        const {
            previewVisible,
            propsClass
        } = this.state;

        const modalOptions = {
            overlay: false,
            className: 'full-screen preview pdp-image-preview',
            closeClass: 'close-modal'
        };

        this.checkAndSetImage(smallImage);
        this.checkAndSetImage(largeImage);

        const DesktopZoomSettings = {
            smallImage: {
                alt: altText,
                isFluidWidth: true,
                src: smallImage.src
            },
            largeImage,
            enlargedImagePosition: 'over',
            enlargedImageClassName: 'magnified-image',
            style: {
                cursor: 'zoom-in'
            }
        };

        return (
            <article className="image-zoom">
                <div className="image-zoom__mobile-view">
                    <Picture
                        sources={sources}
                        defaultSrc={defaultSrc}
                        altText={altText}
                        customClass={customClass}
                        isLazyLoad={isLazyLoad}
                        clickHandler={this.openPinchPan}
                        isClickable
                    />
                    <TiffanyModal
                        visible={previewVisible}
                        options={modalOptions}
                        onClose={this.onClose}
                    >
                        <div className="preview-container" ref={this.containerRef}>
                            <Picture
                                sources={sources}
                                defaultSrc={defaultSrc}
                                altText={altText}
                                customClass={propsClass}
                                isLazyLoad={isLazyLoad}
                                clickHandler={this.previewZoomIn}
                                isClickable
                            />
                        </div>
                        <button type="button" className="close-modal icon-Close" aria-label={closeAltText} onClick={this.onClose} />
                    </TiffanyModal>
                </div>
                <div className="image-zoom__desktop-view">
                    <ReactImageMagnify
                        {...DesktopZoomSettings}
                    />
                </div>
            </article>
        );
    }
}

ImageZoom.propTypes = {
    sources: PropTypes.array.isRequired,
    defaultSrc: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired,
    customClass: PropTypes.string,
    isLazyLoad: PropTypes.bool,
    largeImage: PropTypes.object.isRequired,
    smallImage: PropTypes.object.isRequired,
    closeAltText: PropTypes.string
};

ImageZoom.defaultProps = {
    isLazyLoad: true,
    customClass: '',
    closeAltText: 'click to close'
};

export default ImageZoom;
